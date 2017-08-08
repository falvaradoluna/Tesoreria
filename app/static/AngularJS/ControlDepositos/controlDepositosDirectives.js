var ctrDepPath = 'AngularJS/ControlDepositos/';

registrationModule.directive('ctrdepBancoFilter', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosBancoFilter.html'
    };
})
.directive('ctrdepBancoTable', function(){
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosBancoTable.html'
    };
})
.directive('ctrdepCarteraFilter', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosCarteraFilter.html'
    };
})
.directive('ctrdepCarteraFilterUser', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosCarteraFilterUser.html'
    };
}).directive('ctrdepCarteraTable', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosCarteraTable.html'
    };
}).directive('ctrdepReferenciaDetail', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosReferenciaDetail.html'
    };
}).directive('ctrdepReferenciaTable', function() {
    return {
        restrict: 'E',
        templateUrl: ctrDepPath + 'controlDepositosReferenciaTable.html'
    };
});


