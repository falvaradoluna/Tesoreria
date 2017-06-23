registrationModule.controller('controlDepositosController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, controlDepositosRepository) {

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
    //Cartera Filtros ID    
    $scope.selectedValueSucursaID = 0;
    $scope.selectedValueDepartamentoID = 0;
    $scope.selectedValueCarteraFechaInicio = '';
    $scope.selectedValuecarteraFechaFin = '';
    $scope.showUserSearchPanel = false;
    //init grids
    $scope.gridDocumentos = controlDepositosRepository.gridDocumentosOptions;
    $scope.gridDocumentos.columnDefs = controlDepositosRepository.gridDocumentosColumns($scope.btnSwitchIsEnable);
    $scope.gridDocumentos.multiSelect = false;
    $scope.gridCartera = controlDepositosRepository.gridCarteraOptions;
    $scope.gridCartera.columnDefs = controlDepositosRepository.gridCarteraColumns();
    $scope.gridCartera.multiSelect = true;
    //busquedaCliente
    $scope.searchType = "ID cliente";
    $scope.searchTypeID = 1;
    $scope.searchValue = '';
    $scope.searchClienteID = 0;
    //sumas
    $scope.depositoTotal = 0;
    $scope.carteraTotal = 0;



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


    $scope.getDepositosBancosNoReferenciados = function(obj) {

        var empresaID = $scope.selectedValueEmpresaID;
        var cuentaID = $scope.selectedValueCuentaID;
        var fechaInicio = $scope.selectedValueFechaInicio;
        var fechaFin = $scope.selectedValueFechaFin;
        var bancoID = $scope.selectedValueBancoID;
        $scope.carteraControlsDisabled = false;


        $('#mdlLoading').modal('show');
        $scope.gridDocumentos.data = [];
        filtrosRepository.getDepositosNoReferenciados(empresaID, cuentaID, fechaInicio, fechaFin).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridDocumentos.data = result.data;
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });

        $scope.getSucursales();
    };


    $scope.getSucursales = function() {

        var idEmpresa = $scope.selectedValueEmpresaID;

        filtrosRepository.getSucursales($scope.idUsuario, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstSucursal = result.data;
            }
        });
    };


    $scope.getDepartamentos = function() {

        var idSucursal = $scope.selectedValueSucursaID;

        filtrosRepository.getDepartamentos($scope.idUsuario, idSucursal).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstDepartamento = result.data;
            }
        });

    };

    $scope.changeSwitch = function() {
        console.log($scope.btnSwitchIsEnable);

        if ($scope.btnSwitchIsEnable === 1) {
            $scope.gridDocumentos.columnDefs =
                controlDepositosRepository.gridDocumentosColumns(true);
        } else {
            $scope.gridDocumentos.columnDefs =
                controlDepositosRepository.gridDocumentosColumns(false);
        }
    };

    $scope.setSearchType = function(val) {
        if (val == 1) {
            $scope.searchType = "ID cliente";
            $scope.searchTypeID = 1;
        }
        if (val == 2) {
            $scope.searchType = "Nombre Cliente";
            $scope.searchTypeID = 2;
        }
        $scope.lstCliente = [];
        $scope.searchValue = '';
        $scope.showUserSearchPanel = false;
    };

    $scope.searchClients = function() {
        $scope.showUserSearchPanel = true;
        if ($scope.searchTypeID == 1) {
            $scope.getClientByID($scope.searchValue);
            $scope.searchClienteID = $scope.searchValue;
        }
        if ($scope.searchTypeID == 2) {
            $scope.getClientByName($scope.searchValue);
        }
    };

    $scope.getClientByID = function(idBusqueda) {
        $('#tblClient').DataTable().destroy();
        $('#mdlLoading').modal('show');
        controlDepositosRepository.getClientById(idBusqueda).then(function(result) {
            if (result.data.length > 0) {
                $('#mdlLoading').modal('hide');
                $scope.lstCliente = result.data;
                $scope.setTableStyle();

            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };



    $scope.getClientByName = function(clientName) {
        $('#tblClient').DataTable().destroy();
        $('#mdlLoading').modal('show');
        controlDepositosRepository.getClientByName(clientName).then(function(result) {
            if (result.data.length > 0) {
                $('#mdlLoading').modal('hide');
                $scope.lstCliente = result.data;
                $scope.setTableStyle();
            } else {
                $('#mdlLoading').modal('hide');
            }
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


    $scope.setTableStyle = function() {
        setTimeout(function() {
            $('#tblClient').DataTable();
            $('#tblClient_filter').remove();
            $('#tblClient_length').remove();
        }, 500);
    };

    $scope.selectedRowDocuments = {};
    $scope.selectedRowCartera = [];

    $scope.gridDocumentos.onRegisterApi = function(gridApi) {

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {

            if (row.isSelected === true) {
                console.log(row.entity.abono);
                $scope.depositoTotal = row.entity.abono;
                $scope.selectedRowDocuments = null;
                $scope.selectedRowDocuments = row.entity;
            } else if (row.isSelected === false) {
                $scope.selectedRowDocuments = null;
            }
        });
        /*
                gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    $scope.updateObservation(rowEntity.idDepositoBanco, rowEntity.observaciones);
                    $scope.$apply();
                });*/


    };


    $scope.gridCartera.onRegisterApi = function(gridApi) {

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected === true) {
                $scope.carteraTotal = $scope.carteraTotal + parseFloat(row.entity.importe);
                $scope.selectedRowCartera.push(row.entity);
                if ($scope.carteraTotal > $scope.depositoTotal) {

                    swal("Aviso", "El saldo de la cartera es mayor que el saldo del deposito.", "warning");

                }
            } else if (row.isSelected === false) {
                $scope.carteraTotal = $scope.carteraTotal - parseFloat(row.entity.importe);
                $scope.removeByAttr($scope.selectedRowCartera, 'IDB', row.entity.IDB);
            }

        });
    };

    $scope.removeByAttr = function(arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                arr.splice(i, 1);
            }
        }
        return arr;
    };


    $scope.getCarteraVencida = function() {

        var clienteID = $scope.searchClienteID;
        var empresa = $scope.selectedValueEmpresaID;
        var sucursaID = $scope.selectedValueSucursaID;
        var deptoID = $scope.selectedValueDepartamentoID;
        var fIni = $scope.selectedValueCarteraFechaInicio;
        var fFin = $scope.selectedValuecarteraFechaFin;

        $scope.gridCartera.data = [];
        $('#mdlLoading').modal('show');
        filtrosRepository.getCartera(clienteID, empresa, sucursaID, deptoID, fIni, fFin).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridCartera.data = result.data;
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };


    $scope.creaReferenciaTemporal = function() {
        var params = $scope.setReferenceParams($scope.selectedRowCartera[0], 0);
        if ($scope.selectedRowCartera.length > 1) params.idTipoReferencia = 4;
        $scope.createReference(params);
        alertFactory.success('Referencia generada con exito.');

    };

    $scope.setReferenceParams = function(objCartera, idreferencia) {

        var params = {};

        params.idEmpresa = $scope.selectedValueEmpresaID;
        params.idReferencia = idreferencia;
        params.idSucursal = $scope.selectedValueSucursaID;;
        params.idDepartamento = $scope.selectedValueDepartamentoID;
        params.idTipoDocumento = 1;
        params.serie = objCartera.serie;
        params.folio = objCartera.idDocumento;
        params.idCliente = objCartera.idCliente;
        params.idAlma = 0;
        params.importeDocumento = objCartera.importe;
        params.idTipoReferencia = 3;

        return params;

    };


    $scope.createReference = function(objData) {

        $('#mdlLoading').modal('show');

        $scope.promise = controlDepositosRepository.createReference(objData).then(function(result) {
            if (result.data.length > 0) {
                var idRef = result.data[0].idReferencia;

                for (var i = 0; i < $scope.selectedRowCartera.length; i++) {

                    var params = $scope.setReferenceParams($scope.selectedRowCartera[i], idRef);
                    $scope.insertReferenceDetails(params);
                }

                $scope.updateReference($scope.selectedRowDocuments.idDepositoBanco, idRef);
                $scope.updateCarteraVencida(idRef);

                //$scope.getDepositosBancosNoReferenciados($scope.filtros.idBanco, $scope.filtroscheck.cargo, $scope.filtros.fechaInicioDeposito, $scope.filtros.fechaFinDeposito);
                //$scope.getCarteraVencida($scope.filtros.idCliente, $scope.filtros.idTipoEmpresa, $scope.filtros.idSucursal, $scope.filtros.idDepartamento, $scope.filtros.fechaInicioCartera, $scope.filtros.fechaFinCartera);
                $scope.loadPendingDocs();
                $('#mdlLoading').modal('hide');

            } else {
                console.log('no trajo nada createReference');
                $('#mdlLoading').modal('hide');
            }
        }, function(error) {
            console.log('Error');
            $('#mdlLoading').modal('hide');
        });
    };



    $scope.insertReferenceDetails = function(objData) {

        controlDepositosRepository.insertReferenceDetails(objData).then(function(result) {

            if (result.data.length > 0) {
                console.log('ok');
            } else {
                console.log('no trajo nada insertReferenceDetails');
            }
        }, function(error) {
            console.log('Error');
        });
    };

    $scope.updateReference = function(idDepositoBanco, idReferencia) {

        $scope.promise = controlDepositosRepository.updSetReferencia(idDepositoBanco, idReferencia).then(function(result) {

            if (result.data.length > 0) {
                console.log('OK update reference');
            } else {
                console.log('no trajo nada updateReference');
            }
        }, function(error) {
            console.log('Error');
        });
    };


    $scope.updateCarteraVencida = function(idReferencia) {

        controlDepositosRepository.updCarteraVencidaReferencia(idReferencia).then(function(result) {
            if (result.data.length > 0) {
                console.log('ok update cartera vencida');
            } else {
                console.log('no trajo nada updateCarteraVencida');
            }
        }, function(error) {
            console.log('Error');
        });
    };

    $scope.loadPendingDocs = function() {

        controlDepositosRepository.getPendingReference().then(function(result) {
            if (result.data.length > 0) {
                $scope.tblPendientes = result.data;
            } else {
                console.log('no trajo nada loadPendingDocs');
            }
        }, function(error) {
            console.log('Error');
        });

    };

    $scope.showReferenceDetails = function(obj) {
        console.log(obj)
        $scope.tblPendientesDetalle = null;
        $scope.loadPendingDocsDetails(obj.idReferencia);
        $('#mdlReferenciaDetalle').modal('show');
    };

    $scope.loadPendingDocsDetails = function(idReferencia) {

        controlDepositosRepository.getPendingReferenceDetails(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                $scope.tblPendientesDetalle = result.data;
            } else {
                console.log('no trajo nada loadPendingDocsDetails');
            }
        }, function(error) {
            console.log('Error');
        });

    };


    $scope.loadPendingDocs();

});
