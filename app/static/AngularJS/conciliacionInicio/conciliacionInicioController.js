registrationModule.controller('conciliacionInicioController', function($window, $filter,$scope, $rootScope, $location, $timeout, $log, $uibModal, localStorageService, filtrosRepository, conciliacionInicioRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, $sce) {

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
            $scope.InfoBusqueda=false;
            $scope.InmemoryAcount = '';
            $scope.InmemoryAcountBanc = '';
            $scope.difMonetaria = 0;
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
                
                $scope.getEmpresa($rootScope.userData.idUsuario);
                $scope.calendario();
                
                $rootScope.mostrarMenu = 1;
                $scope.paramBusqueda = [];
                variablesLocalStorage();
            }

            var variablesLocalStorage = function() {
                $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
                if ($scope.busqueda  != null) {
                    $scope.getEmpresa($rootScope.userData.idUsuario);
                    $scope.InfoBusqueda=true;
                    $scope.cuentaActual = $scope.busqueda;
                    $scope.empresaActual = $scope.busqueda.Empresa;
                    $scope.bancoActual = $scope.bancoEmpresa;
                    $scope.InmemoryAcount = $scope.busqueda.cuentaContable;
                    $scope.InmemoryAcountBanc = $scope.busqueda.Cuenta;
                    $scope.fechaElaboracion = $scope.busqueda.fechaElaboracion;
                    $scope.fechaCorte = $scope.busqueda.fechaCorte;
                    $scope.contadorGerente=[{'NombreGerente':$scope.busqueda.gerente,
                    'NombreContador':$scope.busqueda.contador
                    }];

                    conciliacionInicioRepository.getTotalAbonoCargo($scope.busqueda.IdBanco, $scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.CuentaContable,$scope.busqueda.fechaElaboracion,$scope.busqueda.fechaCorte, 1).then(function(result) {
                    if (result.data.length > 0) {
                            //console.log('entra')                
                            $scope.totalesAbonosCargos = result.data;
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

                $scope.getEmpresa = function(idUsuario) {
                    filtrosRepository.getEmpresas(idUsuario).then(
                        function(result) {
                            $scope.activaInputCuenta = true;
                            $scope.activaBotonBuscar = true;
                            if (result.data.length > 0) {
                                $scope.empresaUsuario = result.data;
                            }
                        });
                }

                $scope.getBancos = function(idBanco) {
                    $scope.activaInputCuenta = true;
                    $scope.activaBotonBuscar = true;
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
                            } else {
                                $scope.bancoCuenta = [];
                                $scope.bancoEmpresa = [];
                            }
                        });
                    }
                }

                $scope.getCuenta = function(idBanco, idEmpresa) {
                    $scope.activaBotonBuscar = true;
                    if (idBanco == undefined || idBanco == null || idBanco == '') {
                        alertFactory.warning('Seleccioné un Banco');
                        $scope.activaInputCuenta = true;
                    } else {
                        $scope.paramBusqueda = [];
                        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
                            if (result.data.length > 0) {
                                $scope.activaInputCuenta = false;
                                $scope.activaBotonBuscar = false;
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
                                $scope.paramBusqueda = { "IdBanco": $scope.cuentaActual.IdBanco, "Banco": $scope.cuentaActual.NOMBRE, "IdEmpresa": $scope.cuentaActual.IdEmpresa, "Empresa": $scope.empresaActual.emp_nombre, "Cuenta": $scope.cuentaActual.Cuenta, "CuentaContable": $scope.cuentaActual.CuentaContable, "contador": $scope.contadorGerente[0].NombreGerente, "gerente": $scope.contadorGerente[0].NombreContador,"fechaElaboracion": $scope.fechaElaboracion,"fechaCorte": $scope.fechaCorte, "DiferenciaMonetaria": $scope.empresaActual.diferenciaMonetaria};
                                localStorage.setItem('paramBusqueda', JSON.stringify($scope.paramBusqueda));
                                console.log('$scope.paramBusqueda')
                                console.log($scope.paramBusqueda)

                            }, 1000);

                             $scope.enableBottonReport = false;
                        } else {
                            $scope.totalesAbonosCargos = [];
                            $scope.enableBottonReport = true;
                        }
                    });

                    conciliacionInicioRepository.getGerenteContador($rootScope.userData.idUsuario).then(function(result) {
                        if (result.data.length > 0) {
                            $scope.contadorGerente = result.data;
                        }
                    });
                  }
                }

                // $scope.setCuenta = function(cuenta) {
                //     if (cuenta == null) {
                //         $scope.activaBotonBuscar = true;
                //     } else {
                //         $scope.activaBotonBuscar = false;
                //     }
                // }

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
         
         $('#loading').modal('show');

    setTimeout(function(){

        //Obtengo los datos de detalles/diferencias del local storage
        var detalleDiferencias =  JSON.parse(localStorage.getItem('DetalleDiferencias'));
          if(detalleDiferencias.abonoContable.length == undefined){
           alertFactory.warning("Error de comunicación, por favor intente de nuevo!!");
           $('#loading').modal('hide');
           }

else {
        $('reproteModalPdf').modal('show');
        //Genero la promesa para enviar la estructura del reporte 
      new Promise(function(resolve, reject) {
          var rptDetalleConciliacionBancaria = 
                                                { 
                                                        "titulo"    :   "CONCILIACIÓN BANCARIA",
                                                        "titulo2"   :   "BANCOS",
                                                        "titulo3"   :   "FA04",
                                                        "empresa"   :   $scope.busqueda.Empresa,
                                                        "fechaElaboracion"  :   $scope.fechaReporte,
                                                        "conciliacionBancaria"  :   $scope.busqueda.Banco,
                                                        "chequera"  :   $scope.fechaReporte,
                                                        "bancoCuenta"   :   $scope.busqueda.Cuenta,
                                                        "clabe"  :   "01218000 195334667",
                                                        "cuentaContable"  :   $scope.busqueda.CuentaContable,
                                                        "estadoCuenta" : $scope.totalesAbonosCargos[0].saldoBanco,
                                                        "aCNB" : $scope.totalesAbonosCargos[0].tAbonoContable,
                                                        "aBNC" : $scope.totalesAbonosCargos[0].tAbonoBancario,
                                                        "cCNB" : $scope.totalesAbonosCargos[0].tCargoContable,
                                                        "cBNC" : $scope.totalesAbonosCargos[0].tCargoBancario,
                                                        "saldoConciliacion" : $scope.totalesAbonosCargos[0].sConciliacion,
                                                        "saldoContabilidad" : $scope.totalesAbonosCargos[0].sContabilidad,
                                                        "diferencia" : $scope.totalesAbonosCargos[0].diferencia,
                                                        //Detalle de Diferencias
                                                        "DetalleAbonosContables":[detalleDiferencias.abonoContable][0],
                                                        "DetalleAbonosBancarios":[detalleDiferencias.abonoBancario][0],
                                                        "DetalleCargosContables": [detalleDiferencias.cargoContable][0],
                                                        "DetalleCargoBancario":  [detalleDiferencias.cargoBancario][0],

                                                        "firmas":
                                                       [
                                                           {
                                                               "titulo"   :   "ELABORÓ",
                                                               "nombre"   :   "CARLA HERNÁNDEZ RODRÍGUEZ",
                                                               "fecha"   :   ""
                                                           },
                                                           {
                                                               "titulo"   :   "GERENTE ADMINISTRATIVO",
                                                               "nombre"   :   "GUADALUPE HERNÁNDEZ MEJÍA",
                                                               "fecha"   :   ""
                                                           },
                                                           {
                                                               "titulo"   :   "CONTADOR",
                                                               "nombre"   :   "DAVID VÁZQUEZ RICO",
                                                               "fecha"   :   ""
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
                }).then(function(jsonData) {
                    conciliacionInicioRepository.getReporteTesoreria(jsonData).then(function(result){
                        var file = new Blob([result.data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                         $('#loading').modal('hide');
                        $('#reproteModalPdf').modal('show'); 
                    });
                });
}
                } ,4000)
     };

     $scope.go = function ( path ) {
        if(!$scope.enableBottonReport){
              $location.path( path );
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
