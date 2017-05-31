// -- =============================================
// -- Author:      Gibran 
// -- Create date: 05/09/2016
// -- Description: Is the container of the application
// -- Modificó: 
// -- Fecha: 
// -- =============================================
var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning','ui.grid.edit'])
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

        $routeProvider.when('/controlDepositos', {
            templateUrl: 'AngularJS/Templates/controldepositos.html', //FAL 19012017
            controller: 'controlDepositosController'
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
