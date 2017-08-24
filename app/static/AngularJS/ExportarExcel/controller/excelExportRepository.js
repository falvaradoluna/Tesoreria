var excelExportURL =   global_settings.urlCORS + 'api/excelExport/';

registrationModule.factory('excelExportRepository', function($http){
	return{

        sendExcelData: function(NoCuenta, Fecha, Cargo, Abono, Tipo, Transaccion, Leyenda1, Leyenda2){
             return $http({
                        url: excelExportURL + 'insExcel/',
		                method: "GET",
		                params: {                    
		                    NoCuenta: NoCuenta,
		                    Fecha: Fecha,
		                    Cargo: Cargo,
		                    Abono: Abono,
		                    Tipo: Tipo,
		                    Transaccion: Transaccion,
		                    Leyenda1: Leyenda1,
                            Leyenda2: Leyenda2
		                },
		                headers: {
		                    'Content-Type': 'application/json'
		                }

             }); 
          },

          generateLayout: function(banco, codigo, idBanco){
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
        },

        historyLayout : function(nombreBanco, idBanco, claveLayout){
         return $http({
              url: excelExportURL + 'insHistoryLayout/',
              method: "GET",
              params: {
                       nombreBanco: nombreBanco,
                       idBanco: idBanco,
                       claveLayout: claveLayout
              },
              headers: {
                'Content-Type': 'application/json'
              }
         });
        }
        
    //Fin de la llave Return  
	 };
});