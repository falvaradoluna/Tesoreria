registrationModule.controller('conciliacionDetalleRegistroGetGridsController',function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter){

$scope.init = function() {
        variablesLocalStorage();
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
        $scope.getBancoDPI($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
        $scope.bancoReferenciados();
        $scope.contablesReferenciados();
        localStorage.removeItem('infoGridAuxiliar');
        localStorage.removeItem('infoGridBanco');
    };
    
    var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
    };

     // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************
    $scope.getAuxiliarPunteo = function(idempresa, cuenta) {

        conciliacionDetalleRegistroRepository.getAuxiliarPunteo(idempresa, cuenta).then(function(result) {
            $scope.auxiliarPadre = result.data;
            $scope.tabla('auxiliarPunteo');
        });
    };
    //****************************************************************************************************

    // INICIA Obtengo los padres del Banco punteado
    //****************************************************************************************************
    $scope.getBancoPunteo = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, cuentaBanco).then(function(result) {
            $scope.bancoPadre = result.data;
            $scope.tabla('bancoPunteo');
        });
    };
    //****************************************************************************************************

     // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoDPI(idempresa, cuentaBanco).then(function(result) {
            $scope.bancoDPI = result.data;
            $scope.tabla('bancodpi');
        });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.bancoReferenciados = function() {
        conciliacionDetalleRegistroRepository.getBancosRef($scope.idBanco, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte).then(function(result) {
        $scope.bancoReferenciados = result.data;
        $scope.tabla('bancoReferenciado');
      });
    };
    //****************************************************************************************************
    
    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.contablesReferenciados = function() {
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa).then(function(result) {
        $scope.contableReferenciados = result.data;
        $scope.tabla('contableRef');
      });
    };
    //****************************************************************************************************    

// INICIA inicio la tabla para los distintos casos
    //****************************************************************************************************
    $scope.tabla = function(idtabla) {
        $('#' + idtabla).DataTable().destroy();
        setTimeout(function() {
            $('#' + idtabla).DataTable({
                destroy: true,
                "responsive": true,
                searching: false,
                paging: true,
                autoFill: true
            });
        }, 1000);
    };
    //****************************************************************************************************

});