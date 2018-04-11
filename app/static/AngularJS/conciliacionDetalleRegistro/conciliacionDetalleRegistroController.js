registrationModule.controller('conciliacionDetalleRegistroController', function($scope, $rootScope, $location, $timeout, $log, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository, alertFactory, uiGridConstants, i18nService, uiGridGroupingConstants, conciliacionRepository, conciliacionInicioRepository,$filter) {
   
    // ****************** Se guarda la información del usuario en variable userData
    $rootScope.userData = localStorageService.get('userData');
    $rootScope.showBotones = localStorageService.get('ShowBtns')[0];
    $scope.nodoPadre = [];
    $scope.abonoAuxiliar = 0;
    $scope.cargoAuxiliar = 0;
    $scope.abonoBanco = 0;
    $scope.cargoBanco = 0;
    $scope.auxiliarPadre = '';
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
    $scope.mesActivo = false;
     
    //**************Variables para paginación**********************************
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.pages = [];
    //*************************************************************************
    // INICIA 
    //****************************************************************************************************
    $scope.init = function() {
        variablesLocalStorage();
        $scope.showBtns();
        $rootScope.mostrarMenu = 1;
        $scope.DameLaFechaHora();
        setTimeout( function(){
                $(".cargando").remove();
                }, 1500 );
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
        if($scope.busqueda.MesActivo != 1)
        {
          $scope.mesActivo = false;
          alertFactory.error("El mes consultado se encuentra inactivo para conciliar registros, solo podrá consultar información!!!");
        }
        else{
            $scope.mesActivo = true;
        }

    };

    // INICIA consigue los detalles de los punteos
    //****************************************************************************************************
    $scope.verDetallePunteo = function(detallepunteo,opcion) {

        var accionBusqueda = 0;
        var datoBusqueda = '';
        if(opcion == 1){

              if(detallepunteo.idPAdre == 4){
                datoBusqueda = detallepunteo.idDepositoBanco;
                accionBusqueda = 4;
              }
              else if(detallepunteo.idPAdre == 2){

            datoBusqueda = detallepunteo.idDepositoBanco;
            accionBusqueda = 1;
        }
        
        } else {
            if(detallepunteo.idPAdre == 3){
                datoBusqueda = detallepunteo.idAuxiliarContable;
                accionBusqueda = 3;
                }else if(detallepunteo.idPAdre == 2){
                datoBusqueda = detallepunteo.idAuxiliarContable;
                accionBusqueda = 2;
               }

        }
        conciliacionDetalleRegistroRepository.detallePunteo(datoBusqueda, $scope.idBanco, $scope.cuentaBanco, $scope.cuenta, accionBusqueda).then(function(result) {
            $('#punteoDetalle').modal('show');

                $scope.detallePunteo = result.data[0];
                $scope.detallePunteoBanco = result.data[1]; 
                if(result.data.length > 0){
                $scope.calculaTotal($scope.detallePunteo, $scope.detallePunteoBanco);
                datoBusqueda = '';
            }
            else {
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

    //****************************************************************************************************
    // INICIA funcion para mostrar el total de cargos y abonos en la modal de Detalle punteo
    //****************************************************************************************************
    $scope.showBtns = function() {
        
    };
    //****************************************************************************************************

    //Inicia la función que me retorna la fecha y hora actual
    //****************************************************************************************************
     $scope.DameLaFechaHora = function() {
/////////////////////////////////////////////////////////////////////////////Obtiene la fecha actual   
var hora = new Date() 
var hrs = hora.getHours(); 
var min = hora.getMinutes(); 
var hoy = new Date(); 
var m = new Array(); 
var d = new Array() 
var an= hoy.getFullYear(); 
m[0]="Enero"; m[1]="Febrero"; m[2]="Marzo"; 
m[3]="Abril"; m[4]="Mayo"; m[5]="Junio"; 
m[6]="Julio"; m[7]="Agosto"; m[8]="Septiembre"; 
m[9]="Octubre"; m[10]="Noviembre"; m[11]="Diciembre";

$scope.FechahoraActual = hoy.getDate() +" "+m[hoy.getMonth()]+ " " + "del" + " " + an;
/////////////////////////////////////////////////////////////////////////////////////////////

        if (!document.layers&&!document.all&&!document.getElementById)

        return

         var Digital=new Date()
         var hours=Digital.getHours()
         var minutes=Digital.getMinutes()
         var seconds=Digital.getSeconds()

        var dn="PM"
        if (hours<12)
        dn="AM"
        if (hours>12)
        hours=hours-12
        if (hours==0)
        hours=12

         if (minutes<=9)
         minutes="0"+minutes
         if (seconds<=9)
         seconds="0"+seconds
        
        myclock= hours+":"+minutes+":"+seconds+" "+dn ;
        if (document.layers){
        document.layers.liveclock.document.write(myclock)
        document.layers.liveclock.document.close()
        }
        else if (document.getElementById)
        document.getElementById("liveclock").innerHTML=myclock
        setTimeout($scope.DameLaFechaHora,1000);
} 


    //****************************************************************************************************

});
