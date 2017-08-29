registrationModule.controller('interesController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, interesRepository) {

    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;

    $scope.objEdicion = {
        usarMontoUsuario: false,
        montoAcumuladoUsuario: 0
    };

    $scope.lstEmpresaUsuario = [];
    $scope.lstBanco = [];
    $scope.lstCuenta = [];
    $scope.lstSucursal = [];
    $scope.lstDepartamento = [];
    $scope.lstTemp = [];
    $scope.lstRegistroContable = [];

    //Depositos controles Habilitados
    $scope.ddlBancoDisabled = true;
    $scope.ddlCuentaDisabled = true;
    $scope.txtFechasDisabled = true;
    $scope.btnBuscarDisabled = true;
    $scope.carteraControlsDisabled = true;

    $scope.selectedValueEmpresaID = 0;
    $scope.selectedValueSucursalID = 0;
    $scope.selectedDepartamentoID = 0;
    $scope.selectedValueBancoID = 0;
    $scope.selectedValueCuentaID = 0;
    $scope.selectedValueFechaInicio = '';
    $scope.selectedValueFechaFin = '';
    $scope.currentComisionHeaderID = 0;
    $scope.showSub = false;
    //init grids
    $scope.gridComisiones = interesRepository.gridComisionesOptions;
    $scope.gridComisiones.columnDefs = interesRepository.gridComisionesColumns();
    $scope.gridComisiones.multiSelect = false;
    $scope.gridInteres = interesRepository.gridInteresOptions;
    $scope.gridInteres.columnDefs = interesRepository.gridInteresColumns();
    $scope.gridInteres.multiSelect = false;

    $scope.gridComisionesRow = null;
    $scope.gridInteresRow = null;


    var activeTab = "list-group-item active text-center";
    var notActiveTab = "list-group-item text-center";


    $scope.lstTabs = [
        { description: "Buscar", stepIsComplete: false, isActive: true, className: activeTab, iconName: "glyphicon glyphicon-search" },
        { description: "Interés", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-eye-open" },
        { description: "Deptos", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-briefcase" },
        { description: "Detalle", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-list" }
    ];

    $scope.$watch('lstTabs[1].isActive', function(active, oldActive) {
        if (active && active !== oldActive && $scope.gridApi) {
            $timeout(function() {
                $scope.gridApi.grid.handleWindowResize();
            });
        }
    });


    $scope.$watch('lstTabs[1].isActive', function(active, oldActive) {
        if (active && active !== oldActive && $scope.gridApiInteres) {
            $timeout(function() {
                $scope.gridApiInteres.grid.handleWindowResize();
            });
        }
    });

    interesRepository.selInteresComision().then(function(result) {
        $scope.lstTemp = result.data;
    });

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

    $scope.getDepartamentosBpro = function(id) {
        $scope.objEdicion.montoAcumuladoUsuario = 0;
        $('#tblDepartamentos').DataTable().destroy();
        $('#mdlLoading').modal('show');
        $scope.lstDepartamento = [];
        interesRepository.getDepartamentoBpro(id).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstDepartamento = result.data;
                $('#mdlLoading').modal('hide');
            }
        });
    };


    $scope.getSucursales = function() {

        var idEmpresa = $scope.selectedValueEmpresaID;

        filtrosRepository.getSucursales($scope.idUsuario, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstSucursal = result.data;
            }
        });
    };

    $scope.enableCalendar = function() {
        $scope.txtFechasDisabled = false;
        $scope.btnBuscarDisabled = false;
    };


    $scope.getInteres = function(obj) {

        $scope.setActiveTab($scope.lstTabs[1]);

        var params = {
            idBanco: $scope.selectedValueBancoID,
            noCuenta: $scope.selectedValueCuentaID,
            fechaIni: $scope.selectedValueFechaInicio,
            fechaFin: $scope.selectedValueFechaFin
        };

        console.log(params);


        $scope.carteraControlsDisabled = false;

        $('#mdlLoading').modal('show');
        $scope.gridComisiones.data = [];
        interesRepository.getInteres(params).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridComisiones.data = result.data;
                console.log("El data",result.data);
                $scope.getSucursales();
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    $scope.getInteresIva = function(depositoID) {
        $('#mdlLoading').modal('show');
        $scope.gridInteres.data = [];
        interesRepository.getInteresIva(depositoID).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridInteres.data = result.data;

                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    $scope.gridComisiones.onRegisterApi = function(gridApi) {

        $scope.gridApi = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.gridComisionesRow = row.entity;
            $scope.getInteresIva(row.entity.idDepositoBanco);
        });
    };


    $scope.gridInteres.onRegisterApi = function(gridApi) {
        $scope.gridApiInteres = gridApi;

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.gridInteresRow = row.entity;
            $scope.msgTempSave();
        });

    };

    $scope.msgTempSave = function() {

        if ($scope.gridInteresRow === null || $scope.gridComisionesRow === null) {
            swal("Aviso", "No ha seleccioando un interes", "warning");
        } else {

            swal({
                    title: "¿Esta seguro?",
                    text: "Se creará una referencia",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },

                function() {
                    $scope.tempSave();
                });
        }

    };

    $scope.tempSave = function() {
        var params = {
            interesID: $scope.gridInteresRow.idDepositoBanco,
            comisionID: $scope.gridComisionesRow.idDepositoBanco,
            bancoID: $scope.gridComisionesRow.idBanco,
            userID: $scope.idUsuario,
            statusID: 1
        };

        interesRepository.insInteresComision(params).then(function(result) {
            $scope.currentComisionHeaderID = result.data[0].headerID;

            console.log("soy a", result.data);
            console.log("soy b", result.data[0].headerID);
            interesRepository.selInteresComision().then(function(result) {
                $scope.lstTemp = result.data;
                $scope.getInteres();
                $scope.setActiveTab($scope.lstTabs[2]);
            });
        });

    };

    $scope.tempSaveDetail = function() {


    }


    $scope.aplicar = function() {



        $scope.insInteresComisionDetalle();

        /*
                swal({
                        title: "¿Esta seguro?",
                        text: "Se aplicarán todas la referencia.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#21B9BB",
                        confirmButtonText: "Aceptar",
                        closeOnConfirm: false
                    },
                    function() {

                        interesRepository.insCxpComisionesInteres().then(function(result) {
                            console.log("finalizo");
                        });

                        interesRepository.selInteresComision().then(function(result) {
                            $scope.lstTemp = result.data;
                        });


                        swal("Aplicado", "Referencia aplicada", "success");
                    });*/

    };




    $scope.showDetail = function() {
        $('#mdlDetail').modal('show');
    };


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


    $scope.validarMontos = function(pnlName) {

        if ($scope.objEdicion.usarMontoUsuario === true && ($scope.objEdicion.montoAcumuladoUsuario != $scope.gridComisionesRow.abono)) {
            swal("Aviso", "La suma de los montos deben ser iguales.", "warning");
        } else {
            $scope.gridInteresRow = null;
            $scope.gridComisionesRow = null;
            $scope.setActiveTab($scope.lstTabs[3]);
        }
    };


    $scope.sumUserAmount = function() {
        $scope.objEdicion.montoAcumuladoUsuario = 0;
        $scope.lstDepartamento.forEach(function(row) {
            $scope.objEdicion.montoAcumuladoUsuario += Number(row.userValue);
        });
    };

    $scope.setActiveTab = function(item) {

        $scope.lstTabs.forEach(function(row) {
            row.className = notActiveTab;
            row.isActive = false;
        });

        item.className = activeTab;
        item.isActive = true;

    };


    $scope.setCuentaContable = function() {

        $scope.lstRegistroContable = [];
        $scope.lstRegistroContable = interesRepository.getInteresTemplate();

        $scope.lstRegistroContable[0].cuenta = $scope.lstRegistroContable[0].cuenta.replace('A', $scope.selectedValueSucursalID);
        $scope.lstRegistroContable[0].cuenta = $scope.lstRegistroContable[0].cuenta.replace('B', $scope.selectedValueEmpresaID);
        $scope.lstRegistroContable[1].cuenta = $scope.lstRegistroContable[1].cuenta.replace('F', $scope.selectedDepartamentoID);
        $scope.lstRegistroContable[2].cuenta = $scope.lstRegistroContable[2].cuenta.replace('F', $scope.selectedDepartamentoID);

        $scope.lstRegistroContable[0].cargo = $scope.gridComisionesRow.abono;
        $scope.lstRegistroContable[1].cargo = $scope.gridInteresRow.abono;
        $scope.lstRegistroContable[2].abono = $scope.gridComisionesRow.abono + $scope.gridInteresRow.abono;

    };

    $scope.toggleShowSub = function() {
        if ($scope.showSub === true)
            $scope.showSub = false;
        else
            $scope.showSub = true;
    };


    $scope.showSubcuentas = function() {
        $('#mdlSubcuentas').modal('show');
    };


    $scope.insInteresComisionDetalle = function() {


        $scope.lstRegistroContable.forEach(function(row, index) {
            var params = {
                cuentacontable: row.cuenta,
                concepto: row.concepto,
                cargo: row.cargo,
                abono: row.abono,
                documento: 0,
                idpersona: $scope.idUsuario,
                idcomisionesintereses: $scope.currentComisionHeaderID,
                tipodocumento: row.tipodocumento,
                fechavencimiento: '2017/01/01', //Tampoco sabe que ira aqui 
                poriva: 16,
                referencia: '', //Menos este lo hace BPRO?
                banco: $scope.selectedValueBancoID,
                referenciabancaria: '12345678901234567891',
                conpoliza: index + 1
            };

            interesRepository.insInteresComisionDetalle(params).then(function(result) {
                console.log(result.data, 'Soy la respuesta del store de pipus');
            });

        });




        $scope.lstDepartamento.forEach(function(row, index) {
            var params = {
                cuentacontable: row.cuentaContable,
                concepto: row.descripcion.substring(7),
                cargo: (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100,
                abono: 0,
                documento: 0,
                idpersona: $scope.idUsuario,
                idcomisionesintereses: $scope.currentComisionHeaderID,
                tipodocumento: '',
                fechavencimiento: '2017/01/01', //Tampoco sabe que ira aqui 
                poriva: 16,
                referencia: '', //Menos este lo hace BPRO?
                banco: $scope.selectedValueBancoID,
                referenciabancaria: '12345678901234567891',
                conpoliza: index + 4
            };

            interesRepository.insInteresComisionDetalle(params).then(function(result) {
                console.log(result.data, 'Soy la respuesta del store de pipus');
            });

        });




    };



});
