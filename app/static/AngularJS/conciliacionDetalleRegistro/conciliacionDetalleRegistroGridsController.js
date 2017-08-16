registrationModule.controller('conciliacionDetalleRegistroGridsController',function($scope, $log, localStorageService, filtrosRepository, alertFactory, uiGridConstants, uiGridGroupingConstants){

      $scope.gridsInfo = [];
      $scope.depositosBancos = '';

            $scope.abonoAuxiliar = 0;
            $scope.cargoAuxiliar = 0;
            $scope.abonoBanco = 0;
            $scope.cargoBanco = 0;
            $scope.difMonetaria = 0;

     $scope.init = function() {
        variablesLocalStorage();
        $scope.getDepositosBancos($scope.busqueda.IdBanco, 1, $scope.busqueda.Cuenta, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getAuxiliarContable($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
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
        enableFiltering: true
    };
    $scope.gridAuxiliarContable.columnDefs = [
        { name: 'cargo', displayName: 'Cargo', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        { name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},//, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Referencia', width: 200 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 }
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
        enableFiltering: true
    };
    $scope.gridDepositosBancos.columnDefs = [
        { name: 'concepto', displayName: 'Concepto', width: 300 },
        { name: 'fechaOperacion', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'cargo', displayName: 'Cargos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abonos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' }
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
                    console.log($scope.gridDepositosBancos.data, 'Desposito Bancario')
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
            } else if (row.isSelected == false) {
                $scope.abonoAuxiliar = $scope.abonoAuxiliar - row.entity.abono;
                $scope.cargoAuxiliar = $scope.cargoAuxiliar - row.entity.cargo;
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
            } else if (row.isSelected == false) {
                $scope.abonoBanco = $scope.abonoBanco - row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco - row.entity.cargo;
            }

        });

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
            localStorage.setItem('infoGridBanco', JSON.stringify($scope.punteoBanco));
        });
    };

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