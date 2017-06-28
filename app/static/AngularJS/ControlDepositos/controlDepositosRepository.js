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
        createTempReference: function(objData) {

            return $http({
                url: controlDepositosURL + 'createTempReference/',
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

        gridDocumentosOptions: function() {
            return {
                enableColumnResize: true,
                enableRowSelection: true,
                enableGridMenu: true,
                enableFiltering: true,
                enableGroupHeaderSelection: false,
                treeRowHeaderAlwaysVisible: true,
                showColumnFooter: true,
                showGridFooter: true,
                height: 900,
                cellEditableCondition: function($scope) {
                    return $scope.row.entity.seleccionable;
                }
            };
        },
        gridDocumentosColumns: function(isVisible) {
            return [
                { name: 'banco', displayName: 'Banco', width: '10%' },
                { name: 'idBmer', displayName: 'Cons', width: '5%' },
                { name: 'referencia', displayName: 'Referencia', width: '15%' },
                { name: 'concepto', displayName: 'Concepto', width: '15%' },
                { name: 'fechaOperacion', displayName: 'Fecha', width: '10%', type: 'date' },
                { name: 'cargo', displayName: 'Cargo', width: '10%', cellFilter: 'currency', visible: isVisible },
                { name: 'abono', displayName: 'Abono', width: '10%', cellFilter: 'currency' }, {
                    name: 'observaciones',
                    displayName: 'Observaciones',
                    width: '25%',
                    cellEditableCondition: true
                }
            ];
        },

        gridCarteraOptions: function() {
            return {
                enableColumnResize: true,
                enableRowSelection: true,
                enableGridMenu: true,
                enableFiltering: true,
                enableGroupHeaderSelection: false,
                treeRowHeaderAlwaysVisible: true,
                showColumnFooter: true,
                showGridFooter: true,
                height: 900,
                cellEditableCondition: function($scope) {
                    return $scope.row.entity.seleccionable;
                }
            };
        },
        gridCarteraColumns: function() {
            return [
                { name: 'nombreSucursal', width: '10%', displayName: 'Sucursal' },
                { name: 'nombreDepartamento', width: '10%', displayName: 'Departamento' },
                { name: 'folio', width: '10%', displayName: 'Factura' },
                { name: 'fecha', width: '10%', displayName: 'fecha', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'' },
                { name: 'nombreCliente', width: '30%', displayName: 'Cliente' },
                { name: 'importe', width: '10%', displayName: 'Importe', cellFilter: 'currency' },
                { name: 'saldo', width: '10%', displayName: 'Saldo', cellFilter: 'currency' },
            ];
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
    };

});
