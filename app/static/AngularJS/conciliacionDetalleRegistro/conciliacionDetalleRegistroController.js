registrationModule.controller('conciliacionDetalleRegistroController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter) {

    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $scope.nodoPadre = [];
    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.auxiliarPadre = '';
    $scope.bancoPadre = '';
    $scope.detallePunteo = '';
    $scope.detallePunteoBanco = '';
    i18nService.setCurrentLang('es'); //Para seleccionar el idioma  
    $scope.infReporte = '';
    $scope.jsonData = '';
    $scope.ruta = '';
    $scope.clabe = '';
    $scope.datosPunteo = '';
    $scope.accionElimina = 0;
    $scope.bancoDPI = '';
    $scope.auxiliarDPI = '';
    $scope.difMonetaria = 0;
    $scope.bancoReferenciados = '';
    $scope.contableReferenciados= '';
 
    //**************Variables para paginación**********************************
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.pages = [];
    //*************************************************************************

    //****************************************************************************************************
    // INICIA las variables para el GRID AUXILIAR CONTABLE
    //****************************************************************************************************
    $scope.gridAuxiliarContable = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true
    };
    $scope.gridAuxiliarContable.columnDefs = [
        { name: 'cargo', displayName: 'Cargo', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abono', width: 100, type: 'number', cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' },
        { name: 'movFechaOpe', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},//, cellFilter: 'date:\'dd-MM-yyyy\''
        { name: 'polTipo', displayName: 'Referencia', width: 200 },
        { name: 'movConcepto', displayName: 'Concepto', width: 600 }
    ];
    $scope.gridAuxiliarContable.multiSelect = true;
    //****************************************************************************************************
    // INICIA las variables para el GRID BANCOS
    //****************************************************************************************************
    $scope.gridDepositosBancos = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: false,
        selectionRowHeaderWidth: 35,
        rowHeight: 35,
        showGridFooter: true,
        enableFiltering: true
    };
    $scope.gridDepositosBancos.columnDefs = [
        { name: 'concepto', displayName: 'Concepto', width: 300 },
        { name: 'fechaOperacion', displayName: 'Fecha', width: 100, cellFilter: 'date:\'yyyy-MM-dd\''},
        { name: 'referencia', displayName: 'Referencia', width: 200 },
        { name: 'cargo', displayName: 'Cargos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.cargo > 0">{{row.entity.cargo | currency}}</span></div><div class="text-right"><span ng-if="row.entity.cargo == 0">{{row.entity.cargo | currency}}</span></div>' },
        { name: 'abono', displayName: 'Abonos', type: 'number', width: 100, cellTemplate: '<div class="text-right text-success text-semibold"><span ng-if="row.entity.abono > 0">{{row.entity.abono | currency}}</span></div><div class="text-right"><span ng-if="row.entity.abono == 0">{{row.entity.abono | currency}}</span></div>' }
    ];
    $scope.gridDepositosBancos.multiSelect = true;
    //****************************************************************************************************
    // INICIA 
    //****************************************************************************************************
    $scope.init = function() {
        variablesLocalStorage();
        $scope.getDepositosBancos($scope.idBanco, 1, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getAuxiliarContable($scope.idEmpresa, $scope.cuenta, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getAuxiliarPunteo($scope.idEmpresa, $scope.cuenta);
        $scope.getBancoPunteo($scope.idEmpresa, $scope.cuentaBanco);
        $scope.getBancoDPI($scope.idEmpresa, $scope.cuentaBanco);
        $scope.bancoReferenciados();
        $scope.contablesReferenciados();
        $rootScope.mostrarMenu = 1;
        console.log($scope.busqueda);
    };
    var variablesLocalStorage = function() {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.idEmpresa = $scope.busqueda.IdEmpresa;
        $scope.difMonetaria = $scope.busqueda.DiferenciaMonetaria;
        $scope.cuenta = $scope.busqueda.CuentaContable;
        $scope.idBanco = $scope.busqueda.IdBanco;
        $scope.nombreEmpresa = $scope.busqueda.Empresa;
        $scope.cuentaBanco = $scope.busqueda.Cuenta;
        $scope.nombreBanco = $scope.busqueda.Banco;
        $scope.nombreGerente = $scope.busqueda.gerente;
        $scope.nombreContador = $scope.busqueda.contador;
    };
    $scope.getAuxiliarContable = function(idEmpresa, numero_cuenta, idestatus, fElaboracion, fCorte) {
        if (idestatus == 1) { //Consigo los datos del Auxiliar Contable sin puntear
            filtrosRepository.getAuxiliar(idEmpresa, numero_cuenta, idestatus, fElaboracion, fCorte).then(function(result) {
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
    $scope.getDepositosBancos = function(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte) {
        if (idestatus == 1) { //Consigo los datos del Banco sin Puntear
            filtrosRepository.getDepositos(idBanco, idestatus, cuentaBancaria, fElaboracion, fCorte).then(function(result) {
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
        }); 

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
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

        }); //Este me dice cuales van siendo seleccionadas

        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
            var msg = 'rows changed ' + rows.length;
            //console.log(msg, 'Estoy en rowSelectionChangedBatch', rows);
            angular.forEach(rows, function(value, key) {
                $scope.punteoBanco[key] = value.entity;
            });
        });
    };

    $scope.GuardarGrid = function() {
        $scope.punteoAuxiliar = [];
        $scope.punteoBanco = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        if ($scope.punteoAuxiliar.length > 0 && $scope.punteoBanco.length > 0) {
          
            if ($scope.punteoAuxiliar.length >= 1 && $scope.punteoBanco.length >= 1) {
                if ($scope.cargoBanco != 0 && $scope.abonoBanco != 0) {
                    $scope.limpiaVariables();
                    alertFactory.warning('No se puede seleccionar abono y cargo al mismo tiempo');
                } else {
                    $scope.verificaCantidades(2);
                }
            } 

        } else {
            $scope.limpiaVariables();
            alertFactory.warning('No ha seleccionado ninguna relación');
        }

    };
    //****************************************************************************************************


    // INICIA funcion que verifica que la cantidad sea igual o mas menos $scope.difMonetaria, parametrizado según la empresa en curso 
    //****************************************************************************************************
    $scope.verificaCantidades = function(tipopunteo) {
        if ($scope.cargoBanco != 0 && $scope.abonoAuxiliar != 0) {
            if ((($scope.cargoBanco - $scope.difMonetaria) <= $scope.abonoAuxiliar && $scope.abonoAuxiliar <= ($scope.cargoBanco + $scope.difMonetaria)) || (($scope.abonoAuxiliar - $scope.difMonetaria) <= $scope.cargoBanco && $scope.cargoBanco <= ($scope.abonoAuxiliar + $scope.difMonetaria))) {
                $scope.guardaPunteo(tipopunteo);
            } else {
                $scope.limpiaVariables();
                alertFactory.error('La cantidad de cargo y abono no coinciden');
            }
        } else if ($scope.abonoBanco != 0 && $scope.cargoAuxiliar != 0) {
            if ((($scope.abonoBanco - $scope.difMonetaria) <= $scope.cargoAuxiliar && $scope.cargoAuxiliar <= ($scope.abonoBanco + $scope.difMonetaria)) || (($scope.cargoAuxiliar - $scope.difMonetaria) <= $scope.abonoBanco && $scope.abonoBanco <= ($scope.cargoAuxiliar + $scope.difMonetaria))) {
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
            var conceptoPago = value.movConcepto;
            angular.forEach($scope.punteoBanco, function(value, key) {
                conciliacionDetalleRegistroRepository.insertPuntoDeposito(value.idBmer, valueAuxiliar, conceptoPago, 2, tipopunteo).then(function(result) {
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


    // INICIA funcion para guardar el punteo
    //****************************************************************************************************
    $scope.guardaDPIs = function( ) {
        
        $scope.punteoBanco = [];
        $scope.punteoAuxiliar = [];
        $scope.gridApiBancos.selection.clearSelectedRows();
        $scope.gridApiAuxiliar.selection.clearSelectedRows();
        var idUsuario = $rootScope.userData.idUsuario;

        if($scope.punteoAuxiliar.length > 0){
            $scope.limpiaVariables();
            $scope.getGridTablas();
         alertFactory.warning('Acción incorrecta, no es posible enviar a DPI los Abonos Contables seleccionados');
        }

        if($scope.punteoBanco.length > 0){
         if($scope.cargoBanco == 0)
            {
                angular.forEach($scope.punteoBanco, function(value, key) {
                conciliacionDetalleRegistroRepository.insertDepositosDPI(value.idBmer, value.idBanco,idUsuario).then(function(result) {
                    if (result.data[0].ESTATUS == 2) {
                        console.log('Respuesta Correcta');
                        $scope.limpiaVariables();
                        $scope.getGridTablas();
                    } else {
                        console.log('Respuesta Incorrecta');
                    }
                })
            });
                alertFactory.success('Los registros seleccionados se han modificado correctamente!');
            }
                else{
                        $scope.limpiaVariables();
                        $scope.getGridTablas();
                        alertFactory.warning('No es posible enviar cargos bancarios a DPI, por favor verifique su selección'); 
                    }
    }      
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
        $scope.getDepositosBancos($scope.idBanco, 1, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getAuxiliarContable($scope.idEmpresa, $scope.cuenta, 1, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte);
        $scope.getAuxiliarPunteo($scope.idEmpresa, $scope.cuenta);
        $scope.getBancoPunteo($scope.idEmpresa, $scope.cuentaBanco);
        $scope.getBancoDPI($scope.idEmpresa, $scope.cuentaBanco);
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

     // INICIA Obtengo los padres del Banco no identificado
    //****************************************************************************************************
    $scope.getBancoDPI = function(idempresa, cuentaBanco) {

        conciliacionDetalleRegistroRepository.getBancoDPI(idempresa, cuentaBanco).then(function(result) {
            //console.log(result.data, 'soy el banco punteado')
            $scope.bancoDPI = result.data;
            $scope.tabla('bancodpi');
        });
    };
    //****************************************************************************************************

    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.bancoReferenciados = function() {
        conciliacionDetalleRegistroRepository.getBancosRef($scope.idBanco, $scope.cuentaBanco, $scope.busqueda.fechaElaboracion, $scope.busqueda.fechaCorte).then(function(result) {
        $scope.bancoReferenciados = result.data;
        $scope.tabla('bancoReferenciado');
      });
    };
    //****************************************************************************************************
    
    //Función que obtiene los registros Bancarios Referenciados
    //****************************************************************************************************
     $scope.contablesReferenciados = function() {
        conciliacionDetalleRegistroRepository.getContablesRef($scope.busqueda.CuentaContable, $scope.busqueda.fechaCorte, $scope.busqueda.IdEmpresa).then(function(result) {
        $scope.contableReferenciados = result.data;
        $scope.tabla('contableRef');
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
                searching: false,
                paging: true,
                autoFill: true
            });
        }, 1000);
    };
    $scope.eliminarTabla = function() {

    };
    //****************************************************************************************************
    // INICIA elimina los punteos ya realizados
    //****************************************************************************************************
    $scope.eliminarPunteo = function(punteo, opcion) {
        var datoBusqueda = '';
        if(opcion == 1){
           datoBusqueda = punteo.idDepositoBanco;
        }else{
           datoBusqueda = punteo.idAuxiliarContable;
        }
        conciliacionDetalleRegistroRepository.eliminarPunteo(datoBusqueda,opcion).then(function(result) {
            console.log(result, 'Resultado cuando elimino');
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionPunteo').modal('hide');
            $scope.getGridTablas();
        });
    };
    //****************************************************************************************************
    // INICIA consigue los detalles de los punteos
    //****************************************************************************************************
    $scope.verDetallePunteo = function(detallepunteo,opcion) {
        var accionBusqueda = 0;
        var datoBusqueda = '';
        if(opcion == 1){
            datoBusqueda = detallepunteo.idDepositoBanco;
            accionBusqueda = 1;
        } else { 
           datoBusqueda = detallepunteo.idAuxiliarContable;
           accionBusqueda = 2;
        }
        conciliacionDetalleRegistroRepository.detallePunteo(datoBusqueda, accionBusqueda).then(function(result) {
            $('#punteoDetalle').modal('show');

                $scope.detallePunteo = result.data[0];
                $scope.detallePunteoBanco = result.data[1]; 
                if(result.data.length > 0){
                $scope.calculaTotal($scope.detallePunteo, $scope.detallePunteoBanco);
                datoBusqueda = '';
            }
            else{
                alertFactory.error('No existen punteos en este detalle')
            }
            
        });
    };
    //****************************************************************************************************
    // INICIA funcion para mostrar el total de cargos y abonos en la modal de Detalle punteo
    //****************************************************************************************************
    $scope.calculaTotal = function(detallePunteo, detallePunteoBanco) {
        $scope.abonoTotalBanco = 0;
        $scope.cargoTotalBanco = 0;
        $scope.abonoTotalAuxiliar = 0;
        $scope.cargoTotalAuxiliar = 0;
        
        angular.forEach(detallePunteo, function(value, key) {

            $scope.abonoTotalAuxiliar += value.abono;
            $scope.cargoTotalAuxiliar += value.cargo;
            
       
        });
        angular.forEach(detallePunteoBanco, function(value, key) {
            
            $scope.abonoTotalBanco += value.abonoBanco;
            $scope.cargoTotalBanco += value.cargoBanco;
       
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

     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de punteos relacionados

    $scope.alertaEliminaPunteos = function (datosPunteo,accionElimina){
        $scope.datosPunteo = datosPunteo;
        $scope.accionElimina = accionElimina;
     $('#alertaEliminacionPunteo').modal('show');
    };

    $scope.cancelaEliminacionPunteo = function(){
        $scope.datosPunteo = '';
        $scope.accionElimina = '';
      $('#alertaEliminacionPunteo').modal('hide');
    };
    //****************************************************************************************************

    
     ////////Muestra mensaje de alerta para aceptar o rechazar la eliminación de registros no identificados

    $scope.alertaEliminaDPI = function (datosPunteo,accionElimina){
        $scope.datosPunteo = datosPunteo;
        $scope.accionElimina = accionElimina;
     $('#alertaEliminacionDPI').modal('show');
    };

    $scope.cancelaEliminacionDPI = function(){
        $scope.datosPunteo = '';
        $scope.accionElimina = '';
      $('#alertaEliminacionDPI').modal('hide');
    };
    //****************************************************************************************************

     $scope.EliminaDPI = function(){

       conciliacionDetalleRegistroRepository.insertDepositosDPI(2,$scope.datosPunteo.idDepositoBanco, 0,$scope.datosPunteo.noCuenta).then(function(result) {
                    if (result.data[0].length) {
                        console.log('Respuesta Incorrecta');
                    } else {
                        console.log('Respuesta Correcta');
                        $scope.limpiaVariables();
                        $scope.getGridTablas();
                    }
                });
            $scope.datosPunteo = '';
            $scope.accionElimina = '';
            $('#alertaEliminacionDPI').modal('hide');
            $scope.getGridTablas();
     };

    // INICIA Se guarda el punteo que ya no podra ser modificado
    //****************************************************************************************************
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo($scope.idEmpresa, $scope.idBanco, $scope.cuenta, $scope.cuentaBanco).then(function(result) {
            console.log(result.data[0].idEstatus)
            $('#alertaPunteo').modal('hide');
            if(result.data[0].idEstatus==1){
                alertFactory.success(result.data[0].Descripcion)
            }else if(result.data[0].idEstatus==0){
                alertFactory.error(result.data[0].Descripcion)
            }
            $scope.getGridTablas();
        });
    };    

});
