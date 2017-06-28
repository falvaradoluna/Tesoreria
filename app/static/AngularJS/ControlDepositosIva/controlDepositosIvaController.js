registrationModule.controller('controlDepositosIvaController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, controlDepositosIvaRepository) {

    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;


    //Listas Onjetos BD
    $scope.lstEmpresaUsuario = [];
    $scope.lstBanco = [];
    $scope.lstCuenta = [];
    $scope.lstSucursal = [];
    $scope.lstDepartamento = [];
    $scope.lstCliente = [];
    //Depositos controles Habilitados
    $scope.ddlBancoDisabled = true;
    $scope.ddlCuentaDisabled = true;
    $scope.txtFechasDisabled = true;
    $scope.btnBuscarDisabled = true;
    $scope.carteraControlsDisabled = true;
    //Depositos Filtros ID 
    $scope.selectedValueEmpresaID = 0;
    $scope.selectedValueBancoID = 0;
    $scope.selectedValueCuentaID = 0;
    $scope.selectedValueFechaInicio = '';
    $scope.selectedValueFechaFin = '';
    $scope.btnSwitchIsEnable = false;

    //init grids
    $scope.gridComisiones = controlDepositosIvaRepository.gridComisionesOptions;
    $scope.gridComisiones.columnDefs = controlDepositosIvaRepository.gridComisionesColumns($scope.btnSwitchIsEnable);
    $scope.gridComisiones.multiSelect = false;    
    $scope.gridInteres = controlDepositosIvaRepository.gridInteresOptions;
    $scope.gridInteres.columnDefs = controlDepositosIvaRepository.gridInteresColumns($scope.btnSwitchIsEnable);
    $scope.gridInteres.multiSelect = false;
    

    $scope.selectedPanel = "pnlCuenta";



    filtrosRepository.getEmpresas($scope.idUsuario).then(function(result) {
        if (result.data.length > 0) {
            $scope.lstEmpresaUsuario = result.data;
            $scope.initCalendarstyle();
        }
    });

    $scope.getBancos = function() {

        var idEmpresa = $scope.selectedValueEmpresaID;
        $scope.ddlBancoDisabled = false;

        filtrosRepository.getBancos(idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstBanco = result.data;
            }
        });
    };

    $scope.getCuentas = function() {

        var idBanco = $scope.selectedValueBancoID;
        var idEmpresa = $scope.selectedValueEmpresaID;
        $scope.ddlCuentaDisabled = false;

        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstCuenta = result.data;
            }
        });
    };

    $scope.enableCalendar = function() {
        $scope.txtFechasDisabled = false;
        $scope.btnBuscarDisabled = false;
    };


    $scope.getComisiones = function(obj) {

        /*
                var empresaID = $scope.selectedValueEmpresaID;
                var cuentaID = $scope.selectedValueCuentaID;
                var fechaInicio = $scope.selectedValueFechaInicio;
                var fechaFin = $scope.selectedValueFechaFin;
                var bancoID = $scope.selectedValueBancoID;
                $scope.carteraControlsDisabled = false;
                */


        $('#mdlLoading').modal('show');
        $scope.gridComisiones.data = [];
        controlDepositosIvaRepository.getcomisiones().then(function(result) {
            if (result.data.length > 0) {
                $scope.gridComisiones.data = result.data;
                $scope.getOtros();

                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });


    };

    $scope.getOtros = function(obj) {



        $('#mdlLoading').modal('show');
        $scope.gridInteres.data = [];
        controlDepositosIvaRepository.getcomisionesIva().then(function(result) {
            if (result.data.length > 0) {
                $scope.gridInteres.data = result.data;

                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });


    };

    $scope.changePanel = function(pnlName) {
        $scope.selectedPanel = pnlName;
    }

    $scope.initCalendarstyle = function() {
        $('#calendar .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: true,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: "dd/mm/yyyy"
        });
    };


    $scope.setTableStyle = function() {
        setTimeout(function() {
            $('#tblClient').DataTable();
            $('#tblClient_filter').remove();
            $('#tblClient_length').remove();
        }, 500);
    };





});
