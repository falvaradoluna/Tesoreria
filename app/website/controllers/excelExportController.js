var excelExportView = require('../views/reference'),
    excelExportModel = require('../models/dataAccess');


var excelExport = function (conf) {
    this.conf = conf || {};

    this.view = new excelExportView();
    this.model = new excelExportModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

excelExport.prototype.get_insExcelScotiabank = function(req,res,next){
	var self = this;
 
	var params = [
                 {name: "idBanco", value: req.query.idBanco, type: self.model.types.INT},
                 {name: "noCuenta", value: req.query.NoCuenta, type: self.model.types.STRING},
		         {name: "fecha", value: req.query.Fecha, type: self.model.types.STRING},
                 {name: "ref_numerica", value: req.query.Referencia_Numerica, type: self.model.types.STRING},
		         {name: "cargo", value: req.query.Cargo, type: self.model.types.DECIMAL},
		         {name: "abono", value: req.query.Abono, type: self.model.types.DECIMAL},
		         {name: "tipo", value: req.query.Tipo, type: self.model.types.STRING},
		         {name: "transaccion", value: req.query.Transaccion, type: self.model.types.STRING},
		         {name: "leyenda1", value: req.query.Leyenda1, type: self.model.types.STRING},
                 {name: "leyenda2", value: req.query.Leyenda2, type: self.model.types.STRING},
                 {name: "clveLayout", value: req.query.claveLayout, type: self.model.types.STRING}
	             ];


    this.model.query('INS_EXCEL_DATA_SCOTIABANK', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

excelExport.prototype.get_insExcelLayout = function(req,res,next){
	var self = this;
 
    var params = [
        { name: "noCuenta", value: req.query.noCuenta, type: self.model.types.STRING },
        { name: "fecha", value: req.query.fecha, type: self.model.types.STRING },
        { name: "descripcion", value: req.query.descripcion, type: self.model.types.STRING },
        { name: "referencia", value: req.query.referencia, type: self.model.types.STRING },
        { name: "desAmpliada", value: req.query.desAmpliada, type: self.model.types.STRING },
        { name: "tipoMovimiento", value: req.query.tipoMovimiento, type: self.model.types.STRING },
        { name: "cargo", value: req.query.cargo, type: self.model.types.DECIMAL },
        { name: "abono", value: req.query.abono, type: self.model.types.DECIMAL },
        { name: "grupoIns", value: req.query.grupoIns, type: self.model.types.INT }
    ];
    
    this.model.query('[DBO].[INS_LAYOUT_SP]', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

excelExport.prototype.get_insExcelBanamex = function(req,res,next){
    var self = this;
 
    var params = [
                 {name: "idBanco", value: req.query.idBanco, type: self.model.types.INT},
                 {name: "noCuenta", value: req.query.NoCuenta, type: self.model.types.STRING},
                 {name: "fecha", value: req.query.Fecha, type: self.model.types.STRING},
                 {name: "descipcion", value: req.query.Descripcion, type: self.model.types.STRING},
                 {name: "sucursal", value: req.query.Sucursal, type: self.model.types.INT},
                 {name: "tipoTransaccion", value: req.query.Tipo_Transaccion, type: self.model.types.STRING},
                 {name: "refNumerica", value: req.query.Referencia_Numerica, type: self.model.types.INT},
                 {name: "refAlfanumerica", value: req.query.Referencia_Alfanumerica, type: self.model.types.STRING},
                 {name: "autorizacion", value: req.query.Autorizacion, type: self.model.types.INT},
                 {name: "depositos", value: req.query.Depositos, type: self.model.types.DECIMAL},
                 {name: "retiros", value: req.query.Retiros, type: self.model.types.DECIMAL},
                 {name: "clveLayout", value: req.query.claveLayout, type: self.model.types.STRING}
                 ];


    this.model.query('INS_EXCEL_DATA_BANAMEX', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


excelExport.prototype.get_insExcelInbursa = function(req,res,next){
    var self = this;
 
    var params = [
                 {name: "idBanco", value: req.query.idBanco, type: self.model.types.INT},
                 {name: "noCuenta", value: req.query.NoCuenta, type: self.model.types.STRING},
                 {name: "fecha", value: req.query.Fecha, type: self.model.types.STRING},
                 {name: "referencia", value: req.query.Referencia, type: self.model.types.INT},
                 {name: "refLeyenda", value: req.query.Referencia_Leyenda, type: self.model.types.STRING},
                 {name: "refNumerica", value: req.query.Referencia_Numerica, type: self.model.types.STRING},
                 {name: "cargo", value: req.query.Cargo, type: self.model.types.DECIMAL},
                 {name: "abono", value: req.query.Abono, type: self.model.types.DECIMAL},
                 {name: "ordenante", value: req.query.Ordenante, type: self.model.types.STRING},                 
                 {name: "clveLayout", value: req.query.claveLayout, type: self.model.types.STRING}
                 ];


    this.model.query('INS_EXCEL_DATA_INBURSA', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



excelExport.prototype.get_insExcelCargaInicial = function(req,res,next){
    var self = this;
 
    var params = [
                 {name: "noCuenta", value: req.query.NoCuenta, type: self.model.types.STRING},
                 {name: "fecha", value: req.query.Fecha, type: self.model.types.STRING},
                 {name: "concepto", value: req.query.Concepto, type: self.model.types.STRING},
                 {name: "sucursal", value: req.query.Sucursal, type: self.model.types.INT},
                 {name: "referencia", value: req.query.Referencia, type: self.model.types.INT},
                 {name: "refAmpliada", value: req.query.Referencia_Ampliada, type: self.model.types.STRING},
                 {name: "autorizacion", value: req.query.Autorizacion, type: self.model.types.INT},
                 {name: "abonos", value: req.query.Abonos, type: self.model.types.DECIMAL},
                 {name: "cargos", value: req.query.Cargos, type: self.model.types.DECIMAL},
                 {name: "clveLayout", value: req.query.claveLayout, type: self.model.types.STRING}
                 ];


    this.model.query('INS_EXCEL_DATA_CARGAINICIAL', params, function(error, result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



excelExport.prototype.get_deleteDataLayout = function (req, res, next) {
    var self = this;
    var params = [
        { name: "idGrupoIns", value: req.query.grupo, type: self.model.types.STRING }
    ];
    console.log( 'params', params );
    this.model.query('[DBO].[DEL_MOVIMIENTOLAYOUT_SP]', params, function (error, result) {
        console.log( 'result', result );
        console.log( 'error', error );
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


excelExport.prototype.get_insHistoryLayout = function(req, res, next){
  var self = this;

    //Petición que ejecuta el SP que registra el layout descargado para llevar un control de los archivos a subir

var params =    [{name: "nombreBanco", value: req.query.nombreBanco, type: self.model.types.STRING},
                 {name: "idBanco", value: req.query.idBanco, type: self.model.types.STRING},
                 {name: "clave", value: req.query.claveLayout, type: self.model.types.STRING},
                 {name: "accion", value: req.query.accion, type: self.model.types.INT}
                ];
     
     this.model.query('UPDT_HISTORY_LAYOUT', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

excelExport.prototype.get_createScotiabank = function(req, res, next) {
    var self = this;
    
    var xl = require('excel4node');
    var wb = new xl.Workbook({
        defaultFont: {
            size: 11,
            name: 'Calibri'
        }
    });

    var idBanco = req.query.idBanco;
    var codigo = req.query.codigo;

    var ws = wb.addWorksheet("Información Bancos Layout", {
        margins: {
            left: 0.75,
            right: 0.75,
            top: 1.0,
            bottom: 1.0,
            footer: 0.5,
            header: 0.5
        },
        printOptions: {
            centerHorizontal: true,
            centerVertical: false
        },
        paperDimensions: {
            paperWidth: '210mm',
            paperHeight: '297mm'
        },
        view: {
            zoom: 100
        },
        outline: {
            summaryBelow: true
        },
        fitToPage: {
            fitToHeight: 100,
            orientation: 'landscape',
        }
    });

    // Estilos usados en el excel
    var sty_th = wb.createStyle({
        font: { bold: true },
        border: {
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_fill = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_title = wb.createStyle({
        font:      { size: 18, bold: true, underline: true, },
        alignment: { horizontal: ['center']}
    });

    var sty_center = wb.createStyle({
       alignment: { horizontal: ['center']} 
    });

    var sty_left = wb.createStyle({
       alignment: { horizontal: ['left']} 
    });

    var sty_litle = wb.createStyle({
        font: { size: 8, bold: true }
    });

    var sty_border = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_underline = wb.createStyle({
        font: { color: '#ffffff' },
        border: { 
            left: {style: 'none', },
            right: {style: 'none', },
            top: {style: 'none', },
            bottom: {style: 'thin', }
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_bgcolor = wb.createStyle({
        font: { color: '#ffffff' },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_white = wb.createStyle({
        font: { color: '#ffffff' }
    });
    

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(28);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(28);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(19);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(30);
    ws.column(8).setWidth(30);
    ws.column(9).setWidth(30);


    // // Insercion de llave
    // ws.cell(2,23).string(req.query.codigo).style( sty_white );
   
    // //Insercion del ID Banco

    // ws.cell(2,22).string(idBanco).style(sty_white);

    //Encabezados que contienen los identificadores de la hoja Excel 
    ws.cell(1, 22).string(req.query.codigo).style( sty_white );
    ws.cell(1, 23).string( idBanco).style( sty_white );

    // Titulo
    // ws.cell(3, 1, 3, 6, true ).string( "Información Registros Bancarios" ).style( sty_title );

    // ws.addImage({
    //     path: 'FondoAndrade.png',
    //     type: 'picture',
    //     position: {
    //         type: 'absoluteAnchor',
    //         x: '0.5in',
    //         y: '0.1in'
    //     }
    // });

    // Fila Inicial
    var row = 1;
     
     

    ws.cell( row, 1 ).string('No_Cuenta').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 2 ).string('Fecha').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 3 ).string('Referencia_Numerica').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 4 ).string('Cargo').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 5 ).string('Abono').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 6 ).string('Tipo').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 7 ).string('Transaccion').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 8).string('Leyenda_1').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 9).string('Leyenda_2').style( sty_th ).style( sty_center ).style(sty_bgcolor);

    
 


    // Se escribe el documento de excel
    var nameLayout = 'Layout_'+ req.query.NombreBanco +'.xlsx';

 
    wb.write( 'app/static/AngularJS/ExportarExcel/' + nameLayout, function( err, stats ){
        if (err) {
            console.error(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } 

        self.view.expositor(res, {
            error: false,
            result: {Success: true, Msg: 'Se genero el Layout correctamente', Name: nameLayout}
        });

        setTimeout(function(){
            var fs = require("fs");
            fs.unlink('app/static/AngularJS/ExportarExcel/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 2000);
    });
// Fin del Proceso que genera el cuerpo del Excel a descargar
};



excelExport.prototype.get_createBanamex = function(req, res, next) {
    var self = this;
    
    var xl = require('excel4node');
    var wb = new xl.Workbook({
        defaultFont: {
            size: 11,
            name: 'Calibri'
        }
    });

    var idBanco = req.query.idBanco;
    var codigo = req.query.codigo;

    var ws = wb.addWorksheet("Información Bancos Layout", {
        margins: {
            left: 0.75,
            right: 0.75,
            top: 1.0,
            bottom: 1.0,
            footer: 0.5,
            header: 0.5
        },
        printOptions: {
            centerHorizontal: true,
            centerVertical: false
        },
        paperDimensions: {
            paperWidth: '210mm',
            paperHeight: '297mm'
        },
        view: {
            zoom: 100
        },
        outline: {
            summaryBelow: true
        },
        fitToPage: {
            fitToHeight: 100,
            orientation: 'landscape',
        }
    });

    // Estilos usados en el excel
    var sty_th = wb.createStyle({
        font: { bold: true },
        border: {
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_fill = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_title = wb.createStyle({
        font:      { size: 18, bold: true, underline: true, },
        alignment: { horizontal: ['center']}
    });

    var sty_center = wb.createStyle({
       alignment: { horizontal: ['center']} 
    });

    var sty_left = wb.createStyle({
       alignment: { horizontal: ['left']} 
    });

    var sty_litle = wb.createStyle({
        font: { size: 8, bold: true }
    });

    var sty_border = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_underline = wb.createStyle({
        font: { color: '#ffffff' },
        border: { 
            left: {style: 'none', },
            right: {style: 'none', },
            top: {style: 'none', },
            bottom: {style: 'thin', }
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_bgcolor = wb.createStyle({
        font: { color: '#ffffff' },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_white = wb.createStyle({
        font: { color: '#ffffff' }
    });
    

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(28);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(30);
    ws.column(4).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(19);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);


    // // Insercion de llave
    // ws.cell(2,23).string(req.query.codigo).style( sty_white );
   
    // //Insercion del ID Banco

    // ws.cell(2,22).string(idBanco).style(sty_white);

    //Encabezados que contienen los identificadores de la hoja Excel 
    ws.cell(1, 22).string(req.query.codigo).style( sty_white );
    ws.cell(1, 23).string( idBanco).style( sty_white );

    // Titulo
    // ws.cell(3, 1, 3, 6, true ).string( "Información Registros Bancarios" ).style( sty_title );

    // ws.addImage({
    //     path: 'FondoAndrade.png',
    //     type: 'picture',
    //     position: {
    //         type: 'absoluteAnchor',
    //         x: '0.5in',
    //         y: '0.1in'
    //     }
    // });

    // Fila Inicial
    var row = 1;
     
     

        ws.cell(row, 1).string( 'No_Cuenta' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 2).string( 'Fecha' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 3).string( 'Descripcion' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 4).string( 'Sucursal' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 4).string( 'Tipo_Transaccion' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 5).string( 'Referencia_Numerica' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 6).string( 'Referencia_Alfanumerica' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 7).string( 'Autorizacion' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 8).string( 'Depositos' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 9).string( 'Retiros' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
    
    
 


    // Se escribe el documento de excel
    var nameLayout = 'Layout_'+ req.query.NombreBanco +'.xlsx';

 
    wb.write( 'app/static/AngularJS/ExportarExcel/' + nameLayout, function( err, stats ){
        if (err) {
            console.error(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } 

        self.view.expositor(res, {
            error: false,
            result: {Success: true, Msg: 'Se genero el Layout correctamente', Name: nameLayout}
        });

        setTimeout(function(){
            var fs = require("fs");
            fs.unlink('app/static/AngularJS/ExportarExcel/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 2000);
    });
// Fin del Proceso que genera el cuerpo del Excel a descargar
};

excelExport.prototype.get_createInbursa = function(req, res, next) {
    var self = this;
    
    var xl = require('excel4node');
    var wb = new xl.Workbook({
        defaultFont: {
            size: 11,
            name: 'Calibri'
        }
    });

    var idBanco = req.query.idBanco;
    var codigo = req.query.codigo;

    var ws = wb.addWorksheet("Información Bancos Layout", {
        margins: {
            left: 0.75,
            right: 0.75,
            top: 1.0,
            bottom: 1.0,
            footer: 0.5,
            header: 0.5
        },
        printOptions: {
            centerHorizontal: true,
            centerVertical: false
        },
        paperDimensions: {
            paperWidth: '210mm',
            paperHeight: '297mm'
        },
        view: {
            zoom: 100
        },
        outline: {
            summaryBelow: true
        },
        fitToPage: {
            fitToHeight: 100,
            orientation: 'landscape',
        }
    });

    // Estilos usados en el excel
    var sty_th = wb.createStyle({
        font: { bold: true },
        border: {
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_fill = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_title = wb.createStyle({
        font:      { size: 18, bold: true, underline: true, },
        alignment: { horizontal: ['center']}
    });

    var sty_center = wb.createStyle({
       alignment: { horizontal: ['center']} 
    });

    var sty_left = wb.createStyle({
       alignment: { horizontal: ['left']} 
    });

    var sty_litle = wb.createStyle({
        font: { size: 8, bold: true }
    });

    var sty_border = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_underline = wb.createStyle({
        font: { color: '#ffffff' },
        border: { 
            left: {style: 'none', },
            right: {style: 'none', },
            top: {style: 'none', },
            bottom: {style: 'thin', }
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_bgcolor = wb.createStyle({
        font: { color: '#ffffff' },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_white = wb.createStyle({
        font: { color: '#ffffff' }
    });
    

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(28);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(28);
    ws.column(4).setWidth(28);
    ws.column(5).setWidth(28);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(15);
    ws.column(8).setWidth(28);


    // // Insercion de llave
    // ws.cell(2,23).string(req.query.codigo).style( sty_white );
   
    // //Insercion del ID Banco

    // ws.cell(2,22).string(idBanco).style(sty_white);

    //Encabezados que contienen los identificadores de la hoja Excel 
    ws.cell(1, 22).string(req.query.codigo).style( sty_white );
    ws.cell(1, 23).string( idBanco).style( sty_white );

    // Titulo
    // ws.cell(3, 1, 3, 6, true ).string( "Información Registros Bancarios" ).style( sty_title );

    // ws.addImage({
    //     path: 'FondoAndrade.png',
    //     type: 'picture',
    //     position: {
    //         type: 'absoluteAnchor',
    //         x: '0.5in',
    //         y: '0.1in'
    //     }
    // });

    // Fila Inicial
    var row = 1;
     
     

        ws.cell(row, 1).string('No_Cuenta').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 2).string('Fecha').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 3).string('Referencia').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 4).string('Referencia_Leyenda').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 5).string('Referencia_Numerica').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 6).string('Cargo').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 7).string('Abono').style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 8).string('Ordenante').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    
    
 


    // Se escribe el documento de excel
    var nameLayout = 'Layout_'+ req.query.NombreBanco +'.xlsx';

 
    wb.write( 'app/static/AngularJS/ExportarExcel/' + nameLayout, function( err, stats ){
        if (err) {
            console.error(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } 

        self.view.expositor(res, {
            error: false,
            result: {Success: true, Msg: 'Se genero el Layout correctamente', Name: nameLayout}
        });

        setTimeout(function(){
            var fs = require("fs");
            fs.unlink('app/static/AngularJS/ExportarExcel/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 2000);
    });
// Fin del Proceso que genera el cuerpo del Excel a descargar
};

excelExport.prototype.get_createCargaInicial = function(req, res, next) {
    var self = this;
    
    var xl = require('excel4node');
    var wb = new xl.Workbook({
        defaultFont: {
            size: 11,
            name: 'Calibri'
        }
    });

    var idBanco = req.query.idBanco;
    var codigo = req.query.codigo;

    var ws = wb.addWorksheet("Información Bancos Layout", {
        margins: {
            left: 0.75,
            right: 0.75,
            top: 1.0,
            bottom: 1.0,
            footer: 0.5,
            header: 0.5
        },
        printOptions: {
            centerHorizontal: true,
            centerVertical: false
        },
        paperDimensions: {
            paperWidth: '210mm',
            paperHeight: '297mm'
        },
        view: {
            zoom: 100
        },
        outline: {
            summaryBelow: true
        },
        fitToPage: {
            fitToHeight: 100,
            orientation: 'landscape',
        }
    });

    // Estilos usados en el excel
    var sty_th = wb.createStyle({
        font: { bold: true },
        border: {
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_fill = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_title = wb.createStyle({
        font:      { size: 18, bold: true, underline: true, },
        alignment: { horizontal: ['center']}
    });

    var sty_center = wb.createStyle({
       alignment: { horizontal: ['center']} 
    });

    var sty_left = wb.createStyle({
       alignment: { horizontal: ['left']} 
    });

    var sty_litle = wb.createStyle({
        font: { size: 8, bold: true }
    });

    var sty_border = wb.createStyle({
        border: { 
            left: {style: 'thin', },
            right: {style: 'thin', },
            top: {style: 'thin', },
            bottom: {style: 'thin', }
        }
    });

    var sty_underline = wb.createStyle({
        font: { color: '#ffffff' },
        border: { 
            left: {style: 'none', },
            right: {style: 'none', },
            top: {style: 'none', },
            bottom: {style: 'thin', }
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_bgcolor = wb.createStyle({
        font: { color: '#ffffff' },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '203764',
            bgColor: '203764'
        }
    });

    var sty_white = wb.createStyle({
        font: { color: '#ffffff' }
    });
    

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(28);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(30);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(30);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(19);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);


    // // Insercion de llave
    // ws.cell(2,23).string(req.query.codigo).style( sty_white );
   
    // //Insercion del ID Banco

    // ws.cell(2,22).string(idBanco).style(sty_white);

    //Encabezados que contienen los identificadores de la hoja Excel 
    ws.cell(1, 22).string(req.query.codigo).style( sty_white );
    ws.cell(1, 23).string( idBanco).style( sty_white );

    // Titulo
    // ws.cell(3, 1, 3, 6, true ).string( "Información Registros Bancarios" ).style( sty_title );

    // ws.addImage({
    //     path: 'FondoAndrade.png',
    //     type: 'picture',
    //     position: {
    //         type: 'absoluteAnchor',
    //         x: '0.5in',
    //         y: '0.1in'
    //     }
    // });

    // Fila Inicial
    var row = 1;
     
     

        ws.cell(row, 1).string( 'No_Cuenta' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 2).string( 'Fecha' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 3).string( 'Concepto' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 4).string( 'Sucursal' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 5).string( 'Referencia' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 6).string( 'Referencia_Ampliada' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 7).string( 'Autorizacion' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 8).string( 'Abonos' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
        ws.cell(row, 9).string( 'Cargos' ).style( sty_th ).style( sty_center ).style(sty_bgcolor);
    
    
 


    // Se escribe el documento de excel
    var nameLayout = 'Layout_'+ req.query.NombreBanco +'.xlsx';

 
    wb.write( 'app/static/AngularJS/ExportarExcel/' + nameLayout, function( err, stats ){
        if (err) {
            console.error(err);
            self.view.expositor(res, {
                error: true,
                result: err
            });
        } 

        self.view.expositor(res, {
            error: false,
            result: {Success: true, Msg: 'Se genero el Layout correctamente', Name: nameLayout}
        });

        setTimeout(function(){
            var fs = require("fs");
            fs.unlink('app/static/AngularJS/ExportarExcel/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 2000);
    });
// Fin del Proceso que genera el cuerpo del Excel a descargar
};

module.exports = excelExport;