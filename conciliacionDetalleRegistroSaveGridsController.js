registrationModule.controller('conciliacionDetalleRegistroSaveGridsController',function($window ,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory){
    
  
     $scope.init = function(){
        //Obtengo la información almacenada, se genera en conciliacionRegistroGridsController
        $scope.punteoAuxiliar = JSON.parse(localStorage.getItem('infoGridAuxiliar'));
        $scope.punteoBanco = JSON.parse(localStorage.getItem('infoGridBanco'));
        $scope.totalesGrids = JSON.parse(localStorage.getItem('totalesGrids'));
        $scope.bancoPadre = JSON.parse(localStorage.getItem('bancoPadre'));
        $scope.auxiliarPadre = JSON.parse(localStorage.getItem('auxiliarPadre'));
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        //Asigno los totales correspondientes a cada saldo
        if($scope.totalesGrids != null){
        $scope.abonoAuxiliar = $scope.totalesGrids.abonoAuxiliar;
        $scope.cargoAuxiliar = $scope.totalesGrids.cargoAuxiliar;
        $scope.abonoBanco = $scope.totalesGrids.abonoBanco;
        $scope.cargoBanco = $scope.totalesGrids.cargoBanco;
        $scope.difMonetaria = $scope.totalesGrids.diferenciaMonetaria;
    }
     };

     // INICIA Se guarda el punteo que ya no podra ser modificado
    //****************************************************************************************************
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo($scope.busqueda.IdEmpresa, $scope.busqueda.IdBanco, $scope.busqueda.CuentaContable, $scope.busqueda.Cuenta).then(function(result) {
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
     


    $scope.GuardarGrid = function() {
    	$('#alertaGuardarPunteoPrevio').modal('hide');
       //Mando a llamar la función que obtendra la nueva información almacenada
         $scope.init();

        //El tipo 3 pertenece al punteo solo de Registros Contables  
        if($scope.punteoAuxiliar.length > 0 && $scope.punteoBanco.length == 0){
           if ($scope.punteoAuxiliar.length > 0) {
                if ($scope.punteoAuxiliar.length >= 2) {
                    if ($scope.cargoAuxiliar != 0 && $scope.abonoAuxiliar != 0){
                          $scope.verificaCantidades(3); //El numero 3 corresponde al punteo de cargos - abonos de los registros del Auxiliar Contable 
                    } 
                }else{
                 alertFactory.warning('Debes seleccionar mas de un registro para realizar la conciliación Contable');
                }
            } else {
                alertFactory.warning('No ha seleccionado ninguna relación de registros Contables');
            }
         }else {   
                if ($scope.punteoAuxiliar.length > 0 && $scope.punteoBanco.length > 0) {
                    if ($scope.punteoAuxiliar.length >= 1 || $scope.punteoBanco.length >= 1) {
                        if ($scope.cargoBanco != 0 && $scope.abonoBanco != 0) {
                            alertFactory.warning('No se puede seleccionar abono y cargo de registros Bancarios al mismo tiempo');
                        } else {
                            $scope.verificaCantidades(2); //El numero 2 corresponde al punteo de cargos - abonos de Registros Bancarios y Contables 
                        }
                    } 
                } else {
                    alertFactory.warning('No ha seleccionado ninguna relación');
                }
             }

    };
    //****************************************************************************************************


    // INICIA funcion que verifica que la cantidad sea igual o mas menos $scope.difMonetaria, parametrizado según la empresa en curso 
    //****************************************************************************************************
    $scope.verificaCantidades = function(tipopunteo) {

    if($scope.abonoAuxiliar != 0 && $scope.cargoAuxiliar != 0 && $scope.punteoBanco.length == 0) {
      
      if ((($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoAuxiliar + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoAuxiliar + $scope.difMonetaria)))
      {
           $scope.guardaPunteo(tipopunteo); 
      } else{
        alertFactory.error('La cantidad de abono y cargo del Auxiliar Contable no coinciden');
      }

    } 
    else{
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
            }

        }
    };
    //****************************************************************************************************
    // INICIA funcion para guardar el punteo
    //****************************************************************************************************
    $scope.guardaPunteo = function(tipopunteo) {
    
    if (tipopunteo == 3){ // Entra a guardar los registros conciliados de Contabilidad cargos- abonos
           $scope.newId = JSON.parse(localStorage.getItem('idRelationOfContableRows'));
            if($scope.newId.length == 0){
               $scope.newId = 0;
            }      
           else{
               $scope.newId = $scope.newId[0].idRelationOfContableRows;
              }

               angular.forEach($scope.punteoAuxiliar, function(value, key){   
                                                                         //Estatusid = 2, indica que el registro ya se encuentra relacionado
               conciliacionDetalleRegistroRepository.insertPuntoDeposito($scope.newId + 1, value.idAuxiliarContable, value.movConcepto, 2, tipopunteo).then(function(result){
               
               var resultado = result.data;  

               }) 
           });
           $scope.refreshGrids();
           alertFactory.success('Registros Contables guardados correctamente!!');
          }
    else{
            angular.forEach($scope.punteoAuxiliar, function(value, key) {
                var valueAuxiliar = value.idAuxiliarContable;
                var conceptoPago = value.movConcepto;

                //Se declaran las variables que identificarán a los grupos conciliados, sea por color o un indice númerico asignado previamente a la clasificación
                var idPrepAuxiliar = undefined;
                var idPrepBanco = undefined;
                var idColorAuxiliar = undefined;
                var idColorBanco = undefined;
                //Fin de la declaración de variables para identificar grupos conciliados en auxiliar contable


                //Validación que verifica si es un registro prepunteado en auxiliar contable   
                if(value.indexPrePunteo != 99999){
                   idPrepAuxiliar = value.indexPrePunteo;
                }
                //Fin de validación registro prepunteado

                //Validación que verifica el color del grupo de selección a conciliar en auxiliar contable
                if(value.color != undefined && value.color != '#c9dde1'){
                 idColorAuxiliar = value.color;
                }
                //Fin de validación

                angular.forEach($scope.punteoBanco, function(value, key) {

                //Validación que verifica si es un registro prepunteado en registros Bancarios   
                if(value.indexPrePunteo != 99999){
                   idPrepBanco = value.indexPrePunteo;
                }

                //Validación que verifica el color del grupo de selección a conciliar en Registros Bancarios
                if(value.color != undefined && value.color != '#c9dde1'){
                 idColorBanco = value.color;
                }
                //Fin de validación


                 //Inicio de la inserción que se aplica solo para los registros prepunteados Bancos
                 if(idPrepAuxiliar != undefined && idPrepBanco != undefined)
                 {
                if(idPrepAuxiliar == idPrepBanco){
                                                                          //Estatusid = 2, indica que el registro ya se encuentra relacionado
                    conciliacionDetalleRegistroRepository.insertPuntoDeposito(value.idBmer, valueAuxiliar, conceptoPago, 2, tipopunteo).then(function(result) {
                        if (result.data[0].length) {    
                            console.log('Respuesta Incorrecta');
                            $scope.punteoAuxiliar = [];
            				        $scope.punteoBanco = [];
                        
                        } else {
                            console.log('Respuesta Correcta');
                        }
                    })
                  }
                }
                 //Fin de la funsión que inserta registros prepunteados

                
                //Inicio de la inserción que se aplica solo para los registros agrupados por color 
                 if(idColorBanco != undefined && idColorAuxiliar != undefined)
                 {
                if(idColorBanco == idColorAuxiliar){
                                                                          //Estatusid = 2, indica que el registro ya se encuentra relacionado
                    conciliacionDetalleRegistroRepository.insertPuntoDeposito(value.idBmer, valueAuxiliar, conceptoPago, 2, tipopunteo).then(function(result) {
                        if (result.data[0].length) {    
                            console.log('Respuesta Incorrecta');
                            $scope.punteoAuxiliar = [];
                            $scope.punteoBanco = [];
                        
                        } else {
                            console.log('Respuesta Correcta');
                        }
                    })
                  }
                }
                 //Fin de la funsión que inserta registros agrupados por color
              });
            });
            $scope.refreshGrids();
           alertFactory.success('Registros guardados correctamente!!');
       }

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
        if($scope.punteoBanco.length > 0){
          
                angular.forEach($scope.punteoBanco, function(value, key) {
                  if(value.cargo == 0){
                conciliacionDetalleRegistroRepository.insertDepositosDPI(value.idBmer, value.idBanco,idUsuario).then(function(result) {
                    if (result.data[0].ESTATUS == 2) {
                        console.log('Respuesta Correcta');
                    } else {
                        console.log('Respuesta Incorrecta');
                    }
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

});