registrationModule.controller('controlDepositosController', function($scope, $rootScope, $location, localStorageService, filtrosRepository, alertFactory, $http, $log, $timeout, uiGridConstants, controlDepositosRepository) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.idUsuario = 0;

    $scope.filtros = {
        idEmpresa: '',
        idSucursal: '',
        idDepartamento: ''
    };

    $scope.init = function() {
        $scope.idUsuario = $rootScope.userData.idUsuario;
        console.log($scope.idUsuario);
        $scope.loadPendingDocs();
        $scope.getEmpresa($scope.idUsuario);
        $scope.calendario();
        $scope.activarBanco = true;
        $scope.activarCuenta = true;
        $scope.activarFechaIniDeposito = true;
        $scope.activarFechaFinDeposito = true;
        $scope.activarSucursal = true;
        $scope.activarDepartamento = true;
        $scope.activarFechaIniCartera = true;
        $scope.activarFechaFinCartera = true;
        $scope.activarBuscarDepositos = true;
        $scope.activarBuscarCartera = true;
        $scope.activarBuscarCliente = true;
        $scope.depositoTotal = 0;
        $scope.carteraTotal = 0;
        //$scope.getDepositosBancosNoReferenciados(1,1,'10/11/2015','31/12/2015');
        //$scope.getCarteraVencida(31996,4,12,67,'10/11/2015','31/12/2015');
        $scope.filtroscheck = { cargo: 1 };
        //console.log($rootScope.userData);
        
   };

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
    };


     $scope.searchClients = function() {
        if ($scope.searchTypeID == 1) {
            $scope.showPanel = true;
            $scope.individualEmpresa = false;
            $scope.lote = false,
            $scope.individual = true;
            $scope.Clientefiltro = true;
            $scope.DocumentoFiltro = false;
            $scope.sucursal= false;
            $scope.departament = false;

            $scope.getClientId($scope.filtros.idCliente);
            $scope.currentIDClient = $scope.filtros.idCliente;
           
            $scope.nombreEmpresa = '';
            $scope.idEmpresa = null;
            $scope.idDepartamento = null;
        } else {
            if($scope.searchTypeID == 2){
                $scope.Clientefiltro = true;
                $scope.mostrar = true;
                $scope.nombreEmpresa = '';
                $scope.idEmpresa = null;
                $scope.getClient($scope.filtros.idCliente);
                $scope.showPanel = true;
                $scope.showPanel1 = false;
        }
        }
    }


     $scope.lstClient = [];

    $scope.getClient = function(clientName) {
        $scope.lstClient = [];
     
        $('#tblClient').DataTable().destroy();
        $('#loadModal').modal('show');
        $scope.showPanel1 = true;
        controlDepositosRepository.getClientByName(clientName).then(function(result) {

            if (result.data.length > 0) {
                $scope.lstClient = result.data;


                setTimeout(function() {
                    $scope.setTablePaging('tblClient');
                    $("#tblClient_filter").removeClass("dataTables_info").addClass("hide-div");
                    $('#loadModal').modal('hide');
                }, 1000);
            } else { $('#loadModal').modal('hide'); }
        });
    };


     $scope.setTablePaging = function(idTable) {
        $('#' + idTable).DataTable({
            dom: '<"html5buttons"B>lTfgitp',
            buttons: [{
                extend: 'excel',
                title: 'ExampleFile'
            }, {
                extend: 'print',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');
                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }]
        });
    };
        
    $scope.getClientId = function(idBusqueda) {

        $scope.mostrar = false;
        $scope.showPanel1 = true;
        $scope.showPanel = false;
        $('#tblClient').DataTable().destroy();
        $('#loadModal').modal('show');
        controlDepositosRepository.getClientById(idBusqueda).then(function(result) {
            if (result.data.length > 0) {
                $scope.lstClient = result.data;
                /*setTimeout(function() {
                    $scope.setTablePaging('tblClient');
                    $("#tblClient_filter").removeClass("dataTables_info").addClass("hide-div");
                    $('#loadModal').modal('hide');
                }, 1000);*/
            } else { $('#loadModal').modal('hide'); }
        });
    };

     $scope.searchDocs = function(obj) {
       
        $scope.showPanel = false;
        $scope.showPanel1 = true;
        $scope.filtros.idCliente= obj.idCliente;
        $scope.clienteDetalle = obj;
        //$scope.getCarteraVencida($scope.filtros);
        
    };


    $scope.getEmpresa = function(idUsuario) {
        filtrosRepository.getEmpresas(idUsuario).then(function(result) {
            if (result.data.length > 0) {
                $scope.empresaUsuario = result.data;
            }
        });
    };

    $scope.empresaSeleccionada = function(idEmpresa) {

        $scope.activarBanco = true;
        $scope.activarSucursal = true;
        $scope.getSucursales($scope.idUsuario, idEmpresa); /*optimizar*/
        $scope.getBancos(idEmpresa);

    };


    $scope.getSucursales = function(idEmpresa) {

        $scope.activarSucursal = false;
        filtrosRepository.getSucursales($scope.idUsuario, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.sucursalesUsuario = result.data;
            }
        });
    };

    $scope.getDepartamentos = function(idSucursal) {
        $scope.activarDepartamento = false;
        filtrosRepository.getDepartamentos($scope.idUsuario, idSucursal).then(function(result) {
            if (result.data.length > 0) {
                $scope.departamentosUsuario = result.data;
            }
        });
    };

    $scope.getBancos = function(idEmpresa) {
        $scope.activarBanco = false;
        $scope.cuentaBancaria =
            filtrosRepository.getBancos(idEmpresa).then(function(result) {
                if (result.data.length > 0) {
                    $scope.bancoEmpresa = result.data;
                }
            });
    };

    $scope.getCuentas = function(idBanco, idEmpresa) {

        $scope.activarCuenta = false;
        $scope.cuentaBancaria = [];
        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.cuentaBancaria = result.data;
                console.log($scope.cuentaBancaria);
            }
        });
    };

    $scope.getCarteraVencida = function(obj) {

        console.log("getCarteraVencida");
        console.log(obj);

            /*
    obj.idEmpresa
    obj.idSucursal
    obj.idDepartamento
    obj.idCuenta
    obj.fechaInicioDeposito
    obj.fechaFinDeposito
    obj.idBanco
    obj.idCliente
    obj.fechaInicioCartera
    obj.fechaFinCartera

    */
    
        //ISSUE_2 modificar los filtros de getCarteraVencida convertir a objeto getCarteraVencida
        $scope.gridCartera.data = [];
        $('#mdlLoading').modal('show');
        filtrosRepository.getCartera(obj.idCliente, obj.idEmpresa, obj.idSucursal, obj.idDepartamento, obj.fechaInicioCartera, obj.fechaFinCartera).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridCartera.data = result.data;
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });

    };

    $scope.getDepositosBancosNoReferenciados = function(obj) {

        $('#mdlLoading').modal('show');
        $scope.gridDocumentos.data = [];
        filtrosRepository.getDepositosNoReferenciados(obj.idEmpresa, obj.idCuenta, obj.fechaInicioDeposito, obj.fechaFinDeposito).then(function(result) {
            if (result.data.length > 0) {
                $scope.gridDocumentos.data = result.data;               
                $('#mdlLoading').modal('hide');
            } else {
                $('#mdlLoading').modal('hide');
            }
        });
    };

    $scope.getCalendartios = function(idBanco, idEmpresa) {

        $scope.activarCuenta = false;

        filtrosRepository.getCuenta(idBanco, idEmpresa).then(function(result) {
            if (result.data.length > 0) {
                $scope.cuentaBancaria = result.data;
            }
        });
    };

    $scope.empresaVacia = function() {

        $scope.filtros.idCuenta = null;
        $scope.filtros.fechaInicioDeposito = null;
        $scope.filtros.fechaFinDeposito = null;
        $scope.filtros.idDepartamento = null;
        $scope.filtros.fechaInicioDeposito = null;
        $scope.filtros.fechaFinDeposito = null;
        $scope.activarCuenta = true;
        $scope.activarFechaIniDeposito = true;
        $scope.activarFechaFinDeposito = true;
        $scope.activarDepartamento = true;
        $scope.activarFechaIniCartera = true;
        $scope.activarFechaFinCartera = true;
        $scope.activarBuscarDepositos = true;
        $scope.activarBuscarCartera = true;
        $scope.gridCartera.data = [];
        $scope.gridDocumentos.data = [];
    };

    $scope.gridCartera = {
        enableColumnResize: true,
        enableRowSelection: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableGroupHeaderSelection: false,
        treeRowHeaderAlwaysVisible: true,
        showColumnFooter: true,
        showGridFooter: true,
        height: 900,
        cellEditableCondition: function($scope) {
            return $scope.row.entity.seleccionable;
        }
    };

    $scope.gridCartera.columnDefs = [
        { name: 'nombreSucursal', width: '10%', displayName: 'Sucursal' },
        { name: 'nombreDepartamento', width: '10%', displayName: 'Departamento' },
        { name: 'folio', width: '10%', displayName: 'Factura' },
        { name: 'fecha', width: '10%', displayName: 'fecha', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'' },
        { name: 'nombreCliente', width: '30%', displayName: 'Cliente' },
        { name: 'importe', width: '10%', displayName: 'Importe', cellFilter: 'currency' },
        { name: 'saldo', width: '10%', displayName: 'Saldo', cellFilter: 'currency' },

    ];

    $scope.gridCartera.multiSelect = true;

    $scope.gridDocumentos = {
        enableColumnResize: true,
        enableRowSelection: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableGroupHeaderSelection: false,
        treeRowHeaderAlwaysVisible: true,
        showColumnFooter: true,
        showGridFooter: true,
        height: 900,
        cellEditableCondition: function($scope) {
            return $scope.row.entity.seleccionable;
        }
    };

    $scope.gridDocumentos.columnDefs = [
        { name: 'banco', displayName: 'Banco', width: '10%' },
        { name: 'idBmer', displayName: 'Cons', width: '5%' },
        { name: 'referencia', displayName: 'Referencia', width: '15%' },
        { name: 'concepto', displayName: 'Concepto', width: '15%' },
        { name: 'fechaOperacion', displayName: 'Fecha', width: '10%', type: 'date' },
        { name: 'cargo', displayName: 'Cargo', width: '10%', cellFilter: 'currency' },
        { name: 'abono', displayName: 'Abono', width: '10%', cellFilter: 'currency' }, {
            name: 'observaciones',
            displayName: 'Observaciones',
            width: '25%',
            cellEditableCondition: true
        }
    ];

    $scope.gridDocumentos.multiSelect = false;
    $scope.gridDocumentos.modifierKeysToMultiSelect = false;
    $scope.gridDocumentos.noUnselect = true;

    $scope.gridDocumentos.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.toggleRowSelection = function() {
        $scope.gridApi.selection.clearSelectedRows();
        $scope.gridDocumentos.enableRowSelection = !$scope.gridDocumentos.enableRowSelection;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };


    $scope.activa_calendariosDepositos = function() {
        $scope.activarFechaIniDeposito = false;
        $scope.activarFechaFinDeposito = false;
        $scope.activarBuscarDepositos = false;
    };

    $scope.activa_calendariosCartera = function() {
        $scope.activarFechaIniCartera = false;
        $scope.activarFechaFinCartera = false;
        $scope.activarBuscarCliente = false;
        $scope.activarBuscarCartera = false;
    };

    $scope.activa_BuscarCartera = function() {
        $scope.activarBuscarCartera = false;
    };


    $scope.selectedDocuments = {};
    $scope.selectedCartera = [];

    $scope.gridDocumentos.onRegisterApi = function(gridApi) {

        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            //var msg = 'row selected ' + row.isSelected;
            if (row.isSelected === true) {
                $scope.depositoTotal = row.entity.abono;
                $scope.selectedDocuments = null;
                $scope.selectedDocuments = row.entity;
            } else if (row.isSelected == false) {
                $scope.selectedDocuments = null;
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
            if (row.isSelected == true) {
                $scope.carteraTotal = $scope.carteraTotal + parseFloat(row.entity.importe);
                $scope.selectedCartera.push(row.entity);
            } else if (row.isSelected == false) {
                $scope.carteraTotal = $scope.carteraTotal - parseFloat(row.entity.importe);
                $scope.removeByAttr($scope.selectedCartera, 'IDB', row.entity.IDB);
            }

        });
    };



    $scope.guardarGrid = function() {
        //$('#mdlLoading').modal('show');    
        var params = $scope.setReferenceParams($scope.selectedCartera[0], 0);
        if ($scope.selectedCartera.length > 1) params.idTipoReferencia = 4;
        $scope.createReference(params);
        alertFactory.success('Referencia generada con exito.');

    };


    $scope.setReferenceParams = function(objCartera, idreferencia) {

        var params = {};

        params.idEmpresa = $scope.filtros.idEmpresa;
        params.idReferencia = idreferencia;
        params.idSucursal = $scope.filtros.idSucursal;
        params.idDepartamento = $scope.filtros.idDepartamento;
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

                for (var i = 0; i < $scope.selectedCartera.length; i++) {

                    var params = $scope.setReferenceParams($scope.selectedCartera[i], idRef);
                    $scope.insertReferenceDetails(params);
                }

                $scope.updateReference($scope.selectedDocuments.idDepositoBanco, idRef);
                $scope.updateCarteraVencida(idRef);

                $scope.getDepositosBancosNoReferenciados($scope.filtros.idBanco, $scope.filtroscheck.cargo, $scope.filtros.fechaInicioDeposito, $scope.filtros.fechaFinDeposito);
                $scope.getCarteraVencida($scope.filtros.idCliente, $scope.filtros.idTipoEmpresa, $scope.filtros.idSucursal, $scope.filtros.idDepartamento, $scope.filtros.fechaInicioCartera, $scope.filtros.fechaFinCartera);
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

        $scope.promise = controlDepositosRepository.insertReferenceDetails(objData).then(function(result) {

            if (result.data.length > 0) {
                console.log('ok');
            } else {
                console.log('no trajo nada insertReferenceDetails');
            }
        }, function(error) {
            console.log('Error');
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

    $scope.tblPendientes = [];
    $scope.tblPendientesDetalle = [];


    $scope.loadPendingDocs = function() {

        $scope.promise = controlDepositosRepository.getPendingReference().then(function(result) {

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
        $scope.tblPendientesDetalle = null;
        $scope.loadPendingDocsDetails(obj.idReferencia);
        $('#mdlReferenciaDetalle').modal('show');
    };

    $scope.loadPendingDocsDetails = function(idReferencia) {

        $scope.promise = controlDepositosRepository.getPendingReferenceDetails(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                $scope.tblPendientesDetalle = result.data;
            } else {
                console.log('no trajo nada loadPendingDocsDetails');
            }
        }, function(error) {
            console.log('Error');
        });

    };

    $scope.applyReference = function(idReferencia) {

        $scope.promise = controlDepositosRepository.insApplyReference(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                $scope.loadPendingDocs();
            } else {
                console.log('no trajo nada applyReference');
            }
        }, function(error) {
            console.log('Error');
        });


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

    $scope.setSearchType = function(val) {
      if (val == 1) {
          $scope.searchType = "ID cliente";
          $scope.searchTypeID = 1;
          $scope.nombreEmpresa = '';
      } else {
          if (val == 2) {
              $scope.searchType = "Nombre Cliente";
              $scope.searchTypeID = 2;
          }
      }

      $scope.txtSearchClient = "";
    }


    $scope.updateReference = function(idDepositoBanco, idReferencia) {

        $scope.promise = controlDepositosRepository.updSetReferencia(idDepositoBanco, idReferencia).then(function(result) {

            if (result.data.length > 0) {
                console.log('OKKKKKKKKKKKKKK');
            } else {
                console.log('no trajo nada updateReference');
            }
        }, function(error) {
            console.log('Error');
        });
    };


    $scope.updateCarteraVencida = function(idReferencia) {

        $scope.promise = controlDepositosRepository.updCarteraVencidaReferencia(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                console.log('ok cartera vencida');
            } else {
                console.log('no trajo nada updateCarteraVencida');
            }
        }, function(error) {
            console.log('Error');
        });
    };


    $scope.deleteReferenciaGenerada = function(idReferencia) {

        $scope.promise = controlDepositosRepository.delReferenciaGenerada(idReferencia).then(function(result) {

            if (result.data.length > 0) {
                console.log('Ref Eliminada');
            } else {
                console.log('no trajo nada deleteReferenciaGenerada');
            }
        }, function(error) {
            console.log('Error');
        });
    };


    $scope.testApi = function() {

        $scope.promise = controlDepositosRepository.testApi({ val1: 1, val2: 'valor' }).then(function(result) {

            if (result.data.length > 0) {
                console.log(result.data);
            } else {
                console.log('no trajo nada deleteReferenciaGenerada');
            }
        }, function(error) {
            console.log('Error');
        });
    };


    $scope.testClendar = function(obj) {

        console.log("prueba Calendario");
        console.log(obj.fechaFinCartera);
        console.log(obj.fechaInicioCartera);
    };


});
