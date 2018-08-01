registrationModule.controller('conciliacionInicioConsultaController', function ($window, $filter, $scope, $rootScope, $location, $timeout, $log, $uibModal, localStorageService, filtrosRepository, conciliacionInicioConsultaRepository, uiGridConstants, i18nService, uiGridGroupingConstants, $sce) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.fechaReporte = new Date();
    $scope.fechaCorte = new Date();
    $scope.fechaElaboracion = new Date($scope.fechaCorte.getFullYear(), $scope.fechaCorte.getMonth(), 1);

    //*****Inicio variables para activar o desactivar botones o input 
    $rootScope.btnShow = 0;
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
    $rootScope.tipoConsulta = 1;
    //***************************************************************

    //*****Variables para ocultar Depositos y Pagos referenciados
    $scope.elementState = {}
    $scope.elementState.show = false;
    //***********************************************************

    //*****Cambio del formato en fechas predeterminadas para la búsqueda
    // $scope.fechaCorte = $filter('date')(new Date($scope.fechaCorte), 'yyyy-MM-dd');
    // $scope.fechaElaboracion = $filter('date')(new Date($scope.fechaElaboracion), 'yyyy-MM-dd');
    //******************************************************************

    //Variables para traer el historio LAGP
    $scope.empresaId;
    $scope.bancoId;
    $scope.bancariaCuenta;
    $scope.contableCuenta;
    $rootScope.fechaHistorico;

    $scope.init = function () {

        $rootScope.tiposConsultas = [{ tipo: 'Por empresa', value: 1 }, { tipo: 'Por sistema', value: 2 }];
        $scope.tipoConsulta = {  tipo: 'Por empresa', value: 1 };

        $scope.getEmpresa($rootScope.userData.idUsuario);
        $scope.calendario();
        $scope.getMeses();
        $rootScope.mostrarMenu = 1;
        $scope.paramBusqueda = [];
        //variablesLocalStorage();
        setTimeout(function () {
            $(".cargando").remove();
        }, 1500);

        if (localStorage.getItem('comeBackConsulta')) {
            $rootScope.btnShow = 1;
            $scope.empresaNombre = JSON.parse(localStorage.getItem('empresaActualInMemory')).emp_nombre;
            $scope.bancoNombreT = JSON.parse(localStorage.getItem('cuentaActualInMemory')).NOMBRE;
            $scope.bancoId = JSON.parse(localStorage.getItem('cuentaActualInMemory')).IdBanco;
            $scope.empresaId = JSON.parse(localStorage.getItem('empresaActualInMemory')).emp_idempresa
            $scope.cuentaNumerica = JSON.parse(localStorage.getItem('cuentaActualInMemory')).Cuenta;
            $scope.cuentaContable = JSON.parse(localStorage.getItem('cuentaActualInMemory')).CuentaContable;
            $scope.polizaPagos = JSON.parse(localStorage.getItem('empresaActualInMemory')).polizaPago;
            $scope.tipoConsultaH = JSON.parse(localStorage.getItem('paramBusqueda')).tipoConsulta;

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
            conciliacionInicioConsultaRepository.getTotalAbonoCargo($scope.busqueda.IdBanco, $scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.polizaPago, 1, $rootScope.userData.idUsuario).then(function (result) { //LQMA add 06032018 idUsuario
                if (result.data.length > 0) {             
                    $scope.totalesAbonosCargos = result.data;
                    $scope.mesActivo = result.data.mesActivo;
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
        var d = new Date();
        $rootScope.mesesConsulta = [];
        const monthNames = [
            {value: '20180101', nombre:"Enero"}, 
            {value: '20180201', nombre:"Febrero"}, 
            {value: '20180301', nombre:"Marzo"}, 
            {value: '20180401', nombre:"Abril"}, 
            {value: '20180501', nombre:"Mayo"}, 
            {value: '20180601', nombre:"Junio"},
            {value: '20180701', nombre:"Julio"}, 
            {value: '20180801', nombre:"Agosto"}, 
            {value: '20180901', nombre:"Septiembre"}, 
            {value: '20181001', nombre:"Octubre"}, 
            {value: '20181101', nombre:"Noviembre"}, 
            {value: '20181201', nombre:"Diciembre"}];
        angular.forEach(monthNames, function( value, key ){
            if( key < d.getMonth() + 1 ){
                $rootScope.mesesConsulta.push( monthNames[key] );
            }
        })
        $rootScope.mesSelect = $rootScope.mesesConsulta;
    };

    $scope.getUltimoMes = function( idEmpresa, idBanco, noCuenta ){
        //Obetenemos el año actual
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDay();
        
        if( month < 10 ){
            if( day < 10 ){
                var date = year.toString() + '0' + month.toString() + '0' + day.toString();
            }else{
                var date = year.toString() + '0' + month.toString() + day.toString();
            }
        }else{
            var date = year.toString() + month.toString() + day.toString();
        }
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
            $scope.empresaId = idEmpresa;
            filtrosRepository.getBancos(idEmpresa).then(function (result) {
                if (result.data.length > 0) {
                    $scope.activaInputBanco = false;

                    $scope.bancoEmpresa = $filter('filter')(result.data, function (value) {
                        return value.IdBanco != 6
                    });;

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
                'Seleccione una Banco',
                'warning'
            );
            $scope.activaInputCuenta = true;
        } else {
            $scope.bancoId = idBanco;
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

    $scope.tipoConsultaF = function (consulta) {
    }

    $scope.lastDay = function(y,m){
        return  new Date(y, m , 0).getDate();
    }

    $scope.getTotalesAbonoCargo = function () {       
        
            if (!localStorage.getItem('comeBackConsulta')) {
                
                if ($scope.mesActual == undefined) {
                    swal(
                        'Alto',
                        'Seleccione un mes',
                        'warning'
                    );
                } else {
                    
                    $scope.fechaElaboracion = $scope.mesActual.value.substr(0, 4) + '-' + $scope.mesActual.value.substr(4, 2) + '-' + $scope.mesActual.value.substr(6, 2);
                    $scope.fechaCorte = $scope.mesActual.value.substr(0, 4) + '-' + $scope.mesActual.value.substr(4, 2) + '-' + $scope.lastDay($scope.mesActual.value.substr(0, 4), $scope.mesActual.value.substr(4, 2));
                   
                    if ($scope.fechaElaboracion.substr(-5, 2) != $scope.fechaCorte.substr(-5, 2)) {
                        swal(
                            'Alto',
                            'El rango de fechas seleccionado debe pertenecer al mismo mes',
                            'warning'
                        );
                    }else {
                        localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
                        localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
                        localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));

                        $('#actualizarBD').modal('show');
                        
                        conciliacionInicioConsultaRepository.getTotalAbonoCargo(
                            $scope.cuentaActual.IdBanco,
                            $scope.cuentaActual.IdEmpresa,
                            $scope.cuentaActual.Cuenta,
                            $scope.cuentaActual.CuentaContable,
                            $scope.fechaElaboracion,
                            $scope.fechaCorte,
                            $scope.empresaActual.polizaPago,
                            2,
                            $rootScope.userData.idUsuario,
                            $scope.tipoConsulta.value
                        ).then(function (result) { //LQMA add 06032018 idUsuario
                            $('#actualizarBD').modal('hide');
                            if (result.data.length > 0) {
                                if (result.data[0].resultado == 0) {
                                    swal(
                                        'Alto',
                                        result.data[0].mensaje,
                                        'warning'
                                    );
                                    $scope.totalesAbonosCargos = [];
                                } else {
                                    $scope.totalesAbonosCargos = result.data[0];
                                    $scope.mesActivo = result.data[0].mesActivo;
                                    localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));
                                    $rootScope.fechaHistorico = result.data[0].fecha;

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
                                            "mensaje": result.data[0].mensaje,
                                            "HistoricoId": result.data[0].idHistorico,
                                            "FechaHistoricoSave": result.data[0].fecha,
                                            "tipoConsulta": $scope.tipoConsulta.value
                                        };
                                        localStorage.setItem('paramBusqueda', JSON.stringify($scope.paramBusqueda));

                                    }, 1000);

                                    $scope.enableBottonReport = false;
                                    $scope.InfoBusqueda = true;
                                }
                            } else {
                                $scope.totalesAbonosCargos = [];
                                $scope.enableBottonReport = true;
                            }
                        });

                        conciliacionInicioConsultaRepository.getGerenteContador($rootScope.userData.idUsuario, $scope.cuentaActual.IdEmpresa).then(function (result) {
                            if (result.data.length > 0) {
                                $scope.contadorGerente = result.data;
                            }
                        });
                    }
                }

            } else {
                $scope.activaBotonBuscar = true;
                
                localStorage.setItem('cuentaActualInMemory', JSON.stringify($scope.cuentaActual));
                localStorage.setItem('empresaActualInMemory', JSON.stringify($scope.empresaActual));
                localStorage.setItem('bancoActualInMemory', JSON.stringify($scope.bancoActual));
                $scope.fechaElaboracion = JSON.parse(localStorage.getItem('paramBusqueda')).fechaElaboracion.substr(0, 10);
                $scope.fechaCorte = JSON.parse(localStorage.getItem('paramBusqueda')).fechaCorte.substr(0, 10);
                $scope.fechaElaboracionCombo = parseInt( JSON.parse(localStorage.getItem('paramBusqueda')).fechaElaboracion.substr(6, 1) );
              
                const monthNamesFoto = [
                    {value: '20180101', nombre:"Enero"}, 
                    {value: '20180201', nombre:"Febrero"}, 
                    {value: '20180301', nombre:"Marzo"}, 
                    {value: '20180401', nombre:"Abril"}, 
                    {value: '20180501', nombre:"Mayo"}, 
                    {value: '20180601', nombre:"Junio"},
                    {value: '20180701', nombre:"Julio"}, 
                    {value: '20180801', nombre:"Agosto"}, 
                    {value: '20180901', nombre:"Septiembre"}, 
                    {value: '20181001', nombre:"Octubre"}, 
                    {value: '20181101', nombre:"Noviembre"}, 
                    {value: '20181201', nombre:"Diciembre"}];
                $scope.mesActual = monthNamesFoto[ $scope.fechaElaboracionCombo -1 ];
                conciliacionInicioConsultaRepository.getTotalAbonoCargo(
                    $scope.bancoId,
                    $scope.empresaId,
                    $scope.cuentaNumerica,
                    $scope.cuentaContable,
                    $scope.fechaElaboracion,
                    $scope.fechaCorte,
                    $scope.polizaPagos,
                    2,
                    $rootScope.userData.idUsuario,
                    $scope.tipoConsultaH
                ).then(function (result) { //LQMA add 06032018 idUsuario
                    $('#actualizarBD').modal('hide');
                    //localStorage.setItem( 'dataSearch', JSON.parse(result.data[0]) );
                    if (result.data.length > 0) {
                        $scope.totalesAbonosCargos = result.data[0];
                        $scope.mesActivo = result.data[0].mesActivo;
                        localStorage.setItem('dataSearch', JSON.stringify($scope.totalesAbonosCargos));
                        $rootScope.fechaHistorico = result.data[0].fecha;
                        //Mensaje de alerta que corrobora la disponibilidad para conciliar registro del mes consultado

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
                                "mensaje": result.data[0].mensaje,
                                "HistoricoId": result.data[0].idHistorico,
                                "FechaHistoricoSave": result.data[0].fecha,
                                "tipoConsulta": $scope.tipoConsultaH
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

                conciliacionInicioConsultaRepository.getGerenteContador($rootScope.userData.idUsuario, $scope.empresaId).then(function (result) {
                    if (result.data.length > 0) {
                        $scope.contadorGerente = result.data;
                    }
                });
            }

        localStorage.removeItem('comeBackConsulta');
    }

    $scope.setCuenta = function (cuenta) {
        $scope.bancariaCuenta = cuenta.Cuenta;
        $scope.contableCuenta = cuenta.CuentaContable;
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

    $scope.generarLoading = function(){
        console.log( 'Loading...' );
        $('#loading').modal('show');
        setTimeout(function(){
            if( JSON.parse(localStorage.getItem('DetalleDiferencias') ==  null )){
                setTimeout(function(){
                    $scope.generarLoading();
                },5000);
            }else{
                $scope.generaInfoReport();
            }
        },2000);
    };


    $scope.generaInfoReport = function () {
        console.log( 'GO!' );
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $('#loading').modal('show');

        setTimeout(function () {

            //Obtengo los datos de detalles/diferencias del local storage
            var detalleDiferencias = JSON.parse(localStorage.getItem('DetalleDiferencias'));
            console.log(detalleDiferencias);
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
                conciliacionInicioConsultaRepository.getReporteTesoreria(jsonData).then(function (result) {
                    var file = new Blob([result.data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    $scope.rptResumenConciliacion = $sce.trustAsResourceUrl(fileURL);
                    $('#loading').modal('hide');
                    $('#reproteModalPdf').modal('show');
                });
            });
        }, 4000)
    };

    $scope.go = function (path) {
        if (!$scope.enableBottonReport) {
            $location.path(path);
        }
    };

    //********************************************Luis Antonio Garcia Perrusquia***********************************

    $scope.getHistorico = function () {
        conciliacionInicioConsultaRepository.getHistorico( $rootScope.userData, $scope.empresaId, $scope.bancoId, $scope.contableCuenta, $scope.bancariaCuenta )
        .then(function(result){
        });
    };

    //********************************************Luis Antonio Garcia Perrusquia***********************************

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
