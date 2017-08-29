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

excelExport.prototype.get_insExcel = function(req,res,next){
	var self = this;
 
	var params = [{name: "noCuenta", value: req.query.NoCuenta, type: self.model.types.STRING},
		         {name: "fecha", value: req.query.Fecha, type: self.model.types.STRING},
		         {name: "cargo", value: req.query.Cargo, type: self.model.types.STRING},
		         {name: "abono", value: req.query.Abono, type: self.model.types.STRING},
		         {name: "tipo", value: req.query.Tipo, type: self.model.types.STRING},
		         {name: "transaccion", value: req.query.Transaccion, type: self.model.types.STRING},
		         {name: "leyenda1", value: req.query.Leyenda1, type: self.model.types.STRING},
                 {name: "leyenda2", value: req.query.Leyenda2, type: self.model.types.STRING},
                 {name: "accion", value: 2, type: self.model.types.INT}
	        ];


    this.model.query('INS_EXCEL_DATA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

excelExport.prototype.get_insHistoryLayout = function(req, res, next){
  var self = this;

    //Petición que ejecuta el SP que registra el layout descargado para llevar un control de los archivos a subir

     //La accion 2 indica que guardará la información del archivo excel que se esta descargando, para su posterior validación
     //se utiliza el mismo SP que guarda la inforamción del Layout ocupando los campos idBmer "se envía el nombre del banco",
     //IdBanco "se envía el identificador del banco al que pertenece el layout", txtOrigen "Envío el código"

var params =    [{name: "nombreBanco", value: req.query.NombreBanco, type: self.model.types.STRING},
                 {name: "idBanco", value: req.query.idBanco, type: self.model.types.STRING},
                 {name: "claveLayout", value: req.query.codigo, type: self.model.types.STRING}

                ];
     
     this.model.query('INS_EXCEL_DATA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

excelExport.prototype.get_create = function(req, res, next) {
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
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(19);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(30);
    ws.column(8).setWidth(30);


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
     
 

    ws.cell( row, 1 ).string('NoCuenta').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 2 ).string('Fecha').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 3 ).string('Cargo').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 4 ).string('Abono').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 5 ).string('Tipo').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 6 ).string('Transaccion').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 7).string('Leyenda1').style( sty_th ).style( sty_center ).style(sty_bgcolor);
    ws.cell( row, 8).string('Leyenda2').style( sty_th ).style( sty_center ).style(sty_bgcolor);

 


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

        setTimeout( function(){
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