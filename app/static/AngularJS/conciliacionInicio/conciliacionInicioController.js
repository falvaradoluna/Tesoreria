registrationModule.controller('conciliacionInicioController', function ($window, $filter, $scope, $rootScope, $location, $timeout, $log, $uibModal, localStorageService, filtrosRepository, conciliacionInicioRepository, uiGridConstants, i18nService, uiGridGroupingConstants, $sce, conciliacionDetalleRegistroRepository) {

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
    $scope.cuentaActual = {Cuenta:''};
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
    
    //******************************************************************

    $scope.init = function () {
        $scope.getCloseBtnUsers();
                
        $scope.getEmpresa($rootScope.userData.idUsuario);
        $scope.calendario();
        //$scope.getUltimoMes();

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
            $scope.getUltimoMes($scope.empresaId, $scope.bancoId, $scope.cuentaNumerica)
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
    
    $scope.getCloseBtnUsers = function () {
        conciliacionInicioRepository.getCloseBtnUsers()
        .then(function (result) {
            if( result.data.length > 0 ){
                angular.forEach(result.data, function(value){
                    // Mostrar y ocultar le boton de cerrar mes
                    if( $rootScope.userData.idUsuario == value.seg_idUsuario ){
                        $rootScope.showCloseBtn = 1
                        }
                });
            }
        });
    };

    $scope.getUltimoMes = function( idEmpresa, idBanco, noCuenta ){
        //Obetenemos el año actual
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        
        if( month < 10 ){
            // var date = year.toString() + '0' + month.toString() + '0' + day.toString();
            var date = year.toString() + '0' + month.toString() +  day.toString();
        }else{
            var date = year.toString() + month.toString() + day.toString();
        }
        
        var paramsMes = {
            idEmpresa: idEmpresa,
            idBanco: idBanco,
            cuentaBanco: noCuenta,
            fechaActual: date
        }
        console.log( 'a', paramsMes );
        conciliacionInicioRepository.getUltimoMes( paramsMes ).then(function (result) {
            console.log( 'resultMes', result );
            if( result.data.length != 0 ){
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];  
                if( result.data[0].mec_numMes < 10 ){
                    $scope.jsonMes = {
                        ID: result.data[0].mec_numMes,
                        PAR_IDENPARA: result.data[0].mec_anio + '0' + result.data[0].mec_numMes + '01',
                        PAR_DESCRIP2: 'ABIERTO',
                        MES: monthNames[ result.data[0].mec_numMes - 1 ],
                        ACTIVO: 1
                    };
                }else{
                    $scope.jsonMes = {
                        ID: result.data[0].mec_numMes,
                        PAR_IDENPARA: result.data[0].mec_anio + '' + result.data[0].mec_numMes + '01',
                        PAR_DESCRIP2: 'ABIERTO',
                        MES: monthNames[ result.data[0].mec_numMes - 1 ],
                        ACTIVO: 1
                    };
                }
                $rootScope.nombreMes = monthNames[ result.data[0].mec_numMes - 1 ]
                $scope.mesActualJUN = $scope.jsonMes;
            }
        });
    }

    $scope.getBancos = function (idEmpresa) {
        $scope.activaInputCuenta = true;
        $scope.activaBotonBuscar = true;
        $scope.bancoActual = '';
        $scope.cuentaActual = '';
        if (idEmpresa == undefined || idEmpresa == null || idEmpresa == '') {
            swal(
                'Alto',
                'Seleccione una Empresa',
                'warning'
            );
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
            swal(
                'Alto',
                'Seleccioné una Banco',
                'warning'
            );
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

    //Funcion para obetener el ultimo dia del mes LGAP
    $scope.lastDay = function(y,m){
        return  new Date(y, m , 0).getDate();
    }
    
    $scope.getLocalAbonoCargo = function () {

        localStorage.removeItem('cuentaActualInMemory');
        localStorage.removeItem('empresaActualInMemory');
        localStorage.removeItem('bancoActualInMemory');
        if (!localStorage.getItem('comeBack')) {

            //Se coloca la fecha que se obtiene del dropdawn
            $scope.fechaElaboracion = $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(6, 2);
            $scope.fechaCorte = $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + '-' + $scope.lastDay( $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4), $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) );
            if ($scope.fechaElaboracion.substr(-5, 2) != $scope.fechaCorte.substr(-5, 2)) {
                swal(
                    'Alto',
                    'El rango de fechas seleccionado debe pertenecer al mismo mes',
                    'warning'
                );
            }
            else {
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
                        if (result.data.length > 0) {
                            
                            $scope.totalesAbonosCargos = result.data[0];
                            $scope.mesActivo = result.data[0].mesActivo;
                            localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));
                            
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
                                
                                $('#actualizarBD').modal('hide');
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
            }

        } else {
            $('#actualizarBD').modal('show');
            localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
            localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
            localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));
            $scope.fechaElaboracion = JSON.parse( localStorage.getItem('paramBusqueda') ).fechaElaboracion.substr(0, 10);
            $scope.fechaCorte = JSON.parse( localStorage.getItem('paramBusqueda') ).fechaCorte.substr(0, 10);
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
                    if (result.data.length > 0) {
                        $scope.totalesAbonosCargos = result.data[0];
                        $scope.mesActivo = result.data[0].mesActivo;
                        localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));

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
                            $('#actualizarBD').modal('hide');

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

        localStorage.removeItem('comeBack');
    };

    $scope.getTotalesAbonoCargo = function () {
        localStorage.removeItem('cuentaActualInMemory');
        localStorage.removeItem('empresaActualInMemory');
        localStorage.removeItem('bancoActualInMemory');
        if (!localStorage.getItem('comeBack')) {

            //Se coloca la fecha que se obtiene del dropdawn
            $scope.fechaElaboracion = $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(6, 2);
            $scope.fechaCorte = $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + '-' + $scope.lastDay( $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4), $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) );
            if ($scope.fechaElaboracion.substr(-5, 2) != $scope.fechaCorte.substr(-5, 2)) {
                swal(
                    'Alto',
                    'El rango de fechas seleccionado debe pertenecer al mismo mes',
                    'warning'
                );
            }
            else {
                localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
                localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
                localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));

                $('#actualizarBD').modal('show');

                conciliacionInicioRepository.getLocalAbonoCargo(
                    $scope.cuentaActual.IdBanco,
                    $scope.cuentaActual.IdEmpresa,
                    $scope.cuentaActual.Cuenta,
                    $scope.cuentaActual.CuentaContable,
                    $scope.fechaElaboracion,
                    $scope.fechaCorte,
                    $scope.empresaActual.polizaPago,
                    2,
                    $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                        if (result.data.length > 0) {
                            
                            $scope.totalesAbonosCargos = result.data[0];
                            $scope.mesActivo = result.data[0].mesActivo;
                            localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));

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
                                
                                $('#actualizarBD').modal('hide');
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
            }

        } else {
            $('#actualizarBD').modal('show');
            localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
            localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
            localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));
            $scope.fechaElaboracion = JSON.parse( localStorage.getItem('paramBusqueda') ).fechaElaboracion.substr(0, 10);
            $scope.fechaCorte = JSON.parse( localStorage.getItem('paramBusqueda') ).fechaCorte.substr(0, 10);
            conciliacionInicioRepository.getLocalAbonoCargo(
                $scope.bancoId,
                $scope.empresaId,
                $scope.cuentaNumerica,
                $scope.cuentaContable,
                $scope.fechaElaboracion,
                $scope.fechaCorte,
                $scope.polizaPagos,
                2,
                $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                    if (result.data.length > 0) {
                        $scope.totalesAbonosCargos = result.data[0];
                        $scope.mesActivo = result.data[0].mesActivo;
                        localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));

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
                            $('#actualizarBD').modal('hide');

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

        localStorage.removeItem('comeBack');
    };

    $scope.setCuenta = function (cuenta) {
        if (cuenta == null) {
            $scope.activaBotonBuscar = true;
        } else {
            $scope.getUltimoMes($scope.cuentaActual.IdEmpresa, $scope.cuentaActual.IdBanco, $scope.cuentaActual.Cuenta);
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
        var d = new Date();
        var n = d.getMonth() + 1;
        if( parseInt($scope.mesActualJUN.PAR_IDENPARA.substr(4, 2)) == n ){
            $scope.fechaReporteConcilio = $scope.fechaReporte;
        }else{
            $scope.fechaReporteConcilio = $scope.fechaCorte;
        }
        setTimeout(function () {

            //Obtengo los datos de detalles/diferencias del local storage
            var detalleDiferencias = JSON.parse(localStorage.getItem('DetalleDiferencias'));
            console.log( 'detalleDiferencias', detalleDiferencias );
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
                            "chequera": $scope.fechaReporteConcilio,
                            "bancoCuenta": $scope.busqueda.Cuenta,
                            "clabe": $scope.busqueda.Cuenta,
                            "cuentaContable": $scope.busqueda.CuentaContable,
                            "estadoCuenta": $scope.totalesAbonosCargos.saldoBanco,
                            "aCNB": $scope.totalesAbonosCargos.tAbonoContable,
                            "aBNC": $scope.totalesAbonosCargos.tAbonoBancario,
                            "cCNB": $scope.totalesAbonosCargos.tCargoContable,
                            "cBNC": $scope.totalesAbonosCargos.tCargoBancario,
                            "saldoConciliacion": $scope.totalesAbonosCargos.sConciliacion,
                            "saldoContabilidad": $scope.totalesAbonosCargos.sContabilidad,
                            "diferencia": $scope.totalesAbonosCargos.diferencia,
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
        }, 7000)
    };

    $scope.go = function (path) {
        if (!$scope.enableBottonReport) {
            $location.path(path);
        }
    };

    $scope.guardarHistoricoSis = function() {
        console.log( 'Foto por sistema' );
        $scope.guardaDisable = true;
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.guardarHistorico(
                $rootScope.userData.idUsuario,
                $scope.cuentaActual.IdBanco,
                $scope.cuentaActual.IdEmpresa,
                $scope.cuentaActual.Cuenta,
                $scope.cuentaActual.CuentaContable,
                $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + $scope.mesActualJUN.PAR_IDENPARA.substr(6, 2),
                $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + '-' + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + '-' + $scope.lastDay( $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4), $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) ),
                $scope.empresaActual.polizaPago,
                2
            )
            .then(function(result) {
                console.log( 'resultH', result.data );
                if (result.data[0].estatus == 0) {
                    swal(
                        'Listo',
                        result.data[0].mensaje,
                        'success'
                    );
                    $scope.guardaDisable = false;
                    $('#loading').modal('hide');
                } else {
                    swal(
                        'Listo',
                        result.data[0].mensaje,
                        'success'
                    );
                    $scope.guardaDisable = true;
                    $('#loading').modal('hide');
                }
            });

    };

    $scope.closeMes = function () {
        var mes = parseInt($scope.mesActualJUN.PAR_IDENPARA.substr(4, 2));
        
        var months = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        swal({
            title: '¿Deseas cerrar el mes de ' + months[mes] + '?',
            text: 'Si cierras el mes de ' + months[mes] + ' se iniciara la conciliacion del mes de ' + months[mes + 1] + '.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cerrar',
            cancelButtonText: 'Cancelar',
            confirmButtonClass: 'confirm-class',
            cancelButtonClass: 'cancel-class',
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    
                    var parametros = {
                        idEmpresa: $scope.cuentaActual.IdEmpresa, 
                        idBanco: $scope.cuentaActual.IdBanco,
                        cuentaBanco: $scope.cuentaActual.Cuenta,
                        fechaInicio: $scope.fechaElaboracion = $scope.mesActualJUN.PAR_IDENPARA.substr(0, 4) + $scope.mesActualJUN.PAR_IDENPARA.substr(4, 2) + $scope.mesActualJUN.PAR_IDENPARA.substr(6, 2)
                    }
                    conciliacionInicioRepository.getcloseMes( parametros )
                    .then(function (result) {
                        if( result.data[0].success == 1 ){
                            $scope.guardarHistoricoSis();
                            $scope.getUltimoMes($scope.cuentaActual.IdEmpresa, $scope.cuentaActual.IdBanco, $scope.cuentaActual.Cuenta,);
                            swal(
                                'Listo',
                                result.data[0].msg,
                                'success'
                            );
                            setTimeout(function(){
                                $scope.getTotalesAbonoCargo();
                            }, 3000);
                        }else{
                            swal(
                                'Alto',
                                result.data[0].msg,
                                'error'
                            );
                        }
                    });
                    
                } else {
                    swal(
                        'Cancelado',
                        'No se cerro el mes de ' + months[mes] + '.',
                        'error'
                    );
                }
            });

    }

    $scope.openModalMovimiento = function(){
        var mesName = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        var fecha = $scope.fechaCorte.split('-');
        var anio  = parseInt(fecha[0]);
        var mes   = parseInt(fecha[1]);
        var dia   = parseInt(fecha[2])

        $scope.mMov = {
            anio: anio,
            mes: mes,
            mesName: mesName[ mes ],
            dia: dia
        }
        
        $scope.frmMovimientoBancario = {
            referencia:     '',
            concepto:       '',
            refAmpliada:    '',
            esCargo:        '',
            importe:        0,
            dia:            1
        }
        $("#MovimientoBancario").modal('show');
    }

    $scope.frmMovimientoBancario = {
        referencia:     '',
        concepto:       '',
        refAmpliada:    '',
        esCargo:        '',
        importe:        0,
        dia:            1
    }
    $scope.saveMovimientoBancario = function(){
        if( $scope.frmMovimientoBancario.referencia === '' && $scope.frmMovimientoBancario.concepto === '' && $scope.frmMovimientoBancario.refAmpliada === '' ){
            swal("Nuevo Movimiento Bancario","Debes agregar al menos una descripción en referencia, concepto o referencia ampliada.");
        }
        else if( isNaN($scope.frmMovimientoBancario.importe) ){
            swal("Nuevo Movimiento Bancario","Debes agregar un importe valido.");
            $scope.frmMovimientoBancario.importe = 0;
        }
        else if( $scope.frmMovimientoBancario.importe === '' ){
            swal("Nuevo Movimiento Bancario","Debes agregar un importe al movimiento bancario.");
        }
        else if( $scope.frmMovimientoBancario.importe === 0 ){
            swal("Nuevo Movimiento Bancario","Debes agregar un importe mayor a cero.");
        }
        else if( $scope.frmMovimientoBancario.dia === 0 ){
            swal("Nuevo Movimiento Bancario","Debes elegir un día para la fecha de operación del movimiento.");   
        }
        else{
            swal({
                title: "Nuevo Movimiento Bancario",
                text: "¿Estas seguro de agregar el movimiento bancario.?",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Si, estoy seguro",
                closeOnConfirm: false
            },
            function() {
                var parametros = {
                    referencia:     $scope.frmMovimientoBancario.referencia,
                    concepto:       $scope.frmMovimientoBancario.concepto,
                    refAmpliada:    $scope.frmMovimientoBancario.refAmpliada,
                    noCuenta:       $scope.cuentaActual.Cuenta != null ? $scope.cuentaActual.Cuenta : $scope.cuentaNumerica,
                    esCargo:        $scope.frmMovimientoBancario.esCargo ? 1 : 0,
                    importe:        $scope.frmMovimientoBancario.importe,
                    fechaOperacion: $scope.mMov.anio
                                    + '-' + 
                                    ($scope.mMov.mes < 10 ? '0' + $scope.mMov.mes : $scope.mMov.mes)
                                    + '-' + 
                                    ($scope.frmMovimientoBancario.dia < 10 ? '0' + $scope.frmMovimientoBancario.dia : $scope.frmMovimientoBancario.dia),
                    idUsuario:      $rootScope.userData.idUsuario,
                    idEmpresa:      $scope.empresaActual.emp_idempresa,
                    idBanco:        $scope.bancoActual,
                    anio:           $scope.mMov.anio
                }

                conciliacionInicioRepository.addMovimientoBancario( parametros ).then(function(result) {
                    swal({
                        title:"Nuevo Movimiento Bancario", 
                        text: "Se ha agregado con exito.", 
                        type: "success"
                    },function(){
                        $("#MovimientoBancario").modal('hide');
                        $scope.getTotalesAbonoCargo();
                    });
                });
            });
        }
    }

});
