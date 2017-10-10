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
        insertPuntoDeposito: function(banco, auxiliar, descripcion, estatus, idpadre) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'insertPuntoDeposito/',
                method: "POST",
                data: {
                    idDepositoBanco: banco,
                    idAuxiliarContable: auxiliar,
                    descripcion: descripcion,
                    idEstatus: estatus,
                    idPadre: idpadre
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAuxiliarPunteo: function(idempresa, cuentaContable) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'auxiliarPunteo/',
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


        getBancoPunteo: function(idempresa, cuentaBancaria) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

         getBancoDPI: function(idempresa, cuentaBancaria) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoDPI/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },


        eliminarPunteo: function(datoBusqueda, opcion) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'eliminarPunteo/',
                method: "POST",
                data: {
                    idDatoBusqueda: datoBusqueda,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        detallePunteo: function(idPunteo,idBanco,noCuenta,cuentaContable,accionBusqueda) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detallePunteo/',
                method: "POST",
                data: {
                    idPunteoAuxiliarBanco: idPunteo,
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    accionBusqueda: accionBusqueda
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        sendMail: function(filename, cuentaContable, nombreEmpresa, cuentaBancaria, nombreBanco, responsable) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'sendMail/',
                method: "POST",
                data: {
                    nombreArchivo: filename,
                    cuentaContable: cuentaContable,
                    nombreEmpresa: nombreEmpresa,
                    cuentaBancaria: cuentaBancaria,
                    nombreBanco: nombreBanco,
                    responsable: responsable
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        generaPunteo: function(idempresa, idbanco, cuentacontable, cuentabancaria) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'generaPunteo/',
                method: "POST",
                data: {
                    idEmpresa: idempresa,
                    idBanco: idbanco,
                    cuentaContable: cuentacontable,
                    cuentaBancaria: cuentabancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insertDepositosDPI: function(idCargoBanco, idBanco, idUsuario) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'insertDPI/',
                method: "POST",
                data: {
                    idCargoBanco: idCargoBanco,
                    idBanco: idBanco,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getBancosRef: function(idBanco, noCuenta, fechaInicio, fechaCorte, idEmpresa){
            return $http({
                url: conciliacionDetalleRegistroURL + 'bancoReferenciado/',
                method:"GET",
                params:{
                    idBanco : idBanco,
                    noCuenta : noCuenta,
                    fechaInicio : fechaInicio,
                    fechaCorte : fechaCorte,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getContablesRef: function(cuentacontable, fechaCorte, polizaPago, idEmpresa, idBanco){
            return $http({
                url: conciliacionDetalleRegistroURL + 'contableReferenciado/',
                method: 'GET',
                params:{
                    cuentaContable: cuentacontable,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    idEmpresa: idEmpresa,
                    idBanco : idBanco
                },
                headers:{
                     'Content-Type': 'application/json'
                }
            });
        },


        getDetalleRelacion: function(refampliada, tipoRegistro, idEmpresa, cuentaContable, fecha, polizaPago, cuentaBanco, idRegistroBancario){
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
                    'Content-Type' : 'application/json'
                }
            });
        },

        getDetalleRelacionContables: function(refampliada, tipoRegistro, idEmpresa, cuentaContable, fecha, polizaPago, cuentaBanco, idRegistroBancario){
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
                    'Content-Type' : 'application/json'
                }
            });
        }

//Fin de la llave return
    };
});
