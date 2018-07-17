registrationModule.controller('conciliacionDetalleRegistroGetGridsController', function ($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository, $filter) {

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
    $rootScope.contableReferenciadosAbonosTotales = 0;
    $rootScope.contableReferenciadosCargosTotales = 0;
    $scope.BancoReferenciadoCargosTotales = 0;
    $scope.BancoReferenciadoAbonosTotales = 0;

    $scope.bancoDPITotal = 0;

    //Variables para obtener los valores para el stored de total
    $scope.busquedaUniverso = JSON.parse(localStorage.getItem("paramBusqueda"));
    $scope.usuarioData = JSON.parse(localStorage.getItem("ls.userData"));

    $scope.universoContable = [];
    $scope.universoBancario = [];
    $rootScope.universoTotalMovimientoContableCargo = 0;
    $rootScope.universoTotalMovimientoContableAbono = 0;
    $rootScope.universoTotalMovimientoBancarioCargo = 0;
    $rootScope.universoTotalMovimientoBancarioAbono = 0;


    $scope.init = function () {
        localStorage.removeItem('auxiliarPadre');
        localStorage.removeItem('bancoPadre');
        variablesLocalStorage();

        //Elimino la información almacenada de consultas anteriores, limpio las variables locales para estos elementos
        localStorage.removeItem('infoGridAuxiliar');
        localStorage.removeItem('infoGridBanco');
        localStorage.removeItem('totalesGrids');
    };

    $rootScope.LlenaDPI = function () {
        $scope.getBancoDPI($scope.busqueda.IdEmpresa, $scope.busqueda.Cuenta);
    }
    $rootScope.Llenatablas = function () {
        $scope.getTotalUniverso();
    }
    $rootScope.LlenatablasBancario = function () {
        $scope.getTotalUniversoBancario();
    }
    var variablesLocalStorage = function () {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.polizaPago = $scope.busqueda.PolizaPago;
    };

    $scope.verDetallePunteoGet = function (detallepunteo, opcion) {
        $rootScope.NohayPdf = undefined;
        conciliacionDetalleRegistroRepository.detallePunteo(detallepunteo).then(function (result) {
            $('#punteoDetalle').modal('show');
            $rootScope.detalleBanco = result.data[0];
            $rootScope.detalleContable = result.data[1];

        });
    };

    // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************

    //=========================METODO PARA LLENAR LOS PUNTEPOS Ing. Luis Antonio Garcia Perrusquia

    $scope.getBancoPunteo = function () {
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.getBancoPunteo(
            $scope.busqueda.IdEmpresa,
            $scope.busqueda.IdBanco,
            $scope.busqueda.Cuenta,
            $scope.busqueda.CuentaContable,
            1)
            .then(function (result) {

                $rootScope.bancoPadrePun = result.data[0];
                $rootScope.auxiliarPadrePun = result.data[1];

                //Suma de los que ya estan punteados BANCOS
                $rootScope.BancoPunteadoAbonosTotales = 0;
                $rootScope.BancoPunteadoCargosTotales = 0;
                angular.forEach(result.data[0], function (value, key) {
                    if (value.aplicado == 1) {
                        $rootScope.BancoPunteadoAbonosTotales += value.abono;
                        $rootScope.BancoPunteadoCargosTotales += value.cargo;
                    }
                });

                //Suma de los que ya estan punteados CARGOS
                $rootScope.AuxiliarPunteadoAbonosTotales = 0;
                $rootScope.AuxiliarPunteadoCargosTotales = 0;
                angular.forEach(result.data[1], function (value, key) {
                    if (value.aplicado == 1) {
                        $rootScope.AuxiliarPunteadoAbonosTotales += value.abono;
                        $rootScope.AuxiliarPunteadoCargosTotales += value.cargo;
                    }
                });

                $('#loading').modal('hide');
            });
    };

    //==================================================================================

    //Ing. Luis Antonio Garcia Perrusquia
    $scope.getConciliados = function () {
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.getBancoPunteo(
            $scope.busqueda.IdEmpresa,
            $scope.busqueda.IdBanco,
            $scope.busqueda.Cuenta,
            $scope.busqueda.CuentaContable,
            2)
            .then(function (result) {
                $scope.uniConciliadoBancario = result.data[0];
                $scope.uniConciliadoContable = result.data[1];

                $rootScope.uniAbonoBan = [];
                $rootScope.uniCargoCon = [];
                $rootScope.uniCargoBan = [];
                $rootScope.uniAbonoCon = [];

                $rootScope.bancoReferenciadosAbonosTotales = 0;
                $rootScope.bancoReferenciadosCargosTotales = 0;
                angular.forEach($scope.uniConciliadoBancario, function (valueBan, key) {
                    if (valueBan.abono != 0) {
                        $rootScope.uniAbonoBan.push(valueBan);
                        $rootScope.bancoReferenciadosAbonosTotales += valueBan.abono;
                    } else {
                        $rootScope.uniCargoBan.push(valueBan);
                        $rootScope.bancoReferenciadosCargosTotales += valueBan.cargo
                    }
                });

                $rootScope.contableReferenciadosCargosTotales = 0;
                $rootScope.contableReferenciadosAbonosTotales = 0;
                angular.forEach($scope.uniConciliadoContable, function (valueCon, key) {
                    if (valueCon.cargo != 0) {
                        $rootScope.uniCargoCon.push(valueCon);
                        $rootScope.contableReferenciadosCargosTotales += valueCon.cargo;
                    } else {
                        $rootScope.uniAbonoCon.push(valueCon);
                        $rootScope.contableReferenciadosAbonosTotales += valueCon.abono
                    }
                });

                $scope.tablaSearch('contableRefAbonos');
                $scope.tablaSearch('contableRefCargos');
                $scope.tablaSearch('bancoReferenciadoAbono');
                $scope.tablaSearch('bancoReferenciadoCargo');
                setTimeout(function () {
                    $('#loading').modal('hide');
                }, 500);

            });
    };

    // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function (idempresa, cuentaBanco) {
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.getBancoDPI(idempresa, cuentaBanco).then(function (result) {
            $scope.bancoDPI = result.data;
            //Obtener la suma total de los registros
            angular.forEach($scope.bancoDPI, function (value, key) {
                $scope.bancoDPITotal += value.abono;
            });
            $('#bancodpi').DataTable().destroy();
            setTimeout(function () {
                $('#bancodpi').DataTable({
                    destroy: true,
                    "responsive": true,
                    searching: true,
                    paging: true,
                    autoFill: false,
                    fixedColumns: true
                });
                $('#loading').modal('hide');
            }, 300);
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
                    } else {
                        swal(
                            'Alto',
                            'No existe relación para este registro',
                            'error'
                        );
                    }
                } else if (registroConciliado.tipoReferencia == 4) {
                    $('#loading').modal('hide');
                    swal(
                        'Alto',
                        'Función en desarrollo ...',
                        'warning'
                    );
                }
            } else if (registroConciliado.tipoReferencia < 3) {
                if (result.data.length > 0) {
                    $('#loading').modal('hide');
                    $scope.abonoActual = $scope.datoBancarioActual.abono;
                    $scope.BancoReferenciadoAbonos = result.data;

                    angular.forEach($scope.BancoReferenciadoAbonos, function (value, key) {
                        $scope.cargoTotal += value.cargo;
                    });

                    $('#DetalleRelacionAbonos').modal('show');
                } else {
                    swal(
                        'Alto',
                        'No existe relación para este registro',
                        'warning'
                    );
                }
            }

        });
    };

    //********************************* Ing. Luis Antonio García Perrusquía 27/03/2018

    $scope.detalleRegistrosBancariosCargosF = function (idCargo, banco) {

        conciliacionDetalleRegistroRepository.detalleRegistrosBancariosCargos(idCargo)
            .then(function (result) {

                $rootScope.detalleRegistrosBancariosCargos = result.data;

                if ($rootScope.detalleRegistrosBancariosCargos.length > 0) {
                    $rootScope.detalleRegistrosBancariosCargosTotal = result.data[0].Total;
                    $rootScope.detalleRegistrosBancariosCargosFecha = result.data[0].Fecha;
                    $rootScope.detalleRegistrosBancariosCargostipoPoliza = result.data[0].tipoPoliza;
                    $rootScope.detalleRegistrosBancariosCargosconsPoliza = result.data[0].consPoliza;
                    $rootScope.detalleRegistrosBancariosCargosnumeroCuenta = result.data[0].numeroCuenta;
                    $rootScope.detalleRegistrosBancariosCargosconcepto = result.data[0].concepto;
                    $rootScope.detalleRegistrosBancariosCargosAbono = result.data[0].Abono;
                    $('#regBancariosCargoDetalle').modal('show');
                } else {
                    swal(
                        'Alto',
                        'No se encontraron datos.',
                        'warning'
                    );
                }
            });

    };
    //****************************************************************************************************

    $scope.detalleRegistrosReferenciadosContablesAbono = function (registroConciliado) {

        conciliacionDetalleRegistroRepository.getDetalleAbono(registroConciliado)
            .then(function (result) {

                $rootScope.detalleAbono = result.data[0];
                $rootScope.detalleAbonoPadre = result.data[1];
                $rootScope.abonoTotalBanco = result.data[1][0].MOV_HABER;
                $rootScope.abonoTotalBancoSuma = result.data[0][0].Total;
                if ($rootScope.detalleAbono.length > 0) {
                    $('#regContablesAbonoDetalle').modal('show');
                    $rootScope.detalleAbono.forEach(function (item, key) {

                    });
                }
            });
    };
    //Ing. Luis Antonio García Perrusquía
    $scope.detalleRegistrosBancariosAbonos = function (abonosData) {

        $rootScope.registrosBancariosAbonos[0] = abonosData;
        $rootScope.registrosBancariosAbonosTotal = abonosData.abono;
        conciliacionDetalleRegistroRepository.detalleRegistrosBancariosAbonos(abonosData.IDABONOSBANCOS)
            .then(function (result) {

                if (result.data[1].length > 0) {
                    $rootScope.regBancariosAbonoDetalle = result.data[1];
                    $rootScope.totalAbonoBanco = result.data[1][0].ABONO_BANCO;
                    $rootScope.esCargo = result.data[0][0].esCargo;

                    $('#regBancariosAbonoDetalle').modal('show');
                } else {
                    swal(
                        'Alto',
                        'No se encontraron datos.',
                        'warning'
                    );
                }
            });
    };

    $scope.detalleRegistrosContablesAbonos = function (abonosData) {

        $rootScope.registroCargosAbono[0] = abonosData;
        $rootScope.registrosCargodAbonosTotal = abonosData.cargo;

        conciliacionDetalleRegistroRepository.detalleRegistrosContablesAbonos(abonosData.idAuxiliar)
            .then(function (result) {
                if (result.data[1].length != 0) {

                    $rootScope.regCargoAbonoDetalle = result.data[1];
                    $rootScope.totalHijosCargos = result.data[1][0].importe;

                    $('#regCargoAbonoDetalle').modal('show');
                } else {
                    swal(
                        'Alto',
                        'No se encontraron datos.',
                        'warning'
                    );
                }


            });
    };
    //Ing. Luis Antonio García Perrusquía
    $scope.getTotalUniverso = function () {
        $('#loading').modal('show');
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
            .then(function (result) {

                if (result.data.length != 0) {
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
                    $('#loading').modal('hide');
                } else {
                    $('#loading').modal('hide');
                    swal(
                        'Alto',
                        'No se encontraron datos, intentelo de nuevo.',
                        'warning'
                    );

                }
            });
    }
    //Ing. Luis Antonio García Perrusquía
    $scope.getTotalUniversoBancario = function () {
        $('#loading').modal('show');
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
                                $rootScope.universoTotalMovimientoBancarioCargo += value.cargo;

                            }

                            if (value.tipoMovimiento == 0) {
                                $rootScope.universoTotalMovimientoBancarioAbono += value.abono;
                            }
                        });
                    }
                    $scope.universoBancario = result.data;
                    console.log( "Este es el universoBancario" );

                    $scope.tablaSearch('contableUniBancarioCargo');
                    $('#loading').modal('hide');
                } else {
                    $('#loading').modal('hide');
                    swal(
                        'Alto',
                        'No se encontraron datos, intentelo de nuevo.',
                        'warning'
                    );

                }
            });
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

    // INICIA elimina los punteos ya realizados
    //****************************************************************************************************

    ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de punteos relacionados
    //Luis Antonio Garcia Perrusquia
    $scope.alertaEliminaPunteos = function (datosPunteo) {
        localStorage.setItem('datosPunteo', datosPunteo);
        $('#alertaEliminarPunteo').modal('show');
    };

    $scope.cancelaEliminacionPunteo = function () {
        $scope.datosPunteo = '';
        $scope.accionElimina = '';
        $('#alertaEliminarPunteo').modal('hide');
    };
    //Ing. Luis Antonio Garcia
    $scope.eliminarPunteo = function () {
        $scope.datosPunteo = parseInt(localStorage.getItem('datosPunteo'));
        conciliacionDetalleRegistroRepository.eliminarPunteo($scope.datosPunteo).then(function (result) {
            $('#alertaEliminarPunteo').modal('hide');
            if (result.data[0].success == 1) {
                swal(
                    'Listo',
                    result.data[0].msg,
                    'success'
                );
                $scope.getBancoPunteo();
            } else {
                swal(
                    'Alto',
                    result.data[0].msg,
                    'error'
                );
            }
            localStorage.removeItem('datosPunteo');
            // $scope.refreshGrids();
        });
    };
    //****************************************************************************************************

});