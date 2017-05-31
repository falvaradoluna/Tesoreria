var conciliacionURL = global_settings.urlCORS + 'api/conciliacion/';

registrationModule.factory('conciliacionRepository', function($http) {
    return {
        getAbonoContable: function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
            return $http({
                url: conciliacionURL + 'abonoContable/',
                method: "GET",
                params: {
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta, 
                    cuentaContable: cuentaContable,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getCargoContable: function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
            return $http({
                url: conciliacionURL + 'cargoContable/',
                method: "GET",
                params: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta, 
                    cuentaContable: cuentaContable,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getCargoBancario: function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
            return $http({
                url: conciliacionURL + 'cargoBancario/',
                method: "GET",
                params: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta, 
                    cuentaContable: cuentaContable,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getAbonoBancario: function(idEmpresa, fInicial, fFinal, opcion,idBanco,noCuenta,cuentaContable) {
            return $http({
                url: conciliacionURL + 'abonoBancario/',
                method: "GET",
                params: {                    
                    idBanco: idBanco,                    
                    idEmpresa: idEmpresa,
                    noCuenta: noCuenta, 
                    cuentaContable: cuentaContable,
                    opcion: opcion
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDepositosPendientes: function(idUsuario, idEstatus, idTipoAuxiliar,idDepositoBanco) {
            return $http({
                url: conciliacionURL + 'depositosPendientes/',
                method: "GET",
                params: {                    
                    idUsuario: idUsuario,                    
                    idEstatus: idEstatus,
                    idTipoAuxiliar: idTipoAuxiliar,
                    idDepositoBanco: idDepositoBanco
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    }
});
