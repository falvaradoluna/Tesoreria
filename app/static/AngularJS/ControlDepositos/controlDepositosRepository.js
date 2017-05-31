var controlDepositosURL = global_settings.urlCORS + 'api/controlDepositos/';

registrationModule.factory('controlDepositosRepository', function($http) {
    return {

        createReference: function(objData) {

            return $http({
                url: controlDepositosURL + 'createReference/',
                method: "GET",
                params: objData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insertReferenceDetails: function(objData) {
            return $http({
                url: controlDepositosURL + 'insertReferenceDetails/',
                method: "GET",
                params: objData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getPendingReference: function() {
            return $http({
                url: controlDepositosURL + 'pendingReference/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getPendingReferenceDetails: function(idReferencia) {
            return $http({
                url: controlDepositosURL + 'pendingReferenceDetails/',
                method: "GET",
                params: { idReferencia: idReferencia },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insApplyReference: function(idReferencia) {
            return $http({
                url: controlDepositosURL + 'applyReference/',
                method: "GET",
                params: { idReferencia: idReferencia },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updCarteraVencidaReferencia: function(idReferencia) {
            return $http({
                url: controlDepositosURL + 'updCarteraVencidaReferencia/',
                method: "GET",
                params: { idReferencia: idReferencia },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updSetObservation: function(idDepositoBanco, observacion) {
            return $http({
                url: controlDepositosURL + 'setObservation/',
                method: "GET",
                params: { idDepositoBanco: idDepositoBanco, observacion: observacion },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        updSetReferencia: function(idDepositoBanco, idReferencia) {
            return $http({
                url: controlDepositosURL + 'setReferencia/',
                method: "GET",
                params: { idDepositoBanco: idDepositoBanco, idReferencia: idReferencia },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        delReferenciaGenerada: function(idReferencia) {
            return $http({
                url: controlDepositosURL + 'delReferenciaGenerada/',
                method: "GET",
                params: { idReferencia: idReferencia },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        testApi: function(objData) {

            console.log(objData);

            return $http({
                url: controlDepositosURL + 'testApi/',
                method: "GET",
                params: objData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getClientByName: function(clientName) {
            return $http({
                url: controlDepositosURL + 'clientByName/',
                method: "GET",
                params: {
                    clientName: clientName
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        getClientById: function(idBusqueda) {
            return $http({
                url: controlDepositosURL + 'clientById/',
                method: "GET",
                params: {
                    idBusqueda: idBusqueda
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }


    }
});
