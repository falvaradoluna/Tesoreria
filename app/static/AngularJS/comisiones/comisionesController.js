registrationModule.controller('comisionesController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, comisionesRepository) {

    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;

    $scope.objEdicion = {
        usarMontoUsuario: false,
        montoAcumuladoUsuario: 0
    };

    $scope.lstEmpresaUsuario = [];
    $scope.lstBanco = [];
    $scope.lstDetalle = [];
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
    $scope.gridComisiones = comisionesRepository.gridComisionesOptions;
    $scope.gridComisiones.columnDefs = comisionesRepository.gridComisionesColumns();
    $scope.gridComisiones.multiSelect = false;
    $scope.gridInteres = comisionesRepository.gridInteresOptions;
    $scope.gridInteres.columnDefs = comisionesRepository.gridInteresColumns();
    $scope.gridInteres.multiSelect = false;

    $scope.gridComisionesRow = null;
    $scope.gridInteresRow = null;


    var activeTab = "list-group-item active text-center";
    var notActiveTab = "list-group-item text-center";


    $scope.lstTabs = [
        { description: "Buscar", stepIsComplete: false, isActive: true, className: activeTab, iconName: "glyphicon glyphicon-search" },
        { description: "Comisiones", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-eye-open" },
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

    comisionesRepository.selInteresComision().then(function(result) {
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
        comisionesRepository.getDepartamentoBpro(id).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstDepartamento = result.data;
                $('#mdlLoading').modal('hide');
            } else {
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


    $scope.getComisiones = function() {

        $scope.setActiveTab($scope.lstTabs[1]);

        var params = {
            idBanco: $scope.selectedValueBancoID,
            noCuenta: $scope.selectedValueCuentaID,
            fechaIni: $scope.selectedValueFechaInicio,
            fechaFin: $scope.selectedValueFechaFin
        };

        $scope.carteraControlsDisabled = false;

        $('#mdlLoading').modal('show');
        $scope.gridComisiones.data = [];
        comisionesRepository.getcomisiones(params).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridComisiones.data = result.data;
                $scope.getSucursales();
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    $scope.getComisionesIva = function(depositoID) {

        $('#mdlLoading').modal('show');
        $scope.gridInteres.data = [];
        comisionesRepository.getcomisionesIva(depositoID).then(function(result) {
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
            $scope.getComisionesIva(row.entity.idDepositoBanco);
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

        comisionesRepository.insInteresComision(params).then(function(result) {
            $scope.currentComisionHeaderID = result.data[0].headerID;
            comisionesRepository.selInteresComision().then(function(result) {
                $scope.lstTemp = result.data;
                $scope.getComisiones();
                $scope.gridInteres.data = [];
                $scope.setActiveTab($scope.lstTabs[2]);
            });
        });

    };

    $scope.tempSaveDetail = function() {


    };


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

                        comisionesRepository.insCxpComisionesInteres().then(function(result) {
                            console.log("finalizo");
                        });

                        comisionesRepository.selInteresComision().then(function(result) {
                            $scope.lstTemp = result.data;
                        });


                        swal("Aplicado", "Referencia aplicada", "success");
                    });*/

    };




    $scope.showDetail = function() {
        comisionesRepository.selInteresComisionDetalle(1).then(function(result) {
            $scope.lstDetalle = result.data;
            $('#mdlDetail').modal('show');
        });

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

    ///aqui va el detalle

    $scope.validarMontos = function() {

        if ($scope.objEdicion.usarMontoUsuario === true && ($scope.objEdicion.montoAcumuladoUsuario != $scope.gridComisionesRow.abono)) {
            swal("Aviso", "La suma de los montos deben ser iguales.", "warning");
        } else {
            //aqui cabecera
            $scope.setActiveTab($scope.lstTabs[3]);
            swal("Creado", "Se genero un asiento Contable", "success");
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
        $scope.lstRegistroContable = comisionesRepository.getComisionTemplate();

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


        comisionesRepository.insCxpComisionesInteres().then(function(result) {

            console.log("headerID", result.data[0].headerID);

            $scope.rowsToInsert = [];

            $scope.lstRegistroContable.forEach(function(row, index) {

                var params = {};

                params.cuentacontable = row.cuenta;
                params.concepto = row.concepto;
                params.cargo = row.cargo;
                params.abono = row.abono;
                params.documento = 0;
                params.idpersona = $scope.idUsuario;
                params.idcomisionesintereses = $scope.currentComisionHeaderID;
                params.tipodocumento = row.tipodocumento;
                params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                params.poriva = 16;
                params.referencia = ''; //Menos este lo hace BPRO?
                params.banco = $scope.selectedValueBancoID;
                params.referenciabancaria = '12345678901234567891';
                params.conpoliza = index + 1;

                $scope.rowsToInsert.push(params);
            });




            $scope.lstDepartamento.forEach(function(row, index) {

                var params = {};

                params.cuentacontable = row.cuentaContable;
                params.concepto = row.descripcion.substring(7);
                params.cargo = (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100;
                params.abono = 0;
                params.documento = 0;
                params.idpersona = $scope.idUsuario;
                params.idcomisionesintereses = $scope.currentComisionHeaderID;
                params.tipodocumento = '';
                params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                params.poriva = 16;
                params.referencia = ''; //Menos este lo hace BPRO?
                params.banco = $scope.selectedValueBancoID;
                params.referenciabancaria = '12345678901234567891';
                params.conpoliza = index + 4;

                $scope.rowsToInsert.push(params);
            });


            $scope.rowsToInsert.forEach(function(row) {
                comisionesRepository.insInteresComisionDetalle(row).then(function(result) {
                    console.log(row.conpoliza);
                });
            });

        });


        /*
                
                        $scope.lstSucursal = [];
                        $scope.lstRegistroContable = [];
                        $scope.lstDepartamento = [];
                        $scope.showSub = false;
                        $scope.gridInteresRow = [];
                        $scope.gridComisionesRow = [];
                        
        */

        //console.log($scope.rowsToInsert);




    };



});