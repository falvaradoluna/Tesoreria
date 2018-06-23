registrationModule.controller('conciliacionDetalleRegistroController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository, $filter, utils) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $rootScope.showBotones = JSON.parse(localStorage.getItem('ShowBtns'));
    $rootScope.paramsSaveHistori = JSON.parse(localStorage.getItem('paramBusqueda'));
    $scope.nodoPadre = [];
    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.auxiliarPadre = '';
    $scope.detallePunteo = '';
    $scope.detallePunteoBanco = '';
    i18nService.setCurrentLang('es'); //Para seleccionar el idioma  
    $scope.infReporte = '';
    $scope.jsonData = '';
    $scope.ruta = '';
    $scope.clabe = '';
    $scope.datosPunteo = '';
    $scope.accionElimina = 0;
    $scope.bancoDPI = '';
    $scope.auxiliarDPI = '';
    $scope.difMonetaria = 0;
    $scope.mesActivo = false;
    $scope.guardaDisable = false;

    //**************Variables para paginación**********************************
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.pages = [];
    //*************************************************************************
    // INICIA 
    //****************************************************************************************************
    $scope.init = function() {
        variablesLocalStorage();
        $scope.showBtns();
        $rootScope.mostrarMenu = 1;
        $scope.DameLaFechaHora();
        setTimeout(function() {
            $(".cargando").remove();
        }, 1500);
    };
    var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.idEmpresa = $scope.busqueda.IdEmpresa;
        $scope.difMonetaria = $scope.busqueda.DiferenciaMonetaria;
        $scope.cuenta = $scope.busqueda.CuentaContable;
        $scope.idBanco = $scope.busqueda.IdBanco;
        $scope.nombreEmpresa = $scope.busqueda.Empresa;
        $scope.cuentaBanco = $scope.busqueda.Cuenta;
        $scope.nombreBanco = $scope.busqueda.Banco;
        $scope.nombreGerente = $scope.busqueda.gerente;
        $scope.nombreContador = $scope.busqueda.contador;

        if ($scope.busqueda.MesActivo != 1) {
            $scope.mesActivo = true
        } else {
            $scope.mesActivo = true;
        }

    };

    // INICIA consigue los detalles de los punteos
    //****************************************************************************************************

    $rootScope.NohayPdf = undefined;

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";
    $scope.mostrar = 0;
    $scope.dayDataCollapseFn = function() {
        $scope.dayDataCollapse = [];
        for (var i = 0; i < $scope.detalleContable.length; i += 1) {
            $scope.dayDataCollapse.push(false);
        }
    };


    $scope.selectTableRow = function(index, storeId) {
        if (typeof $scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapseFn();
        }
        /////Obtener pdf
        $scope.buscaRecibos(storeId.tipoPoliza, storeId.anio, storeId.mes, storeId.poliza, storeId.idEmpresa);
        if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
            $scope.tableRowIndexExpandedPrev = "";
            $scope.tableRowExpanded = true;
            $scope.tableRowIndexExpandedCurr = index;
            $scope.storeIdExpanded = storeId;
            $scope.dayDataCollapse[index] = true;
        } else if ($scope.tableRowExpanded === true) {
            if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === storeId) {
                $scope.tableRowExpanded = false;
                $scope.tableRowIndexExpandedCurr = "";
                $scope.storeIdExpanded = "";
                $scope.dayDataCollapse[index] = false;
            } else {
                $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                $scope.tableRowIndexExpandedCurr = index;
                $scope.storeIdExpanded = storeId;
                $scope.dayDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
                $scope.dayDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
            }
        }

    };

    $scope.buscaRecibos = function(tipo, anio, mes, folio, idEmpresa) {

        var folioEmpresaSucursal = ''
        var arregloBytes = [];
        $rootScope.pdf = [];
        $scope.contador = 1;

        var param = {

            tipo: tipo,
            anio: anio,
            mes: mes,
            folio: folio,
            idEmpresa: idEmpresa
        }
        console.log('Entre a busqueda por numero de factura', $scope.folio + '/' + $scope.empresa + '/' + $scope.sucursal);
        conciliacionDetalleRegistroRepository.getArchivoPdf(param).then(function(result) {
            console.log(result);
            arregloBytes = result.data.arrayBits;
            console.log(arregloBytes, 'Solo los arreglos');
            if (arregloBytes.length == 0) {
                $rootScope.NohayPdf = 1;
            } else {
                $rootScope.NohayPdf = undefined;
                $rootScope.pdf = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/pdf"));
            }
            //$scope.pdf[key] = URL.createObjectURL(utils.b64toBlob(value, "application/pdf"));
            // $('#reciboCaja').modal('show');


            setTimeout(function() {

                $("<object class='filesInvoce' data='" + $scope.pdf + "' width='100%' height='500px' >").appendTo('#pdfArchivo');

            }, 100);
            $('#loading').modal('hide');


            console.log($scope.pdf, 'Soy el arreglo ')

        });


    };
    $scope.verDetallePunteo = function(detallepunteo, opcion) {
        $rootScope.NohayPdf = undefined;
        conciliacionDetalleRegistroRepository.detallePunteo(detallepunteo).then(function(result) {
            $('#punteoDetalle').modal('show');
            $rootScope.detalleBanco = result.data[0];
            $rootScope.detalleContable = result.data[1];
        });
    };

    $scope.verDetallePunteoRef = function(detallepunteo, opcion) {
        $rootScope.NohayPdf = undefined;
        conciliacionDetalleRegistroRepository.detallePunteo(detallepunteo).then(function(result) {
            $('#punteoDetalle').modal('show');
            $rootScope.detalleBanco = result.data[0];
            $rootScope.detalleContable = result.data[1];
            // $('#punteoDetalleRef').modal('show');
            // $scope.detalleBancoRef = result.data[0];
            // $scope.detalleContableRef = result.data[1];
        });
    };

    //****************************************************************************************************
    // INICIA funcion para mostrar el total de cargos y abonos en la modal de Detalle punteo
    //****************************************************************************************************
    $scope.calculaTotal = function(detallePunteo, detallePunteoBanco) {
        $scope.abonoTotalBanco = 0;
        $scope.cargoTotalBanco = 0;
        $scope.abonoTotalAuxiliar = 0;
        $scope.cargoTotalAuxiliar = 0;

        angular.forEach(detallePunteo, function(value, key) {

            $scope.abonoTotalAuxiliar += value.abono;
            $scope.cargoTotalAuxiliar += value.cargo;


        });
        angular.forEach(detallePunteoBanco, function(value, key) {

            $scope.abonoTotalBanco += value.abonoBanco;
            $scope.cargoTotalBanco += value.cargoBanco;

        });

    };
    //****************************************************************************************************

    //****************************************************************************************************
    // INICIA funcion para mostrar el total de cargos y abonos en la modal de Detalle punteo
    //****************************************************************************************************
    $scope.showBtns = function() {

    };
    //****************************************************************************************************

    //Inicia la función que me retorna la fecha y hora actual
    //****************************************************************************************************
    $scope.DameLaFechaHora = function() {
        /////////////////////////////////////////////////////////////////////////////Obtiene la fecha actual   
        var hora = new Date()
        var hrs = hora.getHours();
        var min = hora.getMinutes();
        var hoy = new Date();
        var m = new Array();
        var d = new Array()
        var an = hoy.getFullYear();
        m[0] = "Enero";
        m[1] = "Febrero";
        m[2] = "Marzo";
        m[3] = "Abril";
        m[4] = "Mayo";
        m[5] = "Junio";
        m[6] = "Julio";
        m[7] = "Agosto";
        m[8] = "Septiembre";
        m[9] = "Octubre";
        m[10] = "Noviembre";
        m[11] = "Diciembre";

        $scope.FechahoraActual = hoy.getDate() + " " + m[hoy.getMonth()] + " " + "del" + " " + an;
        /////////////////////////////////////////////////////////////////////////////////////////////

        if (!document.layers && !document.all && !document.getElementById)

            return

        var Digital = new Date()
        var hours = Digital.getHours()
        var minutes = Digital.getMinutes()
        var seconds = Digital.getSeconds()

        var dn = "PM"
        if (hours < 12)
            dn = "AM"
        if (hours > 12)
            hours = hours - 12
        if (hours == 0)
            hours = 12

        if (minutes <= 9)
            minutes = "0" + minutes
        if (seconds <= 9)
            seconds = "0" + seconds

        myclock = hours + ":" + minutes + ":" + seconds + " " + dn;
        if (document.layers) {
            document.layers.liveclock.document.write(myclock)
            document.layers.liveclock.document.close()
        } else if (document.getElementById)
            document.getElementById("liveclock").innerHTML = myclock
        setTimeout($scope.DameLaFechaHora, 1000);
    }


    //****************************************************************************************************

    //LAGP
    $scope.guardarHistorico = function() {
        $scope.guardaDisable = true;
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.guardarHistorico(
                $rootScope.userData.idUsuario,
                $rootScope.paramsSaveHistori.IdBanco,
                $rootScope.paramsSaveHistori.IdEmpresa,
                $rootScope.paramsSaveHistori.Cuenta,
                $rootScope.paramsSaveHistori.CuentaContable,
                $rootScope.paramsSaveHistori.fechaElaboracion,
                $rootScope.paramsSaveHistori.fechaCorte,
                $rootScope.paramsSaveHistori.PolizaPago,
                1,
            )
            .then(function(result) {
                if (result.data[1][0].estatus == 0) {
                    swal(
                        'Listo',
                        result.data[1][0].mensaje,
                        'success'
                    );
                    $scope.guardaDisable = false;
                    $('#loading').modal('hide');
                } else {
                    swal(
                        'Listo',
                        result.data[1][0].mensaje,
                        'success'
                    );
                    $scope.guardaDisable = true;
                    $('#loading').modal('hide');
                }
            });

    };

    $scope.grupoDPI = 0;
    $scope.alertaEliminaDPI = function(dpi) {
        $scope.grupoDPI = dpi;
        $('#alertaEliminacionDPI').modal('show');
    };

    $scope.closeDPI = function() {
        $scope.grupoDPI = 0;
        $('#alertaEliminacionDPI').modal('hide');
    }

    $scope.cancelaDPI = function() {
        conciliacionDetalleRegistroRepository.getCancelaDPI($scope.grupoDPI).then(function(result) {
            location.reload();
        });
    }

});