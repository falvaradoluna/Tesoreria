// -- =============================================
// -- Author:      Gibran 
// -- Create date: 05/09/2016
// -- Description: Is the container of the application
// -- Modificó: 
// -- Fecha: 
// -- =============================================

var registrationModule = angular.module("registrationModule", ["ngRoute", "colorpicker.module", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.moveColumns', 'angular.filter', 'ui.bootstrap', 'ui.bootstrap.modal', 'datatables', 'ngResource'])

.config(function($routeProvider, $locationProvider) {

    /*cheange the routes*/
    $routeProvider.when('/', {
        templateUrl: 'AngularJS/Templates/login.html', //example 1
        controller: 'loginController'
    });
    $routeProvider.when('/conciliacionInicio', {
        templateUrl: 'AngularJS/Templates/conciliacionInicio.html', //example 1
        controller: 'conciliacionInicioController'
    });

    //LQMA add 16032018 consultas por periodico y mensual
    $routeProvider.when('/conciliacionInicioConsulta', {
        templateUrl: 'AngularJS/Templates/conciliacionInicioConsulta.html', //example 1
        controller: 'conciliacionInicioConsultaController'
    });

    $routeProvider.when('/conciliacion', {
        templateUrl: 'AngularJS/Templates/conciliacion.html', //example 1
        controller: 'conciliacionController'
    });
    $routeProvider.when('/caja', {
        templateUrl: 'AngularJS/Templates/caja.html', //example 1
        controller: 'cajaController'
    });
    $routeProvider.when('/conciliacionDetalleRegistros', {
        templateUrl: 'AngularJS/Templates/conciliacionDetalleRegistros.html', //example 1
        controller: 'conciliacionDetalleRegistroController'
    });

    $routeProvider.when('/comisiones', {
        templateUrl: 'AngularJS/Templates/comisiones.html', //FAL 19012017
        controller: 'comisionesController'
    });

    $routeProvider.when('/interes', {
        templateUrl: 'AngularJS/Templates/interes.html', //FAL 19012017
        controller: 'interesController'
    });

    $routeProvider.when('/conciliacionDetalleConsulta', {
        templateUrl: 'AngularJS/Templates/conciliacionDetalleRegistrosConsulta.html', //FAL 19012017
        controller: 'conciliacionDetalleRegistroConsultaController'
    });

    $routeProvider.when('/controlDepositos', {
        templateUrl: 'AngularJS/Templates/controldepositos.html', //FAL 19012017
        controller: 'controlDepositosController'
    });

    $routeProvider.when('/importarDatosExcel', {
        templateUrl: 'AngularJS/ExportarExcel/Template/ExcelExport.html', //FAL 19012017
        controller: 'excelExportController'
    });
    $routeProvider.otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed             
        });
        changeHeight(); // when page loads          
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
registrationModule.factory("utils", function($http) {
    return {
        b64toBlob: function(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }
    }
});