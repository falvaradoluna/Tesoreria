registrationModule.controller('conciliacionDetalleRegistroEliminatesRelationShipsController', function($window,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository){
      
     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de registros no identificados

    $scope.alertaEliminaDPI = function (datosPunteo,accionElimina){
        $scope.datosPunteo = datosPunteo;
        $scope.accionElimina = accionElimina;
     $('#alertaEliminacionDPI').modal('show');
    };

    $scope.cancelaEliminacionDPI = function(){
        $scope.datosPunteo = '';
        $scope.accionElimina = '';
      $('#alertaEliminacionDPI').modal('hide');
    };
    //****************************************************************************************************

     $scope.EliminaDPI = function(){

       conciliacionDetalleRegistroRepository.insertDepositosDPI(2,$scope.datosPunteo.idDepositoBanco, 0,$scope.datosPunteo.noCuenta).then(function(result) {
                    if (result.data[0].length) {
                        console.log('Respuesta Incorrecta');
                    } else {
                        console.log('Respuesta Correcta');
                        $scope.limpiaVariables();
                        $scope.refreshGrids();
                    }
                });
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionDPI').modal('hide');
            $scope.refreshGrids();
     };

     $scope.refreshGrids = function(){
      $window.location.reload();
    };

});
