var conciliacionInicioURL = global_settings.urlCORS + 'api/conciliacionInicio/';

registrationModule.factory('conciliacionInicioRepository', function($http) {
    return {

    	getTotalAbonoCargo: function(idBanco,idEmpresa,noCuenta,cuentaContable,opcion) {
            return $http({
                url: conciliacionInicioURL + 'totalAbonoCargo/',
                method: "POST",
                data: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta,	
                    cuentaContable: cuentaContable,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getGerenteContador: function(idUsuario) {
            return $http({
                url: conciliacionInicioURL + 'gerenteContador/',
                method: "GET",
                params: {                    
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }

    };
});
