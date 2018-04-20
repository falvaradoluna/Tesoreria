var conciliacionInicioConsultaURL = global_settings.urlCORS + 'api/conciliacionInicioConsulta/';

registrationModule.factory('conciliacionInicioConsultaRepository', function($http) {
    return {

    	getTotalAbonoCargo: function(idBanco,idEmpresa,noCuenta,cuentaContable,fechaE,fechaC,polizaPago,opcion,idUsuario) { //LQMA add 06032018 idUsuario
            
            return $http({
                url: conciliacionInicioConsultaURL + 'totalAbonoCargo/',
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
        getGerenteContador: function(idUsuario, idEmpresa) {
            return $http({
                url: conciliacionInicioConsultaURL + 'gerenteContador/',
                method: "GET",
                params: {                    
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getReporteTesoreria: function(myJson) {
            return $http({
                //LQMA changed 01022018
                //url: 'http://189.204.141.193:5488/api/report',
                url: 'http://192.168.20.89:5488/api/report',
                method: "POST",
                data: {
                    template: { name: myJson.template.name },
                    data: myJson.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },

        getHistorico: function(idUsuario, idEmpresa, idBanco, cuentaContable, cuentaBancaria) {
            return $http({
                url: conciliacionInicioConsultaURL + 'historico/',
                method: "GET",
                params: {                    
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa,
                    idBanco: idBanco,
                    cuentaContable: cuentaContable,
                    cuentaBancaria: cuentaBancaria
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

//Fin de la llave "return"
    };
});
