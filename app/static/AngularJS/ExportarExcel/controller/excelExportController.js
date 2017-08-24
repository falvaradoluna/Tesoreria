registrationModule.controller('excelExportController', function($scope, alertFactory, excelExportRepository){
    
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


    $scope.init = function(){
          $scope.enableButton = false;
          $scope.bancoLayout=[
           {"Nombre": "SCOTIABANK", "idBanco": 4},
           {"Nombre": "BANAMEX", "idBanco": 5}
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
            reader.onload = function (e) {
                var data = e.target.result;
                //XLSX from js-xlsx library , which I will add in page view page
                var workbook = XLSX.read(data, { type: 'binary' });
                var sheetName = workbook.SheetNames[0];
                var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (excelData.length > 0) {
                    //Save data
                    angular.forEach(excelData, function(value,key){
                      excelExportRepository.sendExcelData(value.idBmer, value.IDBanco, value.txtOrigen, value.registro,	value.noMovimiento, value.referencia, value.concepto).then(function(result){
                      }, function(error){
    						console.log("Error en la migración de datos", error);
    						$('#loading').modal('hide');
    					});
                    });
                    alertFactory.success("Base de datos Actualizada	 correctamente!");
                    $scope.enableButton = false;
                  }
                else {
                    $scope.Message = "No data found";
                }
            }
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
      excelExportRepository.generateLayout($scope.bancoActual, $scope.password, $scope.idBanco).then(function(result){
                var Resultado = result.data;
                window.open('AngularJS/ExportarExcel/' + Resultado.Name);
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

});