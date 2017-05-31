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
        eliminarPunteo: function(idPunteo) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'eliminarPunteo/',
                method: "POST",
                data: {
                    idPunteoAuxiliarBanco: idPunteo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        detallePunteo: function(idPunteo) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detallePunteo/',
                method: "POST",
                data: {
                    idPunteoAuxiliarBanco: idPunteo
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
        }
    };
});
