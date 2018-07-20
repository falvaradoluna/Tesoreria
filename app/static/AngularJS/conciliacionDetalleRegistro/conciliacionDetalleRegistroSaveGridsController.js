registrationModule.controller('conciliacionDetalleRegistroSaveGridsController',function($window ,$scope, $rootScope, localStorageService, filtrosRepository, conciliacionDetalleRegistroRepository){
    
      $scope.tipoPunteo = 0;

     $scope.init = function(){
        //Obtengo la información almacenada, se genera en conciliacionRegistroGridsController
        //Se obtienen los datos de los abonos contables y cargos bancarios de un solo grid
        $scope.punteoAuxiliar = JSON.parse(localStorage.getItem('infoGridAuxiliar'));
        $scope.punteoBanco = JSON.parse(localStorage.getItem('infoGridBanco'));
        //Se obtienen los datos de abonos bancarios contra cargos bancarios y viseversa
        $scope.abonoCargoAuxiliar = JSON.parse(localStorage.getItem('infoGridAbonoCargoAuxiliar'));
        $scope.abonoCargoBanco = JSON.parse(localStorage.getItem('infoGridAbonoCargoBanco'));
        $scope.infoGridagrupadosBancosContables = JSON.parse(localStorage.getItem('infoGridagrupadosBancosContables'));
        //Se obtienen los datos de DPI
        $scope.DPIdata = JSON.parse(localStorage.getItem('infoDPIData'));


        $scope.bancoPadre = JSON.parse(localStorage.getItem('bancoPadre'));
        $scope.auxiliarPadre = JSON.parse(localStorage.getItem('auxiliarPadre'));
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        
     };

    // Ing. Luis Antonio Garcia Perruquia 
    $scope.generaPunteo = function() {
        conciliacionDetalleRegistroRepository.generaPunteo()
        .then(function(result) {
            $('#alertaPunteo').modal('hide');
            if(result.data[0].success == 1){
                swal(
                    'Listo',
                    result.data[0].msg,
                    'success'
                );
            }else{
                swal(
                    'Alto',
                    result.data[0].msg,
                    'error'
                );
            }
            $scope.refreshGrids();
        });
    };
     // Fin de la funsion que guarda el punteo que ya no podra ser modificado
    //**************************************************************************************************** 
   
    $scope.guardaPunteoPrevio = function(){
        ///Tipo de punteo 1 = (Abonos o cargos Bancarios) - (Abonos o cargos Contables)
        ///Tipo de punteo 2 = Punteos Bancarios (conciliación entre los mismos tipos de datos)
        ///Tipo de punteo 3 = Punteo Contable (conciliación entre los mismos tipos de datos)
        console.log( 'funcionGuarda punteo' );
        $('#alertaGuardarPunteoPrevio').modal('hide');
        //Mando a llamar la función que obtendra la nueva información almacenada
        $scope.init();
        $('#loading').modal('show');
        setTimeout(function () {

            //If que inserta el grupo de registros de Contabilidad cargos- abonos
            console.log( 'abonoCargoAuxiliar', $scope.abonoCargoAuxiliar );
            if ($scope.abonoCargoAuxiliar.length > 0) { // Entra a guardar los registros conciliados de Contabilidad cargos - abonos
                console.log( 'PrimeraDiscriminante' );
                angular.forEach($scope.abonoCargoAuxiliar, function( value, key ){
                    console.log( 'value', value );
                });
            }
            //If que inserta el grupo de registros de Bancos cargos- abonos
            if ($scope.abonoCargoBanco.length > 0) {
                console.log( 'SegundaDiscriminante' );
                angular.forEach( $scope.abonoCargoBanco, function( value, key ){
                    console.log( 'value', value );
                });
            }
            //If que inserta el grupo de registros Bancos-Contable--Cargos-Abonos
            if ($scope.punteoBanco.length >= 1 && $scope.punteoAuxiliar.length >= 1) {
                console.log( 'TerceraDiscriminante' );
                var arrayCargoAbono = [];
                var contador = 0;
                var objeto = {};
                angular.forEach( $scope.infoGridagrupadosBancosContables, function( value, key ){
                    angular.forEach(value, function( valueChild, keyChild ){
                        // console.log( 'key', keyChild );
                        console.log( 'value', valueChild );
                        // console.log( 'valueCOlor', valueChild.color );
                        // arrayCargoAbono.push( valueChild.color );
                        // objeto = { color: valueChild.color };
                    });
                });
                console.log( 'array', arrayCargoAbono );
                console.log( 'objeto', objeto );
            }

        }, 3000);

        setTimeout(function () {
            $scope.refreshGrids();
            $('#loading').modal('hide');
            swal(
                'Listo',
                'Registros guardados correctamente',
                'success'
            );
        }, 10000);
    };

    //****************************************************************************************************

     // INICIA funcion para guardar los registros DPI
    //****************************************************************************************************
    $scope.guardaDPIs = function () {

        $('#alertaGuardarDPI').modal('hide');
        //Mando a llamar la función que obtendrá los nuevos datos almacenados en localstorage
        $scope.init();

        var idUsuario = $rootScope.userData.idUsuario;
        var contRegBancos = 0;
        var contRegAuxiliar = 0;

        if ($scope.punteoAuxiliar != null) {
            swal(
                'Alto',
                'Acción incorrecta, no es posible enviar a DPI los Abonos o Cargos Contables seleccionados',
                'error'
            );
        } else {
            if ($scope.DPIdata.length > 0) {

                angular.forEach($scope.DPIdata, function (value, key) {
                    if (value.cargo == 0) {
                        conciliacionDetalleRegistroRepository.insertDepositosDPI(value.idBmer, value.idBanco, $scope.busqueda.IdEmpresa, idUsuario).then(function (result) {
                            console.log( result );
                            if( result.data[0].success == 1 ){
                                swal(
                                    'Listo',
                                    'Los registros seleccionados se han modificado correctamente',
                                    'success'
                                );
                                setTimeout(function(){
                                    $scope.refreshGrids();
                                },2000); 
                                
                            }else{
                                swal(
                                    'Alto',
                                    result.data[0].msg,
                                    'warning'
                                );
                            }
                        })
                        contRegBancos += 1;
                    } else {
                        contRegAuxiliar += 1;
                    }
                });
                // if (contRegBancos > 0) {
                //     $scope.refreshGrids();
                //     swal(
                //         'Listo',
                //         'Los registros seleccionados se han modificado correctamente',
                //         'success'
                //     );
                // }
                // if (contRegAuxiliar > 0) {
                //     swal(
                //         'Listo',
                //         'No es posible enviar cargos bancarios a DPI, por favor verifique su selección',
                //         'success'
                //     );
                // }

            }
        }
    };
    //****************************************************************************************************

    $scope.refreshGrids = function(){
      $window.location.reload();
    };
    

    // INICIA Se genera modal de alerta para que el usuario acepte o rechace generar el punteo definitivo
    //****************************************************************************************************
    $scope.generaAlertaPunteo = function() {
      $scope.init(); //Se inicialisa la funsión para obtener la información de localStorage
        if ($scope.bancoPadre.length > 0 || $scope.auxiliarPadre.length > 0) {
            $('#alertaPunteo').modal('show');
        } else {
            swal(
                'Alto',
                'No existen punteos',
                'error'
            );
        }
    };
    //****************************************************************************************************
    $scope.comeBack = function(){
        console.log( 'comeBack' );
        localStorage.setItem('comeBack', true)
        $window.location.href = "/conciliacionInicio";
    }
    

});