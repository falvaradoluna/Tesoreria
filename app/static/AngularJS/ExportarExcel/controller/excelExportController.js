registrationModule.controller('excelExportController', function($scope, alertFactory, excelExportRepository, $window){
    
    //Declaración de Variables locales
    $scope.selectedFile = null;
    $scope.enableButton = false;
    $scope.bancoActual = '';
    $scope.idBanco = 0;
    

    //Variables para generar código automático
    $scope.passwordLength = 12;
    $scope.addUpper       = true;
    $scope.addNumbers     = true;
    $scope.addSymbols        = true;
    $scope.password = '';


    $scope.init = function() {
          $scope.enableButton = false;
          $scope.bancoLayout=[
           {"Nombre": "SCOTIABANK", "idBanco": 4},
           {"Nombre": "BANAMEX", "idBanco": 2},
           {"Nombre": "INBURSA", "idBanco": 5}
          ];
    };
     
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
               
                var sheetName = workbook.SheetNames[0];
                var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (excelData.length > 0) {
                    //Save data
                    if(workbook.Strings[1].h == 4){
                    //Inicio para el registro de datos Scotiabank
                    angular.forEach(excelData, function(value,key){                                                                                                             //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataScotibank(value.No_Cuenta, value.Fecha, value.Cargo, value.Abono, value.Tipo, value.Transaccion, value.Leyenda_1, value.Leyenda_2, workbook.Strings[0].h).then(function(result){
                        console.log(result.data);
                      }, function(error){
                            alertFactory.warning(error);
                						$('#loading').modal('hide');
    					         });
                    });
                    //Fin para el registro de datos Scotiabank
                   }

                   if(workbook.Strings[1].h == 5){

                    //Inicio para el registro de datos Banamex
                    angular.forEach(excelData, function(value,key){                                                                                                                                                                            //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataBanamex(value.No_Cuenta, value.Fecha, value.Descripcion, value.Sucursal, value.Referencia_Numerica, value.Referencia_Alfanumerica, value.Autorizacion, value.Depositos, value.Retiros, workbook.Strings[0].h).then(function(result){
                        console.log(result);
                      }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                       });
                    });
                    //Fin para el registro de datos Banamex

                   }
                   if(workbook.Strings[1].h == 6){

                    //Inicio para el registro de datos Inbursa
                    angular.forEach(excelData, function(value,key){                                                                                                                                              //Dato de la clave Layout del documento en curso
                      excelExportRepository.sendExcelDataInbursa(value.No_Cuenta, value.Fecha, value.Referencia, value.Referencia_Leyenda, value.Referencia_Numerica, value.Cargo, value.Abono, value.Ordenante, workbook.Strings[0].h).then(function(result){
                        console.log(result.data);
                      }, function(error){
                            alertFactory.warning(error);
                            $('#loading').modal('hide');
                       });
                    });
                    //Fin para el registro de datos Inbursa

                   }

                    alertFactory.success("Base de datos Actualizada	 correctamente!");
                    //$scope.enableButton = false;
                    $scope.reload();
                  }
                else {
                    alertFactory.error("El archivo que intenta migrar no contiene datos, por favor verifique el contenido del archivo!");
                }

                }else{
                    alertFactory.error("El documento que intenta migrar no esta registrado en el sistema, verifique su seleccion o descargue la plantilla correspondiente.");
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
     
     if(idBanco == 4){
      excelExportRepository.generateLayoutScotiabank($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }
        if(idBanco == 5){
      excelExportRepository.generateLayoutBanamex($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }
        if(idBanco == 6){
      excelExportRepository.generateLayoutInbursa($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });
        }                                                                //Es la opcion para el SP para insertar registros en la TBL history_layout
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


    $scope.reload = function(){
      $window.location.reload();
    };

});