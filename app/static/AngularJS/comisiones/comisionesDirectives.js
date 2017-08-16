var comisionesPath = 'AngularJS/comisiones/';

registrationModule.directive('comisionesBuscar', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesBuscar.html'
    };
}).directive('comisionesIva', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesIva.html'
    };
}).directive('comisionesDepartamentoInner', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesDepartamentoInner.html'
    };
}).directive('comisionesDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesDetalle.html'
    };
}).directive('comisionesAplicadas', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesAplicadas.html'
    };
}).directive('comisionesModals', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesModals.html'
    };
}).directive('comisionesDetalleInner', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesDetalleInner.html'
    };
}).directive('comisionesDepartamento', function() {
    return {
        restrict: 'E',
        templateUrl: comisionesPath + 'comisionesDepartamento.html'
    };
});
