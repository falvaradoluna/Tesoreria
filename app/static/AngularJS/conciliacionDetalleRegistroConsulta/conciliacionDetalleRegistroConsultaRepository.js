var conciliacionDetalleRegistroConsultaURL = global_settings.urlCORS + 'api/conciliacionDetalleRegistroConsulta/';

registrationModule.factory('conciliacionDetalleRegistroConsultaRepository', function($http) {
    return {
        getReportePdf: function(jsondata) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'reportePdf/',
                method: "POST",
                data: {
                    values: jsondata
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insertPuntoDeposito: function(banco, auxiliar, descripcion, estatus, idpadre, idOpcion, idEmpresa, idBanco, tipoPunteo, idUsuario) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'insertPuntoDeposito/',
                method: "POST",
                data: {
                    idDepositoBanco: banco,
                    idAuxiliarContable: auxiliar,
                    descripcion: descripcion,
                    idEstatus: estatus,
                    idPadre: idpadre,
                    idOpcion : idOpcion,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    tipoPunteo: tipoPunteo,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //SEL_TOTAL_ABONOCARGO_SP_H
        getTotalAbonoCargo: function(idBanco,idEmpresa,noCuenta,cuentaContable,fechaE,fechaC,polizaPago,opcion,idUsuario) { //LQMA add 06032018 idUsuario
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'totalAbonoCargo/',
                method: "POST",
                data: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta, 
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaE,
                    fechaCorte: fechaC,
                    polizaPago: polizaPago,
                    opcion: opcion,
                    idUsuario: idUsuario //LQMA add 06032018
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_DEPOSITOS_REFERENCIADOS_SP_H
        getDepositos: function(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte, idEmpresa) {
            return $http({
                url: filtrosURL + 'depositos/',
                method: "GET",
                params: {
                    idBanco: idBanco,
                    idEstatus: idestatus,
                    cuentaBancaria: cuentaBancaria,
                    fElaboracion: fElaboracion,
                    fCorte: fCorte,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_AUXILIAR_CONTABLE_EMPRESA_CUENTA_SP_H
        getAuxiliar: function(idEmpresa, idBanco, numero_cuenta, idestatus, fElaboracion, fCorte, polizaPago, cuentaBancaria) {
            return $http({
                url: filtrosURL + 'auxiliarContable/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    numero_cuenta: numero_cuenta,
                    idEstatus: idestatus,
                    fElaboracion: fElaboracion,
                    fCorte: fCorte,
                    polizaPago: polizaPago,
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_PUNTEO_DEPOSITOS_PADRES_SP_H
        getBancoPunteo: function(idempresa, cuentaBancaria, idBanco, fechaInicio, fechaCorte) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaBancaria: cuentaBancaria,
                    idBanco: idBanco,
                    fechaInicio: fechaInicio,
                    fechaCorte: fechaCorte
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_PUNTEO_AUXILIAR_PADRES_SP_H      
        getAuxiliarPunteo: function(idempresa, cuentaContable, fechaInicio, fechaCorte) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'auxiliarPunteo/',
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
        //SEL_DEPOSITOSDPI_H
        getBancoDPI: function(idempresa, cuentaBancaria) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoDPI/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },                                                                                                                     //LQMA add 10032018 - diBmerPadre
        insertPunteoBancoCargoAbono: function(banco, auxiliar, descripcion, estatus, idPadre, idOpcion, idEmpresa, idBanco, tipoPunteo, idBmerPadre){
          return $http ({
            url: conciliacionDetalleRegistroConsultaURL + 'insertPunteoBancoAC/',
            method: "POST",
            data: {
                idDepositoBanco: banco,
                idAuxiliarContable: auxiliar,
                descripcion: descripcion,
                idEstatus: estatus,
                idPadre: idPadre,
                idOpcion : idOpcion,
                idEmpresa: idEmpresa,
                idBanco: idBanco,
                tipoPunteo: tipoPunteo,
                idBmerPadre: idBmerPadre
            },
            headers:{
                'Content-Type': 'application/json'
            }

          });
        },        

        getAuxiliarDPI: function(idempresa, cuentaContable) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'auxiliarDPI/',
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
        eliminarPunteo: function(datoBusqueda, opcion, idEmpresa, idBanco) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'eliminarPunteo/',
                method: "POST",
                data: {
                    idDatoBusqueda: datoBusqueda,
                    opcion: opcion,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        detallePunteo: function(idPunteo,idBanco,noCuenta,cuentaContable,accionBusqueda) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'detallePunteo/',
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
        sendMail: function(filename, file, fileUrl,cuentaContable, nombreEmpresa, cuentaBancaria, nombreBanco, responsable) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'sendMail/',
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
        generaPunteo: function(idempresa, idbanco, cuentacontable, cuentabancaria) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'generaPunteo/',
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

        insertDepositosDPI: function(idAbonoBanco, idBanco, idEmpresa, idUsuario) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'insertDPI/',
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
        //SEL_REG_BANCOS_REFERENCIADOS_H    
        getBancosRef: function(idBanco, noCuenta, fechaInicio, fechaCorte, idEmpresa){
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoReferenciado/',
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

        getContablesRef: function(cuentacontable, cuentaBanco, fechaInicio, fechaCorte, polizaPago, idEmpresa, idBanco){
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'contableReferenciado/',
                method: 'GET',
                params:{
                    cuentaContable: cuentacontable,
                    cuentaBanco: cuentaBanco,
                    fechaInicio: fechaInicio,
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
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRelacionBancos/',
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
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRelacionBancos/',
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
