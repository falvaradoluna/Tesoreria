var interesPath = 'AngularJS/interes/';

registrationModule.directive('interesBuscar', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesBuscar.html'
    };
}).directive('interesIva', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesIva.html'
    };
}).directive('interesDepartamentoInner', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDepartamentoInner.html'
    };
}).directive('interesDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDetalle.html'
    };
}).directive('interesModals', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesModals.html'
    };
}).directive('interesDetalleInner', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDetalleInner.html'
    };
}).directive('interesDepartamento', function() {
    return {
        restrict: 'E',
        templateUrl: interesPath + 'interesDepartamento.html'
    };
});
