﻿registrationModule.controller('conciliacionDetalleRegistroGetGridsController',function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter){

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
     $rootScope.regBancariosAbonoDetalle = [];

     //Cargos contables Abonos
     $rootScope.registroCargosAbono = [];
     $rootScope.registrosCargodAbonosTotal;
     $rootScope.regCargoAbonoDetalle = [];
     $rootScope.totalHijosCargos;
     $rootScope.esCargo;

     //Variables para los resultados totales de cada Grid
     $rootScope.bancoReferenciadosAbonosTotales = 0;
     $rootScope.bancoReferenciadosCargosTotales = 0;
     $scope.contableReferenciadosAbonosTotales = 0;
     $scope.contableReferenciadosCargosTotales = 0;
     $scope.BancoReferenciadoCargosTotales = 0;
     $scope.BancoReferenciadoAbonosTotales = 0;
     $rootScope.AuxiliarPunteadoAbonosTotales = 0;
     $rootScope.AuxiliarPunteadoCargosTotales = 0;
     $rootScope.BancoPunteadoAbonosTotales = 0;
     $rootScope.BancoPunteadoCargosTotales = 0;
     $scope.bancoDPITotal = 0;

    //Variables para obtener los valores para el stored de total
    $scope.busquedaUniverso = JSON.parse(localStorage.getItem("paramBusqueda")); 
    $scope.usuarioData = JSON.parse( localStorage.getItem( "ls.userData" ) );
    //$scope.universoAbono = [];
    $scope.universoContable = [];
    $scope.universoBancario = [];
    $rootScope.universoTotalMovimientoContableCargo = 0;
    $rootScope.universoTotalMovimientoContableAbono = 0;
    $rootScope.universoTotalMovimientoBancarioCargo = 0;
    $rootScope.universoTotalMovimientoBancarioAbono = 0;
    //$scope.universoBancarioCargo = [];

    //Variables PrePunteado
    $rootScope.BancoPrePunteadoCargosTotales = 0;
    $rootScope.BancoPrePunteadoAbonosTotales = 0;
    $rootScope.AuxiliarPrePunteadoCargosTotales = 0;
    $rootScope.AuxiliarPrePunteadoAbonosTotales = 0;
    

$scope.init = function() {
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();
        console.log( 'paramsBusqueda', $scope.busqueda );
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        //$scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.IdBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.busqueda.Cuenta, $scope.busqueda.CuentaContable);
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
    
    $scope.verDetallePunteoGet = function (detallepunteo, opcion) {
        console.log('grupoGET', detallepunteo);
        conciliacionDetalleRegistroRepository.detallePunteo(detallepunteo).then(function (result) {
            $('#punteoDetalleGet').modal('show');
            $rootScope.detalleBancoGet = result.data[0];
            $rootScope.detalleContableGet = result.data[1];
            console.log( 'detalleBancoGet', $rootScope.detalleBancoGet );
            console.log( 'detalleContableGet', $rootScope.detalleContableGet );
            console.log( 'result', result.data );
        });
    };

     // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************
   $scope.getAuxiliarPunteo = function(idempresa, cuenta, fechaElaboracion, fechaCorte) {
        // conciliacionDetalleRegistroRepository.getAuxiliarPunteo(idempresa, cuenta, fechaElaboracion, fechaCorte).then(function(result) {
            
        //     $scope.auxiliarPadre = result.data;
        //    // localStorage.setItem('auxiliarPadre', JSON.stringify($scope.auxiliarPadre));
        //     $scope.AuxiliarPunteado = $filter('filter')(result.data, function(value){
        //     return value.idEstatus == 3;
        //     });
            
        //    //Obtener la uma total de los registros
        //     // angular.forEach($scope.AuxiliarPunteado, function (value, key) {
        //     //     $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
        //     // });

        //     // angular.forEach($scope.AuxiliarPunteado, function (value, key) {
        //     //     $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
        //     // });

        //     if( $rootScope.AuxiliarPunteadoAbonosTotales == 0 && $rootScope.AuxiliarPunteadoCargosTotales == 0 ){
        //         angular.forEach(result.data, function( value, key ){
        //             if( value.idPunteoFinalBancos == 3 ){
        //                 $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
        //                 $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
        //             }
        //         });
        //     }
            

        //     $scope.tabla('auxiliarPunteo');
        // });
        // $scope.conteoAuxiliar++;
    };
    //****************************************************************************************************
    //Ing. Luis Antonio Garcia Perrusquia
    $scope.getBancoPunteo = function (idempresa, idBanco, noCuenta, CuentaContable) {
        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, idBanco, noCuenta, CuentaContable).then(function (result) {

            $scope.bancoPadre = result.data[0];
            $scope.auxiliarPadre = result.data[1];
            console.log( 'todoResult', result );
            localStorage.setItem('bancoPadre', JSON.stringify($scope.bancoPadre));
            localStorage.setItem('auxiliarPadre', JSON.stringify($scope.auxiliarPadre));

            $scope.BancoPunteado = $filter('filter')($scope.bancoPadre, function (value) {
                return value.idPAdre == 3;
            });
            

            //Suma de los que estan prepumteados BANCOS
            if ($rootScope.BancoPrePunteadoAbonosTotales == 0 && $rootScope.BancoPrePunteadoCargosTotales == 0) {
                angular.forEach(result.data[0], function (value, key) {
                    if (value.aplicado == 0) {
                        $rootScope.BancoPrePunteadoAbonosTotales += value.abono;
                        $rootScope.BancoPrePunteadoCargosTotales += value.cargo;
                    }
                });
            };
            //Suma de los que ya estan prepunteados CARGOS
            if ($rootScope.AuxiliarPrePunteadoAbonosTotales == 0 && $rootScope.AuxiliarPrePunteadoCargosTotales == 0) {
                angular.forEach(result.data[1], function (value, key) {
                    if (value.aplicado == 0) {
                        console.log( 'value', value );
                        $rootScope.AuxiliarPrePunteadoAbonosTotales += value.abono;
                        $rootScope.AuxiliarPrePunteadoCargosTotales += value.cargo;
                    }
                });
            };

            //Suma de los que ya estan punteados BANCOS
            if ($rootScope.BancoPunteadoAbonosTotales == 0 && $rootScope.BancoPunteadoCargosTotales == 0) {
                angular.forEach(result.data[0], function (value, key) {
                    if (value.aplicado == 1) {
                        $rootScope.BancoPunteadoAbonosTotales += value.abono;
                        $rootScope.BancoPunteadoCargosTotales += value.cargo;
                    }
                });
            };
            //Suma de los que ya estan punteados CARGOS
            if ($rootScope.AuxiliarPunteadoAbonosTotales == 0 && $rootScope.AuxiliarPunteadoCargosTotales == 0) {
                angular.forEach(result.data[1], function (value, key) {
                    if (value.aplicado == 1) {
                        $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
                        $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
                    }
                });
            };

            $scope.tabla('bancoPunteo');
        });
    };

    // INICIA Obtengo los padres del Banco punteado
    //****************************************************************************************************
     /*$scope.getBancoPunteo = function(idempresa, cuentaBanco, idBanco, fechaElaboracion, fechaCorte) {
        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, cuentaBanco, idBanco, fechaElaboracion, fechaCorte).then(function(result) {
            $scope.bancoPadre = result.data;
            localStorage.setItem('bancoPadre', JSON.stringify($scope.bancoPadre));
            
            $scope.BancoPunteado = $filter('filter')($scope.bancoPadre, function(value){
            return value.idPAdre == 3;
            });
            
           //Obtener la uma total de los registros
            // angular.forEach($scope.BancoPunteado, function (value, key) {
            //     $rootScope.BancoPunteadoAbonosTotales += value.abono;
            // });

            // angular.forEach($scope.BancoPunteado, function (value, key) {
            //     $rootScope.BancoPunteadoCargosTotales += value.cargo;
            // });

            if( $rootScope.BancoPunteadoAbonosTotales == 0 && $rootScope.BancoPunteadoCargosTotales == 0 ){
                angular.forEach(result.data, function( value, key ){
                    if(value.idPunteoFinalBancos == 3){
                        $rootScope.BancoPunteadoAbonosTotales += value.abono;
                        $rootScope.BancoPunteadoCargosTotales += value.cargo;
                    }
                });
            }
            
            $scope.tabla('bancoPunteo');
        });
    };*/
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
    $scope.bancoReferenciados = function () {
        conciliacionDetalleRegistroRepository.getBancosRef($scope.idBanco, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa).then(function (result) {

            // $scope.bancoReferenciadosAbonos = $filter('filter')(result.data, function (value) {
            //     return value.tipoMovimiento == 0;
            // });

            // $scope.tablaSearch('bancoReferenciadoAbono');
            // $scope.tablaSearch('bancoReferenciadoCargo');
            //Obtener la uma total de los registros
            

            // angular.forEach($scope.bancoReferenciadosAbonos, function (value, key) {
            //     $scope.bancoReferenciadosAbonosTotales += value.abono;
            // });
        });
    };

    

    $scope.getRegistrosBancariosCargos = function () {
        conciliacionDetalleRegistroRepository.getRegistrosBancariosCargos()
        .then(function (result) {
            // $rootScope.registrosBancariosCargos = result.data
            // if ($rootScope.bancoReferenciadosCargosTotales == 0) {
            //     angular.forEach(result.data, function (value, key) {
            //         $rootScope.bancoReferenciadosCargosTotales += value.importe;
            //     });
            // }
        });
    };
    //****************************************************************************************************
    
    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.contablesReferenciados = function(polizaPago, cuentaBanco){
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte, polizaPago, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco).then(function(result) {

    //     $scope.contableReferenciadosAbonos = $filter('filter')(result.data, function(value){
    //      return value.tipoMovimiento == 0;
    //     });
    //     $scope.contableReferenciadosCargos = $filter('filter')(result.data, function(value){
    //      return value.tipoMovimiento == 1;
    //     });
    //     $scope.tablaSearch('contableRefAbonos');
    //     $scope.tablaSearch('contableRefCargos');

    //     //Obtener la uma total de los registros
    //          angular.forEach($scope.contableReferenciadosAbonos, function(value, key) {
    //                 $scope.contableReferenciadosAbonosTotales += value.abono;
    //                 });
             
    //          angular.forEach($scope.contableReferenciadosCargos, function(value, key) {
    //                 $scope.contableReferenciadosCargosTotales += value.cargo;
    //                 });  
      });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
    $scope.detalleRegistrosReferenciadosBancos = function (registroConciliado) {

        $('#loading').modal('show');

        /*  Números identificadores para el tipo de referencia de cada registro Bancario "ABONOS - CARGOS"
            1 Corresponde a depositos Bancarios (Abonos) referenciados (Directos)
            2 Corresponde a depositos BANCARIOS (Abonos) referenciados (Control de depositos)
            3 Corresponde a depositos Bancarios (Cargos) referenciados
            4 Corresponde a depositos Bancarios (Cargos) referenciados (Comisiones)*/
        conciliacionDetalleRegistroRepository.getDetalleRelacion(registroConciliado.refAmpliada, registroConciliado.tipoReferencia, $scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.polizaPago, $scope.busqueda.Cuenta, registroConciliado.idBmer).then(function (result) {
            $scope.datoBancarioActual = registroConciliado;

            $scope.abonoTotal = 0;
            $scope.cargoTotal = 0;
            if (registroConciliado.tipoReferencia >= 3) {
                if (registroConciliado.tipoReferencia == 3) {
                    if (result.data.length > 0) {
                        $('#loading').modal('hide');
                        $scope.cargoActual = $scope.datoBancarioActual.cargo;
                        $scope.BancoReferenciadoCargos = result.data;

                        angular.forEach($scope.BancoReferenciadoCargos, function (value, key) {
                            $scope.abonoTotal += value.abono;
                        });

                        $('#DetalleRelacionCargos').modal('show');
                    }
                    else {
                        alertFactory.warning('No existe relación para este registro');
                    }
                }
                else if (registroConciliado.tipoReferencia == 4) {
                    $('#loading').modal('hide');
                    alertFactory.warning('Función en desarrollo ...');
                }
            }
            else if (registroConciliado.tipoReferencia < 3) {
                if (result.data.length > 0) {
                    $('#loading').modal('hide');
                    $scope.abonoActual = $scope.datoBancarioActual.abono;
                    $scope.BancoReferenciadoAbonos = result.data;

                    angular.forEach($scope.BancoReferenciadoAbonos, function (value, key) {
                        $scope.cargoTotal += value.cargo;
                    });

                    $('#DetalleRelacionAbonos').modal('show');
                }
                else {
                    alertFactory.warning('No existe relación para este registro');
                }
            }

        });
    };
    
    //********************************* Ing. Luis Antonio García Perrusquía 27/03/2018
    // Get Registros bancarios cargos
    //*/

    $scope.detalleRegistrosBancariosCargosF = function ( idCargo, banco ) {
        
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
     //Ing. Luis Antonio García Perrusquía
    $scope.detalleRegistrosBancariosAbonos = function (abonosData) {
        
        $rootScope.registrosBancariosAbonos[0] = abonosData;
        $rootScope.registrosBancariosAbonosTotal = abonosData.abono;
        conciliacionDetalleRegistroRepository.detalleRegistrosBancariosAbonos( abonosData.IDABONOSBANCOS )
        .then(function(result){
            
            if( result.data[1].length > 0 ){
                $rootScope.regBancariosAbonoDetalle = result.data[1];
                $rootScope.totalAbonoBanco = result.data[1][0].ABONO_BANCO;
                $rootScope.esCargo = result.data[0][0].esCargo;
                
                $('#regBancariosAbonoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos.');
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };

    $scope.detalleRegistrosContablesAbonos = function (abonosData) {
        
        $rootScope.registroCargosAbono[0] = abonosData;
        $rootScope.registrosCargodAbonosTotal = abonosData.cargo;
        
        conciliacionDetalleRegistroRepository.detalleRegistrosContablesAbonos( abonosData.idAuxiliar )
        .then(function(result){
            if( result.data[1].length != 0 ){
                
                $rootScope.regCargoAbonoDetalle = result.data[1];
                $rootScope.totalHijosCargos = result.data[1][0].importe;
                
                $('#regCargoAbonoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos');
            }
           
            
        });
    };
    //Ing. Luis Antonio García Perrusquía
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
            
            if( result.data.length != 0 ){
                if ($rootScope.universoTotalMovimientoContableCargo == 0 && $rootScope.universoTotalMovimientoContableAbono == 0) {
                    angular.forEach(result.data, function (value, key) {
                        if (value.tipoMovimiento == 0) {
                            $rootScope.universoTotalMovimientoContableCargo += value.cargo;
                        }

                        if (value.tipoMovimiento == 1) {
                            $rootScope.universoTotalMovimientoContableAbono += value.abono;
                        }
                    });
                }
                $scope.universoContable = result.data;

                $scope.tablaSearch('contableUniCargo');
            }else{
                alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
            }
        });
    }
    //Ing. Luis Antonio García Perrusquía
    $scope.getTotalUniversoBancario = function () {
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
            .then(function (result) {
                if (result.data.length != 0) {
                    
                    if ($rootScope.universoTotalMovimientoBancarioCargo == 0 && $rootScope.universoTotalMovimientoBancarioAbono == 0) {
                        angular.forEach(result.data, function (value, key) {
                            if (value.tipoMovimiento == 1) {
                                $rootScope.universoTotalMovimientoBancarioCargo +=  value.cargo;
                                //console.log( 'cargo', value.cargo );
                            }

                            if (value.tipoMovimiento == 0) {
                                $rootScope.universoTotalMovimientoBancarioAbono += value.abono;
                            }
                        });
                    }
                    $scope.universoBancario = result.data;
                    
                    $scope.tablaSearch('contableUniBancarioCargo');
                } else {
                    alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
                }
            });
    }

    // INICIA inicio la tabla para los distintos casos
        //****************************************************************************************************
    $scope.tabla = function (idtabla) {
        $('#' + idtabla).DataTable().destroy();

        setTimeout(function () {
            
            var table = $('#' + idtabla).DataTable({
                destroy: true,
                "responsive": true,
                searching: true,
                paging: true,
                autoFill: false,
                fixedColumns:   true
            });
            
        }, 1000);
    };

    $scope.tablaSearch = function (idtabla) {
        $('#' + idtabla).DataTable().destroy();

        setTimeout(function () {
            $('#' + idtabla + ' thead th').each(function (i) {
                var title = $('#' + idtabla + ' tfoot th').eq($(this).index()).text();
                $(this).html('<input type="text" placeholder="Buscar ' + title + '" data-index="' + i + '" />');
            });

            var table = $('#' + idtabla).DataTable({
                destroy: true,
                "responsive": true,
                searching: true,
                paging: true,
                autoFill: false,
                fixedColumns: true

            });

            $(table.table().container()).on('keyup', 'thead input', function () {
                table
                    .column($(this).data('index'))
                    .search(this.value)
                    .draw();
            });
        }, 1000);
    };
    //****************************************************************************************************

});