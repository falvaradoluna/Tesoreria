var ctrDepIvaPath = 'AngularJS/ControlDepositosIva/';

registrationModule.directive('ctrdepivaBancoFilter', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepIvaPath + 'controlDepositosIvaBancoFilter.html'
    };
}).directive('ctrdepivaBancoTable', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepIvaPath + 'controlDepositosIvaBancoTable.html'
    };
}).directive('ctrdepivaBancoTableB', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepIvaPath + 'controlDepositosIvaBancoTableB.html'
    };
}).directive('ctrdepivaBancoTableAdd', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepIvaPath + 'controlDepositosIvaBancoTableAdd.html'
    };
});


