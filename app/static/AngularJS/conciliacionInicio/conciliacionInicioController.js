registrationModule.controller('conciliacionInicioController', function($filter,$scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionInicioRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants) {

            // ****************** Se guarda la información del usuario en variable userData
            $rootScope.userData = localStorageService.get('userData');
            $scope.nodoPadre = [];
            $scope.fechaReporte = new Date();
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

            //*****Variables para ocultar Depositos y Pagos referenciados
            $scope.elementState = {}
            $scope.elementState.show = false;
            //***********************************************************

            //*****Cambio del formato en fechas predeterminadas para la búsqueda
            $scope.fechaCorte = $filter('date')(new Date($scope.fechaCorte), 'yyyy-MM-dd');
            $scope.fechaElaboracion = $filter('date')(new Date($scope.fechaElaboracion), 'yyyy-MM-dd');
            //******************************************************************

            $scope.init = function() {
                
                $scope.getEmpresa(15);
                $scope.calendario();
                
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
                       conciliacionInicioRepository.getTotalAbonoCargo($scope.busqueda.idBanco, $scope.busqueda.idEmpresa, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte, 1).then(function(result) {
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
                    console.log($scope.fechaElaboracion.substr(-5,2));
                    if($scope.fechaElaboracion.substr(-5,2) != $scope.fechaCorte.substr(-5,2)){
                      alertFactory.warning('El rango de fechas seleccionado debe pertenecer al mismo mes');
                    }
                    else{
                    $scope.activaBotonesReporte = false;
                    console.log('$scope.cuentaActual')
                    console.log($scope.cuentaActual)

                      $('#actualizarBD').modal('show');
                    conciliacionInicioRepository.getTotalAbonoCargo($scope.cuentaActual.IdBanco, $scope.cuentaActual.IdEmpresa, $scope.cuentaActual.Cuenta, $scope.cuentaActual.CuentaContable,$scope.fechaElaboracion,$scope.fechaCorte, 2).then(function(result) {
                        $('#actualizarBD').modal('hide');
                        if (result.data.length > 0) {
                            //console.log('entra')                
                            $scope.totalesAbonosCargos = result.data;
                            //console.log($scope.totalesAbonosCargos)

                            $scope.paramBusqueda = [];

                            setTimeout(function() {
                                $scope.paramBusqueda = { "idBanco": $scope.cuentaActual.IdBanco, "Banco": $scope.cuentaActual.NOMBRE, "idEmpresa": $scope.cuentaActual.IdEmpresa, "Empresa": $scope.empresaActual.emp_nombre, "cuenta": $scope.cuentaActual.Cuenta, "cuentaContable": $scope.cuentaActual.CuentaContable, "contador": $scope.contadorGerente[0].NombreGerente, "gerente": $scope.contadorGerente[0].NombreContador,"fechaElaboracion": $scope.fechaElaboracion,"fechaCorte": $scope.fechaCorte};
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

                $scope.cambiarMenu = function(){
                $scope.elementState.show = !$scope.elementState.show;   
                };

                $scope.calendario = function() {
                 $('#calendar .input-group.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: true,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true,
                format : "yyyy-mm-dd"
                });
    };


     $scope.generaInfoReport = function(){
          $('#reproteModalPdf').modal('show');
     };

    $scope.ImprimirReporte = function(){
       $('#reproteModalPdf').modal('hide'); 
    window.print();
     };

            });
