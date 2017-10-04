var conciliacionInicioURL = global_settings.urlCORS + 'api/conciliacionInicio/';

registrationModule.factory('conciliacionInicioRepository', function($http) {
    return {

    	getTotalAbonoCargo: function(idBanco,idEmpresa,noCuenta,cuentaContable,fechaE,fechaC,polizaPago,opcion) {
            return $http({
                url: conciliacionInicioURL + 'totalAbonoCargo/',
                method: "POST",
                data: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta,	
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaE,
                    fechaCorte: fechaC,
                    polizaPago: polizaPago,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getGerenteContador: function(idUsuario, idEmpresa) {
            return $http({
                url: conciliacionInicioURL + 'gerenteContador/',
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
                url: 'http://189.204.141.193:5488/api/report',
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
        }

//Fin de la llave "return"
    };
});
