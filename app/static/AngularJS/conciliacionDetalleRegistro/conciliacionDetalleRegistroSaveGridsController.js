registrationModule.controller('conciliacionDetalleRegistroSaveGridsController',function($scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory){

    $scope.GuardarGrid = function() {
    	$('#alertaGuardarPunteoPrevio').modal('hide');
        $scope.punteoAuxiliar = JSON.parse(localStorage.getItem('infoGridAuxiliar'));
        $scope.punteoBanco = JSON.parse(localStorage.getItem('infoGridBanco'));
        if ($scope.punteoAuxiliar.length > 0 && $scope.punteoBanco.length > 0) {
          
            if ($scope.punteoAuxiliar.length >= 1 && $scope.punteoBanco.length >= 1) {
                if ($scope.cargoBanco != 0 && $scope.abonoBanco != 0) {
                    alertFactory.warning('No se puede seleccionar abono y cargo al mismo tiempo');
                } else {
                    $scope.verificaCantidades(2);
                }
            } 
        } else {
            alertFactory.warning('No ha seleccionado ninguna relación');
        }

    };
    //****************************************************************************************************


    // INICIA funcion que verifica que la cantidad sea igual o mas menos $scope.difMonetaria, parametrizado según la empresa en curso 
    //****************************************************************************************************
    $scope.verificaCantidades = function(tipopunteo) {
        if ($scope.cargoBanco != 0 && $scope.abonoAuxiliar != 0) {
            if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoAuxiliar + $scope.difMonetaria))) {
                $scope.guardaPunteo(tipopunteo);
            } else {
                alertFactory.error('La cantidad de cargo y abono no coinciden');
            }
        } else if ($scope.abonoBanco != 0 && $scope.cargoAuxiliar != 0) {
            if ((($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoBanco + $scope.difMonetaria)) || (($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoAuxiliar + $scope.difMonetaria))) {
                $scope.guardaPunteo(tipopunteo);
            } else {
                alertFactory.error('La cantidad de cargo y abono no coinciden');
            }
        } else {
            alertFactory.warning('No puede relacionar abono con abono o cargo con cargo');
        }
    };
    //****************************************************************************************************
    // INICIA funcion para guardar el punteo
    //****************************************************************************************************
    $scope.guardaPunteo = function(tipopunteo) {
        angular.forEach($scope.punteoAuxiliar, function(value, key) {
            var valueAuxiliar = value.idAuxiliarContable;
            var conceptoPago = value.movConcepto;
            angular.forEach($scope.punteoBanco, function(value, key) {
                conciliacionDetalleRegistroRepository.insertPuntoDeposito(value.idBmer, valueAuxiliar, conceptoPago, 2, tipopunteo).then(function(result) {
                    if (result.data[0].length) {    
                        console.log('Respuesta Incorrecta');
                        $scope.punteoAuxiliar = [];
        				$scope.punteoBanco = [];
                        $('#divGetGrids').load();
                    } else {
                        console.log('Respuesta Correcta');
                    }
                })
            });
        });
    };
    //****************************************************************************************************

     // INICIA funcion para guardar los registros DPI
    //****************************************************************************************************
    $scope.guardaDPIs = function() {
        
        $('#alertaGuardarDPI').modal('hide');
        $scope.punteoAuxiliar = JSON.parse(localStorage.getItem('infoGridAuxiliar'));
        $scope.punteoBanco = JSON.parse(localStorage.getItem('infoGridBanco'));

        var idUsuario = $rootScope.userData.idUsuario;

        if($scope.punteoAuxiliar != null){
         alertFactory.warning('Acción incorrecta, no es posible enviar a DPI los Abonos Contables seleccionados');
         }
     else{
        if($scope.punteoBanco.length > 0){
         if($scope.cargoBanco == 0)
            {
                angular.forEach($scope.punteoBanco, function(value, key) {
                conciliacionDetalleRegistroRepository.insertDepositosDPI(value.idBmer, value.idBanco,idUsuario).then(function(result) {
                    if (result.data[0].ESTATUS == 2) {
                        console.log('Respuesta Correcta');
                    } else {
                        console.log('Respuesta Incorrecta');
                    }
                })
            });
                alertFactory.success('Los registros seleccionados se han modificado correctamente!');
                $('#divGetGrids').load();
            }
                else{
                        alertFactory.warning('No es posible enviar cargos bancarios a DPI, por favor verifique su selección'); 
                    }
    }
    }      
    };
    //****************************************************************************************************

});