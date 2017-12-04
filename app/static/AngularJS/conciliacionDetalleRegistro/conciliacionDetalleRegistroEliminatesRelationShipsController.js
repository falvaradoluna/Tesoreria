registrationModule.controller('conciliacionDetalleRegistroEliminatesRelationShipsController', function($window,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory){
  
   // INICIA elimina los punteos ya realizados
    //****************************************************************************************************
    $scope.eliminarPunteo = function() {
         
        $scope.datosPunteo = JSON.parse(localStorage.getItem('datosPunteo'));
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));

        var datoBusqueda = '';
        if($scope.datosPunteo.accion == 1){
           datoBusqueda = $scope.datosPunteo.Datos.idDepositoBanco;
           if($scope.datosPunteo.idPAdre == 4){
             $scope.datoBusqueda.accion = 4;
           }
        }else{
           if($scope.datosPunteo.idPAdre == 3){
            $scope.datosPunteo.accion = 3;
           }
           datoBusqueda = $scope.datosPunteo.Datos.idAuxiliarContable;
        }
        conciliacionDetalleRegistroRepository.eliminarPunteo(datoBusqueda,$scope.datosPunteo.accion, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco).then(function(result) {
            console.log(result, 'Resultado cuando elimino');
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionPunteo').modal('hide');
             localStorage.removeItem('datosPunteo');
            $scope.refreshGrids();
        });
    };
    //****************************************************************************************************


     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de punteos relacionados

    $scope.alertaEliminaPunteos = function (datosPunteo,accionElimina){

      localStorage.setItem('datosPunteo', JSON.stringify({"Datos": datosPunteo, "accion": accionElimina}));

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
