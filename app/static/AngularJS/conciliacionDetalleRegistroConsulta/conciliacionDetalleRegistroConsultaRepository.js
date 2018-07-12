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
        getDepositos: function(idBanco, idestatus, cuentaBancaria, idEmpresa, idHistorico, fechaElaboracion) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'depositos/',
                method: "GET",
                params: {
                    idBanco: idBanco,
                    idEstatus: idestatus,
                    cuentaBancaria: cuentaBancaria,
                    idEmpresa: idEmpresa,
                    idHistorico: idHistorico, //LQMA 21042018
                    fechaElaboracion: fechaElaboracion //LAGP 03052018
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_AUXILIAR_CONTABLE_EMPRESA_CUENTA_SP_H
        getAuxiliar: function(idEmpresa, idBanco, cuentaContable, fechaElaboracion, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'auxiliarContable/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    cuentaContable: cuentaContable,  
                    fechaElaboracion: fechaElaboracion, //LAGP 03052018  
                    idHistorico: idHistorico //LQMA 21042018                
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_PUNTEO_DEPOSITOS_PADRES_SP_H
        getBancoPunteo: function(idempresa, idHistorico, fechaElaboracion) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    idHistorico: idHistorico,
                    fechaElaboracion: fechaElaboracion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        //SEL_PUNTEO_AUXILIAR_PADRES_SP_H      
        getAuxiliarPunteo: function(idempresa, cuentaContable, idHistorico, idEstatus) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'auxiliarPunteo/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaContable: cuentaContable,
                    idHistorico: idHistorico,
                    idEstatus : idEstatus  //LQMA 21042018 add idEstatus = 2 : punteo tempora, = 3 punteo final 
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },     
        //SEL_DEPOSITOSDPI_H
        getBancoDPI: function(idempresa, cuentaBancaria, fechaElaboracion, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoDPI/',
                method: "GET",
                params: {
                    idEmpresa: idempresa,
                    cuentaBancaria: cuentaBancaria,
                    fechaElaboracion: fechaElaboracion,
                    idHistorico: idHistorico
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
        //Luis Antonio Garcia Perrusquia
        detallePunteo: function (grupo, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroURL + 'detallePunteo/',
                method: "POST",
                data: {
                    grupo: grupo,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        // detallePunteo: function(idPunteo,idBanco,noCuenta,cuentaContable,accionBusqueda, idHistorico) {
        //     return $http({
        //         url: conciliacionDetalleRegistroConsultaURL + 'detallePunteo/',
        //         method: "POST",
        //         data: {
        //             idPunteoAuxiliarBanco: idPunteo,
        //             idBanco: idBanco,
        //             noCuenta: noCuenta,
        //             cuentaContable: cuentaContable,
        //             accionBusqueda: accionBusqueda,
        //             idHistorico : idHistorico
        //         },
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        // },
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
        getBancosRef: function(idBanco, noCuenta, idEmpresa, idHistorico){
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'bancoReferenciado/',
                method:"GET",
                params:{
                    idBanco: idBanco,
                    noCuenta: noCuenta,
                    idEmpresa: idEmpresa,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getContablesRef: function(numCuenta, cuentaBancaria, idEmpresa, idBanco, idHistorico){
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'contableReferenciado/',
                method: 'GET',
                params:{
                    numCuenta: numCuenta,
                    cuentaBancaria: cuentaBancaria,
                    idEmpresa: idEmpresa,
                    idBanco : idBanco,
                    idHistorico: idHistorico
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
        },
        
        // Ing.LAGP
        getDetalleAbono: function (idAbono, idHistorico) {
            
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRegistroAbono',
                method: 'GET',
                params: {
                    idAbono: idAbono,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        detalleRegistrosBancariosCargos: function (idCargo, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRegistrosBancariosCargos',
                method: 'GET',
                params: {
                    idCargo: idCargo,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //CLON LAGP
        detalleRegistrosBancariosAbonos: function (idAbono, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRegistrosBancariosAbonos',
                method: 'GET',
                params: {
                    idAbono: idAbono,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //CLON LAGP
        detalleRegistrosContablesAbonos: function (idAuxiliar, idHistorico) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'detalleRegistrosContablesAbonos',
                method: 'GET',
                params: {
                    idAuxiliar: idAuxiliar,
                    idHistorico: idHistorico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //Ing. LAGPC
        getUniversoContableConsulta: function (idEmpresa, idUsuario, idHistorico, noCuenta, cuentaContable, fechaElaboracion, polizaPago, idBanco) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'universoContableConsulta',
                method: 'GET',
                params: {
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario,
                    idHistorico: idHistorico,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaElaboracion,
                    polizaPago: polizaPago,
                    idBanco: idBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        //Ing. LAGPC
        getUniversoBancariosConsulta: function (idEmpresa, idUsuario, idHistorico, noCuenta, cuentaContable, fechaElaboracion, fechaCorte, polizaPago, idBanco) {
            return $http({
                url: conciliacionDetalleRegistroConsultaURL + 'universoBancarioConsulta',
                method: 'GET',
                params: {
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario,
                    idHistorico: idHistorico,
                    noCuenta: noCuenta,
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaElaboracion,
                    fechaCorte: fechaCorte,
                    polizaPago: polizaPago,
                    idBanco: idBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

//Fin de la llave return
    };
});
