registrationModule.controller('conciliacionController', function($scope, $rootScope, $location, localStorageService, alertFactory, conciliacionRepository) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');

    // $scope.panels = [
    //        { name: 'Abonos Contables', active: true, className: 'active' },
    //        { name: 'Abonos Bancarios', active: false, className: '' },
    //        { name: 'Cargo Contable', active: false, className: '' },
    //        { name: 'Cargo Bancario', active: false, className: '' }
    //    ];

    $scope.paramBusqueda = JSON.parse(localStorage.getItem('paramBusqueda'));

    $scope.init = function() {
        $scope.calendario();

        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.idEmpresa = $scope.busqueda.idEmpresa;
        $scope.cuenta = $scope.busqueda.cuentaContable;
        $scope.idBanco = $scope.busqueda.idBanco;        
        $scope.cuentaBanco = $scope.busqueda.cuenta;


        $scope.dato = "llllll";
        $scope.dpiSelected = false;

        $scope.totalAboContaBanco = 0;
        $scope.totalAboBancoConta = 0;
        $scope.totalCargoContaBanco = 0;
        $scope.totalCargoBancoConta = 0;

        $scope.idTipoAuxiliar = 0;

        $scope.abonosContables = [];
        $scope.cargosContables = [];
        $scope.abonosBancarios = [];
        $scope.cargosBancarios = [];

        $scope.totalAbonoContable = 0;
        $scope.totalAbonoBancario = 0;
        $scope.totalCargoContable = 0;
        $scope.totalCargoBancario = 0;

        $scope.obtieneCargosAbonos();

        $scope.resumenDPI = [];

    }

    $scope.obtieneCargosAbonos = function() {

        $scope.getAbonoContable($scope.busqueda.idEmpresa,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getAbonoBancario($scope.busqueda.idEmpresa,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getCargoContable($scope.busqueda.idEmpresa,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getCargoBancario($scope.busqueda.idEmpresa,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
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
        { name: 'MOV_NUMCTA', displayName: 'Numero de Cuenta', width: 150, align:'center' },
        { name: 'MOV_TIPOPOL', displayName: 'Tipo de Poliza', width: 150 },
        { name: 'MOV_CONSPOL', displayName: 'Número de Poliza', width: 150 },
        { name: 'MOV_CONSMOV', displayName: 'Consecutivo', width: 150 },
        { name: 'MOV_MES', displayName: 'Mes del Movimiento', width: 150 },
        { name: 'MOV_DEBE', displayName: "Cargos", width: 150, cellTemplate: '<div><div>{{row.entity.MOV_DEBE | currency}}</div></div>'},
        { name: 'MOV_FECHOPE', displayName: 'Fecha de Operacion', width: 250,  cellFilter: 'date:\'yyyy-MM-dd\''},
        { name: "MOV_HABER", displayName: "Abonos", width: 150, cellTemplate: '<div class="text-success text-semibold"><div>{{row.entity.MOV_HABER | currency}}</div></div>'}
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
        { name: 'CONSEPTO', displayName: 'Concepto', width: 150 },
        { name: 'REFERENCIA', displayName: 'Referencia', width: 150 },
        { name: 'REFAMPLIADA', displayName: 'Referencia Ampliada', width: 250 },
        { name: "IMPORTE", displayName: "Importe", width: 150, cellTemplate: '<div class="text-success text-semibold"><div>{{row.entity.IMPORTE | currency}}</div></div>'}
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
        { name: 'MOV_NUMCTA', displayName: 'Numero de Cuenta', width: 150, align:'center' },
        { name: 'MOV_TIPOPOL', displayName: 'Tipo de Poliza', width: 150 },
        { name: 'MOV_CONSPOL', displayName: 'Número de Poliza', width: 150 },
        { name: 'MOV_CONSMOV', displayName: 'Consecutivo', width: 150 },
        { name: 'MOV_MES', displayName: 'Mes del Movimiento', width: 150 },
        { name: 'MOV_HABER', displayName: "Abonos", width: 150, cellTemplate: '<div><div>{{row.entity.MOV_HABER | currency}}</div></div>'},
        { name: 'MOV_FECHOPE', displayName: 'Fecha de Operacion', width: 250,  cellFilter: 'date:\'yyyy-MM-dd\'' },
        { name: "Cargos", displayName: "Cargos", width: 150, cellTemplate: '<div class="text-success text-semibold"><div>{{row.entity.MOV_DEBE | currency}}</div></div>'}
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
        { name: 'CUENTA', displayName: 'Cuenta', width: 150 },
        { name: 'FECHAOP', displayName: 'Fecha de Operación', width: 150 },
        { name: 'HORAOP', displayName: 'Hora de Operación', width: 150 },
        { name: 'CONSEPTO', displayName: 'Concepto', width: 150 },
        { name: 'REFERENCIA', displayName: 'Referencia', width: 150 },
        { name: 'REFAMPLIADA', displayName: 'Referencia Ampliada', width: 250 },
        { name: "IMPORTE", displayName: "Importe", width: 150, cellTemplate: '<div class="text-success text-semibold"><div>{{row.entity.IMPORTE | currency}}</div></div>'}
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

    $scope.getAbonoContable = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getAbonoContable(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {

                    //console.log(result.data)
                    $scope.gridAbonosContables.data = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalAbonoContable = $scope.totalAbonoContable + result.data[i].MOV_HABER;
                } else {
                    /*console.log('entro a getAbonoContable')
                    console.log(result.data);
                    console.log(result.data[0].idTipoAuxiliar)*/
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

                } else {
                    
                    //console.log('abono bancario')
                    //console.log($scope.resumenDPI)
                    /*$scope.resumenDPI = result.data;

                    console.log($scope.resumenDPI)
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;*/
                     //$scope.resumenDPI = $scope.gridApi.selection.selectRow();
                    //console.log($scope.resumenDPI);                     

                }
            }
        });
    }

    $scope.getCargoContable = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getCargoContable(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {
                    $scope.gridCargosContables.data = result.data;

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
        //console.log(idTipoAuxiliar)        
        conciliacionRepository.getDepositosPendientes(idUsuario, idEstatus, idTipoAuxiliar,$scope.resumenDPI.idDepositoBanco).then(function(result) {
            if (result.data.length > 0) {

                /*console.log('entro a datos: ')
                console.log(result.data)*/
                $scope.dpiSelected = false;
                $scope.resumenDPI = [];    
                $scope.obtieneCargosAbonos();
            }
        });
    }

    $scope.gridDepositosBancos.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApiBancos = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;

            if (row.isSelected == true) {
                $scope.dpiSelected = true;
                //console.log(row.entity)
                $scope.resumenDPI = row.entity;//{"BANCO":row.entity.BANCO,"FECHA":row.entity.FECHA,"SALDO_ACTUAL":row.entity.SALDO_ACTUAL,"POLIZA": row.entity.POLIZA,"CONCEPTO": row.entity.CONCEPTO };
                //console.log('sss')
                //console.log($scope.resumenDPI)                
            } else if (row.isSelected == false) {
                $scope.dpiSelected = false;
            }
            //console.log(msg, 'Estoy en rowSelectionChanged');

        }); //Este me dice cuales van siendo seleccionadas

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            //console.log(msg, 'Estoy en rowSelectionChangedBatch', rows);
            /*angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });*/
        });
    };
});
