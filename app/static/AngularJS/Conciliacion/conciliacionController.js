registrationModule.controller('conciliacionController', function($scope, $rootScope, $location, localStorageService, conciliacionRepository) {

     $scope.variableControl = 0;
    $scope.init = function() {

        // ****************** Se guarda la información del usuario en variable userData
        $rootScope.userData = localStorageService.get('userData');

        $scope.calendario();

        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
 
        $scope.dato = "llllll";
        $scope.dpiSelected = false;

        $scope.totalAboContaBanco = 0;
        $scope.totalAboBancoConta = 0;
        $scope.totalCargoContaBanco = 0;
        $scope.totalCargoBancoConta = 0;

        $scope.idTipoAuxiliar = 0;

        $scope.abonosContables = {};
        $scope.cargosContables = {};
        $scope.abonosBancarios = {};
        $scope.cargosBancarios = {};

        $scope.totalAbonoContable = 0;
        $scope.totalAbonoBancario = 0;
        $scope.totalCargoContable = 0;
        $scope.totalCargoBancario = 0;
        
        $scope.obtieneCargosAbonos($scope.busqueda);
        
        $scope.resumenDPI = [];
        
        setTimeout( function(){
                $(".cargando").remove();
                }, 1500 );
    }

    $scope.obtieneCargosAbonos = function(busqueda) {
        localStorage.removeItem('DetalleDiferencias');
        
        $scope.getAbonoContable(busqueda.IdEmpresa,busqueda.fechaElaboracion,busqueda.fechaCorte,1,busqueda.IdBanco, busqueda.Cuenta,busqueda.CuentaContable, busqueda.PolizaPago);
        $scope.getAbonoBancario(busqueda.IdEmpresa,busqueda.fechaElaboracion,busqueda.fechaCorte,1,busqueda.IdBanco, busqueda.Cuenta,busqueda.CuentaContable);
        $scope.getCargoContable(busqueda.IdEmpresa,busqueda.fechaElaboracion,busqueda.fechaCorte,1,busqueda.IdBanco, busqueda.Cuenta,busqueda.CuentaContable);
        $scope.getCargoBancario(busqueda.IdEmpresa,busqueda.fechaElaboracion,busqueda.fechaCorte,1,busqueda.IdBanco, busqueda.Cuenta,busqueda.CuentaContable);
        
        setTimeout(function(){
        localStorage.setItem('DetalleDiferencias', JSON.stringify({"abonoContable": $scope.abonosContables, "abonoBancario": $scope.abonosBancarios,"cargoContable": $scope.cargosContables, "cargoBancario": $scope.cargosBancarios}));
        } ,2000)
    }

    //****************************************************************************************************
    // INICIA las variables para el GRID ABONOS CONTABLES
    //******
    $scope.gridAbonosContables = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
    };
    
      $scope.gridAbonosContables.columnDefs = [
        { name: 'MOV_NUMCTA', displayName: 'Numero de Cuenta', width: 170, align:'center' },
        { name: 'MOV_TIPOPOL', displayName: 'Tipo de Poliza', width: 150 },
        { name: 'MOV_CONSPOL', displayName: 'Número de Poliza', width: 150 },
        { name: 'MOV_CONSMOV', displayName: 'Consecutivo', width: 150 },
        { name: 'MOV_MES', displayName: 'Mes del Movimiento', width: 150 },
        { name: 'MOV_FECHOPE', displayName: 'Fecha de Operacion', width: 250,  cellFilter: 'date:\'yyyy-MM-dd\''},
        { name: 'MOV_DEBE', displayName: "Cargos", width: 250, cellTemplate: '<div><div class="text-right">{{row.entity.MOV_DEBE | currency}}</div></div>'},
        { name: "MOV_HABER", displayName: "Abonos", width: 250, cellTemplate: '<div class="text-success text-semibold text-right"><div>{{row.entity.MOV_HABER | currency}}</div></div>'}
    ];


    $scope.gridAbonosContables.multiSelect = false;

    //****************************************************************************************************
    // INICIA las variables para el GRID ABONOS BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
    };

    $scope.gridDepositosBancos.columnDefs = [
        { name: 'BANCO', displayName: 'Banco', width: 150, align:'center' },
        { name: 'CUENTA', displayName: 'Cuenta', width: 150 },
        { name: 'FECHAOP', displayName: 'Fecha de Operación', width: 150 },
        { name: 'HORAOP', displayName: 'Hora de Operación', width: 150 },
        { name: 'CONSEPTO', displayName: 'Concepto', width: 230 },
        { name: 'REFERENCIA', displayName: 'Referencia', width: 150 },
        { name: 'REFAMPLIADA', displayName: 'Referencia Ampliada', width: 270 },
        { name: "IMPORTE", displayName: "Importe", width: 250, cellTemplate: '<div class="text-success text-semibold text-right"><div>{{row.entity.IMPORTE | currency}}</div></div>'}
    ];


    $scope.gridDepositosBancos.multiSelect = false;

     //****************************************************************************************************
    // INICIA las variables para el GRID CARGOS CONTABLES
    //****************************************************************************************************
    $scope.gridCargosContables = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
    };

    $scope.gridCargosContables.columnDefs = [
        { name: 'MOV_NUMCTA', displayName: 'Numero de Cuenta', width: 250, align:'center' },
        { name: 'MOV_TIPOPOL', displayName: 'Tipo de Poliza', width: 150 },
        { name: 'MOV_CONSPOL', displayName: 'Número de Poliza', width: 150 },
        { name: 'MOV_CONSMOV', displayName: 'Consecutivo', width: 150 },
        { name: 'MOV_MES', displayName: 'Mes del Movimiento', width: 150 },
        { name: 'MOV_FECHOPE', displayName: 'Fecha de Operacion', width: 250,  cellFilter: 'date:\'yyyy-MM-dd\'' },
        { name: 'MOV_HABER', displayName: "Abonos", width: 250, cellTemplate: '<div><div>{{row.entity.MOV_HABER | currency}}</div></div>'},
        { name: "Cargos", displayName: "Cargos", width: 250, cellTemplate: '<div class="text-success text-semibold text-right"><div>{{row.entity.MOV_DEBE | currency}}</div></div>'}
    ];


    $scope.gridCargosContables.multiSelect = false;

     //****************************************************************************************************
    // INICIA las variables para el GRID CARGOS BANCOS
    //****************************************************************************************************
    $scope.gridCargosBancarios = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true,
    };

    $scope.gridCargosBancarios.columnDefs = [
        { name: 'BANCO', displayName: 'Banco', width: 150, align:'center' },
        { name: 'CUENTA', displayName: 'Cuenta', width: 250 },
        { name: 'FECHAOP', displayName: 'Fecha de Operación', width: 150 },
        { name: 'HORAOP', displayName: 'Hora de Operación', width: 150 },
        { name: 'CONSEPTO', displayName: 'Concepto', width: 250 },
        { name: 'REFERENCIA', displayName: 'Referencia', width: 150 },
        { name: 'REFAMPLIADA', displayName: 'Referencia Ampliada', width: 250 },
        { name: "IMPORTE", displayName: "Importe", width: 250, cellTemplate: '<div class="text-success text-semibold text-right"><div>{{row.entity.IMPORTE | currency}}</div></div>'}
    ];


    $scope.gridCargosBancarios.multiSelect = false;


    $scope.calendario = function() {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "dd/mm/yyyy"
        });
    }
    //*****************************************************************
    //FIN  
    //*****************************************************************

    $scope.getAbonoContable = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable, polizaPago) {
        conciliacionRepository.getAbonoContable(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable, polizaPago).then(function(result) {
            //console.log(result);
            if (result.data.length > 0) {

                if (opcion == 1) {  
                    $scope.gridAbonosContables.data = result.data;
                    $scope.abonosContables = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalAbonoContable = $scope.totalAbonoContable + result.data[i].MOV_HABER;
                } else {
                    $scope.resumenDPI = result.data;
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;
                }

            } else {
                $scope.gridAbonosContables.data = [];
                $scope.totalAbonoContable = 0;
            }
        });
    }

    $scope.getAbonoBancario = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getAbonoBancario(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {
                    $scope.abonosBancarios = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalAbonoBancario = $scope.totalAbonoBancario + result.data[i].IMPORTE;

                    $scope.gridDepositosBancos.data = result.data;

                }
            }
        });
    }

    $scope.getCargoContable = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getCargoContable(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {
                    $scope.gridCargosContables.data = result.data;
                    $scope.cargosContables = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalCargoContable = $scope.totalCargoContable + result.data[i].MOV_DEBE;
                } else {
                    $scope.resumenDPI = result.data;
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;
                }
            } else {
                $scope.gridCargosContables.data = [];
                $scope.totalCargoContable = 0;
            }
        });
    }

    $scope.getCargoBancario = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getCargoBancario(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {
                    $scope.gridCargosBancarios.data = result.data;
                    $scope.cargosBancarios = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalCargoBancario = $scope.totalCargoBancario + result.data[i].IMPORTE;
                } else {
                    $scope.resumenDPI = result.data;
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;
                }
            }
        });
    }

    $scope.getDepositosPendientes = function(idUsuario, idEstatus, idTipoAuxiliar) {       
        conciliacionRepository.getDepositosPendientes(idUsuario, idEstatus, idTipoAuxiliar,$scope.resumenDPI.idDepositoBanco).then(function(result) {
            if (result.data.length > 0) {
                $scope.dpiSelected = false;
                $scope.resumenDPI = [];    
                $scope.obtieneCargosAbonos();
            }
        });
    }

    $scope.gridDepositosBancos.onRegisterApi = function(gridApi) {
        $scope.gridApiBancos = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;

            if (row.isSelected == true) {
                $scope.dpiSelected = true;
                $scope.resumenDPI = row.entity;                
            } else if (row.isSelected == false) {
                $scope.dpiSelected = false;
            }
        }); 
        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
        });
    };

});
