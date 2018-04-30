registrationModule.controller('conciliacionDetalleRegistroGetGridsConsultaController', function ($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroConsultaRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioConsultaRepository, $filter) {

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

    //Variables para los resultados totales de cada Grid
    $scope.bancoReferenciadosAbonosTotales = 0;
    $scope.bancoReferenciadosCargosTotales = 0;
    $scope.contableReferenciadosAbonosTotales = 0;
    $scope.contableReferenciadosCargosTotales = 0;
    $scope.BancoReferenciadoCargosTotales = 0;
    $scope.BancoReferenciadoAbonosTotales = 0;
    $rootScope.AuxiliarPunteadoAbonosTotales = 0;
    $rootScope.AuxiliarPunteadoCargosTotales = 0;
    $rootScope.BancoPunteadoAbonosTotales = 0;
    $rootScope.BancoPunteadoCargosTotales = 0;
    $scope.bancoDPITotal = 0;

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

     //Universos
     $scope.universoContable = [];
     $scope.universoBancario = [];
     $rootScope.universoTotalMovimientoContableCargo = 0;
     $rootScope.universoTotalMovimientoContableAbono = 0;
     $rootScope.universoTotalMovimientoBancarioCargo = 0;
     $rootScope.universoTotalMovimientoBancarioAbono = 0;


    //Variable para los parametros
    $scope.paramsHistory = JSON.parse(localStorage.getItem('paramBusqueda'));
    $scope.userData = JSON.parse( localStorage.getItem('ls.userData') );

    $scope.init = function () {
        $scope.getUniversoContableConsulta();
        $scope.getUniversoBancariosConsulta();
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();
        $scope.getAuxiliarPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.paramsHistory.HistoricoId);
        $scope.getBancoPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.busqueda.IdBanco, $scope.paramsHistory.HistoricoId);
        $scope.getBancoDPI($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta, $scope.paramsHistory.HistoricoId);
        $scope.bancoReferenciados();
        $scope.contablesReferenciados($scope.polizaPago, $scope.busqueda.Cuenta);
        //Elimino la información almacenada de consultas anteriores, limpio las variables locales para estos elementos
        localStorage.removeItem('infoGridAuxiliar');
        localStorage.removeItem('infoGridBanco');
        localStorage.removeItem('totalesGrids');
    };

    var variablesLocalStorage = function () {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.polizaPago = $scope.busqueda.PolizaPago;
    };

    // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************
    $scope.getAuxiliarPunteo = function (idempresa, cuenta, idHistorico) {
        conciliacionDetalleRegistroConsultaRepository.getAuxiliarPunteo(idempresa, cuenta, idHistorico,2).then(function (result) {
            $scope.auxiliarPadre = result.data;
            localStorage.setItem('auxiliarPadre', JSON.stringify($scope.auxiliarPadre));

            $scope.AuxiliarPunteado = $filter('filter')(result.data, function (value) {
                return value.idEstatus == 3;
            });
            //Obtener la uma total de los registros
            // angular.forEach($scope.AuxiliarPunteado, function (value, key) {
            //     $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
            // });

            // angular.forEach($scope.AuxiliarPunteado, function (value, key) {
            //     $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
            // });

            if( $rootScope.AuxiliarPunteadoAbonosTotales == 0 && $rootScope.AuxiliarPunteadoCargosTotales == 0 ){
                angular.forEach(result.data, function( value, key ){
                    if( value.idPunteoFinalBancos == 3 ){
                        $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
                        $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
                    }
                });
            }

            $scope.tabla('auxiliarPunteo');
        });
    };
    //****************************************************************************************************

    // INICIA Obtengo los padres del Banco punteado
    //****************************************************************************************************
    $scope.getBancoPunteo = function (idempresa, cuentaBanco, idBanco, idHistorico) {
        conciliacionDetalleRegistroConsultaRepository.getBancoPunteo(idempresa, cuentaBanco, idBanco, idHistorico).then(function (result) {
            $scope.bancoPadre = result.data;
            localStorage.setItem('bancoPadre', JSON.stringify($scope.bancoPadre));
            $scope.BancoPunteado = $filter('filter')($scope.bancoPadre, function (value) {
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
    };
    //****************************************************************************************************

    // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function (idempresa, cuentaBanco, idHistorico) {
        conciliacionDetalleRegistroConsultaRepository.getBancoDPI(idempresa, cuentaBanco, idHistorico).then(function (result) {
            $scope.bancoDPI = result.data;
            //Obtener la suma total de los registros
            angular.forEach($scope.bancoDPI, function (value, key) {
                $scope.bancoDPITotal += value.abono;
            });

            $scope.tabla('bancodpi');
        });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
    $scope.bancoReferenciados = function () {
        
        conciliacionDetalleRegistroConsultaRepository.getBancosRef(
            $scope.paramsHistory.IdBanco, 
            $scope.paramsHistory.Cuenta, 
            $scope.paramsHistory.IdEmpresa, 
            $scope.paramsHistory.HistoricoId)
        .then(function (result) {

            $scope.bancoReferenciadosAbonos = $filter('filter')(result.data, function (value) {
                return value.tipoMovimiento == 0;
            });
            $scope.bancoReferenciadosCargos = $filter('filter')(result.data, function (value) {
                return value.tipoMovimiento == 1;
            });
            $scope.tablaSearch('bancoReferenciadoAbono');
            $scope.tablaSearch('bancoReferenciadoCargo');
            //Obtener la uma total de los registros
            angular.forEach($scope.bancoReferenciadosAbonos, function (value, key) {
                $scope.bancoReferenciadosAbonosTotales += value.abono;
            });

            angular.forEach($scope.bancoReferenciadosCargos, function (value, key) {
                $scope.bancoReferenciadosCargosTotales += value.cargo;
            });

        });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
    $scope.contablesReferenciados = function (polizaPago, cuentaBanco) {
        conciliacionDetalleRegistroConsultaRepository.getContablesRef(
            $scope.paramsHistory.CuentaContable,
            $scope.paramsHistory.Cuenta,
            $scope.paramsHistory.IdEmpresa,
            $scope.paramsHistory.IdBanco,
            $scope.paramsHistory.HistoricoId
        ).then(function (result) {

            $scope.contableReferenciadosAbonos = $filter('filter')(result.data, function (value) {
                return value.tipoMovimiento == 0;
            });
            $scope.contableReferenciadosCargos = $filter('filter')(result.data, function (value) {
                return value.tipoMovimiento == 1;
            });
            $scope.tablaSearch('contableRefAbonos');
            $scope.tablaSearch('contableRefCargos');

            //Obtener la uma total de los registros
            angular.forEach($scope.contableReferenciadosAbonos, function (value, key) {
                $scope.contableReferenciadosAbonosTotales += value.abono;
            });

            angular.forEach($scope.contableReferenciadosCargos, function (value, key) {
                $scope.contableReferenciadosCargosTotales += value.cargo;
            });
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
        conciliacionDetalleRegistroConsultaRepository.getDetalleRelacion(registroConciliado.refAmpliada, registroConciliado.tipoReferencia, $scope.busqueda.IdEmpresa, $scope.busqueda.CuentaContable, $scope.busqueda.fechaElaboracion, $scope.polizaPago, $scope.busqueda.Cuenta, registroConciliado.idBmer).then(function (result) {
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
    //****************************************************************************************************

    // $scope.detalleRegistrosReferenciadosContables = function (registroConciliado) {

    //     alertFactory.warning('Función en desarrollo...');

    // };


    $scope.detalleRegistrosReferenciadosContablesAbono = function (registroConciliado) {
        
        conciliacionDetalleRegistroConsultaRepository.getDetalleAbono( registroConciliado, $scope.paramsHistory.HistoricoId )
        .then(function(result){
            
            $rootScope.detalleAbono = result.data[0];
            
            $rootScope.detalleAbonoPadre = result.data[1];
            $rootScope.abonoTotalBanco = result.data[1][0].MOV_HABER;
            $rootScope.abonoTotalBancoSuma = result.data[0][0].Total;
            if($rootScope.detalleAbono.length > 0){
                
                $('#regContablesAbonoDetalle').modal('show');
                $rootScope.detalleAbono.forEach(function( item, key ){
                    
                });
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };

    $scope.getUniversoContableConsulta = function (registroConciliado) {
        conciliacionDetalleRegistroConsultaRepository.getUniversoContableConsulta( 
            $scope.paramsHistory.IdEmpresa, 
            $scope.userData.idUsuario, 
            $scope.paramsHistory.HistoricoId,
            $scope.paramsHistory.Cuenta,
            $scope.paramsHistory.CuentaContable,
            $scope.paramsHistory.fechaElaboracion,
            $scope.paramsHistory.PolizaPago )
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
                $scope.tablaSearch('contableUniAbonos');
            }else{
                alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };

    $scope.getUniversoBancariosConsulta = function (registroConciliado) {
        conciliacionDetalleRegistroConsultaRepository.getUniversoBancariosConsulta( 
            $scope.paramsHistory.IdEmpresa, 
            $scope.userData.idUsuario, 
            $scope.paramsHistory.HistoricoId,
            $scope.paramsHistory.Cuenta,
            $scope.paramsHistory.CuentaContable,
            $scope.paramsHistory.fechaElaboracion,
            $scope.paramsHistory.fechaCorte,
            $scope.paramsHistory.PolizaPago )
        .then(function(result){
            
            if (result.data.length != 0) {
                    
                if ($rootScope.universoTotalMovimientoBancarioCargo == 0 && $rootScope.universoTotalMovimientoBancarioAbono == 0) {
                    angular.forEach(result.data, function (value, key) {
                        if (value.tipoMovimiento == 0) {
                            $rootScope.universoTotalMovimientoBancarioCargo += value.cargo;
                        }

                        if (value.tipoMovimiento == 1) {
                            $rootScope.universoTotalMovimientoBancarioAbono += value.abono;
                        }
                    });
                }
                $scope.universoBancario = result.data;
                
                $scope.tablaSearch('contableUniBancarioCargo');
                $scope.tablaSearch('contableUniBancarioAbono');
            } else {
                alertFactory.warning('No se encontraron datos, intentelo de nuevo.');
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };

    $scope.detalleRegistrosBancariosCargosF = function ( idCargo, banco ) {
        
        conciliacionDetalleRegistroConsultaRepository.detalleRegistrosBancariosCargos( idCargo, $scope.paramsHistory.HistoricoId )
        .then(function(result){
            
            $rootScope.detalleRegistrosBancariosCargos = result.data;
            
            if($rootScope.detalleRegistrosBancariosCargos.length > 0){
                $rootScope.detalleRegistrosBancariosCargosTotal         = result.data[0].Abono;
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
    //CLON LAGP
    $scope.detalleRegistrosBancariosAbonos = function (abonosData) {
        
        $rootScope.registrosBancariosAbonos[0] = abonosData;
        $rootScope.registrosBancariosAbonosTotal = abonosData.abono;
        
        conciliacionDetalleRegistroConsultaRepository.detalleRegistrosBancariosAbonos( abonosData.IDABONOSBANCOS_H, $scope.paramsHistory.HistoricoId )
        .then(function(result){
            
            if( result.data[1].length > 0 ){
                $rootScope.regBancariosAbonoDetalle = result.data[1];
                $rootScope.totalAbonoBanco = result.data[1][0].ABONO_BANCO;
                $('#regBancariosAbonoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos.');
            }
        });
        //alertFactory.warning('Función en desarrollo...');
    };
    //CLON LAGP
    $scope.detalleRegistrosContablesAbonos = function (abonosData) {
        $rootScope.registroCargosAbono[0] = abonosData;
        $rootScope.registrosCargodAbonosTotal = abonosData.cargo;
        
        conciliacionDetalleRegistroConsultaRepository.detalleRegistrosContablesAbonos( abonosData.idAuxiliar, $scope.paramsHistory.HistoricoId )
        .then(function(result){
            if( result.data[1].length != 0 ){
                $rootScope.regCargoAbonoDetalle = result.data[1];
                $rootScope.totalHijosCargos = result.data[1][0].importe;
                
                $('#regCargoAbonoDetalle').modal('show');
            }else{
                alertFactory.warning('No se encontraron datos');
            }  
        });
    }

    // INICIA inicio la tabla para los distintos casos
    //****************************************************************************************************
    $scope.tabla = function (idtabla) {
        $('#' + idtabla).DataTable().destroy();
        setTimeout(function () {
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

    $scope.tablaSearch = function (idtabla) {
        $('#' + idtabla).DataTable().destroy();

        setTimeout(function () {
            $('#' + idtabla + ' thead th').each(function (i) {
                var title = $('#' + idtabla + ' tfoot th').eq($(this).index()).text();
                $(this).html('<input type="text" placeholder="Buscar ' + title + '" data-index="' + i + '" />');
            });

            var table = $('#' + idtabla).DataTable({
                destroy: true,
                "responsive": false,
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

});