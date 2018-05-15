registrationModule.controller('conciliacionInicioController', function ($window, $filter, $scope, $rootScope, $location, $timeout, $log, $uibModal, localStorageService, filtrosRepository, conciliacionInicioRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, $sce) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.fechaReporte = new Date();
    $scope.fechaCorte = new Date();
    $scope.fechaElaboracion = new Date($scope.fechaCorte.getFullYear(), $scope.fechaCorte.getMonth(), 1);
    //*****Inicio variables para activar o desactivar botones o input 
    $scope.activaInputBanco = true;
    $scope.activaInputCuenta = true;
    $scope.activaBotonBuscar = true;
    $scope.enableBottonReport = true;
    $scope.empresaActual = '';
    $scope.bancoActual = '';
    $scope.cuentaActual = '';
    $scope.InfoBusqueda = false;
    $scope.InmemoryAcount = '';
    $scope.InmemoryAcountBanc = '';
    $scope.bancoNombre = '';
    $scope.difMonetaria = 0;
    $scope.mesActivo = undefined;
    //***************************************************************

    //*****Variables para ocultar Depositos y Pagos referenciados
    $scope.elementState = {}
    $scope.elementState.show = false;
    //***********************************************************

    //*****Cambio del formato en fechas predeterminadas para la búsqueda -- Se coloca la fecha del mes en curso
    // $scope.fechaCorte = $filter('date')(new Date($scope.fechaCorte), 'yyyy-MM-dd');
    // $scope.fechaElaboracion = $filter('date')(new Date($scope.fechaElaboracion), 'yyyy-MM-dd');

    
    //******************************************************************

    $scope.init = function () {

        $scope.getEmpresa($rootScope.userData.idUsuario);
        $scope.calendario();
        $scope.getMeses();

        $rootScope.mostrarMenu = 1;
        $scope.paramBusqueda = [];
        //variablesLocalStorage();
        setTimeout(function () {
            $(".cargando").remove();
        }, 1500);

        var d = new Date();
        var n = d.getMonth();

        $scope.mesesSelect = n + 1;

        if (localStorage.getItem('comeBack')) {
            $scope.empresaNombre = JSON.parse(localStorage.getItem('empresaActualInMemory')).emp_nombre;
            $scope.bancoNombreT = JSON.parse(localStorage.getItem('cuentaActualInMemory')).NOMBRE;
            $scope.bancoId = JSON.parse(localStorage.getItem('cuentaActualInMemory')).IdBanco;
            $scope.empresaId = JSON.parse(localStorage.getItem('empresaActualInMemory')).emp_idempresa
            $scope.cuentaNumerica = JSON.parse(localStorage.getItem('cuentaActualInMemory')).Cuenta;
            $scope.cuentaContable = JSON.parse(localStorage.getItem('cuentaActualInMemory')).CuentaContable;
            $scope.polizaPagos = JSON.parse(localStorage.getItem('empresaActualInMemory')).polizaPago;

            $scope.empresaActual = JSON.parse(localStorage.getItem('empresaActualInMemory'));
            $scope.getBancos($scope.empresaId);
            $scope.bancoActual = JSON.parse(localStorage.getItem('bancoActualInMemory'));
            $scope.getCuenta($scope.bancoId, $scope.empresaId);
            $scope.cuentaActual = JSON.parse(localStorage.getItem('cuentaActualInMemory'));
            $scope.getTotalesAbonoCargo();
        }
    }

    var variablesLocalStorage = function () {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        if ($scope.busqueda != null) {
            $scope.getEmpresa($rootScope.userData.idUsuario);
            $scope.InfoBusqueda = true;
            //$scope.empresaActual = $scope.busqueda.Empresa;
            $scope.empresaActual = JSON.parse(localStorage.getItem('empresaActualInMemory'));
            $scope.polizaPago = $scope.busqueda.PolizaPago;
            $scope.bancoActual = $scope.busqueda.Banco;
            $scope.bancoNombre = $scope.busqueda.Banco;
            $scope.InmemoryAcount = $scope.busqueda.CuentaContable;
            $scope.InmemoryAcountBanc = $scope.busqueda.Cuenta;
            $scope.fechaElaboracion = $scope.busqueda.fechaElaboracion;
            $scope.fechaCorte = $scope.busqueda.fechaCorte;
            $scope.contadorGerente = [{
                'NombreUsuario': $scope.busqueda.usuario,
                'NombreGerente': $scope.busqueda.gerente,
                'NombreContador': $scope.busqueda.contador
            }];

            $scope.cuentaActual = JSON.parse(localStorage.getItem('cuentaActualInMemory'));

            //Reemplazo la consulta que retorna el valor del mes activo
            $scope.mesActivo = $scope.busqueda.MesActivo;
            conciliacionInicioRepository.getTotalAbonoCargo($scope.busqueda.IdBanco, $scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.polizaPago, 1, $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                if (result.data.length > 0) {

                    $scope.totalesAbonosCargos = result.data;
                    $scope.mesActivo = result.data.mesActivo;
                    //Habilita botones
                    $scope.activaBotonBuscar = false;
                    $scope.enableBottonReport = false;
                    /////
                } else {
                    $scope.totalesAbonosCargos = [];
                    $scope.enableBottonReport = true;
                }
            });
        }
    };

    $scope.getEmpresa = function (idUsuario) {
        filtrosRepository.getEmpresas(idUsuario).then(
            function (result) {
                $scope.activaInputCuenta = true;
                $scope.activaBotonBuscar = true;
                if (result.data.length > 0) {
                    $scope.empresaUsuario = result.data;
                }
            });
    }

    //Ing. LAGP 03052018
    $scope.getMeses = function () {
        conciliacionInicioRepository.getMeses().then(function (result) {
            console.log( 'result', result );
            if( result.data.length != 0 ){
                $rootScope.mesSelect = result.data;
                angular.forEach($rootScope.mesSelect, function( value, key ){
                    if( value.ACTIVO == 1 ){
                        $scope.mesActual = value;
                    }
                });
            }
        });
    };

    $scope.getBancos = function (idEmpresa) {
        $scope.activaInputCuenta = true;
        $scope.activaBotonBuscar = true;
        $scope.bancoActual = '';
        $scope.cuentaActual = '';
        if (idEmpresa == undefined || idEmpresa == null || idEmpresa == '') {
            alertFactory.warning('Seleccione una Empresa');
            $scope.activaInputBanco = true;
        } else {
            filtrosRepository.getBancos(idEmpresa).then(function (result) {
                if (result.data.length > 0) {
                    $scope.activaInputBanco = false;

                    $scope.bancoEmpresa = $filter('filter')(result.data, function (value) {
                        return value.IdBanco != 6
                    });
                } else {
                    $scope.bancoCuenta = [];
                    $scope.bancoEmpresa = [];
                }
            });
        }
    }

    $scope.getCuenta = function (idBanco, idEmpresa) {
        $scope.activaBotonBuscar = true;
        if (idBanco == undefined || idBanco == null || idBanco == '') {
            alertFactory.warning('Seleccioné un Banco');
            $scope.activaInputCuenta = true;
        } else {
            $scope.paramBusqueda = [];
            filtrosRepository.getCuenta(idBanco, idEmpresa).then(function (result) {
                if (result.data.length > 0) {
                    $scope.activaInputCuenta = false;
                    $scope.bancoCuenta = result.data;
                } else
                    $scope.bancoCuenta = [];
            });
        }
    }
    
    $scope.getTotalesAbonoCargo = function () {
        //Se coloca la fecha que se obtiene del dropdawn
        $scope.fechaElaboracion = $scope.mesActual.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActual.PAR_IDENPARA.substr(4, 2) + '-' + $scope.mesActual.PAR_IDENPARA.substr(6, 2);
        $scope.fechaCorte = $scope.mesActual.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActual.PAR_IDENPARA.substr(4, 2) + '-' + '30';

        if ($scope.fechaElaboracion.substr(-5, 2) != $scope.fechaCorte.substr(-5, 2)) {
            alertFactory.warning('El rango de fechas seleccionado debe pertenecer al mismo mes');
        }
        else {
            if (!localStorage.getItem('comeBack')) {
                localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
                localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
                localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));

                $('#actualizarBD').modal('show');

                conciliacionInicioRepository.getTotalAbonoCargo(
                    $scope.cuentaActual.IdBanco,
                    $scope.cuentaActual.IdEmpresa,
                    $scope.cuentaActual.Cuenta,
                    $scope.cuentaActual.CuentaContable,
                    $scope.fechaElaboracion,
                    $scope.fechaCorte,
                    $scope.empresaActual.polizaPago,
                    2,
                    $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                        $('#actualizarBD').modal('hide');
                        //localStorage.setItem( 'dataSearch', JSON.parse(result.data[0]) );
                        if (result.data.length > 0) {
                            $scope.totalesAbonosCargos = result.data[0];
                            $scope.mesActivo = result.data[0].mesActivo;
                            localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));

                            //Mensaje de alerta que corrobora la disponibilidad para conciliar registro del mes consultado

                            // if ($scope.mesActivo != 1) {
                            //     alertFactory.error("El mes consultado se  encuentra inactivo para conciliar registros, solo podrá consultar información!!!");
                            // }

                            $scope.paramBusqueda = [];

                            setTimeout(function () {
                                $scope.paramBusqueda = {
                                    "IdBanco": $scope.cuentaActual.IdBanco,
                                    "Banco": $scope.cuentaActual.NOMBRE,
                                    "IdEmpresa": $scope.cuentaActual.IdEmpresa,
                                    "Empresa": $scope.empresaActual.emp_nombre,
                                    "Cuenta": $scope.cuentaActual.Cuenta,
                                    "CuentaContable": $scope.cuentaActual.CuentaContable,
                                    "contador": $scope.contadorGerente[0].NombreContador,
                                    "gerente": $scope.contadorGerente[0].NombreGerente,
                                    "usuario": $scope.contadorGerente[0].Usuario,
                                    "fechaElaboracion": $scope.fechaElaboracion,
                                    "fechaCorte": $scope.fechaCorte,
                                    "DiferenciaMonetaria": $scope.empresaActual.diferenciaMonetaria,
                                    "MesActivo": $scope.mesActivo,
                                    "PolizaPago": $scope.empresaActual.polizaPago,
                                    "mensaje": result.data[0].mensaje
                                };
                                localStorage.setItem('paramBusqueda', JSON.stringify($scope.paramBusqueda));

                            }, 1000);

                            $scope.enableBottonReport = false;
                            $scope.InfoBusqueda = true;
                        } else {
                            $scope.totalesAbonosCargos = [];
                            $scope.enableBottonReport = true;
                        }
                    });

                conciliacionInicioRepository.getGerenteContador($rootScope.userData.idUsuario, $scope.cuentaActual.IdEmpresa).then(function (result) {
                    if (result.data.length > 0) {
                        $scope.contadorGerente = result.data;
                    }
                });
            } else {

                conciliacionInicioRepository.getTotalAbonoCargo(
                    $scope.bancoId,
                    $scope.empresaId,
                    $scope.cuentaNumerica,
                    $scope.cuentaContable,
                    $scope.fechaElaboracion,
                    $scope.fechaCorte,
                    $scope.polizaPagos,
                    2,
                    $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                        $('#actualizarBD').modal('hide');
                        //localStorage.setItem( 'dataSearch', JSON.parse(result.data[0]) );
                        if (result.data.length > 0) {
                            $scope.totalesAbonosCargos = result.data[0];
                            $scope.mesActivo = result.data[0].mesActivo;
                            localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));

                            //Mensaje de alerta que corrobora la disponibilidad para conciliar registro del mes consultado

                            if ($scope.mesActivo != 1) {
                                alertFactory.error("El mes consultado se  encuentra inactivo para conciliar registros, solo podrá consultar información!!!");
                            }

                            $scope.paramBusqueda = [];

                            setTimeout(function () {
                                $scope.paramBusqueda = { "IdBanco": $scope.cuentaActual.IdBanco, "Banco": $scope.cuentaActual.NOMBRE, "IdEmpresa": $scope.cuentaActual.IdEmpresa, "Empresa": $scope.empresaActual.emp_nombre, "Cuenta": $scope.cuentaActual.Cuenta, "CuentaContable": $scope.cuentaActual.CuentaContable, "contador": $scope.contadorGerente[0].NombreContador, "gerente": $scope.contadorGerente[0].NombreGerente, "usuario": $scope.contadorGerente[0].Usuario, "fechaElaboracion": $scope.fechaElaboracion, "fechaCorte": $scope.fechaCorte, "DiferenciaMonetaria": $scope.empresaActual.diferenciaMonetaria, "MesActivo": $scope.mesActivo, "PolizaPago": $scope.empresaActual.polizaPago };
                                localStorage.setItem('paramBusqueda', JSON.stringify($scope.paramBusqueda));

                            }, 1000);

                            $scope.enableBottonReport = false;
                            $scope.InfoBusqueda = true;
                        } else {
                            $scope.totalesAbonosCargos = [];
                            $scope.enableBottonReport = true;
                        }
                    });

                conciliacionInicioRepository.getGerenteContador($rootScope.userData.idUsuario, $scope.empresaId).then(function (result) {
                    if (result.data.length > 0) {
                        $scope.contadorGerente = result.data;
                    }
                });
            }
        }
        localStorage.removeItem('comeBack');
    }

    $scope.setCuenta = function (cuenta) {
        if (cuenta == null) {
            $scope.activaBotonBuscar = true;
        } else {
            $scope.activaBotonBuscar = false;
        }
    }

    $scope.cambiarMenu = function () {
        $scope.elementState.show = !$scope.elementState.show;
    };

    $scope.calendario = function () {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "yyyy-mm-dd"
        });
    };


    $scope.generaInfoReport = function () {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $('#loading').modal('show');

        setTimeout(function () {

            //Obtengo los datos de detalles/diferencias del local storage
            var detalleDiferencias = JSON.parse(localStorage.getItem('DetalleDiferencias'));
            if (detalleDiferencias.abonoContable.length == undefined) {
                alertFactory.warning("Error de comunicación, por favor intente de nuevo!!");
                $('#loading').modal('hide');
            }

            else {
                $('reproteModalPdf').modal('show');
                //Genero la promesa para enviar la estructura del reporte 
                new Promise(function (resolve, reject) {
                    var rptDetalleConciliacionBancaria =
                        {
                            "titulo": "CONCILIACIÓN BANCARIA",
                            "titulo2": "BANCOS",
                            "titulo3": "FA04",
                            "empresa": $scope.busqueda.Empresa,
                            "fechaElaboracion": $scope.fechaReporte,
                            "conciliacionBancaria": $scope.busqueda.Banco,
                            "chequera": $scope.fechaReporte,
                            "bancoCuenta": $scope.busqueda.Cuenta,
                            "clabe": $scope.busqueda.Cuenta,
                            "cuentaContable": $scope.busqueda.CuentaContable,
                            "estadoCuenta": $scope.totalesAbonosCargos[0].saldoBanco,
                            "aCNB": $scope.totalesAbonosCargos[0].tAbonoContable,
                            "aBNC": $scope.totalesAbonosCargos[0].tAbonoBancario,
                            "cCNB": $scope.totalesAbonosCargos[0].tCargoContable,
                            "cBNC": $scope.totalesAbonosCargos[0].tCargoBancario,
                            "saldoConciliacion": $scope.totalesAbonosCargos[0].sConciliacion,
                            "saldoContabilidad": $scope.totalesAbonosCargos[0].sContabilidad,
                            "diferencia": $scope.totalesAbonosCargos[0].diferencia,
                            //Detalle de Diferencias
                            "DetalleAbonosContables": [detalleDiferencias.abonoContable][0],
                            "DetalleAbonosBancarios": [detalleDiferencias.abonoBancario][0],
                            "DetalleCargosContables": [detalleDiferencias.cargoContable][0],
                            "DetalleCargoBancario": [detalleDiferencias.cargoBancario][0],

                            "firmas":
                                [
                                    {
                                        "titulo": "ELABORÓ",

                                        "nombre": $scope.contadorGerente[0].Usuario,

                                        "fecha": ""
                                    },
                                    {
                                        "titulo": "GERENTE ADMINISTRATIVO",
                                        "nombre": $scope.busqueda.gerente,
                                        "fecha": ""
                                    },
                                    {
                                        "titulo": "CONTADOR",
                                        "nombre": $scope.busqueda.contador,
                                        "fecha": ""
                                    }
                                ]
                        };
                    var jsonData = {
                        "template": {
                            "name": "ResumenConciliacion_rpt"
                        },
                        "data": rptDetalleConciliacionBancaria
                    }
                    resolve(jsonData);
                }).then(function (jsonData) {
                    conciliacionInicioRepository.getReporteTesoreria(jsonData).then(function (result) {
                        var file = new Blob([result.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                        $('#loading').modal('hide');
                        $('#reproteModalPdf').modal('show');
                    });
                });
            }
        }, 4000)
    };

    $scope.go = function (path) {
        if (!$scope.enableBottonReport) {
            $location.path(path);
        }
    };

    //Cancelación del modal para exportar datos a excel
    // $scope.excelExportModal = function(){
    //  var modalInstance = $uibModal.open({
    //     templateUrl: '../AngularJS/ExportarExcel/Template/ExcelExport.html',
    //     controller: 'excelExportController',
    //     backdrop: 'static',
    //     size: 500
    // });

    // };


});
