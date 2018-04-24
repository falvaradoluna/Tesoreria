registrationModule.controller('conciliacionDetalleRegistroGridsController',function($scope, $log,  $filter, $compile, localStorageService, filtrosRepository, alertFactory, uiGridConstants, uiGridGroupingConstants){

      $scope.gridsInfo = [];
      $scope.depositosBancos = '';

      $scope.control = undefined;
      $scope.isDPI = undefined;

            $scope.abonoAuxiliar = 0;
            $scope.cargoAuxiliar = 0;
            $scope.abonoBanco = 0;
            $scope.cargoBanco = 0;
            $scope.difMonetaria = 0;
            $scope.totalAbonoBancario = 0;
            $scope.totalCargoBancario = 0;
            $scope.totalAbonoContable = 0;
            $scope.totalCargoContable = 0;

             //LQMA add 22082017
            $scope.hexPicker = { color: '#c9dde1' };

            //LQMA 05092017
            $scope.arrayColors = ['#c9dde1',''];//[{ color: '#c9dde1'}, {color: '' }];

            //LQMA 28082017
            $scope.auxiliarContableOriginal = [];
            $scope.depositoBancosOriginal = [];
            $scope.letras = { lit: 'A',lit: 'B',lit:'C',lit:'D',lit:'E',lit:'F',lit:'G',lit:'H',lit:'I',lit:'J',lit:'K',lit:'L',lit:'M',lit:'N',lit:'O',lit:'P',lit:'Q',lit:'R',lit:'S',lit:'T',lit:'W',lit:'X',lit:'Y',lit:'Z'};
            
            //LQMA 29
            $scope.fechaActual = '2017-05-07';

     $scope.init = function() {
        $('#loading').modal('show');

        variablesLocalStorage();
        $scope.getDepositosBancos($scope.busqueda.IdBanco, 1, $scope.busqueda.Cuenta, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa);
        //LQMA comment 17082017
        //$scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
    };
   

   var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.difMonetaria = $scope.busqueda.DiferenciaMonetaria;
        $scope.polizaPago = $scope.busqueda.PolizaPago;
    };
     
 //****************************************************************************************************
    // INICIA las variables para el GRID AUXILIAR CONTABLE
    //****************************************************************************************************
    $scope.gridAuxiliarContable = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
        rowTemplate: '<div> <div ng-style="row.entity.color != \'\' ? {\'background-color\': row.entity.color } : {}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>'
         //LQMA 21082017
        //,rowTemplate : '<div ng-style="{\'background-color\': \'#c00\'}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>'
    };
    $scope.gridAuxiliarContable.columnDefs = [
        { name: 'cargo', displayName: 'Cargo', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },             
        { name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.movFechaOpe.substr(0, 10)}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{row.entity.movFechaOpe.substr(0, 10)}}</span></div>'},//LQMA 29 //, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'MES', displayName: 'Periodo', width: 100 },
        //{ name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\'', cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.movFechaOpe  | date : "yyyy-MM-dd"}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{row.entity.movFechaOpe | date : "yyyy-MM-dd"}}</span></div>'},//LQMA 29 //, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Referencia', width: 200 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 },
        //LQMA 07092017                  
        { name: 'referenciaAuxiliar', displayName: 'Referencia', width: 100 },
        //LQMA 21082017
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show:false }
        ,{ name: 'color', field: 'color', displayName: 'Color', cellClass: 'gridCellRight', enableFiltering: true, width: 100, visible: false
                            ,filter: {  //LQMA 05092017    
                                       //term: '#c9dde1',
                                       noTerm: true,                                
                                        condition: function(searchTerm, cellValue) {                                                                    
                                                                    
                                                                    return ($scope.arrayColors.indexOf(cellValue) > -1)
                                                                    
                                                                    } 
                                     
                                }
                              //filter: { term: ($scope.colorXXX.indexOf('') > -1)?term:'ooooooo' } 
                          }        
    ];
    $scope.gridAuxiliarContable.multiSelect = true;
    //****************************************************************************************************


     // INICIA las variables para el GRID BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
        rowTemplate: '<div> <div ng-style="row.entity.color != \'\' ? {\'background-color\': row.entity.color } : {}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>'
         //LQMA 21082017
        //,rowTemplate : '<div ng-class="{\'myEstilo1\':row.isSelected,\'myEstilo2\': !row.isSelected}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>'
    };
    $scope.gridDepositosBancos.columnDefs = [
        { name: 'concepto', displayName: 'Concepto', width: 300 },
        { name: 'fechaOperacion', displayName: 'Fecha', width: 100, cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.fechaOperacion.substr(0, 10)}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{ row.entity.fechaOperacion.substr(0, 10) }}</span></div>'},//, cellFilter: 'date:\'yyyy-MM-dd\'' , cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.fechaOperacion  | date : "yyyy-MM-dd"}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{row.entity.fechaOperacion | date : "yyyy-MM-dd"}}</span></div>'},//LQMA 29 //, cellFilter: 'date:\'dd-MM-yyyy\''//},
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'MES', displayName: 'Periodo', width: 100 },
        //LQMA 07092017                  
        //{ name: 'referenciaAuxiliar', displayName: 'Referencia Auxiliar', width: 300 },
        { name: 'refAmpliada', displayName: 'Referencia Ampliada', width: 300 },
        { name: 'cargo', displayName: 'Cargos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abonos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        //LQMA add
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show:false },
        { name: 'color', field: 'color', displayName: 'Color', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100, visible: false 
                ,filter: {  //LQMA 05092017    
                                       //term: '#c9dde1',
                                       noTerm: true,                                
                                        condition: function(searchTerm, cellValue) {                                                                    
                                                                    //return ($scope.colorXXX.indexOf(cellValue) > -1)?cellValue == cellValue:(cellValue == "#d420c2")?cellValue == cellValue: cellValue == 'xxxxxx'; 
                                                                    //return (($scope.colorXXX.indexOf(cellValue) > -1) || (cellValue == ''))?cellValue == cellValue:cellValue == 'xxxxxx'; 
                                                                    return ($scope.arrayColors.indexOf(cellValue) > -1) //(($scope.colorXXX.indexOf(searchTerm) > -1))?cellValue == cellValue:(cellValue == '...')?cellValue == cellValue:cellValue == 'xxxxxx'; 
                                                                    //return (($scope.colorXXX.indexOf(searchTerm) > -1))?cellValue == searchTerm:cellValue == 'xxxxxx'; 
                                                                    } 
                                     
                                }
                              //filter: { term: ($scope.colorXXX.indexOf('') > -1)?term:'ooooooo' }                           
        }
    ];
    $scope.gridDepositosBancos.multiSelect = true;
    //****************************************************************************************************


    //******************Función para llenar el grid Depositos Bancos********************************
    $scope.getDepositosBancos = function(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte, IdEmpresa) {
        if (idestatus == 1) { 
            filtrosRepository.getDepositos(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte, IdEmpresa).then(function(result) {
                if (result.data.length >= 0) {
                    $scope.depositosBancos = result.data[0];
                    $scope.gridDepositosBancos.data = result.data[0];
                     //Suma del total monetario, abonos
                    console.log( 'DepositosbancosGRID', result );
                    angular.forEach($scope.depositosBancos, function(value, key) {
                    $scope.totalAbonoBancario += value.abono;
                    });

                     //Suma del total monetario cargos

                     angular.forEach($scope.depositosBancos, function(value, key) {
                    $scope.totalCargoBancario += value.cargo;
                    });


                    localStorage.setItem('idRelationOfBancoRows', JSON.stringify(result.data[1]));
                    
                     //LQMA 17082017 add
                    $scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.polizaPago, $scope.busqueda.Cuenta);
                }
            });
        } else if (idestatus == 2) {
            filtrosRepository.getDepositos(idBanco, idestatus).then(function(result) {
                if (result.data.length > 0) {
                    $scope.depositosBancos = result.data;
                }
            });
        }
    };
   //**********************************************************************************************

   //********************Función para llenar el grid Auxiliar Contable*****************************
    
     $scope.getAuxiliarContable = function(idEmpresa, idBanco,numero_cuenta, idestatus, fElaboracion, fCorte, polizaPago, cuentaBancaria) {
         
            filtrosRepository.getAuxiliar(idEmpresa, idBanco, numero_cuenta, idestatus, fElaboracion, fCorte, polizaPago, cuentaBancaria).then(function(result) {
              
		if (result.data[0].length !=0) {
		     //console.log(result.data)
                    $scope.auxiliarContable = result.data[0];
                    $scope.gridAuxiliarContable.data = result.data[0];
                    console.log( 'AuxiliarGRID', result );
                      //Suma del total monetario, abonos

                    angular.forEach($scope.auxiliarContable, function(value, key) {
                    $scope.totalAbonoContable += value.abono;
                    });

                     //Suma del total monetario cargos

                    angular.forEach($scope.auxiliarContable, function(value, key) {
                    $scope.totalCargoContable += value.cargo;
                    });


                    localStorage.setItem('idRelationOfContableRows', JSON.stringify(result.data[1]));
                     //console.log($scope.gridAuxiliarContable.data, 'Auxiliar Contable')
                     setTimeout(function() { $scope.prePunteo();}, 100); //LQMA 31
                     $('#loading').modal('hide');
                }
            });
    };
  
   //**********************************************************************************************

   // INICIA la configuración del GRID AUXILIAR CONTABLE
    //****************************************************************************************************
    $scope.gridAuxiliarContable.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApiAuxiliar = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected == true) {
                $scope.abonoAuxiliar = $scope.abonoAuxiliar + row.entity.abono;
                $scope.cargoAuxiliar = $scope.cargoAuxiliar + row.entity.cargo;
                    
                    //LQMA 23082017    
                row.entity.color = $scope.hexPicker.color;//$scope.currentColor;
                $scope.agregaDiv($scope.hexPicker.color);
                  

            } else if (row.isSelected == false) {
                $scope.abonoAuxiliar = $scope.abonoAuxiliar - row.entity.abono;
                $scope.cargoAuxiliar = $scope.cargoAuxiliar - row.entity.cargo;

                //LQMA add 24082018            
               if(row.entity.indexPrePunteo != 99999 && row.entity.indexPrePunteo != -1){
                var aux = 0; //LQMA 31
                    angular.forEach($scope.gridApiBancos.grid.rows, function(value, key) {
                            if(value.entity.indexPrePunteo == row.entity.indexPrePunteo && value.entity.color == row.entity.color)
                            {
                                //LQMA 31
                                $scope.gridApiBancos.grid.api.selection.unSelectRow($scope.gridApiBancos.grid.options.data[aux]);
                                value.isSelected = false;
                                value.entity.color = '';
                                value.entity.indexPrePunteo = 99999;
                            }
                            aux++;//LQMA 31
                        });
                
                    row.entity.indexPrePunteo = 99999;
                }
                // //console.log('filtrar por indexPrePunteo: ', filtradosAuxiliar)
                var colorRow = row.entity.color;                
                 //console.log('colores',row.entity.color);
                //if(row.entity.color != '#'){
                row.entity.color = '';
                if(colorRow != '')
                $scope.agregaDiv(colorRow);
            }
        }); 

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function(value, key) {
                $scope.punteoAuxiliar[key] = value.entity;
            });
            // localStorage.setItem('infoGridAuxiliar', JSON.stringify($scope.punteoAuxiliar));
            // localStorage.setItem('totalesGrids', JSON.stringify(
            //     {"abonoAuxiliar": $scope.abonoAuxiliar,"cargoAuxiliar": $scope.cargoAuxiliar, "abonoBanco": $scope.abonoBanco,"cargoBanco": $scope.cargoBanco, "diferenciaMonetaria": $scope.difMonetaria}
            //     ));
        });
    };
    //****************************************************************************************************
    // INICIO la configuración del GRID BANCOS
    //**************************************************************************************************** 
    $scope.gridDepositosBancos.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApiBancos = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected == true) {

                $scope.abonoBanco = $scope.abonoBanco + row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco + row.entity.cargo;
                
                //LQMA add 24082018
                row.entity.color = $scope.hexPicker.color;//$scope.currentColor;
                $scope.agregaDiv($scope.hexPicker.color);



            } else if (row.isSelected == false) {

                $scope.abonoBanco = $scope.abonoBanco - row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco - row.entity.cargo;
                
                //LQMA add 24082018 
                if(row.entity.indexPrePunteo != 99999 && row.entity.indexPrePunteo != -1){
                    var aux = 0; //LQMA 31
                    angular.forEach($scope.gridApiAuxiliar.grid.rows, function(value, key) {
                            if(value.entity.indexPrePunteo == row.entity.indexPrePunteo && value.entity.color == row.entity.color)
                            {
                                $scope.gridApiAuxiliar.grid.api.selection.unSelectRow($scope.gridApiAuxiliar.grid.options.data[aux]); //LQMA 31
                                value.isSelected = false;
                                value.entity.color = '';
                                value.entity.indexPrePunteo = 99999;
                            }
                            aux++; //LQMA 31
                        });
                
                    row.entity.indexPrePunteo = 99999;
                }
                // //console.log('filtrar por indexPrePunteo: ', filtradosAuxiliar)
                var colorRow = row.entity.color;                
                 //console.log('colores',row.entity.color);
                //if(row.entity.color != '#'){
                row.entity.color = '';
                if(colorRow != '')
                $scope.agregaDiv(colorRow);



            }

        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
            // localStorage.setItem('infoGridBanco', JSON.stringify($scope.punteoBanco));
        });

    };

    //Color Grids////////////////////////////////////////////////////////


    //LQMA 05092017  todo  
    $scope.setColorGrupo = function(div) {

        $scope.hexPicker.color = '#' + div.currentTarget.id.substring(1,10);

        $scope.arrayColors = [];
        $scope.arrayColors.push($scope.hexPicker.color);
        $scope.arrayColors.push("");

        $scope.gridApiAuxiliar.grid.refresh()

        $scope.gridApiAuxiliar.grid.api.core.raise.filterChanged();
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiAuxiliar.grid.api.grid.queueGridRefresh();

        $scope.gridApiBancos.grid.refresh()

        $scope.gridApiBancos.grid.api.core.raise.filterChanged();
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiBancos.grid.api.grid.queueGridRefresh();

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {
                        if(value.color != undefined)
                            { 
                                if(value.color == $scope.hexPicker.color)
                                    value.indexPrePunteo = -1; 
                                if(value.color == '')
                                    value.indexPrePunteo = 99999; 
                            }
                        else
                            value.indexPrePunteo = 99999;
        });

        angular.forEach($scope.gridApiBancos.grid.options.data, function(value, key) {
                        if(value.color != undefined)
                            { 
                                if(value.color == $scope.hexPicker.color)
                                    value.indexPrePunteo = -1; 
                                if(value.color == '')
                                    value.indexPrePunteo = 99999; 
                            }
                        else
                            value.indexPrePunteo = 99999;
        });

        setTimeout(function() {

                //$scope.gridApiBancos.grid.api.core.scrollTo($scope.gridApiBancos.grid.options.data[$scope.gridApiBancos.grid.options.data.length - 1], $scope.gridApiBancos.grid.options.columnDefs[0]);
                $scope.gridApiBancos.grid.api.core.scrollTo($scope.gridApiBancos.grid.options.data[0], $scope.gridApiBancos.grid.options.columnDefs[0]);//$scope.gridApiBancos.grid.options.columnDefs[0]);
                
                $scope.gridApiAuxiliar.grid.api.core.scrollTo($scope.gridApiAuxiliar.grid.options.data[0], $scope.gridApiAuxiliar.grid.options.columnDefs[0]);


                $scope.gridApiAuxiliar.grid.options.data = $filter('orderBy')($scope.gridApiAuxiliar.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiAuxiliar.grid.api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );                

                $scope.gridApiBancos.grid.options.data = $filter('orderBy')($scope.gridApiBancos.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiBancos.grid.api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );                
                
        }, 1000);



        $scope.cargoBanco = 0;
        $scope.abonoBanco = 0;
        $scope.cargoAuxiliar = 0; 
        $scope.abonoAuxiliar = 0;

        angular.forEach($scope.gridApiBancos.grid.options.data, function(value, key) {
                            //if(value.color != undefined && value.color != '') {
                            if(value.color == $scope.hexPicker.color) {
                                $scope.cargoBanco = $scope.cargoBanco + value.cargo;
                                $scope.abonoBanco = $scope.abonoBanco + value.abono;
                            }
                        });

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {             
                            //if(value.color != undefined && value.color != '') {               
                            if(value.color == $scope.hexPicker.color) {
                                $scope.cargoAuxiliar = $scope.cargoAuxiliar + value.cargo; 
                                $scope.abonoAuxiliar = $scope.abonoAuxiliar + value.abono;
                            }
                        });
//*************************************************************************************************************************************************************************************
// Validación de los montos entre Registros Bancarios y Contables

        if($scope.abonoAuxiliar != 0 && $scope.cargoAuxiliar != 0) {
      
              if ((($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoAuxiliar + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoAuxiliar + $scope.difMonetaria)))
              {
                   $scope.control = 1; 
              } else{
                alertFactory.error('La cantidad de abono y cargo para conciliar Registros Contables no coinciden!!');
                $scope.control = undefined;
              }

        }

        if($scope.abonoBanco != 0 && $scope.cargoBanco != 0 && $scope.isDPI == undefined) {
      
              if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoBanco + $scope.difMonetaria)))
              {
                   $scope.control = 1; 
              } else{
                alertFactory.error('La cantidad de abono y cargo para conciliar Registros Bancarios no coinciden!!');
                $scope.control = undefined;
              }

        }

        if($scope.abonoBanco != 0 && $scope.cargoBanco == 0 && $scope.isDPI != undefined) {
                $scope.control = 1;
        }

        else { 
        if ($scope.cargoBanco != 0 && $scope.abonoAuxiliar != 0) {
                if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoAuxiliar + $scope.difMonetaria))) {
                    $scope.control = 1;
                } else {
                    $scope.control = undefined;
                    alertFactory.error('La cantidad de cargo y abono no coinciden');
                }
            } else if ($scope.abonoBanco != 0 && $scope.cargoAuxiliar != 0) {
                if ((($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoBanco + $scope.difMonetaria)) || (($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoAuxiliar + $scope.difMonetaria))) {
                    $scope.control = 1;
                } else {
                    $scope.control= undefined;
                    alertFactory.error('La cantidad de cargo y abono no coinciden');
                }
            }


             //Verifica la integridad de las relaciones entre Registros Bancarios y Contables
            if ($scope.rowAuxiliarColor.length > 0 && $scope.rowBancoColor.length > 0) {
                    if ($scope.rowAuxiliarColor.length >= 1 || $scope.rowBancoColor.length >= 1) {
                        if ($scope.cargoBanco != 0 && $scope.cargoAuxiliar != 0 || $scope.abonoBanco != 0 && $scope.abonoAuxiliar != 0){
                            alertFactory.error('La relación de los registros debe ser cargo-abono, abono-cargo de los registros Bancarios y Contables, por favor verifique su selección');
                            $scope.control = undefined;
                        } else {
                            //$scope.verificaCantidades(2); //El numero 2 corresponde al punteo de cargos - abonos de Registros Bancarios y Contables 
                            $scope.control = 1;
                        }
                    } 
                } else {
                    alertFactory.error('No ha seleccionado ninguna relación del grupo creado');
                }
            
                //Fin validación relaciones Registros Bancarios y Contables
        }
            //Fin de ña validación de montos 

//*************************************************************************************************************************************************************************************


    };

    //LQMA 28082017
    $scope.desSeleccionar = function() {

         //console.log($scope.gridApiAuxiliar.grid.options.data);

        /*
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.gridApiBancos.selection.clearSelectedRows();
        */
    }
    //LQMA 05092017  todo
    $scope.mostrarTodos = function() {

        $scope.cargoBanco = 0;
        $scope.abonoBanco = 0;
        $scope.cargoAuxiliar = 0; 
        $scope.abonoAuxiliar = 0;

        $scope.arrayColors = [];                      

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {
                        if( $scope.arrayColors.indexOf(value.color) == -1)
                            $scope.arrayColors.push(value.color)

                        //if(value.color != undefined && value.color != '') {
                            if(value.color == $scope.hexPicker.color) {
                                $scope.cargoAuxiliar = $scope.cargoAuxiliar + value.cargo;
                                $scope.abonoAuxiliar = $scope.abonoAuxiliar + value.abono;
                            }


        });

        angular.forEach($scope.gridApiBancos.grid.options.data, function(value, key) {
                        if( $scope.arrayColors.indexOf(value.color) == -1)
                            $scope.arrayColors.push(value.color)

                        //if(value.color != undefined && value.color != '') {
                            if(value.color == $scope.hexPicker.color) {
                                $scope.cargoBanco = $scope.cargoBanco + value.cargo;
                                $scope.abonoBanco = $scope.abonoBanco + value.abono;
                            }


        });


        $scope.gridApiAuxiliar.grid.refresh()
        // //console.log('colorXXX',$scope.colorXXX)

        $scope.gridApiAuxiliar.grid.api.core.raise.filterChanged();
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiAuxiliar.grid.api.grid.queueGridRefresh();

        $scope.gridApiAuxiliar.grid.refresh()
        // //console.log('colorXXX',$scope.colorXXX)

        $scope.gridApiBancos.grid.api.core.raise.filterChanged();
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiBancos.grid.api.grid.queueGridRefresh();

    }
     //LQMA 05092017 todo
    $scope.mostrarNoPunteados = function() {
        

        $scope.cargoBanco = 0;
        $scope.abonoBanco = 0;
        $scope.cargoAuxiliar = 0; 
        $scope.abonoAuxiliar = 0;


        $scope.arrayColors = [];        
        $scope.arrayColors.push("");
        
        $scope.gridApiAuxiliar.grid.refresh()
        
        $scope.gridApiAuxiliar.grid.api.core.raise.filterChanged();
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiAuxiliar.grid.api.grid.queueGridRefresh();

        $scope.gridApiBancos.grid.refresh()
        
        $scope.gridApiBancos.grid.api.core.raise.filterChanged();
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiBancos.grid.api.grid.queueGridRefresh();
    }

    //LQMA add 28082017 
        $scope.agregaDiv = function(color){
            

            var colorBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
                    return value.color == color; //|| value.assignee.id === 'ak';   
                });

            var colorAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
                    return value.color == color; //|| value.assignee.id === 'ak';                    
                });

            // //console.log(colorBancos)
            
            color = color.replace("#","")


            if(colorBancos.length > 0 || colorAuxiliar.length > 0)
            {       
                if (angular.element("#X" + color +"").length) {
                    var myEl = angular.element( document.querySelector("#X" + color +""));
                    myEl.remove();
                }
                // //console.log('agrega')
                 
                //LQMA 29
                //var divTemplate = "<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' data-ng-click=\"setColorGrupo($event)\"><button type=\"button\" ng-click=\"saluda()\" text='O'>" + colorBancos.length + "</div>";
                var divTemplate = "<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' data-ng-click=\"setColorGrupo($event)\"></div>";
                var temp = $compile(divTemplate)($scope);                
                angular.element(document.getElementById('divGrupos')).append(temp);

                /*
                var newEle = angular.element("<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' ng-click=\"setColorGrupo()\"><button type=\"button\" ng-click=\"saluda()\" text='O'>" + colorBancos.length + "</div>");
                var target = document.getElementById('divGrupos');
                angular.element(target).append(newEle);
                */
                
            }
            else
            {
                 //console.log('compara para borrar')
                if (angular.element("#X" + color +"").length) {
                    var myEl = angular.element( document.querySelector("#X" + color +""));
                    myEl.remove();
                }
            }
        }  



    //LQMA 17082017 add funcion para pre-punteo (pre-seleccion)
    $scope.prePunteo = function(){

        var indexBanco = 0, fechaOperacionBanco = '', cargoBanco = 0, abonoBanco = 0, esCargo = 0;
        var indicePrePunteo = 0;

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {
                            value.indexPrePunteo = 99999;
                        });
        

        angular.forEach($scope.gridApiBancos.grid.options.data, function(value, key) {
                            value.indexPrePunteo = 99999;
                        });

        angular.forEach($scope.gridApiBancos.grid.options.data, function(value, key) {

            value.indexPrePunteo = 99999;

            fechaOperacionBanco = value.fechaOperacion;
            cargoBanco = value.cargo; 
            abonoBanco = value.abono;
            esCargo = value.esCargo;         
            //LQMA 07092017
            referenciaAuxiliar = value.referenciaAuxiliar; 


             var filtradosBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
                //LQMA 07092017
                    return value.cargo == cargoBanco && value.fechaOperacion == fechaOperacionBanco && value.abono == abonoBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';                    
                });

            if(filtradosBancos.length == 1){
            
                    var filtradosAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
                        if(esCargo == 0)
                            //LQMA 07092017
                            return value.cargo == abonoBanco && value.movFechaOpe == fechaOperacionBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';
                        else 
                            //LQMA 07092017
                            return value.abono == cargoBanco && value.movFechaOpe == fechaOperacionBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';
                    });

                    var indexAuxiliar = 0;

                    if(filtradosAuxiliar.length  == 1){                
               

                        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {

                            if(esCargo == 0)
                            {   //LQMA 07092017
                                if(value.movFechaOpe == fechaOperacionBanco && abonoBanco == value.cargo && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar))
                                {
                                    $scope.gridApiAuxiliar.grid.api.selection.selectRow($scope.gridApiAuxiliar.grid.options.data[indexAuxiliar]);
                                    value.indexPrePunteo = indicePrePunteo;
                                }
                            }
                            else//LQMA 07092017
                                if(value.movFechaOpe == fechaOperacionBanco && cargoBanco == value.abono && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar))
                                {
                                    $scope.gridApiAuxiliar.grid.api.selection.selectRow($scope.gridApiAuxiliar.grid.options.data[indexAuxiliar]);
                                    value.indexPrePunteo = indicePrePunteo;
                                }

                            indexAuxiliar ++;    
                        });

                        $scope.gridApiBancos.grid.api.selection.selectRow($scope.gridApiBancos.grid.options.data[indexBanco]);
                        value.indexPrePunteo = indicePrePunteo;

                        indicePrePunteo ++;      

                    }    
            }

            indexBanco++;
        });

        $scope.gridApiAuxiliar.grid.options.data = $filter('orderBy')($scope.gridApiAuxiliar.grid.options.data, "indexPrePunteo", false)
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );

        $scope.gridApiBancos.grid.options.data = $filter('orderBy')($scope.gridApiBancos.grid.options.data, "indexPrePunteo", false)
        $scope.gridApiBancos.grid.api.core.notifyDataChange( uiGridConstants.dataChange.EDIT );

        //LQMA 28082017
        $scope.auxiliarContableOriginal = $scope.gridApiAuxiliar.grid.options.data; 
        $scope.depositoBancosOriginal = $scope.gridApiBancos.grid.options.data; 

    } 

    //LQMA 07092017
    /*
    $scope.$watch('hexPicker.color', function() { 

        if($scope.hexPicker.color == '#c9dde1')
        {
             //console.log('color-->', $scope.hexPicker.color);
            $scope.hexPicker.color = '#b9b8f5'
        }
        
     }, true);
    */
        //LQMA  05092017 todo
    $scope.filtraBanco = function(filtro)
    {   

         //console.log($scope.filtroBancoCarAbo)

        switch($scope.filtroBancoCarAbo)
        {
            case '0':
                    $scope.gridApiAuxiliar.grid.columns[0].filters[0] = {}
                    $scope.gridApiBancos.grid.columns[4].filters[0] = {}

                break;

            case '1':
                    $scope.gridApiAuxiliar.grid.columns[0].filters[0] = {
                                                              condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                                                              term: 0
                                                            }

                    $scope.gridApiBancos.grid.columns[4].filters[0] = {
                                                              condition: uiGridConstants.filter.GREATER_THAN,
                                                              term: 0
                                                            }
                break;

            case '2':                    
                    $scope.gridApiAuxiliar.grid.columns[0].filters[0] = {
                                                              condition: uiGridConstants.filter.GREATER_THAN,
                                                              term: 0
                                                            }

                    $scope.gridApiBancos.grid.columns[4].filters[0] = {
                                                              condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                                                              term: 0
                                                            }            
                break;    
        }
                                                            

        $scope.gridApiAuxiliar.grid.refresh()

        $scope.gridApiAuxiliar.grid.api.core.raise.filterChanged();
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiAuxiliar.grid.api.grid.queueGridRefresh();                                                            

         
        $scope.gridApiBancos.grid.refresh()

        $scope.gridApiBancos.grid.api.core.raise.filterChanged();
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiBancos.grid.api.grid.queueGridRefresh();                                                                

    }



    $scope.ShowAlertPunteo = function(){

           //Obtengo los registros seleccionados y agrupados por color

        var auxiSel = 0,depoSel = 0; auxiTot = 0,depoTot = 0;
        var deSel = [], auSel = []; // variables en las que se almacenan los registros seleccionados
        angular.forEach($scope.gridApiBancos.grid.options.data , function(value, key) {             
                            if(value.color != undefined && value.color != '') {               
                                    depoTot++;
                                    deSel.push(value);
                                if(value.color == $scope.hexPicker.color)
                                {
                                    // //console.log('seleccionado: ',value.color)
                                    depoSel++;
                                }
                            }
                        });
        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {             
                            if(value.color != undefined && value.color != '') {
                                    auxiTot++;
                                    auSel.push(value);
                                if(value.color == $scope.hexPicker.color)
                                {
                                    // //console.log('seleccionado: ',value.color)
                                    auxiSel++;
                                }
                            }
                        });
      // Mando a llamar la función que me genera el grupo de arrays por color y tipo de Punteo
        $scope.crearArrayGrupos(deSel, auSel);
 
        
        
           //Registro el grupo de arrays del grid original ya seleccionado en local storage para obtenerlos en un controlller distinto
          localStorage.setItem('infoGridAuxiliar', JSON.stringify($scope.agrupadosAuxiliar));
          localStorage.setItem('infoGridBanco', JSON.stringify($scope.agrupadosBancos));
          localStorage.setItem('infoGridAbonoCargoAuxiliar', JSON.stringify($scope.agrupadosAuxiliarCargoAbono));
          localStorage.setItem('infoGridAbonoCargoBanco', JSON.stringify($scope.agrupadosBancosCargoAbono));


if($scope.control != undefined){
       $('#alertaGuardarPunteoPrevio').modal('show');
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.limpiaVariables();
    }
    else{
        if(($scope.cargoAuxiliar != $scope.abonoBanco || $scope.cargoBanco != $scope.abonoAuxiliar) && ($scope.cargoAuxiliar != $scope.abonoAuxiliar || $scope.cargoBanco != $scope.abonoBanco)){
        alertFactory.error('Tiene errores en los grupos creados para conciliar, por favor verifique su información!!');
        }
      else if($scope.cargoAuxiliar == $scope.abonoBanco || $scope.cargoBanco == $scope.abonoAuxiliar || $scope.cargoAuxiliar == $scope.abonoAuxiliar || $scope.cargoBanco == $scope.abonoBanco) {
       $('#alertaGuardarPunteoPrevio').modal('show');
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.limpiaVariables();
      } 
     }

    };


$scope.crearArrayGrupos = function(deSel, auSel){

        var coloresUsados = [];        
        $scope.agrupadosBancos = []; 
        $scope.agrupadosAuxiliar = [];
        $scope.agrupadosAuxiliarCargoAbono = [];
        $scope.agrupadosBancosCargoAbono = [];
///Finaliza la funcion que guarda la relación (cargos - abonos) Contables y bancarios
        if(deSel.length > 0 && auSel.length > 0){
        var colorActual = deSel[0].color;
        var filtradosColors = deSel;
         
        while(filtradosColors.length > 0)
        {
            colorActual = filtradosColors[0].color;
            coloresUsados.push(colorActual); 

            var grupoActualBanco = $filter('filter')(deSel, function(value){
                                            return value.color == colorActual;  
                                        }); 

            var grupoActualAuxiliar = $filter('filter')(auSel, function(value){
                                            return value.color == colorActual;  
                                        });                                

            // //console.log('grupo actual: ',grupoActual);
            $scope.agrupadosBancos.push(grupoActualBanco)
            $scope.agrupadosAuxiliar.push(grupoActualAuxiliar)

            // //console.log('busca colores: ', coloresUsados.indexOf(colorActual))

            filtradosColors = $filter('filter')(filtradosColors, function(value){
                                            return (coloresUsados.indexOf(colorActual) == -1)?value.color =='.........':value.color!=colorActual;  
                                        });

            // //console.log('grupos restantes: ',filtradosColors);
        }
    }
///Finaliza la funcion que guarda la relación (cargos - abonos) Contables y bancarios

///Inicia la funcion que guarda cargos - abonos Contables
else if(deSel.length == 0 && auSel.length > 0){
        var gruposAuxiliarSolo = $filter('filter')(auSel, function(value){
                                            // //console.log(value);
                                            return (coloresUsados.indexOf(value.color) == -1)?value.color==value.color:value.color =='.........';  
                                        });

        // //console.log('complemento de auxiliares:',gruposAuxiliarSolo);
        

        while(gruposAuxiliarSolo.length > 0)
        {
            colorActual = gruposAuxiliarSolo[0].color;
            
            coloresUsados.push(colorActual); 

            var grupoActualBanco = $filter('filter')(gruposAuxiliarSolo, function(value){
                                            return value.color == colorActual;  
                                        }); 

            $scope.agrupadosAuxiliarCargoAbono.push(grupoActualBanco)

            gruposAuxiliarSolo = $filter('filter')(gruposAuxiliarSolo, function(value){
                                            return (coloresUsados.indexOf(colorActual) == -1)?value.color =='.........':value.color!=colorActual;  
                                        });
        }
    }

///Inicia la funsión que guarda cargos - abonos Bancarios
    else if(deSel.length > 0 && auSel.length == 0){
     var gruposBancoSolo = $filter('filter')(deSel,function(value){
                           return (coloresUsados.indexOf(value.Color) == -1)?value.color:value.color =='.........';
         });
     

     while(gruposBancoSolo.length > 0)
             {
                colorActual = gruposBancoSolo[0].color;

                coloresUsados.push(colorActual);

                var grupoActualContable = $filter('filter')(gruposBancoSolo, function(value){
                        return value.color == colorActual;
                });

                $scope.agrupadosBancosCargoAbono.push(grupoActualContable);

                gruposBancoSolo = $filter('filter')(gruposBancoSolo, function(value){
                                  return (coloresUsados.indexOf(colorActual) == -1)?value.color =='.........':value.color!=colorActual;
                });

             }

    }
///Finaliza la funcion que guarda cargos - abonos Contables


        //  //console.log('agrupados Bancos: ', $scope.agrupadosBancos)
        //  //console.log('agrupados Auxiliar: ', $scope.agrupadosAuxiliar)
        //  //console.log('agrupados Auxiliar- Cargo - abono: ', $scope.agrupadosAuxiliarCargoAbono)

};





    $scope.cancelaPunteoPrevio = function(){
    	//$scope.limpiaVariables();
     $('#alertaGuardarPunteoPrevio').modal('hide');
    };
    
    ////////////////////////////////////////////////////////Funsión para guardar los depositos no identificados////////////////////////////////////////////////7
     $scope.ShowAlertDPI = function(){

          $scope.isDPI = 1;

           
          var PunteoDPI = [], AbonoBanco = 0, CargoBanco = 0;

          angular.forEach($scope.gridApiBancos.grid.options.data , function(value, key) {             
                            if(value.color != undefined && value.color != '') {               
                                    PunteoDPI.push(value);
                                    AbonoBanco += value.abono;
                                    CargoBanco += value.cargo;
                            }
                        });
          if(AbonoBanco > 0 && CargoBanco == 0){
               $scope.control = 1;
          }

          if ($scope.control != undefined){
          $('#alertaGuardarDPI').modal('show');
          localStorage.setItem('infoDPIData', JSON.stringify(PunteoDPI));
	
	   //console.log('PunteoDPI: ')
	   //console.log(PunteoDPI)	
        ///////////////////////////////////////////////////////////////////////////////
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.limpiaVariables();
        //////////////////////////////////////////////////////////////////////////////
    }
    else {

        alertFactory.error('Tiene errores en los grupos creados para el envío a DPI, por favor verifique su información!!');
    }
     };

     ////////////////////////////////////////////////////////////////////////////////Funsión para cancelar los punteos///////////////////////////////////

     $scope.cancelaPunteoDPI = function(){
        $scope.limpiaVariables();
      $('#alertaGuardarDPI').modal('hide');
     };

    $scope.limpiaVariables = function() {
        $scope.abonoAuxiliar = 0;
        $scope.cargoAuxiliar = 0;
        $scope.abonoBanco = 0;
        $scope.cargoBanco = 0;
    };
});