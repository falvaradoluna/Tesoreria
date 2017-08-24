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
          },

          generateLayout: function(banco, codigo, idBanco) {
            return $http({
                url: excelExportURL + 'create/',
                method: "GET",
                params:{
                    NombreBanco: banco,
                    codigo: codigo,
                    idBanco: idBanco
                },                
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    //Fin de la llave Return  
	 };
});