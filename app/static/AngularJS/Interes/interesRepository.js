var interesURL = global_settings.urlCORS + 'api/controlDepositos/';


registrationModule.factory('interesRepository', function($http) {
    return {

        getDepartamentoBpro: function(sucursalID) {
            return $http({
                url: interesURL + 'departamentoBpro/',
                method: "GET",
                params: { sucursalID: sucursalID },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getInteres: function(params) {
            return $http({
                url: interesURL + 'interes/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getInteresIva: function(idDepositoBanco) {
            return $http({
                url: interesURL + 'interesIva/',
                method: "GET",
                params: { idDepositoBanco: idDepositoBanco },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        selInteresComision: function() {
            return $http({
                url: interesURL + 'selInteresComision/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        insInteresComision: function(params) {
            return $http({
                url: interesURL + 'interesComision/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insInteresComisionDetalle: function(params) {
            return $http({
                url: interesURL + 'insInteresComisionDetalle/',
                method: "GET",
                params: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insCxpComisionesInteres: function() {
            return $http({
                url: interesURL + 'insCxpComisionesInteres/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        testApi: function(objData) {

            console.log(objData);

            return $http({
                url: interesURL + 'testApi/',
                method: "GET",
                params: objData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getClientByName: function(clientName) {
            return $http({
                url: interesURL + 'clientByName/',
                method: "GET",
                params: {
                    clientName: clientName
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },

        gridComisionesOptions: function() {
            return {
                enableRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 35,
                rowHeight: 35,
                showGridFooter: true,
                enableFiltering: true

            };
        },
        gridComisionesColumns: function() {
            return [
                { name: 'referencia', displayName: 'Referencia' },
                { name: 'concepto', displayName: 'Concepto' },
                { name: 'fechaOperacion', displayName: 'Fecha', type: 'date' },
                { name: 'abono', displayName: 'Abono', type: 'number', cellFilter: 'currency' }
            ];
        },

        gridInteresOptions: function() {
            return {
                enableRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 35,
                rowHeight: 35,
                showGridFooter: true,
                enableFiltering: true
            };
        },
        gridInteresColumns: function() {
            return [
                { name: 'referencia', displayName: 'Referencia' },
                { name: 'concepto', displayName: 'Concepto' },
                { name: 'fechaOperacion', displayName: 'Fecha', type: 'date' },
                { name: 'abono', displayName: 'Abono', type: 'number', cellFilter: 'currency' }
            ];
        },

        getInteresTemplate: function() {
            return [{
                consecutivo: 1,
                cuenta: "700A-000B-0002-0009",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "Comisiones bancarias",
                cargo: 0,
                abono: 0,
                tipodocumento:'',
                tipo: 'C',
                showSub: true
            }, {
                consecutivo: 2,
                cuenta: "1100-0065-000F-0004",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "IVA por Acreditar a/d mxp",
                cargo: 0,
                abono: 0,
                tipodocumento:'FACIVA',
                tipo: 'A',
                showSub: false
            }, {
                consecutivo: 3,
                cuenta: "2100-0002-000F-0001",
                concepto: "Comisiones bancarias Provisión",
                descripcion: "Acreedores diversos mxp",
                cargo: 0,
                abono: 0,
                tipodocumento:'FAC',
                tipo: 'A',
                showSub: false

            }];
        },


        getClientById: function(idBusqueda) {
            return $http({
                url: interesURL + 'clientById/',
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
