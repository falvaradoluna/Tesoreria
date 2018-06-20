registrationModule.controller('conciliacionDetalleRegistroEliminatesRelationShipsController', function($window,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository){
  
   // INICIA elimina los punteos ya realizados
    //****************************************************************************************************
    //Ing. Luis Antonio Garcia
    $scope.eliminarPunteo = function() {
        $scope.datosPunteo = parseInt(localStorage.getItem('datosPunteo'));
        conciliacionDetalleRegistroRepository.eliminarPunteo($scope.datosPunteo).then(function(result) {
            $('#alertaEliminacionPunteo').modal('hide');
            if( result.data[0].success == 1 ){
                swal(
                    'Listo',
                    result.data[0].msg,
                    'success'
                );
            }else{
                swal(
                    'Alto',
                    result.data[0].msg,
                    'error'
                );
            }
             localStorage.removeItem('datosPunteo');
            $scope.refreshGrids();
        });
    };

     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de punteos relacionados
    //Luis Antonio Garcia Perrusquia
     $scope.alertaEliminaPunteos = function (datosPunteo){
        localStorage.setItem('datosPunteo', datosPunteo);
        $('#alertaEliminacionPunteo').modal('show');
      };
      
    $scope.cancelaEliminacionPunteo = function(){
        $scope.datosPunteo = '';
        $scope.accionElimina = '';
      $('#alertaEliminacionPunteo').modal('hide');
    };
    //****************************************************************************************************

    
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
