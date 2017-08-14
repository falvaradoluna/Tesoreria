var excelExportURL =   global_settings.urlCORS + 'api/excelExport/';

registrationModule.factory('excelExportRepository', function($http){
	return{

        sendExcelData: function(idBmer, idBanco, txtOrigen, registro, noMovimiento, referencia, concepto){
             return $http({
                        url: excelExportURL + 'insExcel/',
		                method: "GET",
		                params: {                    
		                    idBmer: idBmer,
		                    idBanco: idBanco,
		                    txtOrigen: txtOrigen,
		                    registro: registro,
		                    noMovimiento: noMovimiento,
		                    referencia: referencia,
		                    concepto: concepto
		                },
		                headers: {
		                    'Content-Type': 'application/json'
		                }

             }); 
          }


          
	 };
});