var loginURL = global_settings.urlCORS + 'api/login/';


registrationModule.factory('loginRepository', function($http) {
    return {
        getPermisos: function(usuario) {
            return $http({
                url: loginURL + 'permisos/',
                method: "GET",
                params: {
                    usuario: usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getEmpleado: function(usuario) {
            return $http({
                url: loginURL + 'empleado/',
                method: "GET",
                params: {
                    usuario: usuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});
