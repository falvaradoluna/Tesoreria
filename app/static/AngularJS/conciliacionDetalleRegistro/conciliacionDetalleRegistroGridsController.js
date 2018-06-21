registrationModule.controller('conciliacionDetalleRegistroGridsController', function ($scope, $log, $filter, $compile, localStorageService, filtrosRepository, uiGridConstants, uiGridGroupingConstants, filterFilter) {

    $scope.gridsInfo = [];
    $scope.depositosBancos = '';

    $scope.control = undefined;
    $scope.isDPI = undefined;
    $scope.ocultarSave = false;

    $scope.aboConCarBan = 0;
    $scope.carConAboBan = 0;

    $scope.cacheContable = [];
    $scope.cacheBancario = [];

    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.difMonetaria = 0;
    $scope.totalAbonoBancario = 0;
    $scope.totalCargoBancario = 0;
    $scope.totalAbonoContable = 0;
    $scope.totalCargoContable = 0;

    //Variables para la sumatoria por grupo
    $scope.bancoGrupo = 0;
    $scope.contableGrupo = 0;
    $scope.bancoText = '';
    $scope.contableText = '';

    //Punteo especial
    $scope.checkboxEspecial = {
        value : false
      };

    //LQMA add 22082017
    $scope.hexPicker = { color: '#c9dde1' };

    //LQMA 05092017
    $scope.arrayColors = ['#c9dde1', ''];//[{ color: '#c9dde1'}, {color: '' }];

    //LQMA 28082017
    $scope.auxiliarContableOriginal = [];
    $scope.depositoBancosOriginal = [];
    $scope.letras = { lit: 'A', lit: 'B', lit: 'C', lit: 'D', lit: 'E', lit: 'F', lit: 'G', lit: 'H', lit: 'I', lit: 'J', lit: 'K', lit: 'L', lit: 'M', lit: 'N', lit: 'O', lit: 'P', lit: 'Q', lit: 'R', lit: 'S', lit: 'T', lit: 'W', lit: 'X', lit: 'Y', lit: 'Z' };

    //LQMA 29
    $scope.fechaActual = '2017-05-07';

    $scope.init = function () {
        $('#loading').modal('show');

        variablesLocalStorage();
        $scope.getDepositosBancos($scope.busqueda.IdBanco, 1, $scope.busqueda.Cuenta, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa);
        $scope.diferenciaNeg = $scope.difMonetaria * -1;
        //LQMA comment 17082017
        //$scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
    };


    var variablesLocalStorage = function () {
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
        { name: 'cargo', displayName: 'Cargo', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo != 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono != 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        { name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.movFechaOpe.substr(0, 10)}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{row.entity.movFechaOpe.substr(0, 10)}}</span></div>' },//LQMA 29 //, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Referencia', width: 200 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 }, 
        { name: 'referenciaAuxiliar', displayName: 'Referencia', width: 100 },
        { name: 'MES', displayName: 'Periodo', width: 100 },       
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show: false }
        , {
            name: 'color', field: 'color', displayName: 'Color', cellClass: 'gridCellRight', enableFiltering: true, width: 100, visible: false
            , filter: {
                noTerm: true,
                condition: function (searchTerm, cellValue) {

                    return ($scope.arrayColors.indexOf(cellValue) > -1)

                }

            }
        }
    ];
    $scope.gridAuxiliarContable.multiSelect = true;
    //****************************************************************************************************


    // INICIA las variables para el GRID BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        //enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
        rowTemplate: '<div> <div ng-style="row.entity.color != \'\' ? {\'background-color\': row.entity.color } : {}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ui-grid-cell></div></div>'
    };
    $scope.gridDepositosBancos.columnDefs = [
        { name: 'MES', displayName: 'Periodo', width: 100 },
        { name: 'concepto', displayName: 'Concepto', width: 300 },
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'fechaOperacion', displayName: 'Fecha', width: 100, cellTemplate: '<div class="text-right text-danger text-semibold"><span ng-if="row.entity.fechaAnterior == 1">{{row.entity.fechaOperacion.substr(0, 10)}}</span></div><div class="text-right"><span ng-if="row.entity.fechaAnterior == 0">{{ row.entity.fechaOperacion.substr(0, 10) }}</span></div>' },
        { name: 'refAmpliada', displayName: 'Referencia Ampliada', width: 300 },
        { name: 'cargo', displayName: 'Cargos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abonos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show: false },
        {
            name: 'color', field: 'color', displayName: 'Color', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100, visible: false
            , filter: {  //LQMA 05092017    
                //term: '#c9dde1',
                noTerm: true,
                condition: function (searchTerm, cellValue) {
                    return ($scope.arrayColors.indexOf(cellValue) > -1) 
                }

            }
            //filter: { term: ($scope.colorXXX.indexOf('') > -1)?term:'ooooooo' }                           
        }
    ];
    $scope.gridDepositosBancos.multiSelect = true;
    //****************************************************************************************************


    //******************Función para llenar el grid Depositos Bancos********************************
    $scope.getDepositosBancos = function (idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte, IdEmpresa) {

        if (idestatus == 1) {

            filtrosRepository.getDepositos(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte, IdEmpresa).then(function (result) {
                if (result.data.length >= 0) {
                    $scope.depositosBancos = result.data[0];
                    
                    angular.forEach($scope.depositosBancos, function (value, key) {
                        if (value.esCargo == 1) {
                            $scope.depositosBancos[key]['cargo'] = value.importe;
                            $scope.totalCargoBancario += value.importe;
                        } else if (value.esCargo == 0) {
                            $scope.depositosBancos[key]['abono'] = value.importe;
                            $scope.totalAbonoBancario += value.importe;
                        }
                    });

                    $scope.gridDepositosBancos.data = result.data[0];

                    localStorage.setItem('idRelationOfBancoRows', JSON.stringify(result.data[1]));

                    //LQMA 17082017 add
                    $scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.polizaPago, $scope.busqueda.Cuenta);
                }
            });
        } else if (idestatus == 2) {
            filtrosRepository.getDepositos(idBanco, idestatus).then(function (result) {
                if (result.data.length > 0) {
                    $scope.depositosBancos = result.data;
                }
            });
        }
    };
    //**********************************************************************************************

    //********************Función para llenar el grid Auxiliar Contable*****************************

    $scope.getAuxiliarContable = function (idEmpresa, idBanco, numero_cuenta, idestatus, fElaboracion, fCorte, polizaPago, cuentaBancaria) {

        filtrosRepository.getAuxiliar(idEmpresa, idBanco, numero_cuenta, idestatus, fElaboracion, fCorte, polizaPago, cuentaBancaria).then(function (result) {

            if (result.data[0].length != 0) {
                $scope.auxiliarContable = result.data[0];
                $scope.gridAuxiliarContable.data = result.data[0];
                //Suma del total monetario, abonos
                
                angular.forEach($scope.auxiliarContable, function (value, key) {
                    $scope.totalAbonoContable += value.abono;
                });

                //Suma del total monetario cargos

                angular.forEach($scope.auxiliarContable, function (value, key) {
                    $scope.totalCargoContable += value.cargo;
                });


                localStorage.setItem('idRelationOfContableRows', JSON.stringify(result.data[1]));
                setTimeout(function () { $scope.prePunteo(); }, 100); //LQMA 31
                $('#loading').modal('hide');
            }
        });
    };

    //**********************************************************************************************
    // INICIA la configuración del GRID AUXILIAR CONTABLE
    //****************************************************************************************************

    $scope.gridAuxiliarContable.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApiAuxiliar = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
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
                if (row.entity.indexPrePunteo != 99999 && row.entity.indexPrePunteo != -1) {
                    var aux = 0; //LQMA 31
                    angular.forEach($scope.gridApiBancos.grid.rows, function (value, key) {
                        if (value.entity.indexPrePunteo == row.entity.indexPrePunteo && value.entity.color == row.entity.color) {
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
                
                var colorRow = row.entity.color;
                
                row.entity.color = '';
                if (colorRow != '')
                    $scope.agregaDiv(colorRow);
            }
            $scope.validaSaldos();
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function (value, key) {
                $scope.punteoAuxiliar[key] = value.entity;
            });
        });
    };

    //****************************************************************************************************
    // INICIO la configuración del GRID BANCOS
    //**************************************************************************************************** 
    $scope.gridDepositosBancos.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApiBancos = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected == true) {
                $scope.abonoBanco = $scope.abonoBanco  + row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco + row.entity.cargo;
                $scope.cargoBanco = parseFloat( $scope.cargoBanco );
                $scope.abonoBanco = parseFloat( $scope.abonoBanco );
                
                //LQMA add 24082018
                row.entity.color = $scope.hexPicker.color;//$scope.currentColor;
                $scope.agregaDiv($scope.hexPicker.color);



            } else if (row.isSelected == false) {

                $scope.abonoBanco = $scope.abonoBanco - row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco - row.entity.cargo;
                    
                //LQMA add 24082018 
                if (row.entity.indexPrePunteo != 99999 && row.entity.indexPrePunteo != -1) {
                    var aux = 0; //LQMA 31
                    angular.forEach($scope.gridApiAuxiliar.grid.rows, function (value, key) {
                        if (value.entity.indexPrePunteo == row.entity.indexPrePunteo && value.entity.color == row.entity.color) {
                            $scope.gridApiAuxiliar.grid.api.selection.unSelectRow($scope.gridApiAuxiliar.grid.options.data[aux]); //LQMA 31
                            value.isSelected = false;
                            value.entity.color = '';
                            value.entity.indexPrePunteo = 99999;
                        }
                        aux++; //LQMA 31
                    });

                    row.entity.indexPrePunteo = 99999;
                }
                
                var colorRow = row.entity.color;
                
                row.entity.color = '';
                if (colorRow != '')
                    $scope.agregaDiv(colorRow);
            }
            $scope.validaSaldos();
        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function (value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
        });
       
    };

    $scope.validaSaldos = function(){
        $scope.bancoGrupo = (parseFloat($scope.cargoBanco)  * -1) + parseFloat($scope.abonoBanco);
        $scope.contableGrupo = (parseFloat($scope.cargoAuxiliar) * -1) + parseFloat($scope.abonoAuxiliar);
        
        if( $scope.bancoGrupo == 0){
            $scope.bancoText = '';
        }else{
            $scope.bancoText = Math.sign($scope.bancoGrupo) == 1 ? 'Abono' : 'Cargo';
        }

        if( $scope.contableGrupo == 0 ){
            $scope.contableText = '';
        }else{
            $scope.contableText = Math.sign($scope.contableGrupo) == 1 ? 'Abono' : 'Cargo';
        }
        $scope.diferenciaTodo = $scope.bancoGrupo + $scope.contableGrupo;
        
        if( $scope.diferenciaTodo >= $scope.diferenciaNeg && $scope.diferenciaTodo <= $scope.difMonetaria ){
            $scope.info = true;
        }else{
            $scope.info = false;
        }
    };

    $scope.getHexColor = function(){ 
        hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F") 
        color_aleatorio = "#"; 
        for ( i = 0; i < 6; i++ ){ 
            posarray = $scope.aleatorio(0,hexadecimal.length)
            color_aleatorio += hexadecimal[posarray] 
        } 
        return color_aleatorio;
    };

    $scope.aleatorio = function(inferior,superior){ 
        numPosibilidades = superior - inferior 
        aleat = Math.random() * numPosibilidades 
        aleat = Math.floor(aleat) 
        return parseInt(inferior) + aleat 
    };

    $scope.nuevoGrupo = function(){
        $scope.bancoGrupo = 0;
        $scope.contableGrupo = 0;
        if( $scope.info ){
            $scope.hexPicker.color = '';
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

            angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
                if (value.color != undefined) {
                    if (value.color == $scope.hexPicker.color)
                        value.indexPrePunteo = -1;
                    if (value.color == '')
                        value.indexPrePunteo = 99999;
                }
                else
                    value.indexPrePunteo = 99999;
            });

            angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
                if (value.color != undefined) {
                    if (value.color == $scope.hexPicker.color)
                        value.indexPrePunteo = -1;
                    if (value.color == '')
                        value.indexPrePunteo = 99999;
                }
                else
                    value.indexPrePunteo = 99999;
            });

            setTimeout(function () {

                //$scope.gridApiBancos.grid.api.core.scrollTo($scope.gridApiBancos.grid.options.data[$scope.gridApiBancos.grid.options.data.length - 1], $scope.gridApiBancos.grid.options.columnDefs[0]);
                $scope.gridApiBancos.grid.api.core.scrollTo($scope.gridApiBancos.grid.options.data[0], $scope.gridApiBancos.grid.options.columnDefs[0]);//$scope.gridApiBancos.grid.options.columnDefs[0]);

                $scope.gridApiAuxiliar.grid.api.core.scrollTo($scope.gridApiAuxiliar.grid.options.data[0], $scope.gridApiAuxiliar.grid.options.columnDefs[0]);


                $scope.gridApiAuxiliar.grid.options.data = $filter('orderBy')($scope.gridApiAuxiliar.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

                $scope.gridApiBancos.grid.options.data = $filter('orderBy')($scope.gridApiBancos.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

            }, 1000);

            $scope.hexPicker.color = $scope.getHexColor();


            $scope.cargoBanco = 0;
            $scope.abonoBanco = 0;
            $scope.cargoAuxiliar = 0;
            $scope.abonoAuxiliar = 0;

            // var auxCon = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
            //     return (value.color != '')
            // });
            // angular.forEach( auxCon, function(value){
            //     $scope.cacheContable.push(value);
            // })

            // var auxBan = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
            //     return (value.color != '' )
            // });
            // angular.forEach( auxBan, function(value){
            //     $scope.cacheBancario.push( value );
            // })
            
          
            // $scope.gridApiAuxiliar.grid.options.data = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
            //     return (value.color == '' || value.color == $scope.hexPicker.color )
            // });
            // $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

            // $scope.gridApiBancos.grid.options.data = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
            //     return (value.color == '' || value.color == $scope.hexPicker.color )
            // });
            // $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        }else{
            swal(
                'Alto',
                'El grupo actual no esta correctamente punteado.',
                'warning'
            );
        }
    }

    //Color Grids////////////////////////////////////////////////////////


    //LQMA 05092017  todo  
    $scope.setColorGrupo = function (div) {
        if( $scope.info ){
            $scope.hexPicker.color = '#' + div.currentTarget.id.substring(1, 10);

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

            angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
                if (value.color != undefined) {
                    if (value.color == $scope.hexPicker.color)
                        value.indexPrePunteo = -1;
                    if (value.color == '')
                        value.indexPrePunteo = 99999;
                }
                else
                    value.indexPrePunteo = 99999;
            });

            angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
                if (value.color != undefined) {
                    if (value.color == $scope.hexPicker.color)
                        value.indexPrePunteo = -1;
                    if (value.color == '')
                        value.indexPrePunteo = 99999;
                }
                else
                    value.indexPrePunteo = 99999;
            });

            setTimeout(function () {
                $scope.gridApiBancos.grid.api.core.scrollTo($scope.gridApiBancos.grid.options.data[0], $scope.gridApiBancos.grid.options.columnDefs[0]);//$scope.gridApiBancos.grid.options.columnDefs[0]);
                $scope.gridApiAuxiliar.grid.api.core.scrollTo($scope.gridApiAuxiliar.grid.options.data[0], $scope.gridApiAuxiliar.grid.options.columnDefs[0]);

                $scope.gridApiAuxiliar.grid.options.data = $filter('orderBy')($scope.gridApiAuxiliar.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

                $scope.gridApiBancos.grid.options.data = $filter('orderBy')($scope.gridApiBancos.grid.options.data, "indexPrePunteo", false)
                $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

            }, 1000);



            $scope.cargoBanco = 0;
            $scope.abonoBanco = 0;
            $scope.cargoAuxiliar = 0;
            $scope.abonoAuxiliar = 0;

            angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
                //if(value.color != undefined && value.color != '') {
                if (value.color == $scope.hexPicker.color) {
                    
                    if( value.cargo == '' ){
                        $scope.cargoBanco = parseFloat( $scope.cargoBanco ) + 0;
                    }else{
                        $scope.cargoBanco = parseFloat( $scope.cargoBanco ) + parseFloat( value.cargo );
                    }

                    if( value.abono == '' ){
                        $scope.abonoBanco = parseFloat( $scope.abonoBanco ) + 0;
                    }else{
                        $scope.abonoBanco = parseFloat( $scope.abonoBanco ) + parseFloat( value.abono );
                    }
                    
                    $scope.validaSaldos();
                    
                    console.log( 'value.cargo', value.cargo );
                    console.log( 'value.abono', value.abono );
                }
            });

            angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
                //if(value.color != undefined && value.color != '') {               
                if (value.color == $scope.hexPicker.color) {
                    $scope.cargoAuxiliar = parseFloat( $scope.cargoAuxiliar ) + parseFloat( value.cargo );
                    $scope.abonoAuxiliar = parseFloat( $scope.abonoAuxiliar ) + parseFloat( value.abono );
                    $scope.validaSaldos();
                }
            });

            console.log( '$scope.cargoBanco', $scope.cargoBanco );
            console.log( '$scope.abonoBanco', $scope.abonoBanco );
        }
        else{
            swal("Alto","El grupo actual no esta punteado correctamentre","warning");
        }
        //*************************************************************************************************************************************************************************************
        // Validación de los montos entre Registros Bancarios y Contables

        // if ($scope.abonoAuxiliar != 0 && $scope.cargoAuxiliar != 0) {

        //     if ((($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoAuxiliar + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoAuxiliar + $scope.difMonetaria))) {
        //         $scope.control = 1;
        //     } else {
        //         swal(
        //             'Alto',
        //             'La cantidad de abono y cargo para conciliar los registros contables no coinciden.',
        //             'warning'
        //         );
        //         $scope.control = undefined;
        //     }

        // }

        // if ($scope.abonoBanco != 0 && $scope.cargoBanco != 0 && $scope.isDPI == undefined) {

        //     if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoBanco + $scope.difMonetaria))) {
        //         $scope.control = 1;
        //     } else {
        //         swal(
        //             'Alto',
        //             'La cantidad de abono y cargo para conciliar registros bancarios no coinciden.',
        //             'warning'
        //         );
        //         $scope.control = undefined;
        //     }

        // }

        // if ($scope.abonoBanco != 0 && $scope.cargoBanco == 0 && $scope.isDPI != undefined) {
        //     $scope.control = 1;
        // }
        // else {
        //     if ($scope.cargoBanco != 0 && $scope.abonoAuxiliar != 0) {
        //         if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoAuxiliar + $scope.difMonetaria))) {
        //             $scope.control = 1;
        //         } else {
        //             $scope.control = undefined;
        //             swal(
        //                 'Alto',
        //                 'La cantidad de cargo y abono no coinciden.',
        //                 'warning'
        //             );
        //         }
        //     } else if ($scope.abonoBanco != 0 && $scope.cargoAuxiliar != 0) {
        //         if ((($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoBanco + $scope.difMonetaria)) || (($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoAuxiliar + $scope.difMonetaria))) {
        //             $scope.control = 1;
        //         } else {
        //             $scope.control = undefined;
        //             swal(
        //                 'Alto',
        //                 'La cantidad de cargo y abono no coinciden.',
        //                 'warning'
        //             );
        //         }
        //     }


        //     //Verifica la integridad de las relaciones entre Registros Bancarios y Contables
        //     if ($scope.rowAuxiliarColor.length > 0 && $scope.rowBancoColor.length > 0) {
        //         if ($scope.rowAuxiliarColor.length >= 1 || $scope.rowBancoColor.length >= 1) {
        //             if ($scope.cargoBanco != 0 && $scope.cargoAuxiliar != 0 || $scope.abonoBanco != 0 && $scope.abonoAuxiliar != 0) {
        //                 swal(
        //                     'Alto',
        //                     'La relación de los registros debe ser cargo-abono, abono-cargo de los registros bancarios y contables, por favor verifique su selección.',
        //                     'warning'
        //                 );
        //                 $scope.control = undefined;
        //             } else {
        //                 $scope.control = 1;
        //             }
        //         }
        //     } else {
        //         swal(
        //             'Alto',
        //             'No ha seleccionado ninguna relación del grupo creado.',
        //             'warning'
        //         );
        //     }

        //     //Fin validación relaciones Registros Bancarios y Contables
        // }
        //Fin de ña validación de montos 

        //*************************************************************************************************************************************************************************************


    };

    
    //LQMA 05092017  todo
    $scope.mostrarTodos = function () {

        $scope.cargoBanco = 0;
        $scope.abonoBanco = 0;
        $scope.cargoAuxiliar = 0;
        $scope.abonoAuxiliar = 0;

        $scope.arrayColors = [];

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
            if ($scope.arrayColors.indexOf(value.color) == -1)
                $scope.arrayColors.push(value.color)

            //if(value.color != undefined && value.color != '') {
            if (value.color == $scope.hexPicker.color) {
                $scope.cargoAuxiliar = $scope.cargoAuxiliar + value.cargo;
                $scope.abonoAuxiliar = $scope.abonoAuxiliar + value.abono;
            }


        });

        angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
            if ($scope.arrayColors.indexOf(value.color) == -1)
                $scope.arrayColors.push(value.color)

            //if(value.color != undefined && value.color != '') {
            if (value.color == $scope.hexPicker.color) {
                $scope.cargoBanco = $scope.cargoBanco + value.cargo;
                $scope.abonoBanco = $scope.abonoBanco + value.abono;
            }


        });


        $scope.gridApiAuxiliar.grid.refresh()

        $scope.gridApiAuxiliar.grid.api.core.raise.filterChanged();
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiAuxiliar.grid.api.grid.queueGridRefresh();

        $scope.gridApiAuxiliar.grid.refresh()

        $scope.gridApiBancos.grid.api.core.raise.filterChanged();
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        $scope.gridApiBancos.grid.api.grid.queueGridRefresh();

    }
    //LQMA 05092017 todo
    $scope.mostrarNoPunteados = function () {


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
    $scope.agregaDiv = function (color) {


        var colorBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function (value) {
            return value.color == color; //|| value.assignee.id === 'ak';   
        });

        var colorAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function (value) {
            return value.color == color; //|| value.assignee.id === 'ak';                    
        });

        color = color.replace("#", "")
        
        if (colorBancos.length > 0 || colorAuxiliar.length > 0) {
            if (angular.element("#X" + color + "").length) {
                var myEl = angular.element(document.querySelector("#X" + color + ""));
                myEl.remove();
            }
            

            //LQMA 29
            //var divTemplate = "<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' data-ng-click=\"setColorGrupo($event)\"><button type=\"button\" ng-click=\"saluda()\" text='O'>" + colorBancos.length + "</div>";
            // divGrupoPunteoColorShadow
            var hola = "<div id=\"X" + color + "\" style='background-color: #" + color + ";' class='divGrupoPunteoColor' data-ng-click=\"setColorGrupo($event)\"><div class='divGrupoPunteoColorShadow'></div></div>";
            // var divTemplate = "<div id=\"X" + color + "\" style='background-color: #" + color + ";' class='divGrupoPunteo' data-ng-click=\"setColorGrupo($event)\"></div>";
            var divTemplate = "<div id=\"X" + color + "\" style='background-color: #" + color + ";' class='divGrupoPunteoColor' data-ng-click=\"setColorGrupo($event)\"><div class='divGrupoPunteoColorShadow'></div></div>";
            var temp = $compile(divTemplate)($scope);
            angular.element(document.getElementById('divGrupos')).append(temp);

            /*
            var newEle = angular.element("<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' ng-click=\"setColorGrupo()\"><button type=\"button\" ng-click=\"saluda()\" text='O'>" + colorBancos.length + "</div>");
            var target = document.getElementById('divGrupos');
            angular.element(target).append(newEle);
            */

        }
        else {
            if (angular.element("#X" + color + "").length) {
                var myEl = angular.element(document.querySelector("#X" + color + ""));
                myEl.remove();
            }
        }
    }



    //LQMA 17082017 add funcion para pre-punteo (pre-seleccion)
    $scope.prePunteo = function () {

        var indexBanco = 0, fechaOperacionBanco = '', cargoBanco = 0, abonoBanco = 0, esCargo = 0;
        var indicePrePunteo = 0;

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
            value.indexPrePunteo = 99999;
        });


        angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
            value.indexPrePunteo = 99999;
        });

        angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {

            value.indexPrePunteo = 99999;

            fechaOperacionBanco = value.fechaOperacion;
            cargoBanco = value.cargo;
            abonoBanco = value.abono;
            esCargo = value.esCargo;
            //LQMA 07092017
            referenciaAuxiliar = value.referenciaAuxiliar;


            var filtradosBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function (value) {
                //LQMA 07092017
                return value.cargo == cargoBanco && value.fechaOperacion == fechaOperacionBanco && value.abono == abonoBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';                    
            });

            if (filtradosBancos.length == 1) {

                var filtradosAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function (value) {
                    if (esCargo == 0)
                        //LQMA 07092017
                        return value.cargo == abonoBanco && value.movFechaOpe == fechaOperacionBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';
                    else
                        //LQMA 07092017
                        return value.abono == cargoBanco && value.movFechaOpe == fechaOperacionBanco && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar); //|| value.assignee.id === 'ak';
                });

                var indexAuxiliar = 0;

                if (filtradosAuxiliar.length == 1) {


                    angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {

                        if (esCargo == 0) {   //LQMA 07092017
                            if (value.movFechaOpe == fechaOperacionBanco && abonoBanco == value.cargo && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar)) {
                                $scope.gridApiAuxiliar.grid.api.selection.selectRow($scope.gridApiAuxiliar.grid.options.data[indexAuxiliar]);
                                value.indexPrePunteo = indicePrePunteo;
                            }
                        }
                        else//LQMA 07092017
                            if (value.movFechaOpe == fechaOperacionBanco && cargoBanco == value.abono && (referenciaAuxiliar != '' && referenciaAuxiliar == value.referenciaAuxiliar)) {
                                $scope.gridApiAuxiliar.grid.api.selection.selectRow($scope.gridApiAuxiliar.grid.options.data[indexAuxiliar]);
                                value.indexPrePunteo = indicePrePunteo;
                            }

                        indexAuxiliar++;
                    });

                    $scope.gridApiBancos.grid.api.selection.selectRow($scope.gridApiBancos.grid.options.data[indexBanco]);
                    value.indexPrePunteo = indicePrePunteo;

                    indicePrePunteo++;

                }
            }

            indexBanco++;
        });

        $scope.gridApiAuxiliar.grid.options.data = $filter('orderBy')($scope.gridApiAuxiliar.grid.options.data, "indexPrePunteo", false)
        $scope.gridApiAuxiliar.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

        $scope.gridApiBancos.grid.options.data = $filter('orderBy')($scope.gridApiBancos.grid.options.data, "indexPrePunteo", false)
        $scope.gridApiBancos.grid.api.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

        //LQMA 28082017
        $scope.auxiliarContableOriginal = $scope.gridApiAuxiliar.grid.options.data;
        $scope.depositoBancosOriginal = $scope.gridApiBancos.grid.options.data;

    }
    
    $scope.filtraBanco = function (filtro) {
        
        switch ($scope.filtroBancoCarAbo) {
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
    $scope.seleccionados = [];
    $scope.grupoHexadecimal = [];
    $scope.ShowAlertPunteo = function () {
        //Limpiamos variables de guardado
        $scope.seleccionados = [];
        $scope.grupoHexadecimal = [];
        
        //Obtengo los registros seleccionados y agrupados por color
        var auxiSel = 0, depoSel = 0; auxiTot = 0, depoTot = 0;
        var deSel = [], auSel = []; // variables en las que se almacenan los registros seleccionados
        
        var aux1 = $scope.gridApiBancos.grid.options.data;
        for (var i = 0; i <= (aux1.length - 1); i++) {
            var value = aux1[i];
            if (value.color != undefined && value.color != '') {
                depoTot++;
                deSel.push(value);
                $scope.seleccionados.push(
                    {
                        color: value.color,
                        idCargo: value.esCargo == 1 ? value.IDABONOSBANCOS : 0,
                        idAbono: value.esCargo == 1 ? 0 : value.IDABONOSBANCOS,
                        tipo: 'B',
                        usuario: JSON.parse(localStorage.getItem('ls.userData')).idUsuario
                    }
                );
                if ($scope.grupoHexadecimal.indexOf(value.color) == -1) {
                    $scope.grupoHexadecimal.push(value.color);
                }

            }
        }

        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function (value, key) {
            if (value.color != undefined && value.color != '') {
                auxiTot++;
                auSel.push(value);
                $scope.seleccionados.push(
                    {
                        color: value.color,
                        idCargo: value.esCargo == 1 ? value.idAuxiliarContable : 0,
                        idAbono: value.esCargo == 1 ? 0 : value.idAuxiliarContable,
                        tipo: 'C',
                        usuario: JSON.parse(localStorage.getItem('ls.userData')).idUsuario
                    }
                );
                if ($scope.grupoHexadecimal.indexOf(value.color) == -1) {
                    $scope.grupoHexadecimal.push(value.color);
                }
            }
        });

        //Registro el grupo de arrays del grid original ya seleccionado en local storage para obtenerlos en un controlller distinto
        
        if ($scope.control != undefined) {
            
            $('#alertaGuardarPunteoPrevio').modal('show');
            $scope.gridApiAuxiliar.selection.clearSelectedRows();
            $scope.gridApiBancos.selection.clearSelectedRows();
            $scope.limpiaVariables();
        }
        else {
            console.log( 'seleccionados', $scope.seleccionados );
            console.log( 'grupoHexadecimal', $scope.grupoHexadecimal );
            if( $scope.cargoAuxiliar == 0 && $scope.abonoAuxiliar == 0 &&
                $scope.cargoBanco == 0 && $scope.abonoBanco == 0 && $scope.grupoHexadecimal.length == 0 ){
                    swal(
                        'Alto',
                        'Selecciona los cargos y abonos a conciliar.',
                        'warning'
                    );
            }else{
                
                $scope.cargosTotal = parseFloat($scope.cargoAuxiliar) + parseFloat($scope.cargoBanco);
                $scope.abonosTotal = parseFloat($scope.abonoAuxiliar) + parseFloat($scope.abonoBanco);
                $scope.diferencia = $scope.cargosTotal - $scope.abonosTotal;

                if ($scope.diferencia >= $scope.diferenciaNeg && $scope.diferencia <= $scope.difMonetaria) {
                    $('#alertaGuardarPunteoPrevio').modal('show');
                    $scope.punteoAuxiliar = [];
                    $scope.punteoBanco = [];
                    $scope.gridApiAuxiliar.selection.clearSelectedRows();
                    $scope.gridApiBancos.selection.clearSelectedRows();
                } else {
                    swal(
                        'Alto',
                        'tiene errores en los gruos creados para conciliar, por favor verifique su información.',
                        'warning'
                    );
                } 
            }
        }
        localStorage.setItem("seleccionados", JSON.stringify($scope.seleccionados));
        localStorage.setItem("grupoHexadecimal", JSON.stringify($scope.grupoHexadecimal))
        

    };

    $scope.savePunteo = function () {
        $scope.ocultarSave = true;
        $scope.save_seleccionados = JSON.parse(localStorage.getItem("seleccionados"));
        $scope.save_grupoHexadecimal = JSON.parse(localStorage.getItem("grupoHexadecimal"));

        $scope.savePunteoDetalle(0);
    }

    $scope.auxGrupoPunteo = 0;
    $scope.gruposPunteo = [];

    $scope.savePunteoDetalle = function (auxCont) {
        if (auxCont >= ($scope.save_grupoHexadecimal.length)) {
            swal(
                'Listo',
                'Punteo éxitoso.',
                'success'
            );
            $('#alertaGuardarPunteoPrevio').modal('hide');
            setTimeout(function () {
                location.reload();
            }, 2500);
        }
        else {
            var item = $scope.save_grupoHexadecimal[auxCont];
            $scope.gruposPunteo = filterFilter($scope.save_seleccionados, { color: item });
            
            $scope.auxGrupoPunteo = 0;
            $scope.detallePunteoSave(auxCont, 0);
        }
    }

    $scope.detallePunteoSave = function (auxContPadre, auxCont) {
        
        if (auxCont >= ($scope.gruposPunteo.length)) {
            $scope.savePunteoDetalle(auxContPadre + 1);
        } else {
            var value = $scope.gruposPunteo[auxCont]
            var parametros = {
                grupo: $scope.auxGrupoPunteo,
                idCargo: value.idCargo,
                idAbono: value.idAbono,
                tipo: value.tipo,
                usuario: value.usuario,
            }
            filtrosRepository.savePunteado(parametros).then(function (result) {
                var resultado = result.data[0];
                
                if (resultado.length != 0) {
                    $scope.auxGrupoPunteo = resultado.grupoPunteo;
                    $scope.detallePunteoSave(auxContPadre, auxCont + 1);
                }
            })
        }
    }
    
    $scope.crearArrayGrupos = function (deSel, auSel) {
        var coloresUsados = [];

        //Variables para guardar los cargos contra abonos
        $scope.agrupadosBancos = [];
        $scope.agrupadosAuxiliar = [];

        //Variables para utilizar cuando se selecciona un cargo y un abono ya se solo bancario o contable
        $scope.agrupadosAuxiliarCargoAbono = [];
        $scope.agrupadosBancosCargoAbono = [];

        $scope.agrupadosBancosContables = [];

        ///Finaliza la funcion que guarda la relación (cargos - abonos) Contables y bancarios
        //Condicion si se guarda un cargoBancario y abonoContable
        if (deSel.length > 0 && auSel.length > 0) {

            var colorActual = deSel[0].color;
            var filtradosColors = deSel;
            $scope.bancoCargo = [];

            angular.forEach(deSel, function (value, key) {
                $scope.bancoCargo.push(value);
            });
            angular.forEach(auSel, function (value, key) {
                $scope.bancoCargo.push(value);
            });
            
            while (filtradosColors.length > 0) {
                colorActual = filtradosColors[0].color;

                coloresUsados.push(colorActual);

                var grupoActualBanco = $filter('filter')(deSel, function (value) {
                    return value.color == colorActual;
                });

                var grupoActualAuxiliar = $filter('filter')(auSel, function (value) {
                    return value.color == colorActual;
                });

                $scope.agrupadosBancos.push(grupoActualBanco);
                $scope.agrupadosAuxiliar.push(grupoActualAuxiliar);

                $scope.agrupadosBancosContables.push(grupoActualBanco);
                $scope.agrupadosBancosContables.push(grupoActualAuxiliar);

                filtradosColors = $filter('filter')(filtradosColors, function (value) {
                    return (coloresUsados.indexOf(colorActual) == -1) ? value.color == '.........' : value.color != colorActual;
                });
            }
        }
        ///Finaliza la funcion que guarda la relación (cargos - abonos) Contables y bancarios

        ///Inicia la funcion que guarda cargos - abonos Contables
        //Condicion que se ejecuta si se selecciona solo un abono contable contra un cargo contable
        else if (deSel.length == 0 && auSel.length > 0) {
            var gruposAuxiliarSolo = $filter('filter')(auSel, function (value) {
                return (coloresUsados.indexOf(value.color) == -1) ? value.color == value.color : value.color == '.........';
            });

            while (gruposAuxiliarSolo.length > 0) {
                colorActual = gruposAuxiliarSolo[0].color;

                coloresUsados.push(colorActual);

                var grupoActualBanco = $filter('filter')(gruposAuxiliarSolo, function (value) {
                    return value.color == colorActual;
                });
                $scope.agrupadosAuxiliarCargoAbono.push(grupoActualBanco);
                gruposAuxiliarSolo = $filter('filter')(gruposAuxiliarSolo, function (value) {
                    return (coloresUsados.indexOf(colorActual) == -1) ? value.color == '.........' : value.color != colorActual;
                });

            }
        }

        ///Inicia la funsión que guarda cargos - abonos Bancarios
        //Condicion que entra cuando solo seleccionas cargos y abonos bancarios
        else if (deSel.length > 0 && auSel.length == 0) {
            var gruposBancoSolo = $filter('filter')(deSel, function (value) {
                return (coloresUsados.indexOf(value.Color) == -1) ? value.color : value.color == '.........';
            });
            while (gruposBancoSolo.length > 0) {
                colorActual = gruposBancoSolo[0].color;

                coloresUsados.push(colorActual);

                var grupoActualContable = $filter('filter')(gruposBancoSolo, function (value) {
                    return value.color == colorActual;
                });
                $scope.agrupadosBancosCargoAbono.push(grupoActualContable);
                gruposBancoSolo = $filter('filter')(gruposBancoSolo, function (value) {
                    return (coloresUsados.indexOf(colorActual) == -1) ? value.color == '.........' : value.color != colorActual;
                });
            }

        }
        ///Finaliza la funcion que guarda cargos - abonos Contables
    };
    
    $scope.cancelaPunteoPrevio = function () {
        //$scope.limpiaVariables();
        $('#alertaGuardarPunteoPrevio').modal('hide');
    };

    ////////////////////////////////////////////////////////Funsión para guardar los depositos no identificados////////////////////////////////////////////////7
    $scope.ShowAlertDPI = function () {

        $scope.isDPI = 1;


        var PunteoDPI = [], AbonoBanco = 0, CargoBanco = 0;

        angular.forEach($scope.gridApiBancos.grid.options.data, function (value, key) {
            if (value.color != undefined && value.color != '') {
                PunteoDPI.push(value);
                AbonoBanco += value.abono;
                CargoBanco += value.cargo;
            }
        });

        if (AbonoBanco > 0 && CargoBanco == 0) {
            $scope.control = 1;
        }

        if ($scope.control != undefined) {
            $('#alertaGuardarDPI').modal('show');
            localStorage.setItem('infoDPIData', JSON.stringify(PunteoDPI));
            	
            ///////////////////////////////////////////////////////////////////////////////
            $scope.punteoAuxiliar = [];
            $scope.punteoBanco = [];
            $scope.gridApiBancos.selection.clearSelectedRows();
            $scope.gridApiAuxiliar.selection.clearSelectedRows();
            $scope.limpiaVariables();
            //////////////////////////////////////////////////////////////////////////////
        }
        else {
            swal(
                'Alto',
                'Tiene errores en los grupos creados para el envío a DPI, por favor verifique su información.',
                'warning'
            );
        }
    };
    ////////////////////////////////////////////////////////////////////////////////Funsión para cancelar los punteos///////////////////////////////////

    $scope.cancelaPunteoDPI = function () {
        $scope.limpiaVariables();
        $('#alertaGuardarDPI').modal('hide');
    };

    $scope.limpiaVariables = function () {
        $scope.abonoAuxiliar = 0;
        $scope.cargoAuxiliar = 0;
        $scope.abonoBanco = 0;
        $scope.cargoBanco = 0;
    };
});