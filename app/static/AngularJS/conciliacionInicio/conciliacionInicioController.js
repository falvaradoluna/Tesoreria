registrationModule.controller('conciliacionInicioController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionInicioRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants) {

            // ****************** Se guarda la información del usuario en variable userData
            $rootScope.userData = localStorageService.get('userData');
            $scope.nodoPadre = [];
            $scope.fechaCorte = new Date();
            $scope.fechaElaboracion = new Date($scope.fechaCorte.getFullYear(), $scope.fechaCorte.getMonth(), 1);
            //*****Inicio variables para activar o desactivar botones o input 
            $scope.activaInputBanco = true;
            $scope.activaInputCuenta = true;
            $scope.activaBotonBuscar = true;
            $scope.activaBotonesReporte = true;
            $scope.empresaActual = '';
            $scope.bancoActual = '';
            $scope.cuentaActual = '';
            $scope.InfoBusqueda=false;
            //***************************************************************

            $scope.init = function() {
                //$scope.calendario();
                $scope.getEmpresa(15);
                //$scope.getBancos(1);
                //$scope.getCuentaBanco(1, 1)
                //$scope.getClaveBanco(1)
                //$scope.getCuentacontable(1)

                // if($rootScope.userData == null){
                //  location.href = '/';
                //  alertFactory.warning('Inicie Sesión')
                // }else{
                //  alertFactory.success('Bienvenido '+ $rootScope.userData.nombreUsuario)
                // }
                $rootScope.mostrarMenu = 1;
                $scope.paramBusqueda = [];
                variablesLocalStorage();
            }
            var variablesLocalStorage = function() {
                $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
                console.log($scope.busqueda, 'Soy la busqueda')
                if ($scope.busqueda  != null) {
                    $scope.InfoBusqueda=true;
                    $scope.empresaActual=$scope.busqueda.Empresa;
                    $scope.contadorGerente=[{'NombreGerente':$scope.busqueda.gerente,
                    'NombreContador':$scope.busqueda.contador
                    }];
                       conciliacionInicioRepository.getTotalAbonoCargo($scope.busqueda.idBanco, $scope.busqueda.idEmpresa, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable, 2).then(function(result) {
                        if (result.data.length > 0) {
                            //console.log('entra')                
                            $scope.totalesAbonosCargos = result.data;
                            $scope.activaBotonesReporte = false;

                        } else {
                            //console.log('no hay nada')
                            $scope.totalesAbonosCargos = [];
                        }
                    });      
                    }

                };

                $scope.getEmpresa = function(idUsuario) {
                    filtrosRepository.getEmpresas(idUsuario).then(
                        function(result) {
                            $scope.activaInputCuenta = true;
                            $scope.activaBotonBuscar = true;
                            $scope.activaBotonesReporte = true;
                            if (result.data.length > 0) {
                                $scope.empresaUsuario = result.data;

                                //console.log($scope.empresaUsuario)

                            }
                        });
                }

                $scope.getBancos = function(idBanco) {
                    $scope.activaInputCuenta = true;
                    $scope.activaBotonBuscar = true;
                    $scope.activaBotonesReporte = true;
                    $scope.bancoActual = '';
                    $scope.cuentaActual = '';
                    if (idBanco == undefined || idBanco == null || idBanco == '') {
                        alertFactory.warning('Seleccione una Empresa');
                        $scope.activaInputBanco = true;
                    } else {
                        filtrosRepository.getBancos(idBanco).then(function(result) {
                            if (result.data.length > 0) {
                                $scope.activaInputBanco = false;
                                $scope.bancoEmpresa = result.data;
                                //console.log($scope.bancoEmpresa)
                            } else {
                                $scope.bancoCuenta = [];
                                $scope.bancoEmpresa = [];
                            }
                        });
                    }
                }

                /*
                $scope.getCuentaBanco = function(idCuentaBanco, idempresa) {
                    filtrosRepository.getCuentaBanco(idCuentaBanco, idempresa).then(function(result) {
                        if (result.data.length > 0) {
                            $scope.bancoCuenta = result.data;
                            //console.log(result.data)
                        }
                    });
                }

                $scope.getClaveBanco = function(idClaveBanco) {
                    filtrosRepository.getClaveBanco(idClaveBanco).then(function(result) {
                        if (result.data.length > 0) {
                            $scope.bancoClave = result.data;
                            //console.log(result.data)
                        }
                    });
                }

                $scope.getCuentacontable = function(idCuentacontable) {
                    filtrosRepository.getCuentacontable(idCuentacontable).then(function(result) {
                        if (result.data.length > 0) {
                            $scope.cuentacontable = result.data;
                        }
                    });
                }*/

                //LQMA 27022017 add obtiene datos para llenar filtro de cuenta
                $scope.getCuenta = function(idBanco, idEmpresa) {
                    $scope.activaBotonBuscar = true;
                    $scope.activaBotonesReporte = true;
                    //console.log('sdsdsd')
                    //console.log(idBanco,idEmpresa)
                    if (idBanco == undefined || idBanco == null || idBanco == '') {
                        alertFactory.warning('Seleccioné un Banco');
                        $scope.activaInputCuenta = true;
                    } else {
                        $scope.paramBusqueda = [];
                        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
                            if (result.data.length > 0) {
                                $scope.activaInputCuenta = false;
                                $scope.activaBotonBuscar = false;
                                //console.log('$scope.bancoCuenta')
                                //console.log(result.data)
                                $scope.bancoCuenta = result.data;
                            } else
                                $scope.bancoCuenta = [];
                        });
                    }
                }


                $scope.getTotalesAbonoCargo = function() {
                    $scope.activaBotonesReporte = false;
                    console.log('$scope.cuentaActual')
                    console.log($scope.cuentaActual)


                    conciliacionInicioRepository.getTotalAbonoCargo($scope.cuentaActual.IdBanco, $scope.cuentaActual.IdEmpresa, $scope.cuentaActual.Cuenta, $scope.cuentaActual.CuentaContable, 2).then(function(result) {
                        if (result.data.length > 0) {
                            //console.log('entra')                
                            $scope.totalesAbonosCargos = result.data;
                            //console.log($scope.totalesAbonosCargos)

                            $scope.paramBusqueda = [];

                            setTimeout(function() {
                                $scope.paramBusqueda = { "idBanco": $scope.cuentaActual.IdBanco, "Banco": $scope.cuentaActual.NOMBRE, "idEmpresa": $scope.cuentaActual.IdEmpresa, "Empresa": $scope.empresaActual.emp_nombre, "cuenta": $scope.cuentaActual.Cuenta, "cuentaContable": $scope.cuentaActual.CuentaContable, "contador": $scope.contadorGerente[0].NombreGerente, "gerente": $scope.contadorGerente[0].NombreContador };
                                localStorage.setItem('paramBusqueda', JSON.stringify($scope.paramBusqueda));
                                console.log('$scope.paramBusqueda')
                                console.log($scope.paramBusqueda)

                            }, 1000);


                        } else {
                            //console.log('no hay nada')
                            $scope.totalesAbonosCargos = [];
                        }
                    });

                    /*setTimeout(function() {
                        $scope.fresh = JSON.parse(localStorage.getItem('paramBusqueda'))

                        console.log($scope.fresh)
                        //console.log(JSON.parse($scope.fresh))
                    }, 1000);*/
                    conciliacionInicioRepository.getGerenteContador($rootScope.userData.idUsuario).then(function(result) {
                        if (result.data.length > 0) {
                            //console.log('entra')                
                            $scope.contadorGerente = result.data;
                            //console.log('$scope.contadorGerente')
                            //console.log($scope.contadorGerente[0].NombreGerente)
                        }
                    });

                }

                $scope.setCuenta = function(cuenta) {
                    if (cuenta == null) {
                        console.log('Hola')
                        $scope.activaBotonBuscar = true;
                    } else {
                        $scope.activaBotonBuscar = false;
                    }

                    console.log(cuenta)
                }

            });
