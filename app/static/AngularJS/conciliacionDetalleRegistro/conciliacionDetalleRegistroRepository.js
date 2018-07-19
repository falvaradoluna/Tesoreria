var conciliacionDetalleRegistroURL = global_settings.urlCORS + 'api/conciliacionDetalleRegistro/';

registrationModule.factory('conciliacionDetalleRegistroRepository', function($http) {
    return {
        getReportePdf: function(jsondata) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'reportePdf/',
                method: "POST",
                data: {
                    values: jsondata
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getCancelaDPI: function(grupo) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'cancelaDPI/',
                method: "POST",
                data: {
                    grupo: grupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insertPuntoDeposito: function(banco, auxiliar, descripcion, estatus, idpadre, idOpcion, idEmpresa, idBanco, tipoPunteo, idUsuario, esCargoBanco, esCargoContable) { //LQMA 01042018
            console.log('insertPuntoDeposito')
            return $http({
                url: conciliacionDetalleRegistroURL + 'insertPuntoDeposito/',
                method: "POST",
                data: {
                    idDepositoBanco: banco,
                    idAuxiliarContable: auxiliar,
                    descripcion: descripcion,
                    idEstatus: estatus,
                    idPadre: idpadre,
                    idOpcion: idOpcion,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    tipoPunteo: tipoPunteo,
                    idUsuario: idUsuario,
                    esCargoBanco: esCargoBanco, //LQMA 01042018
                    esCargoContable: esCargoContable
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //LQMA add 10032018 - diBmerPadre
        insertPunteoBancoCargoAbono: function(banco, auxiliar, descripcion, estatus, idPadre, idOpcion, idEmpresa, idBanco, tipoPunteo, idBmerPadre, esCargoBanco, esCargoContable) { //LQMA 01042018

            return $http({
                url: conciliacionDetalleRegistroURL + 'insertPunteoBancoAC/',
                method: "POST",
                data: {
                    idDepositoBanco: banco,
                    idAuxiliarContable: auxiliar,
                    descripcion: descripcion,
                    idEstatus: estatus,
                    idPadre: idPadre,
                    idOpcion: idOpcion,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    tipoPunteo: tipoPunteo,
                    idBmerPadre: idBmerPadre,
                    esCargoBanco: esCargoBanco, //LQMA 01042018
                    esCargoContable: esCargoContable
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getAuxiliarPunteo: function(idempresa, cuentaContable, fechaInicio, fechaCorte) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'auxiliarPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaContable: cuentaContable,
                    fechaInicio: fechaInicio,
                    fechaCorte: fechaCorte
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getAuxiliarDPI: function(idempresa, cuentaContable) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'auxiliarDPI/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaContable: cuentaContable
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getBancoPunteo: function(idempresa, idBanco, noCuenta, cuentaContable, rpun_idAplicado) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    rpun_idAplicado: rpun_idAplicado
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getBancoDPI: function(idMes) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoDPI/',
                method: "GET",
                params: {
                    idMes: idMes
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        // Ing. Luis Antonio Garcia
        eliminarPunteo: function(datoBusqueda) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'eliminarPunteo/',
                method: "POST",
                data: {
                    idDatoBusqueda: datoBusqueda
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        // eliminarPunteo: function (datoBusqueda, opcion, idEmpresa, idBanco) {
        //     return $http({
        //         url: conciliacionDetalleRegistroURL + 'eliminarPunteo/',
        //         method: "POST",
        //         data: {
        //             idDatoBusqueda: datoBusqueda,
        //             opcion: opcion,
        //             idEmpresa: idEmpresa,
        //             idBanco: idBanco
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },
        // detallePunteo: function (idPunteo, idBanco, noCuenta, cuentaContable, accionBusqueda) {
        //     return $http({
        //         url: conciliacionDetalleRegistroURL + 'detallePunteo/',
        //         method: "POST",
        //         data: {
        //             idPunteoAuxiliarBanco: idPunteo,
        //             idBanco: idBanco,
        //             noCuenta: noCuenta,
        //             cuentaContable: cuentaContable,
        //             accionBusqueda: accionBusqueda
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },

        //Luis Antonio Garcia Perrusquia
        detallePunteo: function(grupo) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detallePunteo/',
                method: "POST",
                data: {
                    grupo: grupo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        sendMail: function(filename, file, fileUrl, cuentaContable, nombreEmpresa, cuentaBancaria, nombreBanco, responsable) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'sendMail/',
                method: "POST",
                data: {
                    nombreArchivo: filename,
                    cuentaContable: cuentaContable,
                    nombreEmpresa: nombreEmpresa,
                    cuentaBancaria: cuentaBancaria,
                    nombreBanco: nombreBanco,
                    responsable: responsable,
                    file: file,
                    fileUrl: fileUrl
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //Luis Antonios Garcia Perrusquia
        generaPunteo: function() {
            return $http({
                url: conciliacionDetalleRegistroURL + 'generaPunteo/',
                method: "POST",
                data: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        // generaPunteo: function (idempresa, idbanco, cuentacontable, cuentabancaria) {
        //     return $http({
        //         url: conciliacionDetalleRegistroURL + 'generaPunteo/',
        //         method: "POST",
        //         data: {
        //             idEmpresa: idempresa,
        //             idBanco: idbanco,
        //             cuentaContable: cuentacontable,
        //             cuentaBancaria: cuentabancaria
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },

        insertDepositosDPI: function(idAbonoBanco, idBanco, idEmpresa, idUsuario) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'insertDPI/',
                method: "POST",
                data: {
                    idAbonoBanco: idAbonoBanco,
                    idBanco: idBanco,
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getBancosRef: function(idBanco, noCuenta, fechaInicio, fechaCorte, idEmpresa) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoReferenciado/',
                method: "GET",
                params: {
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    fechaInicio: fechaInicio,
                    fechaCorte: fechaCorte,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getContablesRef: function(cuentacontable, cuentaBanco, fechaInicio, fechaCorte, polizaPago, idEmpresa, idBanco) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'contableReferenciado/',
                method: 'GET',
                params: {
                    cuentaContable: cuentacontable,
                    cuentaBanco: cuentaBanco,
                    fechaInicio: fechaInicio,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },


        getDetalleRelacion: function(refampliada, tipoRegistro, idEmpresa, cuentaContable, fecha, polizaPago, cuentaBanco, idRegistroBancario) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRelacionBancos/',
                method: 'GET',
                params: {
                    ReferenciaAmpliada: refampliada,
                    TipoRegistro: tipoRegistro,
                    idEmpresa: idEmpresa,
                    cuentaContable: cuentaContable,
                    fecha: fecha,
                    polizaPago: polizaPago,
                    cuentaBanco: cuentaBanco,
                    idRegistroBancario: idRegistroBancario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getDetalleRelacionContables: function(refampliada, tipoRegistro, idEmpresa, cuentaContable, fecha, polizaPago, cuentaBanco, idRegistroBancario) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRelacionBancos/',
                method: 'GET',
                params: {
                    ReferenciaAmpliada: refampliada,
                    TipoRegistro: tipoRegistro,
                    idEmpresa: idEmpresa,
                    cuentaContable: cuentaContable,
                    fecha: fecha,
                    polizaPago: polizaPago,
                    cuentaBanco: cuentaBanco,
                    idRegistroBancario: idRegistroBancario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        // Ing.LAGP
        getDetalleAbono: function(idAbono) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRegistroAbono',
                method: 'GET',
                params: {
                    idAbono: idAbono
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getRegistrosBancariosCargos: function() {
            return $http({
                url: conciliacionDetalleRegistroURL + 'registrosBancariosCargos',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        detalleRegistrosBancariosCargos: function(idCargo) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRegistrosBancariosCargos',
                method: 'GET',
                params: {
                    idCargo: idCargo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        detalleRegistrosBancariosAbonos: function(idAbono) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRegistrosBancariosAbonos',
                method: 'GET',
                params: {
                    idAbono: idAbono
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        detalleRegistrosContablesAbonos: function(idAuxiliar) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detalleRegistrosContablesAbonos',
                method: 'GET',
                params: {
                    idAuxiliar: idAuxiliar
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getTotalUniverso: function(
            idEmpresa,
            idBanco,
            noCuenta,
            cuentaContable,
            fechaElaboracion,
            fechaCorte,
            polizaPago,
            opcion,
            idUsuario
        ) {

            return $http({
                url: conciliacionDetalleRegistroURL + 'totalUniverso',
                method: 'GET',
                params: {
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaElaboracion,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    opcion: opcion,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getTotalUniversoBancario: function(
            idEmpresa,
            idBanco,
            noCuenta,
            cuentaContable,
            fechaElaboracion,
            fechaCorte,
            polizaPago,
            opcion,
            idUsuario
        ) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'totalUniversoBancario',
                method: 'GET',
                params: {
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaElaboracion,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    opcion: opcion,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        guardarHistorico: function(
            idUsuario,
            idBanco,
            idEmpresa,
            cuentaBancaria,
            cuentaContable,
            fechaElaboracion,
            fechaCorte,
            polizaPago,
            opcion
        ) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'guardarHistorico/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    idBanco: idBanco,
                    idEmpresa: idEmpresa,
                    cuentaBancaria: cuentaBancaria,
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaElaboracion,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getArchivoPdf: function(jsondata) {
                return $http({
                    url: conciliacionDetalleRegistroURL + 'archivoPdf/',
                    method: "GET",
                    params: jsondata,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            //Fin de la llave return
    };
});