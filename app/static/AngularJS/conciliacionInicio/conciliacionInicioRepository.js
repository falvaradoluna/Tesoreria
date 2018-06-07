var conciliacionInicioURL = global_settings.urlCORS + 'api/conciliacionInicio/';

registrationModule.factory('conciliacionInicioRepository', function($http) {
    return {       

    	getTotalAbonoCargo: function(idBanco,idEmpresa,noCuenta,cuentaContable,fechaE,fechaC,polizaPago,opcion,idUsuario) { //LQMA add 06032018 idUsuario
            
            return $http({
                url: conciliacionInicioURL + 'totalAbonoCargo/',
                method: "POST",
                data: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta,	
                    cuentaContable: cuentaContable,
                    fechaElaboracion: fechaE,
                    fechaCorte: fechaC,
                    polizaPago: polizaPago,
                    opcion: opcion,
                    idUsuario: idUsuario //LQMA add 06032018
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getGerenteContador: function(idUsuario, idEmpresa) {
            return $http({
                url: conciliacionInicioURL + 'gerenteContador/',
                method: "GET",
                params: {                    
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getReporteTesoreria: function(myJson) {
            return $http({
                //LQMA changed 01022018
                //url: 'http://189.204.141.193:5488/api/report',
                url: 'http://192.168.20.89:5488/api/report',
                method: "POST",
                data: {
                    template: { name: myJson.template.name },
                    data: myJson.data
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        },
        //Ing. LAGP03052018
        getMeses: function() {
            return $http({
                url: conciliacionInicioURL + 'meses/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        //Ing. LAGP05062018
        getUltimoMes: function( anio ) {
            return $http({
                url: conciliacionInicioURL + 'ultimoMes/',
                method: "GET",
                params: {
                    anio: anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        //Ing. LAGP06062018
        getcloseMes: function( mes, anio ) {
            return $http({
                url: conciliacionInicioURL + 'closeMes/',
                method: "GET",
                params: {
                    mes: mes,
                    anio: anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        addMovimientoBancario: function( parametros ) {
            return $http({
                url: conciliacionInicioURL + 'addMovimientoBancario/',
                method: "GET",
                params: parametros,
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }

//Fin de la llave "return"
    };
});
