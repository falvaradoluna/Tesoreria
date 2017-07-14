var controlDepositosURL = global_settings.urlCORS + 'api/controlDepositos/';


registrationModule.factory('controlDepositosRepository', function($http) {
    return {

        prevSession: {
            isFirstTime: true,
            ddlBancoDisabled: null,
            ddlCuentaDisabled: null,
            txtFechasDisabled: null,
            btnBuscarDisabled: null,
            carteraControlsDisabled: null,
            selectedValueEmpresaID: null,
            selectedValueBancoID: null,
            selectedValueCuentaID: null,
            selectedValueFechaInicio: null,
            selectedValueFechaFin: null,
            btnSwitchIsEnable: null,
            selectedValueSucursaID: null,
            selectedValueDepartamentoID: null,
            selectedValueCarteraFechaInicio: null,
            selectedValuecarteraFechaFin: null,
            showUserSearchPanel: null,
            searchType: null,
            searchTypeID: null,
            searchValue: null,
            searchClienteID: null
        },


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


        insertaRefAntipag: function(bankTableName, currentBase) {
            return $http({
                url: controlDepositosURL + 'insertaRefAntipag/',
                method: "GET",
                params: { bankTableName: bankTableName, currentBase: currentBase },
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
                { name: 'idBmer', displayName: 'Cons', cellClass: 'gridCellRight', width: 75 },
                { name: 'banco', displayName: 'Banco', cellClass: 'gridCellLeft', width: 100 },
                { name: 'referencia', displayName: 'Referencia', cellClass: 'gridCellLeft', width: 200 },
                { name: 'concepto', displayName: 'Concepto', cellClass: 'gridCellLeft', width: 250 },
                { name: 'refAmpliada', displayName: 'Referencia Ampliada', cellClass: 'gridCellLeft', width: 200 },
                { name: 'fechaOperacion', displayName: 'Fecha', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', cellClass: 'gridCellRight', width: 100 },
                { name: 'cargo', displayName: 'Cargo', cellFilter: 'currency', visible: isVisible, cellClass: 'gridCellRight', width: 100 },
                { name: 'abono', displayName: 'Abono', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100 }, {
                    name: 'observaciones',
                    displayName: 'Observaciones',
                    cellEditableCondition: true,
                    cellClass: 'gridCellRight',
                    width: '*'
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
                { name: 'folio', displayName: 'Factura', cellClass: 'gridCellLeft', width: 150 },
                { name: 'nombreSucursal', displayName: 'Sucursal', cellClass: 'gridCellLeft', width: 200 },
                { name: 'nombreDepartamento', displayName: 'Departamento', cellClass: 'gridCellLeft', width: 200 },
                { name: 'nombreCliente', displayName: 'Cliente', cellClass: 'gridCellLeft', width: 200 },
                { name: 'fecha', displayName: 'fecha', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', cellClass: 'gridCellRight', width: 100 },
                { name: 'importe', displayName: 'Importe', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100 },
                { name: 'saldo', displayName: 'Saldo', cellFilter: 'currency', cellClass: 'gridCellRight', width: 100 }
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
