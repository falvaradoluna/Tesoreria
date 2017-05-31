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

        $scope.getAbonoContable($scope.busqueda.idEmpresa,0,0,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getAbonoBancario($scope.busqueda.idEmpresa,0,0,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getCargoContable($scope.busqueda.idEmpresa,0,0,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
        $scope.getCargoBancario($scope.busqueda.idEmpresa,0,0,1,$scope.busqueda.idBanco, $scope.busqueda.cuenta,$scope.busqueda.cuentaContable);
    }


    //****************************************************************************************************
    // INICIA las variables para el GRID BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true
    };

    $scope.gridDepositosBancos.columnDefs = [
        { name: 'idDepositoBanco', displayName: '', width: 20, visible: false},
        { name: 'BANCO', displayName: 'Banco', width: 150 },
        { name: 'FECHA', displayName: 'Fecha', width: 100 },
        { name: "SALDO_ACTUAL", displayName: "Importe", width: 200, cellTemplate: '<div class="text-right text-success text-semibold"><div class="text-right">{{row.entity.SALDO_ACTUAL | currency}}</div></div>'},
        { name: 'TIPO', displayName: 'Tipo', width: 200 },
        { name: 'POLIZA', displayName: 'Polioza', width: 200 },
        { name: 'CONCEPTO', displayName: 'Concepto', width: 300 }
    ];

    $scope.gridDepositosBancos.multiSelect = false;

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
                    $scope.abonosContables = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalAbonoContable = $scope.totalAbonoContable + result.data[i].abono;
                } else {
                    /*console.log('entro a getAbonoContable')
                    console.log(result.data);
                    console.log(result.data[0].idTipoAuxiliar)*/
                    $scope.resumenDPI = result.data;
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;
                }

            } else {
                $scope.abonosContables = [];
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
                        $scope.totalAbonoBancario = $scope.totalAbonoBancario + result.data[i].SALDO_ACTUAL;

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
                    $scope.cargosContables = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalCargoContable = $scope.totalCargoContable + result.data[i].cargo;
                } else {
                    $scope.resumenDPI = result.data;
                    $scope.idTipoAuxiliar = result.data[0].idTipoAuxiliar;
                }
            } else {
                $scope.cargosContables = [];
                $scope.totalCargoContable = 0;
            }
        });
    }

    $scope.getCargoBancario = function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
        conciliacionRepository.getCargoBancario(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable).then(function(result) {
            if (result.data.length > 0) {

                if (opcion == 1) {
                    $scope.cargosBancarios = result.data;

                    for (var i = 0, len = result.data.length; i < len; i++)
                        $scope.totalCargoBancario = $scope.totalCargoBancario + result.data[i].SALDO_ACTUAL;
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

    //   $scope.setActiveClass = function(currentTab) {
    //      console.log(currentTab)
    //     for (var i = 0; i < $scope.panels.length; i++) {
    //         $scope.panels[i].active = false;
    //         $scope.panels[i].className = "";
    //     }
    //     currentTab.active = true;
    //     currentTab.className = "active";
    //     console.log(currentTab)
    // };
});
