registrationModule.controller('conciliacionDetalleRegistroController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.nodoPadre = [];
    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.auxiliarPadre = '';
    $scope.bancoPadre = '';
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
    $scope.bancoReferenciados = '';
    $scope.contableReferenciados= '';
 
    //**************Variables para paginación**********************************
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.pages = [];
    //*************************************************************************

    // INICIA 
    //****************************************************************************************************
    $scope.init = function() {
        variablesLocalStorage();
        $rootScope.mostrarMenu = 1;
        console.log($scope.busqueda);
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
    };

    // INICIA consigue los detalles de los punteos
    //****************************************************************************************************
    $scope.verDetallePunteo = function(detallepunteo,opcion) {
        var accionBusqueda = 0;
        var datoBusqueda = '';
        if(opcion == 1){
            datoBusqueda = detallepunteo.idDepositoBanco;
            accionBusqueda = 1;
        } else { 
           datoBusqueda = detallepunteo.idAuxiliarContable;
           accionBusqueda = 2;
        }
        conciliacionDetalleRegistroRepository.detallePunteo(datoBusqueda, accionBusqueda).then(function(result) {
            $('#punteoDetalle').modal('show');

                $scope.detallePunteo = result.data[0];
                $scope.detallePunteoBanco = result.data[1]; 
                if(result.data.length > 0){
                $scope.calculaTotal($scope.detallePunteo, $scope.detallePunteoBanco);
                datoBusqueda = '';
            }
            else{
                alertFactory.error('No existen punteos en este detalle')
            }
            
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
    // INICIA Se genera modal de alerta para que el usuario acepte o rechace generar el punteo definitivo
    //****************************************************************************************************
    $scope.generaAlertaPunteo = function() {
        if ($scope.bancoPadre.length > 0 || $scope.auxiliarPadre.length > 0) {
            $('#alertaPunteo').modal('show');
        } else {
            alertFactory.error('No existen punteos')
        }
    };
    //****************************************************************************************************

    

    // INICIA Se guarda el punteo que ya no podra ser modificado
    //****************************************************************************************************
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo($scope.idEmpresa, $scope.idBanco, $scope.cuenta, $scope.cuentaBanco).then(function(result) {
            console.log(result.data[0].idEstatus)
            $('#alertaPunteo').modal('hide');
            if(result.data[0].idEstatus==1){
                alertFactory.success(result.data[0].Descripcion)
            }else if(result.data[0].idEstatus==0){
                alertFactory.error(result.data[0].Descripcion)
            }
            $scope.getGridTablas();
        });
    };

});
