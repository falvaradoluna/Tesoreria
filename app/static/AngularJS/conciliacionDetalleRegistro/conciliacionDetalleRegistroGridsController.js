registrationModule.controller('conciliacionDetalleRegistroGridsController',function($scope, $log,  $filter, $compile, localStorageService, filtrosRepository, alertFactory, uiGridConstants, uiGridGroupingConstants){

      $scope.gridsInfo = [];
      $scope.depositosBancos = '';

            $scope.abonoAuxiliar = 0;
            $scope.cargoAuxiliar = 0;
            $scope.abonoBanco = 0;
            $scope.cargoBanco = 0;
            $scope.difMonetaria = 0;

             //LQMA add 22082017
            $scope.hexPicker = { color: '#c9dde1' };

     $scope.init = function() {
        variablesLocalStorage();
        $scope.getDepositosBancos($scope.busqueda.IdBanco, 1, $scope.busqueda.Cuenta, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        //LQMA comment 17082017
        //$scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
    };
   

   var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.difMonetaria = $scope.busqueda.DiferenciaMonetaria;
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
        { name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},//, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Referencia', width: 200 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 },
        //LQMA 21082017
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show:false }
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
        { name: 'fechaOperacion', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'cargo', displayName: 'Cargos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abonos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        //LQMA add
        { name: 'indexPrePunteo', displayName: 'Index', width: 0, show:false },
        { name: 'color', displayName: 'Color', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100, visible: false }
    ];
    $scope.gridDepositosBancos.multiSelect = true;
    //****************************************************************************************************


    //******************Función para llenar el grid Depositos Bancos********************************
    $scope.getDepositosBancos = function(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte) {
        if (idestatus == 1) { 
            filtrosRepository.getDepositos(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte).then(function(result) {
                if (result.data.length >= 0) {
                    $scope.depositosBancos = result.data;
                    $scope.gridDepositosBancos.data = result.data;
                    console.log($scope.gridDepositosBancos.data, 'Desposito Bancario');
                     //LQMA 17082017 add
                    $scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
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
    
     $scope.getAuxiliarContable = function(idEmpresa, numero_cuenta, idestatus, fElaboracion, fCorte) {

            filtrosRepository.getAuxiliar(idEmpresa, numero_cuenta, idestatus, fElaboracion, fCorte).then(function(result) {
                if (result.data[0].length !=0) {
                    $scope.auxiliarContable = result.data[0];
                    $scope.gridAuxiliarContable.data = result.data[0];
                    localStorage.setItem('idRelationOfContableRows', JSON.stringify(result.data[1]));
                    console.log($scope.gridAuxiliarContable.data, 'Auxiliar Contable')
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
                var colorRow = row.entity.color;
                row.entity.color = '';
                $scope.agregaDiv(colorRow);
            }
        }); 

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function(value, key) {
                $scope.punteoAuxiliar[key] = value.entity;
            });
            localStorage.setItem('infoGridAuxiliar', JSON.stringify($scope.punteoAuxiliar));
            localStorage.setItem('totalesGrids', JSON.stringify(
                {"abonoAuxiliar": $scope.abonoAuxiliar,"cargoAuxiliar": $scope.cargoAuxiliar, "abonoBanco": $scope.abonoBanco,"cargoBanco": $scope.cargoBanco, "diferenciaMonetaria": $scope.difMonetaria}
                ));
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
                if(row.entity.indexPrePunteo != 99999){
                angular.forEach($scope.gridApiAuxiliar.grid.rows, function(value, key) {
                            if(value.entity.indexPrePunteo == row.entity.indexPrePunteo)
                            {
                                value.isSelected = false;
                                value.entity.color = '';
                            }
                        });
                }
                var colorRow = row.entity.color;
                row.entity.color = '';
                $scope.agregaDiv(colorRow);



            }

        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
            localStorage.setItem('infoGridBanco', JSON.stringify($scope.punteoBanco));
        });

        //LQMA add24082017       
        setTimeout(function() { $scope.prePunteo();}, 5000);
    };

    //Color Grids////////////////////////////////////////////////////////


    //LQMA add 24082017
    $scope.setColorGrupo = function(div) {

        $scope.hexPicker.color = '#' + div.currentTarget.id.substring(1,10);    
        //console.log(div.currentTarget.id.substring(1,10));
    };


    //LQMA add 23082017 
        $scope.agregaDiv = function(color){

            var colorBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
                    return value.color == color; //|| value.assignee.id === 'ak';                    
                });

            var colorAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
                    return value.color == color; //|| value.assignee.id === 'ak';                    
                });

            console.log(colorBancos)
            
            color = color.replace("#","")

            if(colorBancos.length > 0 || colorAuxiliar.length > 0)
            {              
                if (angular.element("#X" + color +"").length) {
                    var myEl = angular.element( document.querySelector("#X" + color +""));
                    myEl.remove();
                }
               
                var divTemplate = "<div id=\"X" + color + "\" style='background-color: #"+ color +";' class='divGrupoPunteo' data-ng-click=\"setColorGrupo($event)\"><button type=\"button\" ng-click=\"saluda()\" text='O'>" + colorBancos.length + "</div>";
                var temp = $compile(divTemplate)($scope);                
                angular.element(document.getElementById('divGrupos')).append(temp);                
            }
            else
            {
                console.log('compara para borrar')
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

            fechaOperacionBanco = value.fechaOperacion;
            cargoBanco = value.cargo; 
            abonoBanco = value.abono;
            esCargo = value.esCargo;         


             var filtradosBancos = $filter('filter')($scope.gridApiBancos.grid.options.data, function(value){
                    return value.cargo == cargoBanco && value.fechaOperacion == fechaOperacionBanco && value.abono == abonoBanco; //|| value.assignee.id === 'ak';                    
                });

            if(filtradosBancos.length == 1){
            
                    var filtradosAuxiliar = $filter('filter')($scope.gridApiAuxiliar.grid.options.data, function(value){
                        if(esCargo == 0)
                            return value.cargo == abonoBanco && value.movFechaOpe == fechaOperacionBanco; //|| value.assignee.id === 'ak';
                        else 
                            return value.abono == cargoBanco && value.movFechaOpe == fechaOperacionBanco; //|| value.assignee.id === 'ak';
                    });

                    var indexAuxiliar = 0;

                    if(filtradosAuxiliar.length  == 1){                
               

                        angular.forEach($scope.gridApiAuxiliar.grid.options.data, function(value, key) {

                            if(esCargo == 0)
                            {
                                if(value.movFechaOpe == fechaOperacionBanco && abonoBanco == value.cargo)
                                {
                                    $scope.gridApiAuxiliar.grid.api.selection.selectRow($scope.gridApiAuxiliar.grid.options.data[indexAuxiliar]);
                                    value.indexPrePunteo = indicePrePunteo;
                                }
                            }
                            else
                                if(value.movFechaOpe == fechaOperacionBanco && cargoBanco == value.abono)
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

    } 





    $scope.ShowAlertPunteo = function(){
       $('#alertaGuardarPunteoPrevio').modal('show');
        $scope.punteoAuxiliar = [];
    	$scope.punteoBanco = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.limpiaVariables();
    };

    $scope.cancelaPunteoPrevio = function(){
    	$scope.limpiaVariables();
     $('#alertaGuardarPunteoPrevio').modal('hide');
    };
    
     $scope.ShowAlertDPI = function(){
        $('#alertaGuardarDPI').modal('show');
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        $scope.limpiaVariables();
     };

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