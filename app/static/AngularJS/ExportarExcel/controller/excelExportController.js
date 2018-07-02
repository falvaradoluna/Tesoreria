registrationModule.controller('excelExportController', function($scope, alertFactory, $rootScope, localStorageService,excelExportRepository, $window, filtrosRepository, $filter){
    
    //Declaración de Variables locales
    $scope.selectedFile = null;
    $scope.enableButton = false;
    $scope.bancoActual = '';
    $scope.idBanco = 0;
    $scope.showComboEmpresas = false;
    $rootScope.userData = localStorageService.get('userData');

    //Variables para generar código automático
    $scope.passwordLength = 12;
    $scope.addUpper       = true;
    $scope.addNumbers     = true;
    $scope.addSymbols        = true;
    $scope.password = '';
    $scope.bandera = 0;



    $scope.init = function() {
      $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
          $scope.enableButton = false;
          if($scope.busqueda == undefined || $scope.busqueda == null){
            $scope.showComboEmpresas = true;
          $scope.getEmpresa($rootScope.userData.idUsuario);
        }else{
          $scope.getBancos($scope.busqueda.IdEmpresa);
        }
        setTimeout( function(){
                $(".cargando").remove();
                }, 1500 );
    };

    $scope.getEmpresa = function(idUsuario) {
                    filtrosRepository.getEmpresas(idUsuario).then(
                        function(result) {
                            $scope.activaInputCuenta = true;
                            $scope.activaBotonBuscar = true;
                            if (result.data.length > 0) {
                                $scope.empresaUsuario = result.data;
                            }
                        });
                }
     
   $scope.leerExcel = function(files){
      $scope.$apply(function () { 
            $scope.Message = "";
            $scope.selectedFile = files[0];
           //Valido la extención del archivo 
            var ext = $scope.selectedFile.name.substr($scope.selectedFile.name.lastIndexOf('.')+1);
            if(ext != "xlsx"){
                alertFactory.warning("El archivo seleccionado es incorrecto, por favor verifique su selección.");
            	return;
            }

        });
   };
   $scope.count = 0;
   $scope.grupoIns = 0;
    $scope.newParseExcelDataAndSave = function () {
        var file = $scope.selectedFile;
        if (file != null) {
            $scope.enableButton = true;
            var reader = new FileReader();
            reader.onload = function (e) {//Inicio de la funcion antes de leer el archivo
                $scope.bandera = 0;
                var data = e.target.result;
                //XLSX from js-xlsx library , which I will add in page view page
                var workbook = XLSX.read(data, { type: 'binary' });
                var excelObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
                if( $scope.count == excelObject.length ){
                    setTimeout(function(){
                        swal('LISTO', 'Se cargo con éxito', 'success');
                    },1500);
                    $scope.count = 0;
                }else{
                    excelExportRepository.sendExcelDataLayout(
                        excelObject[$scope.count].NoCuenta, 
                        excelObject[$scope.count].Fecha, 
                        excelObject[$scope.count].Descripcion, 
                        excelObject[$scope.count].Referencia, 
                        excelObject[$scope.count].DescripcionAmpliada,
                        excelObject[$scope.count].TipoMovimiento,
                        excelObject[$scope.count].Cargo,
                        excelObject[$scope.count].Abono,
                        $scope.grupoIns
                    )
                    .then(function(result){
                        console.log(result);
                    }, function(error){
                        alertFactory.warning(error);
                        $('#loading').modal('hide');
                    });
                    //console.log( excelObject[$scope.count].NoCuenta);
                    $scope.count = $scope.count + 1;
                    $scope.newParseExcelDataAndSave();
                }
                /*angular.forEach(excelObject, function (value) {
                    excelExportRepository.sendExcelDataLayout(
                        value.NoCuenta, 
                        value.Fecha, 
                        value.Descripcion, 
                        value.Referencia, 
                        value.DescripcionAmpliada,
                        value.TipoMovimiento,
                        value.Cargo,
                        value.Abono
                    )
                    .then(function(result){
                        console.log(result);
                        }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                        });
                });

                setTimeout(function(){
                    swal('LISTO', 'Se cargo con éxito', 'success');
                },1500);*/

            }//Fin de la función antes de leer el archivo
            reader.onerror = function (ex) {
                console.log(ex);
            }

            reader.readAsBinaryString(file);
        } else {
            alertFactory.warning("No has seleccionado un archivo!");
        }
    };

       //Parse Excel Data 
    $scope.ParseExcelDataAndSave = function () {
        var file = $scope.selectedFile;
        if (file != null) {
        	$scope.enableButton = true;
            var reader = new FileReader();
            reader.onload = function (e) {//Inicio de la funcion antes de leer el archivo

                var data = e.target.result;
                //XLSX from js-xlsx library , which I will add in page view page
                var workbook = XLSX.read(data, { type: 'binary' });
               
               //Inicio de la validacion del archivo                                                  
                                                                                                      //1 es la acción dentro de SP para validar si exste el archivo en curso registrado 
               excelExportRepository.historyLayout(" ", workbook.Strings[1].h, workbook.Strings[0].h, 1).then(function(result){
               if (result.data[0].Resultado == 1){      
               $scope.bandera = 0;
                var sheetName = workbook.SheetNames[0];
                var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (excelData.length > 0) {
                    //Save data
                    if(workbook.Strings[1].h == 4){
                    //Inicio para el registro de datos Scotiabank
                    angular.forEach(excelData, function(value,key){       //idBanco desde layout

                    if(value.Fecha.length < 10 || value.Fecha.indexOf('/') == 0){
                         if ($scope.bandera == 0){
                         $scope.bandera = 1;
                         alertFactory.error('El formato de fecha del documento es erroneo, por favor verifique el formato "(dd/MM/yyyy)"...');
                         setTimeout(function() {
                            
                            }, 2000);
                         }
                       }
                       else if(value.Fecha.length == 10 || value.Fecha.indexOf('/') != 0) {                                                                                                      //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataScotibank( workbook.Strings[1].h,value.No_Cuenta, value.Fecha, value.Referencia_Numerica, value.Cargo, value.Abono, value.Tipo, value.Transaccion, value.Leyenda_1, value.Leyenda_2, workbook.Strings[0].h).then(function(result){
                        console.log(result.data);
                      }, function(error){
                            alertFactory.warning(error);
                						$('#loading').modal('hide');
    					         });
                      }
                    });
                    //Fin para el registro de datos Scotiabank
                   }

                   if(workbook.Strings[1].h == 2){

                    //Inicio para el registro de datos Banamex
                    angular.forEach(excelData, function(value,key){   //idBanco desde layout                                                                                                                                                                         //Dato de la clave Layout del documento en curso
                       
                       if(value.Fecha.length < 10 || value.Fecha.indexOf('/') == 0){
                         if ($scope.bandera == 0){
                         $scope.bandera = 1;
                         alertFactory.error('El formato de fecha del documento es erroneo, por favor verifique el formato "(dd/MM/yyyy)"...');
                         setTimeout(function() {
                            
                            }, 2000);
                         }
                       }
                       else if(value.Fecha.length == 10 || value.Fecha.indexOf('/') != 0) {
                      	var dep = value.Depositos;//LQMA
                        var ret = value.Retiros;//LQMA
			//LQMA
                      	excelExportRepository.sendExcelDataBanamex(workbook.Strings[1].h,value.No_Cuenta, value.Fecha, value.Descripcion, value.Sucursal, value.Tipo_Transaccion,value.Referencia_Numerica, value.Referencia_Alfanumerica, value.Autorizacion, (dep != undefined)?dep.replace(',',''):dep,(ret != undefined)?ret.replace(',',''):ret, workbook.Strings[0].h).then(function(result){
                        console.log(result);
                      }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                       });
                      }

                    });
                    //Fin para el registro de datos Banamex

                   }
                   if(workbook.Strings[1].h == 5){

                    //Inicio para el registro de datos Inbursa
                    angular.forEach(excelData, function(value,key){    //idBanco desde layout

                      if(value.Fecha.length < 10 || value.Fecha.indexOf('/') == 0){
                         if ($scope.bandera == 0){
                         $scope.bandera = 1;
                         alertFactory.error('El formato de fecha del documento es erroneo, por favor verifique el formato "(dd/MM/yyyy)"...');
                         setTimeout(function() {
                            
                            }, 2000);
                         }
                       }
                       else if(value.Fecha.length == 10 || value.Fecha.indexOf('/') != 0) {                                                                                                                                          //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataInbursa(workbook.Strings[1].h,value.No_Cuenta, value.Fecha, value.Referencia, value.Referencia_Leyenda, value.Referencia_Numerica, value.Cargo, value.Abono, value.Ordenante, workbook.Strings[0].h).then(function(result){
                        console.log(result.data);
                      }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                       });
                      }
                    });
                    //Fin para el registro de datos Inbursa

                   }
                   
                   if(workbook.Strings[1].h == 6){

                    //Inicio para el registro de datos Carga Inicial
                    angular.forEach(excelData, function(value,key){  
                      if(value.Fecha.length < 10 || value.Fecha.indexOf('/') == 0){
                         if ($scope.bandera == 0){
                         $scope.bandera = 1;
                         alertFactory.error('El formato de fecha del documento es erroneo, por favor verifique el formato "(dd/MM/yyyy)"...');
                         setTimeout(function() {
                            
                            }, 2000);
                         }
                       }
                       else if(value.Fecha.length == 10 || value.Fecha.indexOf('/') != 0) {                                                                                                                                                                          //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataCargaInicial(value.No_Cuenta, value.Fecha, value.Concepto, value.Sucursal, value.Referencia, value.Referencia_Ampliada, value.Autorizacion, value.Abonos, value.Cargos, workbook.Strings[0].h).then(function(result){
                        console.log(result);
                      }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                       });
                      } 
                    });
                    //Fin para el registro de datos Carga Inicial

                   }
                     if($scope.bandera == 0){
                    alertFactory.success("Base de datos Actualizada	 correctamente!");
                    //$scope.enableButton = false;
                    setTimeout(function() {
                    $scope.reload();
                    }, 2000);
                  }
                  }
                else {
                    alertFactory.error("El archivo que intenta migrar no contiene datos, por favor verifique el contenido del archivo!");
                }

                }else{
                    alertFactory.error("El documento que intenta migrar no esta registrado en el sistema, verifique su selección o descargue la plantilla correspondiente.");
                   }
              }, function(error){
                  console.log("Error", error);
                });
//Fin de la validacion del archivo

            }//Fin de la función antes de leer el archivo
            reader.onerror = function (ex) {
                console.log(ex);
            }
 
            reader.readAsBinaryString(file);
        }else{
        	alertFactory.warning("No has seleccionado un archivo!");
        }
    };

    
    //Funcion que descarga los templates en formato xlsx
    $scope.downloadLayout = function(banco, idBanco){
     $scope.bancoActual = banco;
     $scope.idBanco = idBanco;
     $scope.createPassword();
     
     if(idBanco == 4){ // id correspondiente a Scotiabank
      excelExportRepository.generateLayoutScotiabank($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }
        if(idBanco == 2){ // id Correspondiente a Banamex
      excelExportRepository.generateLayoutBanamex($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }
        if(idBanco == 5){ // id Correspondiente a Inbursa
      excelExportRepository.generateLayoutInbursa($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }

        if(idBanco == 6){ // id Correspondiente a CargaInicial
      excelExportRepository.generateLayoutCargaInicial(banco, $scope.password, idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }
        //Funsion que inserta el registro del Layout descargado                                                                //Es la opcion para el SP para insertar registros en la TBL history_layout
      excelExportRepository.historyLayout(banco, idBanco, $scope.password, 2).then(function(result){
      
      }, function(error){
        console.log("Error", error);
      });
    };


    //Funcion que genera automaticamente códigos para los archivos de excel
    $scope.createPassword = function(){
        var lowerCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var upperCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var numbers = ['0','1','2','3','4','5','6','7','8','9'];
        var symbols = ['!', '"', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
        var finalCharacters = lowerCharacters;
        if($scope.addUpper){
            finalCharacters = finalCharacters.concat(upperCharacters);
        }
        if($scope.addNumbers){
            finalCharacters = finalCharacters.concat(numbers);
        }
        if($scope.addSymbols){
            finalCharacters = finalCharacters.concat(symbols);
        }
        var passwordArray = [];
        for (var i = 1; i < $scope.passwordLength; i++) {
            passwordArray.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
        };
        $scope.password = passwordArray.join("");
    }

    $scope.getBancos = function(idEmpresa) {
                    
                    if (idEmpresa == undefined || idEmpresa == null || idEmpresa == '') {
                        alertFactory.warning('Seleccione una Empresa');
                    } else {
                        filtrosRepository.getBancos(idEmpresa).then(function(result) {
                            if (result.data.length > 0) {
                                $scope.bancoLayout = $filter('filter')(result.data, function(value){    
                                                              return value.Layout == 1  });;
                            } else {
                                $scope.bancoLayout = [];
                            }
                        });
                    }
                }


    $scope.reload = function(){
      $window.location.reload();
    };

});