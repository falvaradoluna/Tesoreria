var excelExportURL =   global_settings.urlCORS + 'api/excelExport/';

registrationModule.factory('excelExportRepository', function($http){
	return{

        sendExcelDataScotibank: function(NoCuenta, Fecha, Cargo, Abono, Tipo, Transaccion, Leyenda1, Leyenda2, claveLayout){
             return $http({
                        url: excelExportURL + 'insExcelScotiabank/',
		                method: "GET",
		                params: {                    
		                    NoCuenta: NoCuenta,
		                    Fecha: Fecha,
		                    Cargo: Cargo,
		                    Abono: Abono,
		                    Tipo: Tipo,
		                    Transaccion: Transaccion,
		                    Leyenda1: Leyenda1,
                        Leyenda2: Leyenda2,
                        claveLayout: claveLayout
		                },
		                headers: {
		                    'Content-Type': 'application/json'
		                }

             }); 
          },


          sendExcelDataBanamex: function(NoCuenta, Fecha, Descripcion, Sucursal, Referencia_Numerica, Referencia_Alfanumerica, Autorizacion, Depositos, Retiros, claveLayout){
             return $http({
                        url: excelExportURL + 'insExcelBanamex/',
                    method: "GET",
                    params: {                    
                        NoCuenta: NoCuenta,
                        Fecha: Fecha,
                        Descripcion: Descripcion,
                        Sucursal: Sucursal,
                        Referencia_Numerica: Referencia_Numerica,
                        Referencia_Alfanumerica: Referencia_Alfanumerica,
                        Autorizacion: Autorizacion,
                        Depositos: Depositos,
                        Retiros: Retiros,
                        claveLayout: claveLayout
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }

             }); 
          },

          sendExcelDataInbursa: function(NoCuenta, Fecha, Referencia, Referencia_Leyenda, Referencia_Numerica, Cargo, Abono, Ordenante, claveLayout){
             return $http({
                        url: excelExportURL + 'insExcelInbursa/',
                    method: "GET",
                    params: {                    
                        NoCuenta: NoCuenta,
                        Fecha: Fecha,
                        Referencia: Referencia,
                        Referencia_Leyenda: Referencia_Leyenda,
                        Referencia_Numerica: Referencia_Numerica,
                        Cargo: Cargo,
                        Abono: Abono,
                        Ordenante: Ordenante,
                        claveLayout: claveLayout
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }

             }); 
          },

          generateLayoutScotiabank: function(banco, codigo, idBanco){
            return $http({
                url: excelExportURL + 'createScotiabank/'
                ,method: "GET",
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

        generateLayoutBanamex: function(banco, codigo, idBanco){
            return $http({
                url: excelExportURL + 'createBanamex/'
                ,method: "GET",
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

        generateLayoutInbursa: function(banco, codigo, idBanco){
            return $http({
                url: excelExportURL + 'createInbursa/'
                ,method: "GET",
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

        historyLayout : function(nombreBanco, idBanco, claveLayout, accion){
         return $http({
              url: excelExportURL + 'insHistoryLayout/',
              method: "GET",
              params: {
                       nombreBanco: nombreBanco,
                       idBanco: idBanco,
                       claveLayout: claveLayout,
                       accion: accion
              },
              headers: {
                'Content-Type': 'application/json'
              }
         });
        }
        
    //Fin de la llave Return  
	 };
});