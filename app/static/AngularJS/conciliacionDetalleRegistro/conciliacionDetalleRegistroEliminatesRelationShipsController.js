registrationModule.controller('conciliacionDetalleRegistroEliminatesRelationShipsController', function($scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory){


    $scope.init= function(){


    };

  
   // INICIA elimina los punteos ya realizados
    //****************************************************************************************************
    $scope.eliminarPunteo = function(punteo, opcion) {
        var datoBusqueda = '';
        if(opcion == 1){
           datoBusqueda = punteo.idDepositoBanco;
        }else{
           datoBusqueda = punteo.idAuxiliarContable;
        }
        conciliacionDetalleRegistroRepository.eliminarPunteo(datoBusqueda,opcion).then(function(result) {
            console.log(result, 'Resultado cuando elimino');
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionPunteo').modal('hide');
            $scope.getGridTablas();
        });
    };
    //****************************************************************************************************


     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de punteos relacionados

    $scope.alertaEliminaPunteos = function (datosPunteo,accionElimina){
        $scope.datosPunteo = datosPunteo;
        $scope.accionElimina = accionElimina;
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
                        $scope.getGridTablas();
                    }
                });
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionDPI').modal('hide');
            $scope.getGridTablas();
     };

});
