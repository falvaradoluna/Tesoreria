registrationModule.controller('conciliacionDetalleRegistroGetGridsController',function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter){

     //Declaracion de variables locales
     $scope.bancoReferenciadosAbonos = '';
     $scope.bancoReferenciadosCargos = '';
     $scope.contableReferenciadosAbonos = '';
     $scope.contableReferenciadosCargos = '';
     $scope.BancoReferenciadoCargos = '';
     $scope.BancoReferenciadoAbonos = '';
     $scope.AuxiliarPunteado = '';
     $scope.BancoPunteado = '';
     $scope.cargoActual = 0;
     $scope.abonoActual = 0;

     //Detalle Abono
     $rootScope.detalleAbono = [];
     $rootScope.detalleAbonoPadre = [];
     $rootScope.abonoTotalBanco;
     $rootScope.abonoTotalBancoSuma;

     //Cargos bancario
     $rootScope.registrosBancariosCargos = [];
     $rootScope.detalleRegistrosBancariosCargos = [];
     $rootScope.detalleRegistrosBancariosCargosTotal;
     $rootScope.detalleRegistrosBancariosCargosFecha;
     $rootScope.detalleRegistrosBancariosCargostipoPoliza;
     $rootScope.detalleRegistrosBancariosCargosnumeroCuenta;
     $rootScope.detalleRegistrosBancariosCargosnumeroCuenta;
     $rootScope.detalleRegistrosBancariosCargosconcepto;
     $rootScope.detalleRegistrosBancariosCargosAbono;

     //Abonos bancarios
     $rootScope.registrosBancariosAbonos = [];
     $rootScope.registrosBancariosAbonosTotal;

     //Cargos contables Abonos
     $rootScope.registroCargosAbono = [];
     $rootScope.registrosCargodAbonosTotal;
     $rootScope.regCargoAbonoDetalle = [];
     $rootScope.totalHijosCargos;

     //Variables para los resultados totales de cada Grid
     $scope.bancoReferenciadosAbonosTotales = 0;
     $scope.bancoReferenciadosCargosTotales = 0;
     $scope.contableReferenciadosAbonosTotales = 0;
     $scope.contableReferenciadosCargosTotales = 0;
     $scope.BancoReferenciadoCargosTotales = 0;
     $scope.BancoReferenciadoAbonosTotales = 0;
     $scope.AuxiliarPunteadoAbonosTotales = 0;
     $scope.AuxiliarPunteadoCargosTotales = 0;
     $scope.BancoPunteadoAbonosTotales = 0;
     $scope.BancoPunteadoCargosTotales = 0;
     $scope.bancoDPITotal = 0;

    //Variables para obtener los valores para el stored de total
    $scope.busquedaUniverso = JSON.parse(localStorage.getItem("paramBusqueda")); 
    $scope.usuarioData = JSON.parse( localStorage.getItem( "ls.userData" ) );
    //$scope.universoAbono = [];
    $scope.universoContable = [];
    $scope.universoBancario = [];
    //$scope.universoBancarioCargo = [];

$scope.init = function() {
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.IdBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getBancoDPI($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
        $scope.bancoReferenciados();
        $scope.contablesReferenciados($scope.polizaPago, $scope.busqueda.Cuenta);
        $scope.getRegistrosBancariosCargos();
        $scope.getTotalUniverso();
        $scope.getTotalUniversoBancario();
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
   $scope.getAuxiliarPunteo = function(idempresa, cuenta, fechaElaboracion, fechaCorte) {

        conciliacionDetalleRegistroRepository.getAuxiliarPunteo(idempresa, cuenta, fechaElaboracion, fechaCorte).then(function(result) {
            
            $scope.auxiliarPadre = result.data;
            localStorage.setItem('auxiliarPadre', JSON.stringify($scope.auxiliarPadre));

            $scope.AuxiliarPunteado = $filter('filter')(result.data, function(value){
            return value.idEstatus == 3;
            });
           
           //Obtener la uma total de los registros
             angular.forEach($scope.AuxiliarPunteado, function(value, key) {
                    $scope.AuxiliarPunteadoAbonosTotales += value.abono;
                    });
             
             angular.forEach($scope.AuxiliarPunteado, function(value, key) {
                    $scope.AuxiliarPunteadoCargosTotales += value.cargo;
                    });

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

            $scope.BancoPunteado = $filter('filter')($scope.bancoPadre, function(value){
            return value.idPAdre == 3;
            });
           
           //Obtener la uma total de los registros
             angular.forEach($scope.BancoPunteado, function(value, key) {
                    $scope.BancoPunteadoAbonosTotales += value.abono;
                    });
             
             angular.forEach($scope.BancoPunteado, function(value, key) {
                    $scope.BancoPunteadoCargosTotales += value.cargo;
                    });


            $scope.tabla('bancoPunteo');
        });
    };
    //****************************************************************************************************

     // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoDPI(idempresa, cuentaBanco).then(function(result) {
            $scope.bancoDPI = result.data;
            //Obtener la suma total de los registros
             angular.forEach($scope.bancoDPI, function(value, key) {
                    $scope.bancoDPITotal += value.abono;
                    });
             
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

        //Obtener la uma total de los registros
             angular.forEach($scope.bancoReferenciadosAbonos, function(value, key) {
                    $scope.bancoReferenciadosAbonosTotales += value.abono;
                    });
             
             angular.forEach($scope.bancoReferenciadosCargos, function(value, key) {
                    $scope.bancoReferenciadosCargosTotales += value.cargo;
                    });
                    
      });
    };
    //****************************************************************************************************
    
    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.contablesReferenciados = function(polizaPago, cuentaBanco){
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, polizaPago, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco).then(function(result) {

        $scope.contableReferenciadosAbonos = $filter('filter')(result.data, function(value){
         return value.tipoMovimiento == 0;
        });
        $scope.contableReferenciadosCargos = $filter('filter')(result.data, function(value){
         return value.tipoMovimiento == 1;
        });
        $scope.tabla('contableRefAbonos');
        $scope.tabla('contableRefCargos');

        //Obtener la uma total de los registros
             angular.forEach($scope.contableReferenciadosAbonos, function(value, key) {
                    $scope.contableReferenciadosAbonosTotales += value.abono;
                    });
             
             angular.forEach($scope.contableReferenciadosCargos, function(value, key) {
                    $scope.contableReferenciadosCargosTotales += value.cargo;
                    });  
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
    
    //********************************* Ing. Luis Antonio García Perrusquía 27/03/2018
    // Get Registros bancarios cargos
    //*/

    $scope.getRegistrosBancariosCargos = function () {
        conciliacionDetalleRegistroRepository.getRegistrosBancariosCargos( )
        .then(function(result){
            $rootScope.registrosBancariosCargos = result.data
        });
    };

    $scope.detalleRegistrosBancariosCargosF = function ( idCargo, banco ) {
        console.log( "idCargo", idCargo );
        conciliacionDetalleRegistroRepository.detalleRegistrosBancariosCargos( idCargo )
        .then(function(result){
            
            $rootScope.detalleRegistrosBancariosCargos = result.data;
            
            if($rootScope.detalleRegistrosBancariosCargos.length > 0){
                $rootScope.detalleRegistrosBancariosCargosTotal         = result.data[0].Total;
                $rootScope.detalleRegistrosBancariosCargosFecha         = result.data[0].Fecha;
                $rootScope.detalleRegistrosBancariosCargostipoPoliza    = result.data[0].tipoPoliza;
                $rootScope.detalleRegistrosBancariosCargosconsPoliza    = result.data[0].consPoliza;
                $rootScope.detalleRegistrosBancariosCargosnumeroCuenta  = result.data[0].numeroCuenta;
                $rootScope.detalleRegistrosBancariosCargosconcepto      = result.data[0].concepto;
                $rootScope.detalleRegistrosBancariosCargosAbono         = result.data[0].Abono;
                $('#regBancariosCargoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos.');
            }
        });
        
    };
    //****************************************************************************************************

    $scope.detalleRegistrosReferenciadosContablesAbono = function (registroConciliado) {
        
        conciliacionDetalleRegistroRepository.getDetalleAbono( registroConciliado )
        .then(function(result){
            
            $rootScope.detalleAbono = result.data[0];
            $rootScope.detalleAbonoPadre = result.data[1];
            $rootScope.abonoTotalBanco = result.data[1][0].MOV_HABER;
            $rootScope.abonoTotalBancoSuma = result.data[0][0].Total;
            if($rootScope.detalleAbono.length> 0){
                $('#regContablesAbonoDetalle').modal('show');
                $rootScope.detalleAbono.forEach(function( item, key ){
                    
                });
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };
     
    $scope.detalleRegistrosBancariosAbonos = function (abonosData) {
        console.log("Si es aqui");
        $rootScope.registrosBancariosAbonos[0] = abonosData;
        $rootScope.registrosBancariosAbonosTotal = abonosData.abono;
        
        conciliacionDetalleRegistroRepository.detalleRegistrosBancariosAbonos( abonosData.IDABONOSBANCOS )
        .then(function(result){
            console.log( 'result',result );//Pendiente de llenar la tabla
            $('#regBancariosAbonoDetalle').modal('show');
            
        });
        //alertFactory.warning('Función en desarrollo...');
    };

    $scope.detalleRegistrosContablesAbonos = function (abonosData) {
        
        $rootScope.registroCargosAbono[0] = abonosData;
        $rootScope.registrosCargodAbonosTotal = abonosData.cargo;
        
        conciliacionDetalleRegistroRepository.detalleRegistrosContablesAbonos( abonosData.idAuxiliar )
        .then(function(result){
            if( result.data[1].length != 0 ){
                //console.log( "Total", result.data[1][0].importe );
                $rootScope.regCargoAbonoDetalle = result.data[1];
                $rootScope.totalHijosCargos = result.data[1][0].importe;
                console.log( 'Total', $rootScope.totalHijosCargos );
                $('#regCargoAbonoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos');
            }
           
            
        });
    };

    $scope.getTotalUniverso = function (){
        conciliacionDetalleRegistroRepository.getTotalUniverso( 
            $scope.busquedaUniverso.IdEmpresa,
            $scope.busquedaUniverso.IdBanco,
            $scope.busquedaUniverso.Cuenta,
            $scope.busquedaUniverso.CuentaContable,
            $scope.busquedaUniverso.fechaElaboracion,
            $scope.busquedaUniverso.fechaCorte,
            $scope.busquedaUniverso.PolizaPago,
            0,
            $scope.usuarioData.idUsuario
        )
        .then(function(result){
            //console.log( "resultUniverso", result );
            if( result.data.length != 0 ){
                
                /*
                for( var i = 0; i < result.data.length; i++ ){
                    if( result.data[i].tipoMovimiento == 0 ){
                        $scope.universoCargo.push( result.data[i] );
                    }else{
                        $scope.universoAbono.push( result.data[i] );
                    }
                }*/
                $scope.universoContable = result.data;

                $scope.tabla('contableUniCargo');
                $scope.tabla('contableUniAbonos');
            }else{
                alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
            }
        });
        // console.log( "getTotalAbonos" );
        // console.log( "totalAbonosContables", $scope.totalAbonosContables );
        // console.log( "usuario", $scope.usuarioData );
    }

    $scope.getTotalUniversoBancario = function (){
        conciliacionDetalleRegistroRepository.getTotalUniversoBancario( 
            $scope.busquedaUniverso.IdEmpresa,
            $scope.busquedaUniverso.IdBanco,
            $scope.busquedaUniverso.Cuenta,
            $scope.busquedaUniverso.CuentaContable,
            $scope.busquedaUniverso.fechaElaboracion,
            $scope.busquedaUniverso.fechaCorte,
            $scope.busquedaUniverso.PolizaPago,
            0,
            $scope.usuarioData.idUsuario
        )
        .then(function(result){
            console.log( "resultUniversoBancario", result );
            if( result.data.length != 0 ){
                /*
                for( var i = 0; i < result.data.length; i++ ){
                    if( result.data[i].tipoMovimiento == 0 ){
                        $scope.universoBancarioCargo.push( result.data[i] );
                    }else{
                        $scope.universoBancarioAbono.push( result.data[i] );
                    }
                }*/
                $scope.universoBancario = result.data;

                $scope.tabla('contableUniBancarioCargo');
                $scope.tabla('contableUniBancarioAbono');
            }else{
                alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
            }
        });
    }

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