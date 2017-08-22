registrationModule.controller('excelExportController', function($scope, $uibModalInstance, $uibModal, alertFactory, excelExportRepository){
    
    //Declaración de Variables locales
    $scope.selectedFile = null;
    $scope.enableButton = false;

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

    $scope.Cancel = function(){
     $uibModalInstance.dismiss('cancel');
    };
    
    $scope.downloadLayout = function(){
     
      excelExportRepository.generateLayout().then(function(result){
                //var Resultado = result.data;
                window.open('ExportarExcel/' + Resultado.Name);
            }, function(error){
                console.log("Error", error);
            });

    };

});