registrationModule.controller('cajaController', function ($scope, $rootScope, $location, localStorageService, cajaRepository,alertFactory) {

	// ****************** Se guarda la información del usuario en variable userData
	$rootScope.userData = localStorageService.get('userData');
	
	
	$scope.init = function(){		
		 $rootScope.mostrarMenu = 1;
		 $scope.calendario();
	}
	  $scope.calendario = function() {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "dd/mm/yyyy"
        });
    }
});