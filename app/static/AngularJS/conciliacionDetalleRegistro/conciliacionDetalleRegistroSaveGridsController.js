registrationModule.controller('conciliacionDetalleRegistroSaveGridsController',function($window ,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory){
    
      $scope.tipoPunteo = 0;

     $scope.init = function(){
        //Obtengo la información almacenada, se genera en conciliacionRegistroGridsController
        
        $scope.punteoAuxiliar = JSON.parse(localStorage.getItem('infoGridAuxiliar'));
        $scope.punteoBanco = JSON.parse(localStorage.getItem('infoGridBanco'));
        $scope.abonoCargoAuxiliar = JSON.parse(localStorage.getItem('infoGridAbonoCargoAuxiliar'));
        $scope.abonoCargoBanco = JSON.parse(localStorage.getItem('infoGridAbonoCargoBanco'));
        $scope.DPIdata = JSON.parse(localStorage.getItem('infoDPIData'));


        $scope.bancoPadre = JSON.parse(localStorage.getItem('bancoPadre'));
        $scope.auxiliarPadre = JSON.parse(localStorage.getItem('auxiliarPadre'));
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        
     };

     // INICIA Se guarda el punteo que ya no podra ser modificado
    //****************************************************************************************************
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo(
            $scope.busqueda.IdEmpresa, 
            $scope.busqueda.IdBanco, 
            $scope.busqueda.CuentaContable, 
            $scope.busqueda.Cuenta).then(function(result) {
            console.log(result.data[0].idEstatus)
            $('#alertaPunteo').modal('hide');
            if(result.data[0].idEstatus==1){
                alertFactory.success(result.data[0].Descripcion)
            }else if(result.data[0].idEstatus==0){
                alertFactory.error(result.data[0].Descripcion)
            }
            $scope.refreshGrids();
        });
    };
     // Fin de la funsion que guarda el punteo que ya no podra ser modificado
    //**************************************************************************************************** 


    // INICIA funcion para guardar el punteoPrevio
    //****************************************************************************************************
    $scope.guardaPunteoPrevio = function () {
        ///Tipo de punteo 1 = (Abonos o cargos Bancarios) - (Abonos o cargos Contables)
        ///Tipo de punteo 2 = Punteos Bancarios (conciliación entre los mismos tipos de datos)
        ///Tipo de punteo 3 = Punteo Contable (conciliación entre los mismos tipos de datos)
        console.log( 'funcionGuarda punteo' );
        $('#alertaGuardarPunteoPrevio').modal('hide');
        //Mando a llamar la función que obtendra la nueva información almacenada
        $scope.init();
        $('#loading').modal('show');
        setTimeout(function () {
            //*********************************************************Función que inserta el grupo de registros de Contabilidad cargos- abonos
            if ($scope.abonoCargoAuxiliar.length > 0) { // Entra a guardar los registros conciliados de Contabilidad cargos - abonos
                $scope.tipoPunteo = 3;
                $scope.newId = JSON.parse(localStorage.getItem('idRelationOfContableRows'));
                console.log( '$scope.newId', $scope.newId );
                if ($scope.newId.length == 0) {
                    $scope.newId = 0;
                }
                else {
                    $scope.newId = $scope.newId[0].idRelationOfContableRows;
                }
                console.log( 'abonoCargoAuxilixar', $scope.abonoCargoAuxiliar );
                var currentArray = undefined;
                angular.forEach($scope.abonoCargoAuxiliar, function (value, key1) {

                    if (key1 != currentArray) {
                        $scope.newId = $scope.newId + 1
                    }

                    angular.forEach(value, function (value2, key2) {

                        currentArray = key1;
                        //Estatusid = 2, indica que el registro ya se encuentra relacionado                                                                                                       //LQMA 01042018 esCargo  
                        conciliacionDetalleRegistroRepository.insertPuntoDeposito($scope.newId, value2.idAuxiliarContable, value2.movConcepto, 2, 3, 1, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.tipoPunteo, $rootScope.userData.idUsuario, 0, value2.esCargo).then(function (result) {

                            var resultado = result.data;
                            console.log( 'resultInserrPunteoDeposito', result.data );
                        });
                    });

                });
                $scope.refreshGrids();
                alertFactory.success('Registros Contables guardados correctamente!!');
            }
            //*********************************************************Fin de la función que inserta el grupo de registros de Contabilidad cargos- abonos
            if ($scope.abonoCargoBanco.length > 0) {
                $scope.tipoPunteo = 2;
                $scope.newId = JSON.parse(localStorage.getItem('idRelationOfBancoRows'));
                if ($scope.newId.length == 0) {
                    $scope.newId = 0;
                }
                else {
                    $scope.newId = $scope.newId[0].idRelationOfBancoRows;
                }

                var currentArray = undefined;
                //LQMA add 10032018
                var idBmerPadre = $scope.abonoCargoBanco[0][0].idBmer

                angular.forEach($scope.abonoCargoBanco, function (value, key1) {

                    if (key1 != currentArray) {
                        $scope.newId = $scope.newId + 1
                    }

                    angular.forEach(value, function (value2, key2) {
                        currentArray = key1;
                        console.log('ooooooo', value2)                                                                      //Estatusid = 0, no se cambia el estatus del registro bancario, 4 el tipo de relación abono- cargo Bancario //LQMA add 10032018 - idBmerPadre //LQMA 01042018 esCargo
                        conciliacionDetalleRegistroRepository.insertPunteoBancoCargoAbono(value2.idBmer, $scope.newId, value2.concepto, 0, 4, 2, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.tipoPunteo, idBmerPadre, value2.esCargo, 0).then(function (result) {
                            var resultado = result.data;
                            console.log( 'resultinsertPunteoBancoCargoAbono', result );
                        });

                    });

                });

                $scope.refreshGrids();
                alertFactory.success('Registros Bancarios guardados correctamente!!');
            }


            if ($scope.punteoBanco.length >= 1 && $scope.punteoAuxiliar.length >= 1) {
                $scope.tipoPunteo = 1;
                var currentColorAux = undefined, currentColorBanc = undefined;
                var currentArray = undefined;
                var controlPunteoGrupos = undefined;
                //Se declaran las variables que identificarán a los grupos conciliados, sea por color o un indice númerico asignado previamente a la clasificación
                var idPrepAuxiliar = undefined;
                var idPrepBanco = undefined;
                var idColorAuxiliar = undefined;
                var idColorBanco = undefined;
                //Fin de la declaración de variables para identificar grupos conciliados en auxiliar contable

                angular.forEach($scope.punteoAuxiliar, function (valueAux1, keyAux1) {

                    angular.forEach(valueAux1, function (valueAux2, keyAux2) {

                        var valueAuxiliar = valueAux2.idAuxiliarContable;
                        var conceptoPago = valueAux2.movConcepto;
                        currentColorAux = valueAux2.color;
                        var esCargoContable = valueAux2.esCargo;


                        if (valueAux2.indexPrePunteo != 99999 && valueAux2.indexPrePunteo != -1 && currentColorAux == '#c9dde1') {
                            idPrepAuxiliar = valueAux2.indexPrePunteo;
                        }

                        //Validación que verifica el color del grupo de selección a conciliar en auxiliar contable
                        if (valueAux2.color != undefined && currentColorAux != '#c9dde1') {
                            idColorAuxiliar = valueAux2.color;
                        }
                        //Fin de validación



                        angular.forEach($scope.punteoBanco, function (valueBanco1, keyBanco1) {

                            angular.forEach(valueBanco1, function (valueBanco2, keyBanco2) {

                                currentColorBanc = valueBanco2.color;

                                //Validación que verifica si es un registro prepunteado en registros Contables   
                                if (valueBanco2.indexPrePunteo != 99999 && valueBanco2.indexPrePunteo != -1 && currentColorBanc == '#c9dde1') {
                                    idPrepBanco = valueBanco2.indexPrePunteo;
                                }

                                //Validación que verifica el color del grupo de selección a conciliar en auxiliar contable
                                if (valueBanco2.color != undefined && currentColorBanc != '#c9dde1') {
                                    idColorBanco = valueBanco2.color;
                                }
                                //Fin de validación

                                if (controlPunteoGrupos != undefined) {
                                    controlPunteoGrupos == undefined;
                                }

                                if (idColorAuxiliar == idColorBanco && idColorAuxiliar != undefined && idColorBanco != undefined && currentColorBanc != '#c9dde1' && currentColorAux != '#c9dde1') {
                                    controlPunteoGrupos = 1;
                                    //Estatusid = 2, indica que el registro ya se encuentra relacionado
                                    conciliacionDetalleRegistroRepository.insertPuntoDeposito(valueBanco2.idBmer, valueAuxiliar, conceptoPago, 2, 2, 1, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.tipoPunteo, $rootScope.userData.idUsuario, valueBanco2.esCargo, esCargoContable).then(function (result) {
                                        if (result.data[0].length) {
                                            console.log('Respuesta Incorrecta');
                                            $scope.punteoAuxiliar = [];
                                            $scope.punteoBanco = [];

                                        } else {
                                            console.log('Respuesta Correcta');
                                        }
                                    });
                                }
                                else if (idPrepAuxiliar == idPrepBanco && controlPunteoGrupos == undefined && currentColorBanc == '#c9dde1' && currentColorAux == '#c9dde1') {
                                    //Estatusid = 2, indica que el registro ya se encuentra relacionado
                                    conciliacionDetalleRegistroRepository.insertPuntoDeposito(valueBanco2.idBmer, valueAuxiliar, conceptoPago, 2, 2, 1, $scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.tipoPunteo, $rootScope.userData.idUsuario, esCargo, '3').then(function (result) {
                                        if (result.data[0].length) {
                                            console.log('Respuesta Incorrecta');
                                            $scope.punteoAuxiliar = [];
                                            $scope.punteoBanco = [];

                                        } else {
                                            console.log('Respuesta Correcta');
                                        }
                                    });
                                }

                            });

                        });
                    });

                });
            }

        }, 3000);

        setTimeout(function () {
            $scope.refreshGrids();
            $('#loading').modal('hide');
            alertFactory.success('Registros guardados correctamente!!');
        }, 10000);

        ///*********************QUEDA PENDIENTE PARA OBJETOS MAYORES A 150 ITEMS RO 2017-10-24
    };
    //****************************************************************************************************

     // INICIA funcion para guardar los registros DPI
    //****************************************************************************************************
    $scope.guardaDPIs = function() {

        $('#alertaGuardarDPI').modal('hide');
        //Mando a llamar la función que obtendrá los nuevos datos almacenados en localstorage
        $scope.init();
        
        var idUsuario = $rootScope.userData.idUsuario;
        var contRegBancos = 0;
        var contRegAuxiliar = 0; 

        if($scope.punteoAuxiliar != null){
         alertFactory.warning('Acción incorrecta, no es posible enviar a DPI los Abonos o Cargos Contables seleccionados');
         } else {
        if($scope.DPIdata.length > 0){
          
                angular.forEach($scope.DPIdata, function(value, key) {
                  if(value.cargo == 0){
                conciliacionDetalleRegistroRepository.insertDepositosDPI(value.idBmer, value.idBanco, $scope.busqueda.IdEmpresa, idUsuario).then(function(result) {
                })
                contRegBancos += 1;
            }else{
                  contRegAuxiliar += 1;
            }
            });
                if(contRegBancos > 0){
                $scope.refreshGrids();
                alertFactory.success('Los registros seleccionados se han modificado correctamente!');
                }
                if(contRegAuxiliar > 0){
                alertFactory.warning('No es posible enviar cargos bancarios a DPI, por favor verifique su selección');
                }
                
    }
    }      
    };
    //****************************************************************************************************

    $scope.refreshGrids = function(){
      $window.location.reload();
    };
    

    // INICIA Se genera modal de alerta para que el usuario acepte o rechace generar el punteo definitivo
    //****************************************************************************************************
    $scope.generaAlertaPunteo = function() {
      $scope.init(); //Se inicialisa la funsión para obtener la información de localStorage
        if ($scope.bancoPadre.length > 0 || $scope.auxiliarPadre.length > 0) {
            $('#alertaPunteo').modal('show');
        } else {
            alertFactory.error('No existen punteos')
        }
    };
    //****************************************************************************************************
    $scope.comeBack = function(){
        console.log( 'comeBack' );
        localStorage.setItem('comeBack', true)
        $window.location.href = "/conciliacionInicio";
    }
    

});