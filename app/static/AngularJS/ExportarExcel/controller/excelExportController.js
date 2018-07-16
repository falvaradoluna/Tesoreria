registrationModule.controller('excelExportController', function ($scope, alertFactory, $rootScope, localStorageService, excelExportRepository, $window, filtrosRepository, $filter) {

    //Declaración de Variables locales
    $scope.selectedFile = null;
    $scope.enableButton = false;
    $scope.bancoActual = '';
    $scope.idBanco = 0;
    $scope.showComboEmpresas = false;
    $rootScope.userData = localStorageService.get('userData');

    //Variables para generar código automático
    $scope.passwordLength = 12;
    $scope.addUpper = true;
    $scope.addNumbers = true;
    $scope.addSymbols = true;
    $scope.password = '';
    $scope.bandera = 0;

    $scope.init = function () {
        $scope.busqueda = JSON.parse(localStorage.getItem('paramBusqueda'));
        $scope.enableButton = false;
        
        setTimeout(function () {
            $(".cargando").remove();
        }, 1500);
    };

    $scope.leerExcel = function (files) {
        $scope.$apply(function () {
            $scope.Message = "";
            $scope.selectedFile = files[0];
            //Valido la extención del archivo 
            var ext = $scope.selectedFile.name.substr($scope.selectedFile.name.lastIndexOf('.') + 1);
            if (ext != "xlsx") {
                swal('Alto', 'El archivo seleccionado es incorrecto, por favor verifique su selección.', 'warning');
                return;
            }

        });
    };

    $scope.count = 0;
    $scope.grupoIns = 0;
    $scope.errores = [];
    $scope.countInsert = 0;
    $scope.totalIns = 0;

    $scope.newParseExcelDataAndSave = function () {
        $('#loading').modal('show');
        var file = $scope.selectedFile;
        if (file != null) {
            $scope.enableButton = true;
            var reader = new FileReader();
            reader.onload = function (e) {//Inicio de la funcion antes de leer el archivo
                $scope.bandera = 0;
                var data = e.target.result;
                //XLSX from js-xlsx library , which I will add in page view page
                var workbook = XLSX.read(data, { type: 'binary' });
                var excelObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
                //console.log( 'ObjectExcle', excelObject );
                $scope.totalIns = excelObject.length;
                $scope.nombreExcel = file.name;
                if ($scope.count == excelObject.length) {
                    if ($scope.countInsert == excelObject.length) {
                        setTimeout(function () {
                            $('#loading').modal('hide');
                            swal('LISTO', 'Se cargo con éxito', 'success');
                        }, 1500);
                    } else {
                        excelExportRepository.deleteDataLayout( $scope.grupoIns )
                            .then(function (result) {
                                console.log( 'resultdata', result.data );
                                if (result.data[0].success == 1) {
                                    $('#errorTable').DataTable().destroy();
                                    setTimeout(function () {
                                        $('#errorTable').DataTable({
                                            destroy: true,
                                            "responsive": true,
                                            searching: false,
                                            paging: true,
                                            autoFill: true
                                        });
                                    }, 1000);
                                    $('#loading').modal('hide');
                                    $("#errorInsert").modal("show");
                                } 
                            }, function (error) {
                                swal('ALTO', error, 'warning');
                                $('#loading').modal('hide');
                            });
                        }
                    $scope.count = 0;
                    $scope.grupoIns = 0;
                    $scope.countInsert = 0;
                } else {
                    excelExportRepository.sendExcelDataLayout(
                        excelObject[$scope.count].NoCuenta,
                        excelObject[$scope.count].Fecha,
                        excelObject[$scope.count].Descripcion,
                        excelObject[$scope.count].Referencia,
                        excelObject[$scope.count].DescripcionAmpliada,
                        excelObject[$scope.count].TipoMovimiento,
                        excelObject[$scope.count].Cargo === undefined ? 0 : excelObject[$scope.count].Cargo,
                        excelObject[$scope.count].Abono === undefined ? 0 : excelObject[$scope.count].Abono,
                        $scope.grupoIns
                    )
                        .then(function (result) {
                            //console.log( 'resultCorrecto', result );
                            if (result.data[0].success == 1) {
                                $scope.grupoIns = result.data[0].grupo;
                                $scope.countInsert = $scope.countInsert + 1;
                            } else {
                                excelObject[$scope.count]['error'] = result.data[0].msg;
                                $scope.errores.push(excelObject[$scope.count])
                            }
                            $scope.count = $scope.count + 1;
                            $scope.newParseExcelDataAndSave();
                        }, function (error) {
                            console.log( 'error', error );
                            swal('ALTO', error, 'warning');
                            $('#loading').modal('hide');
                        });
                };
            }//Fin de la función antes de leer el archivo
            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        } else {
            swal('ALTO', 'No has seleccionado un archivo!', 'warning');
            $('#loading').modal('hide');
        };
    };

    $scope.reload = function () {
        $window.location.reload();
    };

});