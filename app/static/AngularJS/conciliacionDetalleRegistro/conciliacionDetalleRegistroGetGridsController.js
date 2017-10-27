registrationModule.controller('conciliacionDetalleRegistroGetGridsController',function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter){

     //Declaracion de variables locales
     $scope.bancoReferenciadosAbonos = '';
     $scope.bancoReferenciadosCargos = '';
     $scope.contableReferenciadosAbonos = '';
     $scope.contableReferenciadosCargos = '';
     $scope.BancoReferenciadoCargos = '';
     $scope.BancoReferenciadoAbonos = '';
     $scope.cargoActual = 0;
     $scope.abonoActual = 0;

$scope.init = function() {
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.IdBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
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
    $scope.getBancoPunteo = function(idempresa, cuentaBanco, idBanco, fechaElaboracion, fechaCorte) {

        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, cuentaBanco, idBanco, fechaElaboracion, fechaCorte).then(function(result) {
            $scope.bancoPadre = result.data;
            localStorage.setItem('bancoPadre', JSON.stringify($scope.bancoPadre));
            $scope.tabla('bancoPunteo');
        });
    };
    //****************************************************************************************************

     // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function(idempresa, cuentaBanco, fechaElaboracion, fechaCorte) {

        conciliacionDetalleRegistroRepository.getBancoDPI(idempresa, cuentaBanco, fechaElaboracion, fechaCorte).then(function(result) {
            $scope.bancoDPI = result.data;
            $scope.tabla('bancodpi');
        });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.bancoReferenciados = function() {
        conciliacionDetalleRegistroRepository.getBancosRef($scope.idBanco, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa).then(function(result) {
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
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, $scope.busqueda.fechaCorte, polizaPago, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco).then(function(result) {
        $scope.contableReferenciadosAbonos = $filter('filter')(result.data, function(value){
         return value.tipoMovimiento == 0;
        });
        $scope.contableReferenciadosCargos = $filter('filter')(result.data, function(value){
         return value.tipoMovimiento == 1;
        });
        $scope.tabla('contableRefAbonos');
        $scope.tabla('contableRefCargos');
      });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
    $scope.detalleRegistrosReferenciadosBancos = function(registroConciliado){
        $('#loading').modal('show');
             
                                                                                                    /*  Números identificadores para el tipo de referencia de cada registro Bancario "ABONOS - CARGOS"
                                                                                                        1 Corresponde a depositos Bancarios (Abonos) referenciados (Directos)
                                                                                                        2 Corresponde a depositos BANCARIOS (Abonos) referenciados (Control de depositos)
                                                                                                        3 Corresponde a depositos Bancarios (Cargos) referenciados
                                                                                                        4 Corresponde a depositos Bancarios (Cargos) referenciados (Comisiones)*/
            conciliacionDetalleRegistroRepository.getDetalleRelacion(registroConciliado.refAmpliada, registroConciliado.tipoReferencia, $scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.polizaPago, $scope.busqueda.Cuenta, registroConciliado.idBmer).then(function(result){
            $scope.datoBancarioActual = registroConciliado;
            
            $scope.abonoTotal = 0;
            $scope.cargoTotal = 0;
            if(registroConciliado.tipoReferencia >= 3)
            {
             if(registroConciliado.tipoReferencia == 3)
             {
                    if(result.data.length > 0){
                    $('#loading').modal('hide');
                   $scope.cargoActual = $scope.datoBancarioActual.cargo;
                   $scope.BancoReferenciadoCargos = result.data;
                   
                    angular.forEach($scope.BancoReferenciadoCargos, function(value, key) {
                    $scope.abonoTotal += value.abono;
                    });

                       $('#DetalleRelacionCargos').modal('show');
                       }
                else{
                    alertFactory.warning('No existe relación para este registro');
                }
              }
              else if(registroConciliado.tipoReferencia == 4)
              {
                $('#loading').modal('hide');
                alertFactory.warning('Función en desarrollo ...');
              }
            }
            else if(registroConciliado.tipoReferencia < 3)
            {
                if(result.data.length > 0){
                $('#loading').modal('hide');
                $scope.abonoActual = $scope.datoBancarioActual.abono;
                $scope.BancoReferenciadoAbonos = result.data;
                
                angular.forEach($scope.BancoReferenciadoAbonos, function(value, key) {
                $scope.cargoTotal += value.cargo;
                });

                $('#DetalleRelacionAbonos').modal('show');
            }
            else{
                alertFactory.warning('No existe relación para este registro');
            }
            }

      });
    };    
    //****************************************************************************************************

    $scope.detalleRegistrosReferenciadosContables = function(registroConciliado){
     
     alertFactory.warning('Función en desarrollo...');

    };


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