registrationModule.controller('mainController', function($scope, $rootScope, $location, localStorageService, alertFactory) {

    $rootScope.userData = localStorageService.get('userData');
   

    $scope.init = function() {
         $rootScope.datosUsuario = localStorageService.get('empleadoDatos');
        var btns = localStorage.getItem('ShowBtns');
        btns = JSON.parse(btns);
            $rootScope.mostrarMenu = 1;
            console.log( '$rootScope.datosUsuario', $rootScope.datosUsuario );
            if(btns[0].Consulta == 1 ){
                $rootScope.controlDepositosAcceso = 0;
                $rootScope.conciliacionAccesso = 0;
            }else{
                if ($rootScope.userData.idPerfil == 4) {
                    $rootScope.controlDepositosAcceso = 0;
                    $rootScope.conciliacionAccesso = 1;          
                    console.log('Administrador Control Depositos')
                } else {
                    if ($rootScope.userData.idPerfil == 5) {
                        $rootScope.controlDepositosAcceso = 1;
                        $rootScope.conciliacionAccesso = 1;
                    }else{
                        $rootScope.controlDepositosAcceso = 1;
                        $rootScope.conciliacionAccesso = 0;
                    }
                    
                }
            }
        }
        
        // ************** NOTA se limpian todos los localStorage utilizados
    $scope.salir = function() {
        alertFactory.warning('Hasta luego ' + $rootScope.userData.nombreUsuario)
        localStorageService.clearAll('userData');
        localStorageService.clearAll('empleadoDatos');
        localStorageService.clearAll('lgnUser');
        localStorage.removeItem('paramBusqueda');

        location.href = '/';
    }
});
