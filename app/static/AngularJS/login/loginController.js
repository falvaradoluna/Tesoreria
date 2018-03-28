registrationModule.controller('loginController', function($scope, $rootScope, $location, loginRepository, alertFactory, localStorageService) {


    $scope.init = function() {
        $rootScope.mostrarMenu = 0;
        localStorageService.clearAll('userData');
        localStorageService.clearAll('empleadoDatos');
        localStorageService.clearAll('lgnUser');
        localStorage.removeItem('paramBusqueda');
        if (!($('#lgnUser').val().indexOf('[') > -1)) {
            localStorageService.set('lgnUser', $('#lgnUser').val());
console.log($rootScope.currentEmployee)
            //$scope.getEmpleado();
            //location.href = '/conciliacionInicio';
            $scope.permisos($rootScope.currentEmployee);
            $scope.getEmpleado($rootScope.currentEmployee);
        } else {
            if (($('#lgnUser').val().indexOf('[') > -1) && !localStorageService.get('lgnUser')) {
                if (getParameterByName('employee') != '') {
                    $rootScope.currentEmployee = getParameterByName('employee');
                    //location.href = '/conciliacionInicio';
                } else {
                    alertFactory.infoTopFull('Inicie sesión desde panel de aplicaciones o desde el login.');
                }

            }
        }
        $rootScope.currentEmployee = localStorageService.get('lgnUser');
        $scope.permisos($rootScope.currentEmployee);
        $scope.getEmpleado($rootScope.currentEmployee);
    }

    // *************************** Función para logueo de portal *****************
    $scope.permisos = function(usuario ) {
        loginRepository.getPermisos(usuario).then(function(result) {
            console.log( 'result', result );
            localStorageService.set( 'ShowBtns', result.data[1] );
            if (result.data.length > 0) {
                $scope.login = result.data[0][0];
                $scope.getEmpleado(usuario);
                if ($scope.login.idPerfil == 4) {
                    $rootScope.controlDepositosAcceso = 1;
                    $rootScope.conciliacionAccesso = 0;
                    alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                    location.href = '/conciliacionInicio';
                    localStorageService.set('userData', $scope.login);
                } else {
                    if ($scope.login.idPerfil == 5) {
                        $rootScope.controlDepositosAcceso = 1;
                        $rootScope.conciliacionAccesso = 1;
                        alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                        location.href = '/controlDepositos';
                        localStorageService.set('userData', $scope.login);
                    } else {
                        $rootScope.controlDepositosAcceso = 0;
                        $rootScope.conciliacionAccesso = 1;
                        alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                        location.href = '/controlDepositos';
                        localStorageService.set('userData', $scope.login);

                    }
                }

            } else {
                alertFactory.info('Valide el usuario y/o contraseña');
            }

        });
    }

    $scope.getEmpleado = function(usuario) {
        loginRepository.getEmpleado(usuario).then(function(empleado) {
            if (empleado.data.length > 0) {
                $scope.empleadoDatos = empleado.data;
                localStorageService.set('empleadoDatos', $scope.empleadoDatos);
                //console.log($scope.empleadoDatos)
            } else {

            }
        })
    }
});
