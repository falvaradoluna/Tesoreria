registrationModule.controller('conciliacionDetalleRegistroController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.nodoPadre = [];
    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.auxiliarPadre = '';
    $scope.bancoPadre = '';
    $scope.bancoDetalle = '';
    $scope.auxiliarDetalle = '';
    i18nService.setCurrentLang('es'); //Para seleccionar el idioma  
    $scope.infReporte = '';
    $scope.jsonData = '';
    $scope.ruta = '';
    $scope.clabe = '';


    //****************************************************************************************************
    // INICIA las variables para el GRID AUXILIAR CONTABLE
    //****************************************************************************************************
    $scope.gridAuxiliarContable = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true
    };
    $scope.gridAuxiliarContable.columnDefs = [
        { name: 'polFecha', displayName: 'Fecha', width: 100, type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'' },//, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Tipo Pol', width: 200 },
        { name: 'polReferencia2', displayName: 'No Pol', width: 100 },
        //{ name: 'polReferencia1', displayName: 'CHQ', width: 300 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 },
        { name: 'cargo', displayName: 'Cargo', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' }
    ];
    $scope.gridAuxiliarContable.multiSelect = true;
    //****************************************************************************************************
    // INICIA las variables para el GRID BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        enableRowSelection: true,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true
    };
    $scope.gridDepositosBancos.columnDefs = [
        { name: 'banco', displayName: 'Banco', width: 100 },
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'concepto', displayName: 'Concepto', width: 300 },
        { name: 'cargo', displayName: 'Cargo', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' }
    ];
    $scope.gridDepositosBancos.multiSelect = true;
    //****************************************************************************************************
    // INICIA 
    //****************************************************************************************************
    $scope.init = function() {
        variablesLocalStorage();
        $scope.getDepositosBancos($scope.idBanco, 1, $scope.cuentaBanco);
        $scope.getAuxiliarContable($scope.idEmpresa, $scope.cuenta, 1);
        $scope.getAuxiliarPunteo($scope.idEmpresa, $scope.cuenta);
        $scope.getBancoPunteo($scope.idEmpresa, $scope.cuentaBanco);
        $rootScope.mostrarMenu = 1;
        console.log($scope.busqueda);
    };
    var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.idEmpresa = $scope.busqueda.idEmpresa;
        $scope.cuenta = $scope.busqueda.cuentaContable;
        $scope.idBanco = $scope.busqueda.idBanco;
        $scope.nombreEmpresa = $scope.busqueda.Empresa;
        $scope.cuentaBanco = $scope.busqueda.cuenta;
        $scope.nombreBanco = $scope.busqueda.Banco;
        $scope.nombreGerente = $scope.busqueda.gerente;
        $scope.nombreContador = $scope.busqueda.contador;
    };
    $scope.getAuxiliarContable = function(idEmpresa, numero_cuenta, idestatus) {
        if (idestatus == 1) { //Consigo los datos del Auxiliar Contable sin puntear
            filtrosRepository.getAuxiliar(idEmpresa, numero_cuenta, idestatus).then(function(result) {
                if (result.data.length >= 0) {
                    $scope.auxiliarContable = result.data;
                    $scope.gridAuxiliarContable.data = result.data;
                    console.log($scope.gridAuxiliarContable.data, 'Auxiliar Contable')
                }
            });
        } else if (idestatus == 2) { //consigo los datos el Auxiliar Contable Punteado
            filtrosRepository.getAuxiliar(idEmpresa, numero_cuenta, idestatus).then(function(result) {
                if (result.data.length >= 0) {
                    $scope.auxiliarContable = result.data;
                }
            });
        }
    };
    $scope.getDepositosBancos = function(idBanco, idestatus, cuentaBancaria) {
        if (idestatus == 1) { //Consigo los datos del Banco sin Puntear
            filtrosRepository.getDepositos(idBanco, idestatus, cuentaBancaria).then(function(result) {
                if (result.data.length >= 0) {
                    $scope.depositosBancos = result.data;
                    $scope.gridDepositosBancos.data = result.data;
                    console.log($scope.gridDepositosBancos.data, 'Desposito Bancario')
                }
            });
        } else if (idestatus == 2) { //Consigo los datos del banco Punteado
            filtrosRepository.getDepositos(idBanco, idestatus).then(function(result) {
                if (result.data.length > 0) {
                    $scope.depositosBancos = result.data;
                }
            });
        }
    };
    //**************************************************************************************************
    // INICIA Genera el pdf 
    //**************************************************************************************************
    $scope.generarReporte = function() {
        $('#loading').modal('show');
        conciliacionDetalleRegistroRepository.getReportePdf($scope.jsonData).then(function(fileName) {
            setTimeout(function() {
                $("#objReportePdf").remove();
                $scope.ruta = fileName.data;
                //$("<object id='objReportePdf' class='filesInvoce' data='http://192.168.20.9:5000/api/layout/viewpdf?fileName=" + $scope.ruta + "' width='100%' height='500px' >").appendTo('#reportePdf');
                $("<object id='objReportePdf' class='filesInvoce' data='http://192.168.20.9:5200/api/conciliacionDetalleRegistro/viewpdf?fileName=" + $scope.ruta + "' width='100%' height='500px' >").appendTo('#reportePdf');
                $('#loading').modal('hide');
                $('#reproteModalPdf').modal('show');
            }, 5000);

        });
    };
    //**************************************************************************************************
    // INICIO Envio de correo 
    //**************************************************************************************************    
    $scope.envioMail = function() {
        conciliacionDetalleRegistroRepository.getReportePdf($scope.jsonData).then(function(fileName) {
            conciliacionDetalleRegistroRepository.sendMail(fileName.data, $scope.cuenta, $scope.nombreEmpresa, $scope.cuentaBanco, $scope.nombreBanco, $rootScope.userData.nombreUsuario).then(function(result) {
                alertFactory.success('Envio de correo con exito');
                console.log(result, 'Estoy en el envio de mail')
            });
        });
    };
    //****************************************************************************************************
    // INICIA la configuración del GRID AUXILIAR CONTABLE
    //****************************************************************************************************
    $scope.gridAuxiliarContable.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApiAuxiliar = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected == true) {
                $scope.abonoAuxiliar = $scope.abonoAuxiliar + row.entity.abono;
                $scope.cargoAuxiliar = $scope.cargoAuxiliar + row.entity.cargo;
            } else if (row.isSelected == false) {
                $scope.abonoAuxiliar = $scope.abonoAuxiliar - row.entity.abono;
                $scope.cargoAuxiliar = $scope.cargoAuxiliar - row.entity.cargo;
            }
            //console.log(msg, 'Estoy en rowSelectionChanged');
        }); //Este me dice cuales van siendo seleccionadas

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            //console.log(msg, 'Estoy en rowSelectionChangedBatch', rows);
            angular.forEach(rows, function(value, key) {
                $scope.punteoAuxiliar[key] = value.entity;
            });
        });
    };
    //****************************************************************************************************
    // INICIO la configuración del GRID BANCOS
    //**************************************************************************************************** 
    $scope.gridDepositosBancos.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApiBancos = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var msg = 'row selected ' + row.isSelected;
            if (row.isSelected == true) {
                $scope.abonoBanco = $scope.abonoBanco + row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco + row.entity.cargo;
            } else if (row.isSelected == false) {
                $scope.abonoBanco = $scope.abonoBanco - row.entity.abono;
                $scope.cargoBanco = $scope.cargoBanco - row.entity.cargo;
            }
            //console.log(msg, 'Estoy en rowSelectionChanged');

        }); //Este me dice cuales van siendo seleccionadas

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            //console.log(msg, 'Estoy en rowSelectionChangedBatch', rows);
            angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
        });
    };
    //****************************************************************************************************
    // INICIA guarda los grid elegidos de auxiliar y banco
    // Para poder realizar el punteo con exito debe cumplir con ciertos criterios
    // 1.- Debe haber seleccionado registros del deposito bancario y el auxiliar contable para relacionarlos entre si
    // 2.- Solo puede existir relaciones de 1 a muchos o 1 a 1 o muchos a 1
    // 3.- No puede seleccionar en un solo grid dos registros que tengan abono y cargo ya que todos los seleccionados deben ser 
    //     cargos o abonos
    // 4.- La seleccion de registro entre depósito bancario y auxiliar contable el total de la suma debe ser = +-1
    //****************************************************************************************************
    $scope.GuardarGrid = function() {
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        if ($scope.punteoAuxiliar.length > 0 && $scope.punteoBanco.length > 0) {
            if ($scope.punteoAuxiliar.length == 1) {
                if ($scope.cargoBanco != 0 && $scope.abonoBanco != 0) {
                    $scope.limpiaVariables();
                    alertFactory.warning('No se puede seleccionar abono y cargo al mismo tiempo');
                } else {
                    $scope.verificaCantidades(2);
                }
            } else if ($scope.punteoBanco.length == 1) {
                if ($scope.cargoAuxiliar != 0 && $scope.abonoAuxiliar != 0) {
                    $scope.limpiaVariables();
                    alertFactory.warning('No se puede seleccionar abono y cargo al mismo tiempo');
                } else {
                    $scope.verificaCantidades(1);
                }
            } else {
                $scope.limpiaVariables();
                alertFactory.warning('Punteo no valido')
            }
        } else {
            $scope.limpiaVariables();
            alertFactory.warning('No ha seleccionado ninguna relación');
        }

    };
    //****************************************************************************************************
    // INICIA funcion que verifica que la cantidad sea igual o mas menos 1 
    //****************************************************************************************************
    $scope.verificaCantidades = function(tipopunteo) {
        if ($scope.cargoBanco != 0 && $scope.abonoAuxiliar != 0) {
            if ((($scope.cargoBanco - 1) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoBanco + 1)) || (($scope.abonoAuxiliar - 1) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoAuxiliar + 1))) {
                $scope.guardaPunteo(tipopunteo);
            } else {
                $scope.limpiaVariables();
                alertFactory.error('La cantidad de cargo y abono no coinciden');
            }
        } else if ($scope.abonoBanco != 0 && $scope.cargoAuxiliar != 0) {
            if ((($scope.abonoBanco - 1) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoBanco + 1)) || (($scope.cargoAuxiliar - 1) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoAuxiliar + 1))) {
                $scope.guardaPunteo(tipopunteo);
            } else {
                $scope.limpiaVariables();
                alertFactory.error('La cantidad de cargo y abono no coinciden');
            }
        } else {
            $scope.limpiaVariables();
            alertFactory.warning('No puede relacionar abono con abono o cargo con cargo');
        }
    };
    //****************************************************************************************************
    // INICIA funcion para guardar el punteo
    //****************************************************************************************************
    $scope.guardaPunteo = function(tipopunteo) {
        angular.forEach($scope.punteoAuxiliar, function(value, key) {
            var valueAuxiliar = value.idAuxiliarContable;
            angular.forEach($scope.punteoBanco, function(value, key) {
                conciliacionDetalleRegistroRepository.insertPuntoDeposito(value.idDepositoBanco, valueAuxiliar, '', 2, tipopunteo).then(function(result) {
                    if (result.data[0].length) {
                        console.log('Respuesta Incorrecta');
                    } else {
                        console.log('Respuesta Correcta');
                        $scope.limpiaVariables();
                        $scope.getGridTablas();
                    }
                })
            });
        });
    };
    //****************************************************************************************************
    // INICIA funcion que limpia las variables de la suma del abono y cargo
    //****************************************************************************************************
    $scope.limpiaVariables = function() {
        $scope.abonoAuxiliar = 0;
        $scope.cargoAuxiliar = 0;
        $scope.abonoBanco = 0;
        $scope.cargoBanco = 0;
    };
    //****************************************************************************************************
    // INICIA funcion que consigue los valores para los grids y las tablas
    //****************************************************************************************************
    $scope.getGridTablas = function() {
        $scope.limpiaVariables();
        $scope.getDepositosBancos($scope.idBanco, 1, $scope.cuentaBanco);
        $scope.getAuxiliarContable($scope.idEmpresa, $scope.cuenta, 1);
        $scope.getAuxiliarPunteo($scope.idEmpresa, $scope.cuenta);
        $scope.getBancoPunteo($scope.idEmpresa, $scope.cuentaBanco);
    };
    //****************************************************************************************************
    // INICIA Obtengo los padres del Auxiliar contable punteado
    //****************************************************************************************************
    $scope.getAuxiliarPunteo = function(idempresa, cuenta) {

        conciliacionDetalleRegistroRepository.getAuxiliarPunteo(idempresa, cuenta).then(function(result) {
            //console.log(result.data, 'soy el auxilear punteado')
            $scope.auxiliarPadre = result.data;
            $scope.tabla('auxiliarPunteo');
        });
    };
    //****************************************************************************************************
    // INICIA Obtengo los padres del Banco punteado
    //****************************************************************************************************
    $scope.getBancoPunteo = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoPunteo(idempresa, cuentaBanco).then(function(result) {
            //console.log(result.data, 'soy el banco punteado')
            $scope.bancoPadre = result.data;
            $scope.tabla('bancoPunteo');
        });
    };
    //****************************************************************************************************
    // INICIA inicio la tabla para los distintos casos
    //****************************************************************************************************
    $scope.tabla = function(idtabla) {
        $('#' + idtabla).DataTable().destroy();

        setTimeout(function() {
            $('#' + idtabla).DataTable({
                destroy: true,
                "responsive": true,
                // "language": {
                //     "paginate": {
                //         "previous": '<i class="demo-psi-arrow-left"></i>',
                //         "next": '<i class="demo-psi-arrow-right"></i>'
                //     }
                // },
                searching: false,
                paging: false,
                autoFill: true
            });
        }, 1000);
    };
    $scope.eliminarTabla = function() {

    };
    //****************************************************************************************************
    // INICIA elimina los punteos ya realizados
    //****************************************************************************************************
    $scope.eliminarPunteo = function(punteo) {
        conciliacionDetalleRegistroRepository.eliminarPunteo(punteo.idPunteoAuxiliarBanco).then(function(result) {
            //console.log(result, 'Resultado cuando elimino');
            $scope.getGridTablas();
        });
    };
    //****************************************************************************************************
    // INICIA consigue los detalles de los punteos
    //****************************************************************************************************
    $scope.verDetallePunteo = function(detallepunteo, tipopunteo) {
        conciliacionDetalleRegistroRepository.detallePunteo(detallepunteo.idPunteoAuxiliarBanco).then(function(result) {
            $('#punteoDetalle').modal('show');
            if (tipopunteo == 1) {
                $scope.bancoDetalle = { detallepunteo };
                $scope.auxiliarDetalle = result.data;
                $scope.calculaTotal($scope.bancoDetalle, $scope.auxiliarDetalle);
            } else if (tipopunteo == 2) {
                $scope.bancoDetalle = result.data;
                $scope.auxiliarDetalle = { detallepunteo };
                $scope.calculaTotal($scope.bancoDetalle, $scope.auxiliarDetalle);
            } else {
                alertFactory.error('Ocurrio un problema');
            }
        });
    };
    //****************************************************************************************************
    // INICIA funcion para mostrar el total de cargos y abonos en la modal de Detalle punteo
    //****************************************************************************************************
    $scope.calculaTotal = function(bancodetalle, auxiliardetalle) {
        $scope.abonoTotalBanco = 0;
        $scope.cargoTotalBanco = 0;
        $scope.abonoTotalAuxiliar = 0;
        $scope.cargoTotalAuxiliar = 0;
        angular.forEach(bancodetalle, function(value, key) {
            $scope.abonoTotalBanco += value.abono;
            $scope.cargoTotalBanco += value.cargo;
        });
        angular.forEach(auxiliardetalle, function(value, key) {
            $scope.abonoTotalAuxiliar += value.abono;
            $scope.cargoTotalAuxiliar += value.cargo;
        });
    };
    //****************************************************************************************************
    // INICIA Se genera modal de alerta para que el usuario acepte o rechace generar el punteo definitivo
    //****************************************************************************************************
    $scope.generaAlertaPunteo = function() {
        if ($scope.bancoPadre.length > 0 || $scope.auxiliarPadre.length > 0) {
            $('#alertaPunteo').modal('show');
        } else {
            alertFactory.error('No existen punteos')
        }
    };
    //****************************************************************************************************
    // INICIA Se guarda el punteo que ya no podra ser modificado
    //****************************************************************************************************
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo($scope.idEmpresa, $scope.idBanco, $scope.cuenta, $scope.cuentaBanco).then(function(result) {
            console.log(result, 'Soy el resultado del punteo GIBI')
            console.log(result.data[0].idEstatus,'Soy la descripcion de GIBI')
            $('#alertaPunteo').modal('hide');
            if(result.data[0].idEstatus==1){
                alertFactory.success(result.data[0].Descripcion)
            }else if(result.data[0].idEstatus==0){
                alertFactory.error(result.data[0].Descripcion)
            }
            $scope.getGridTablas();
            //$scope.generaInfoReport(2);
        });
    };
    //****************************************************************************************************
    // INICIA Se genera el json para el reporte 
    //****************************************************************************************************
    $scope.generaInfoReport = function(accion) {
        variablesLocalStorage();
        conciliacionRepository.getAbonoContable($scope.busqueda.idEmpresa, 0, 0, 1, $scope.busqueda.idBanco, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable).then(function(result) {
            console.log(result, 'soy el Abono Contable');
            $scope.abonoContable = result.data;
            conciliacionRepository.getCargoContable($scope.busqueda.idEmpresa, 0, 0, 1, $scope.busqueda.idBanco, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable).then(function(result) {
                console.log(result, 'Soy el cargo contable');
                $scope.cargoContable = result.data;
                conciliacionRepository.getCargoBancario($scope.busqueda.idEmpresa, 0, 0, 1, $scope.busqueda.idBanco, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable).then(function(result) {
                    console.log(result, 'Soy el cargo bancario');
                    $scope.cargoBancario = result.data;
                    conciliacionRepository.getAbonoBancario($scope.busqueda.idEmpresa, 0, 0, 1, $scope.busqueda.idBanco, $scope.busqueda.cuenta, $scope.busqueda.cuentaContable).then(function(result) {
                        console.log(result, 'Soy el abono bancario');
                        $scope.abonoBancario = result.data;
                        conciliacionInicioRepository.getTotalAbonoCargo(null, '', '', '', 2).then(function(result) {
                            console.log(result.data, 'Soy el total de todo esto');
                            var date = new Date();
                            $scope.fecha = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                            console.log($scope.fecha, 'Soy la fecha');
                            $scope.totalReporte = result.data;
                            $scope.infReporte = {
                                "titulo": "CONCILIACIÓN BANCARIA",
                                "titulo2": "BANCOS",
                                "titulo3": "FA04",
                                "empresa": $scope.nombreEmpresa,
                                "fechaElaboracion": $scope.fecha,
                                "conciliacionBancaria": "BANCOMER",
                                "chequera": $scope.fecha,
                                "bancoCuenta": $scope.cuentaBanco,
                                "clabe": $scope.clabe,
                                "cuentaContable": $scope.cuenta,
                                "estadoCuenta": "407480.53",
                                "aCB": $scope.totalReporte.tAbonoBancario,
                                "aBC": $scope.totalReporte.tAbonoContable,
                                "cBC": $scope.totalReporte.tCargoContable,
                                "cCB": $scope.totalReporte.tCargoBancario,
                                "saldoConciliacion": "435965.15",
                                "saldoContabilidad": "435965.15",
                                "diferencia": "0.00",
                                "menosBanco": $scope.abonoBancario,
                                "masContabilidad": $scope.cargoContable,
                                "menosContabilidad": $scope.abonoContable,
                                "masBanco": $scope.cargoBancario,
                                "firmas": [{
                                    "titulo": "ELABORÓ",
                                    "nombre": $rootScope.userData.nombreUsuario,
                                    "fecha": ""
                                }, {
                                    "titulo": "GERENTE ADMINISTRATIVO",
                                    "nombre": $scope.nombreGerente,
                                    "fecha": ""
                                }, {
                                    "titulo": "CONTADOR",
                                    "nombre": $scope.nombreContador,
                                    "fecha": ""
                                }]
                            }
                            $scope.jsonData = {
                                "template": {
                                    "name": "tesoreria_rpt"
                                },
                                "data": $scope.infReporte
                            }
                            console.log($scope.infReporte, 'Es el información del reporte')
                            if (accion == 1) { //mostrar el reporte
                                $scope.generarReporte();
                            } else if (accion == 2) { //enviar el reporte por mail
                                $scope.envioMail();
                            } else {
                                alertFactory.error('Accion no definida');
                            }
                        });
                    })
                });
            });
        })
    };
});
