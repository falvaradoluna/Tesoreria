registrationModule.controller('comisionesController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, comisionesRepository) {

    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = $rootScope.userData.idUsuario;

    $scope.objEdicion = {
        usarMontoCalculado: false,
        montoAcumuladoUsuario: 0,
        muestraMontoInicial: true
    };

    $scope.sumaDetalle = { cargo: 0, abono: 0 };

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
    $scope.selectedDepartamento = [];
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
        { description: "Detalle", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-list" },
        { description: "Aplicados", stepIsComplete: false, isActive: false, className: notActiveTab, iconName: "glyphicon glyphicon-ok" }
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
        swal({
            title: "¿Esta seguro?",
            text: "Se aplicarán todas las referencias",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
        function() {
            console.log( $scope.lstTemp );
            $scope.lstTemp.forEach(function(row) {
                console.log( 'interesComisionID', row.interesComisionID );
                comisionesRepository.updAplicaComisiones(row.interesComisionID).then(function(result) {
                    console.log(result);
                });
            });
            swal("Aplicado", "Referencia aplicada", "success");
        });
    };

    $scope.showDetail = function(item) {
        comisionesRepository.selInteresComisionDetalle(item.interesComisionID).then(function(result) {
            $scope.lstDetalle = result.data;
            $scope.sumaDetalle.cargo = 0;
            $scope.sumaDetalle.abono = 0;
            $scope.lstDetalle.forEach(function(row) {
                $scope.sumaDetalle.cargo += parseFloat(row.cid_cargo);
                $scope.sumaDetalle.abono += parseFloat(row.cid_abono);
            });

            $scope.sumaDetalle.cargo = parseFloat($scope.sumaDetalle.cargo);
            $scope.sumaDetalle.abono = parseFloat($scope.sumaDetalle.abono);

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



    $scope.validarMontos = function() {

        if ($scope.objEdicion.usarMontoCalculado === false && ($scope.objEdicion.montoAcumuladoUsuario != $scope.gridComisionesRow.abono)) {
            swal("Aviso", "La suma de los montos deben ser iguales.", "warning");
        } else {
            $scope.insInteresComisionDetalle();
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


        console.log($scope.selectedDepartamento);

        $scope.lstRegistroContable = [];
        $scope.lstRegistroContable = comisionesRepository.getComisionTemplate();
        $scope.lstRegistroContable[0].cuenta = $scope.selectedDepartamento.cuentaContable;
        $scope.lstRegistroContable[0].concepto = $scope.selectedDepartamento.descripcion.substring(8);
        $scope.lstRegistroContable[1].cuenta = $scope.lstRegistroContable[1].cuenta.replace('F', $scope.selectedDepartamento.subCuenta);
        $scope.lstRegistroContable[2].cuenta = $scope.lstRegistroContable[2].cuenta.replace('F', $scope.selectedDepartamento.subCuenta);

        $scope.lstRegistroContable[0].cargo = $scope.gridComisionesRow.abono;
        $scope.lstRegistroContable[1].cargo = $scope.gridInteresRow.abono;
        $scope.lstRegistroContable[2].abono = $scope.gridComisionesRow.abono + $scope.gridInteresRow.abono;
        $scope.objEdicion.montoAcumuladoUsuario = $scope.gridComisionesRow.abono;

    };

    $scope.toggleShowSub = function() {
        $scope.montoAcumuladoUsuario = 0;
        if ($scope.showSub === true) {
            $scope.showSub = false;
            $scope.objEdicion.usarMontoCalculado = false;
        } else {
            $scope.showSub = true;
            $scope.objEdicion.usarMontoCalculado = true;
        }
    };


    $scope.showSubcuentas = function() {
        $('#mdlSubcuentas').modal('show');
    };


    $scope.insInteresComisionDetalle = function() {

        var excludeFirstRow = false;



        if ($scope.objEdicion.usarMontoCalculado === true) {
            excludeFirstRow = true;
        } else {
            $scope.lstDepartamento.forEach(function(row) {
                if (row.userValue > 0) {
                    excludeFirstRow = true;
                }
            });
        }

        var counter = 0;


        comisionesRepository.insCxpComisionesInteres($scope.currentComisionHeaderID).then(function(result) {

            var headerID = result.data[0].headerID;
            $scope.rowsToInsert = [];

            $scope.lstRegistroContable.forEach(function(row, index) {

                if (excludeFirstRow === true && index === 0) {
                    console.log('OK');
                } else {

                    var params = {};

                    params.cuentacontable = row.cuenta;
                    params.concepto = row.concepto;
                    params.cargo = row.cargo;
                    params.abono = row.abono;
                    params.documento = 0;
                    params.idpersona = $scope.idUsuario;
                    params.idcomisionesintereses = headerID;
                    params.tipodocumento = row.tipodocumento;
                    params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                    params.poriva = 16;
                    params.referencia = ''; //Menos este lo hace BPRO?
                    params.banco = $scope.selectedValueBancoID;
                    params.referenciabancaria = '12345678901234567891';
                    params.conpoliza = counter += 1;

                    $scope.rowsToInsert.push(params);
                }

            });


            $scope.lstDepartamento.forEach(function(row, index) {

                var params = {};

                params.cuentacontable = row.cuentaContable;
                params.concepto = row.descripcion.substring(7);
                params.cargo = 0; // (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100;
                params.abono = 0;
                params.documento = 0;
                params.idpersona = $scope.idUsuario;
                params.idcomisionesintereses = headerID;
                params.tipodocumento = '';
                params.fechavencimiento = '2017/01/01'; //Tampoco sabe que ira aqui 
                params.poriva = 16;
                params.referencia = ''; //Menos este lo hace BPRO?
                params.banco = $scope.selectedValueBancoID;
                params.referenciabancaria = '12345678901234567891';
                params.conpoliza = counter += 1;

                if ($scope.objEdicion.usarMontoCalculado === true) {
                    //params.userValue = ($scope.gridComisionesRow.abono * row.porcentaje) / 100;
                    params.cargo = (row.porcentaje * $scope.objEdicion.montoAcumuladoUsuario) / 100;
                    $scope.rowsToInsert.push(params);
                } else {
                    if (row.userValue > 0) {
                        params.cargo = row.userValue;
                        $scope.rowsToInsert.push(params);
                    }
                }



            });


            //console.log($scope.rowsToInsert);
            ////////////////////////////////////////////////////////////////////////////

            $scope.rowsToInsert.reduce(
                function(sequence, value) {
                    return sequence.then(function() {
                        return $scope.insertaInteresComisionDetalle(value);
                    }).then(function(obj) {});
                },
                Promise.resolve()
            ).then(function() {

                $scope.lstSucursal = { suc_nombre: "", suc_idsucursal: 0 };
                $scope.selectedValueSucursalID = 0;
                $scope.selectedDepartamento = { subCuenta: 0 };
                $scope.lstDepartamento ={sucursalID:0,cuentaContable:0,descripcion:"",subCuenta:0,};

                $scope.lstRegistroContable = [];
                $scope.showSub = false;
                $scope.gridInteresRow = [];
                $scope.gridComisionesRow = [];
                $scope.objEdicion.montoAcumuladoUsuario = 0;
                swal("Creado", "Se genero un asiento Contable", "success");
            });
            ////////////////////////////////////////////////////////////////////////////////


        });

    };
    ////////////////////////////////////////////////////////
    $scope.insertaInteresComisionDetalle = function(row) {
        return new comisionesRepository.insInteresComisionDetalle(row).then(function(result) {
            return result.data;
        });

    };
    ////////////////////////////////////////////////////////


    $scope.deleteReference = function(item) {

        swal({
                title: "¿Esta seguro?",
                text: "Se eliminará el registro",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
            },
            function() {
                comisionesRepository.delInteresComision(item.interesComisionID).then(function(result) {
                    swal("Eliminado", "Se eliminó el registro", "success");
                    comisionesRepository.selInteresComision().then(function(result2) {
                        $scope.lstTemp = result2.data;
                    });
                });
            });
    };


    $scope.formar_number = function(number, c, d, t){
        var n = number, 
            c = isNaN(c = Math.abs(c)) ? 2 : c, 
            d = d == undefined ? "." : d, 
            t = t == undefined ? "," : t, 
            s = n < 0 ? "-" : "", 
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }

});