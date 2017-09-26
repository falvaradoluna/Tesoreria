registrationModule.controller('conciliacionDetalleRegistroGetGridsController',function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter){

     //Declaracion de variables locales
     $scope.bancoReferenciadosAbonos = '';
     $scope.bancoReferenciadosCargos = '';
     $scope.contableReferenciados= '';
     $scope.BancoReferenciadoCargos = '';
     $scope.cargoTotal = 0;
     $scope.cargoActual = 0;

$scope.init = function() {
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
        $scope.getBancoDPI($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
        $scope.bancoReferenciados();
        $scope.contablesReferenciados($scope.polizaPago);
        //Elimino la información almacenada de consultas anteriores, limpio las variables locales para estos elementos
        localStorage.removeItem('infoGridAuxiliar');
        localStorage.removeItem('infoGridBanco');
        localStorage.removeItem('totalesGrids');
    };
    
    var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.polizaPago = $scope.busqueda.PolizaPago;
    };

     // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************
    $scope.getAuxiliarPunteo = function(idempresa, cuenta) {

        conciliacionDetalleRegistroRepository.getAuxiliarPunteo(idempresa, cuenta).then(function(result) {
            $scope.auxiliarPadre = result.data;
            localStorage.setItem('auxiliarPadre', JSON.stringify($scope.auxiliarPadre));
            $scope.tabla('auxiliarPunteo');
        });
    };
    //****************************************************************************************************

    // INICIA Obtengo los padres del Banco punteado
    //****************************************************************************************************
    $scope.getBancoPunteo = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, cuentaBanco).then(function(result) {
            $scope.bancoPadre = result.data;
            localStorage.setItem('bancoPadre', JSON.stringify($scope.bancoPadre));
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
        $scope.bancoReferenciadosAbonos = $filter('filter')(result.data, function(value){
            return value.tipoMovimiento == 0;
        });
        $scope.bancoReferenciadosCargos = $filter('filter')(result.data,function(value){
            return value.tipoMovimiento == 1;
        });
        $scope.tabla('bancoReferenciadoAbono');
        $scope.tabla('bancoReferenciadoCargo');
      });
    };
    //****************************************************************************************************
    
    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.contablesReferenciados = function(polizaPago){
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, $scope.busqueda.fechaCorte, polizaPago, $scope.busqueda.IdEmpresa).then(function(result) {
        $scope.contableReferenciados = result.data;
        $scope.tabla('contableRef');
      });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
    $scope.detalleRegistrosReferenciados = function(registroConciliado, tipoRegistro){         //Indica: 1 es cargo, 0 es Abono
      conciliacionDetalleRegistroRepository.getDetalleRelacion(registroConciliado.refAmpliada, tipoRegistro, $scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.polizaPago).then(function(result){
            $scope.datoBancarioActual = registroConciliado;
            $scope.cargoActual = $scope.datoBancarioActual.cargo;
            $scope.abonoTotal = 0;
            if(tipoRegistro == 1)
            {
               $scope.BancoReferenciadoCargos = result.data;
               
            angular.forEach($scope.BancoReferenciadoCargos, function(value, key) {
            $scope.abonoTotal += value.abono;
            });

               $('#DetalleRelacionCargos').modal('show');
            }
            else if(tipoRegistro == 0)
            {

                alertFactory.error('Función no disponible');
            }

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