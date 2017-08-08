registrationModule.controller('controlDepositosController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, controlDepositosRepository) {
    // var text = "\n{mensaje:'hola mundo', code:234}";
    // var inicio = text.indexOf('{');
    // var fin = text.indexOf('}');
    // var text2 = text.substr( inicio, fin );
    // var text3 = eval("(" + text2 + ')');
    // console.log( text3 );
    // console.log( 'mensale', text3.mensaje );

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
    $scope.selectedValueDepartamentoID = null;
    $scope.selectedValueCarteraFechaInicio = null;
    $scope.selectedValuecarteraFechaFin = null;
    $scope.showUserSearchPanel = false;
    //init grids
    $scope.gridDocumentos = controlDepositosRepository.gridDocumentosOptions();
    $scope.gridDocumentos.columnDefs = controlDepositosRepository.gridDocumentosColumns($scope.btnSwitchIsEnable);
    $scope.gridDocumentos.multiSelect = false;
    $scope.gridCartera = controlDepositosRepository.gridCarteraOptions();
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
    //

    $scope.selectedRowDocuments = {};
    $scope.selectedRowCartera = [];

    $scope.tipoDeposito = 1;


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

    $scope.BuscarDepositos = function(){        
        switch($scope.tipoDeposito){
            case 1: $scope.getDepositosBancosNoReferenciados(); break;
            case 2: $scope.getDepositosPorIdentificar(); break;
            case 3: $scope.getDepositosAplicados(); break;
            default: $scope.getDepositosBancosNoReferenciados(); break;
        }        
    }

    $scope.getDepositosBancosNoReferenciados = function() {

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

                console.log( $scope.gridDocumentos.data );

                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });

        $scope.getSucursales();
    };

    $scope.getDepositosPorIdentificar = function() {
        var empresaID = $scope.selectedValueEmpresaID;
        var cuentaID = $scope.selectedValueCuentaID;
        var fechaInicio = $scope.selectedValueFechaInicio;
        var fechaFin = $scope.selectedValueFechaFin;
        var bancoID = $scope.selectedValueBancoID;
        $scope.carteraControlsDisabled = false;

        $('#mdlLoading').modal('show');
        $scope.gridDocumentos.data = [];
        filtrosRepository.getDepositosPorIdentificar(empresaID, cuentaID, fechaInicio, fechaFin).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridDocumentos.data = result.data;
                console.log( $scope.gridDocumentos.data );
                $('#mdlLoading').modal('hide');
                console.log('Resultados chidos');
            } else {
                $('#mdlLoading').modal('hide');
                console.log('No hay Resultados');
            }
        });

        $scope.getSucursales();
    };

    $scope.getDepositosAplicados = function() {
        var empresaID = $scope.selectedValueEmpresaID;
        var cuentaID = $scope.selectedValueCuentaID;
        var fechaInicio = $scope.selectedValueFechaInicio;
        var fechaFin = $scope.selectedValueFechaFin;
        var bancoID = $scope.selectedValueBancoID;
        $scope.carteraControlsDisabled = false;

        $('#mdlLoading').modal('show');
        $scope.gridDocumentos.data = [];
        filtrosRepository.getDepositosAplicados(empresaID, cuentaID, fechaInicio, fechaFin).then(function(result) {
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

    $scope.SetClienteID = function(cliente) {
        $scope.lstCliente = [];
        $scope.searchClienteID = cliente.idCliente;
        $scope.lstCliente.push(cliente);
        $scope.searchTypeID = 1;
        $('#tblClient').DataTable().destroy();
    };

    $scope.getClientByID = function(idBusqueda) {
        $('#tblClient').DataTable().destroy();
        $('#mdlLoading').modal('show');
        controlDepositosRepository.getClientById(idBusqueda).then(function(result) {
            if (result.data.length > 0) {
                $('#mdlLoading').modal('hide');
                $scope.lstCliente = result.data;
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



    $scope.gridDocumentos.onRegisterApi = function(gridApi) {

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {

            if (row.isSelected === true) {
                //console.log(row.entity.abono);
                $scope.depositoTotal = row.entity.abono;
                $scope.selectedRowDocuments = null;
                $scope.selectedRowDocuments = row.entity;
            } else if (row.isSelected === false) {
                $scope.selectedRowDocuments = null;
            }
        });

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            $scope.updateObservation(rowEntity.idDepositoBanco, rowEntity.observaciones);
            $scope.$apply();
        });


    };


    $scope.gridCartera.onRegisterApi = function(gridApi) {

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected === true) {
                $scope.carteraTotal = $scope.carteraTotal + parseFloat(row.entity.importe);
                $scope.selectedRowCartera.push(row.entity);

                /*
                if ($scope.carteraTotal > $scope.depositoTotal) {
                    swal("Aviso", "El saldo de la cartera es mayor que el saldo del deposito.", "warning");
                }*/

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
        $scope.setPrevSession();

        if ($scope.searchClienteID === 0) {
            swal("Aviso", "Cliente es requerido.", "warning");
        } else {
            var clienteID = $scope.searchClienteID;
            var empresa = $scope.selectedValueEmpresaID;
            var sucursaID = $scope.selectedValueSucursaID;
            var deptoID = $scope.selectedValueDepartamentoID;
            var fIni = $scope.selectedValueCarteraFechaInicio;
            var fFin = $scope.selectedValuecarteraFechaFin;

            // console.log( sucursaID );
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
        }
    };


    $scope.creaReferenciaTemporal = function() {
        //if ($scope.carteraTotal > $scope.depositoTotal) {
        console.log( 'Filas seleccionadas', $scope.selectedRowCartera.length );
        console.log( 'Cartera Total', $scope.carteraTotal );
        console.log( 'Deposito Total', $scope.depositoTotal );
        // if ($scope.carteraTotal > $scope.depositoTotal && $scope.selectedRowCartera.length > 1) {

        if( $scope.depositoTotal === 0 || $scope.carteraTotal === 0 ){
            swal("Aviso", "Seleccione almenos un deposito  y un documento.", "warning");
        }
        else if( $scope.carteraTotal > $scope.depositoTotal ){
            swal("Aviso", "El pago es menor a la suma de la cartera.", "warning");
        }
        else{
            $("#modal-anticipo").modal('show');
            $scope.anticipo = $scope.depositoTotal - $scope.carteraTotal;
            $scope.Seleccionado = '';
            $scope.selectedRowCartera.forEach( function( item, key ){
                $scope.selectedRowCartera[key].checked = false;
                $scope.selectedRowCartera[key].importeFinal = parseFloat($scope.selectedRowCartera[key].importe) + parseFloat($scope.anticipo);
            });

            $scope.model = {};
            $scope.model.selectedOccurrence = $scope.selectedRowCartera.length - 1;

            $scope.selectedRowCartera[ $scope.selectedRowCartera.length - 1 ].checked = true;
            // console.log( $scope.selectedRowCartera );
            // swal({
            //     title: "¿Esta seguro?",
            //     text: "Se creara una referencia temporal.",
            //     type: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#21B9BB",
            //     confirmButtonText: "Aceptar",
            //     closeOnConfirm: true
            // },
            // function() {
            //     setTimeout(function() {
            //         var params = $scope.setReferenceParams($scope.selectedRowCartera[0], 0, $scope.selectedRowDocuments.idDepositoBanco);
            //         if ($scope.selectedRowCartera.length > 1) params.idTipoReferencia = 4;
            //         $scope.createReference(params);
            //     }, 1000);
            // });
        }
    };

    $scope.ConfirmaReferencia = function(){
        $scope.selectedRowCartera[ $scope.model.selectedOccurrence ].importe = $scope.selectedRowCartera[ $scope.model.selectedOccurrence ].importeFinal;
        
        setTimeout(function() {
            var params = $scope.setReferenceParams($scope.selectedRowCartera[0], 0, $scope.selectedRowDocuments.idDepositoBanco);
            if ($scope.selectedRowCartera.length > 1) params.idTipoReferencia = 4;
            $scope.createReference(params);
        }, 1000);

        $("#modal-anticipo").modal('hide');
    }

    $scope.asignarAnticipoRadio = function( i ){
        console.log( 'Son el cambio' );
        // $scope.selectedRowCartera.forEach( function( item, key ){            
        //     $scope.selectedRowCartera[key].checked = false;
        //     $scope.selectedRowCartera[key].importeFinal = $scope.selectedRowCartera[key].importe;
        // });

        // $scope.selectedRowCartera[ i ].checked = true;
        // $scope.selectedRowCartera[ i ].importeFinal = $scope.selectedRowCartera[key].importe + $scope.anticipo;
    }


    $scope.createReference = function(objData) {

        $scope.promise = controlDepositosRepository.createReference(objData).then(function(result) {
            if (result.data.length > 0) {

                var idRef = result.data[0].idReferencia;

                for (var i = 0; i < $scope.selectedRowCartera.length; i++) {
                    var params = $scope.setReferenceParams($scope.selectedRowCartera[i], idRef, $scope.selectedRowDocuments.idDepositoBanco);
                    $scope.insertReferenceDetails(params);
                }

                $scope.reloadGrids();

            } else {
                console.log('createReference empty');
            }
        }, function(error) {
            console.log('Error');
        });
    };

    $scope.reloadGrids = function() {
        $scope.depositoTotal = 0;
        $scope.carteraTotal = 0;
        $scope.getDepositosBancosNoReferenciados();
        $scope.getCarteraVencida();
        $scope.loadPendingDocs();
    };


    $scope.setReferenceParams = function(objCartera, idreferencia, depositoID) {

        var params = {};

        params.idEmpresa = objCartera.idEmpresa;
        params.idReferencia = idreferencia;
        params.idSucursal = objCartera.idSucursal;
        params.idDepartamento = objCartera.idDepartamento;
        params.idTipoDocumento = 1;
        params.serie = objCartera.serie;
        params.folio = objCartera.idDocumento;
        params.idCliente = objCartera.idCliente;
        params.idAlma = 0;
        params.importeDocumento = objCartera.importe;
        params.idTipoReferencia = 3;
        params.depositoID = depositoID;

        return params;

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


    $scope.aplicarReferencia = function(idReferencia) {

        swal({
                title: "¿Esta seguro?",
                text: "Se aplicará la referencia.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
            },
            function() {
                controlDepositosRepository.insApplyReference(idReferencia).then(function(result) {
                    swal("Aplicado", "Referencia aplicada", "success");
                    $scope.insertaRefAntipag();
                    $scope.loadPendingDocs();
                });
            });
    };

    $scope.aplicarReferenciaTodas = function(data) {

        swal({
                title: "¿Esta seguro?",
                text: "Se aplicarán todas la referencias.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aceptar",
                closeOnConfirm: true
            },
            function() {
                for (var i = 0; i < data.length; i++) {
                    controlDepositosRepository.insApplyReference(data.idReferencia);
                }

                swal("Aplicado", "Se aplicaron todas las referncias", "success");
                $scope.loadPendingDocs();
            });
    };


    $scope.loadPendingDocs = function() {

        $scope.tblPendientes = [];
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

        $scope.tblPendientesDetalle = [];
        $scope.loadPendingDocsDetails(obj.idReferencia);
        $('#mdlReferenciaDetalle').modal('show');
    };

    $scope.loadPendingDocsDetails = function(idReferencia) {

        controlDepositosRepository.getPendingReferenceDetails(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                $scope.tblPendientesDetalle = result.data;
            } else {
                console.log('loadPendingDocsDetails no result');
            }
        }, function(error) {
            console.log('Error');
        });

    };




    $scope.insertaRefAntipag = function() {

        var bankTableName = "";
        var currentBase = "";

        controlDepositosRepository.insertaRefAntipag(bankTableName, currentBase);

    };

    $scope.updateObservation = function(idDepositoBanco, observacion) {

        $scope.promise = controlDepositosRepository.updSetObservation(idDepositoBanco, observacion).then(function(result) {

            if (result.data.length > 0) {
                console.log('OK');
            } else {
                console.log('no trajo nada updateObservation');
            }
        }, function(error) {
            console.log('Error');
        });


    };

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
    }


    $scope.setPrevSession = function() {
        controlDepositosRepository.prevSession.isFirstTime = false;
        controlDepositosRepository.prevSession.ddlBancoDisabled = $scope.ddlBancoDisabled;
        controlDepositosRepository.prevSession.ddlCuentaDisabled = $scope.ddlCuentaDisabled;
        controlDepositosRepository.prevSession.txtFechasDisabled = $scope.txtFechasDisabled;
        controlDepositosRepository.prevSession.btnBuscarDisabled = $scope.btnBuscarDisabled;
        controlDepositosRepository.prevSession.carteraControlsDisabled = $scope.carteraControlsDisabled;
        controlDepositosRepository.prevSession.selectedValueEmpresaID = $scope.selectedValueEmpresaID;
        controlDepositosRepository.prevSession.selectedValueBancoID = $scope.selectedValueBancoID;
        controlDepositosRepository.prevSession.selectedValueCuentaID = $scope.selectedValueCuentaID;
        controlDepositosRepository.prevSession.selectedValueFechaInicio = $scope.selectedValueFechaInicio;
        controlDepositosRepository.prevSession.selectedValueFechaFin = $scope.selectedValueFechaFin;
        controlDepositosRepository.prevSession.btnSwitchIsEnable = $scope.btnSwitchIsEnable;
        controlDepositosRepository.prevSession.selectedValueSucursaID = $scope.selectedValueSucursaID;
        controlDepositosRepository.prevSession.selectedValueDepartamentoID = $scope.selectedValueDepartamentoID;
        controlDepositosRepository.prevSession.selectedValueCarteraFechaInicio = $scope.selectedValueCarteraFechaInicio;
        controlDepositosRepository.prevSession.selectedValuecarteraFechaFin = $scope.selectedValuecarteraFechaFin;
        controlDepositosRepository.prevSession.showUserSearchPanel = $scope.showUserSearchPanel;
        controlDepositosRepository.prevSession.searchType = $scope.searchType;
        controlDepositosRepository.prevSession.searchTypeID = $scope.searchTypeID;
        controlDepositosRepository.prevSession.searchValue = $scope.searchValue;
        controlDepositosRepository.prevSession.searchClienteID = $scope.searchClienteID;
    };


    if (controlDepositosRepository.prevSession.isFirstTime === false) {

        $scope.ddlBancoDisabled = controlDepositosRepository.prevSession.ddlBancoDisabled;
        $scope.ddlCuentaDisabled = controlDepositosRepository.prevSession.ddlCuentaDisabled;
        $scope.txtFechasDisabled = controlDepositosRepository.prevSession.txtFechasDisabled;
        $scope.btnBuscarDisabled = controlDepositosRepository.prevSession.btnBuscarDisabled;
        $scope.carteraControlsDisabled = controlDepositosRepository.prevSession.carteraControlsDisabled;
        $scope.selectedValueEmpresaID = controlDepositosRepository.prevSession.selectedValueEmpresaID;
        $scope.selectedValueBancoID = controlDepositosRepository.prevSession.selectedValueBancoID;
        $scope.selectedValueCuentaID = controlDepositosRepository.prevSession.selectedValueCuentaID;
        $scope.selectedValueFechaInicio = controlDepositosRepository.prevSession.selectedValueFechaInicio;
        $scope.selectedValueFechaFin = controlDepositosRepository.prevSession.selectedValueFechaFin;
        $scope.btnSwitchIsEnable = controlDepositosRepository.prevSession.btnSwitchIsEnable;
        $scope.selectedValueSucursaID = controlDepositosRepository.prevSession.selectedValueSucursaID;
        $scope.selectedValueDepartamentoID = controlDepositosRepository.prevSession.selectedValueDepartamentoID;
        $scope.selectedValueCarteraFechaInicio = controlDepositosRepository.prevSession.selectedValueCarteraFechaInicio;
        $scope.selectedValuecarteraFechaFin = controlDepositosRepository.prevSession.selectedValuecarteraFechaFin;
        $scope.showUserSearchPanel = controlDepositosRepository.prevSession.showUserSearchPanel;
        $scope.searchType = controlDepositosRepository.prevSession.searchType;
        $scope.searchTypeID = controlDepositosRepository.prevSession.searchTypeID;
        $scope.searchValue = controlDepositosRepository.prevSession.searchValue;
        $scope.searchClienteID = controlDepositosRepository.prevSession.searchClienteID;

        $scope.getBancos();
        $scope.getCuentas();
        $scope.getSucursales();
        $scope.getDepartamentos();
    }


    $scope.loadPendingDocs();

    $scope.porAplicar = function(){
        $(".pestania").removeClass('active');
        $(".por-aplicar").addClass('active');
        $scope.tipoDeposito = 1;
        if( !$scope.carteraControlsDisabled )
            $scope.getDepositosBancosNoReferenciados();

    }

    $scope.dpi = function(){
        $(".pestania").removeClass('active');
        $(".dpi").addClass('active');
        $scope.tipoDeposito = 2;
        if( !$scope.carteraControlsDisabled )
            $scope.getDepositosPorIdentificar();
    }

    $scope.aplicado = function(){
        $(".pestania").removeClass('active');
        $(".aplicado").addClass('active');
        $scope.tipoDeposito = 3;
        if( !$scope.carteraControlsDisabled )
            $scope.getDepositosAplicados();
    }

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
