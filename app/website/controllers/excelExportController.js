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

	var params = [{name: "idBmer", value: req.query.idBmer, type: self.model.types.STRING},
		         {name: "IdBanco", value: req.query.IdBanco, type: self.model.types.STRING},
		         {name: "txtOrigen", value: req.query.txtOrigen, type: self.model.types.STRING},
		         {name: "registro", value: req.query.registro, type: self.model.types.STRING},
		         {name: "noMovimiento", value: req.query.noMovimiento, type: self.model.types.STRING},
		         {name: "referencia", value: req.query.referencia, type: self.model.types.STRING},
		         {name: "concepto", value: req.query.concepto, type: self.model.types.STRING}
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
    
    //var json = JSON.parse( req.query.jsonData );

    // Se asignan los anchos de las columnas
    ws.column(1).setWidth(15);
    ws.column(2).setWidth(28);
    ws.column(3).setWidth(27);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(19);
    ws.column(6).setWidth(30);

    // Insercion de llave
    ws.cell(1,6 ).string( 'RodrigoPrueba' ).style( sty_white );
    // Titulo
    ws.cell(3, 1, 3, 6, true ).string( "Inventario de Accesorios" ).style( sty_title );

    ws.addImage({
        path: 'FondoAndrade.png',
        type: 'picture',
        position: {
            type: 'absoluteAnchor',
            x: '0.5in',
            y: '0.1in'
        }
    });

    // Fila Inicial
    var row = 7;

    // Empresa y sucursales
    ws.cell(row, 1).string( "EMPRESA" ).style( sty_litle );
    ws.cell(row, 5).string( "SUCURSAL" ).style( sty_litle );
    row++;

    /*ws.cell(row, 1, row, 2, true).string( json.empresa ).style( sty_underline );
    ws.cell(row, 5, row, 6, true).string( json.sucursal ).style( sty_underline );*/
    row++;
    row++;

    // Datos generales del inventario
    ws.cell(row, 1).string( "VIN" ).style( sty_litle );
    ws.cell(row, 2,row, 3, true).string( "CATÁLOGO" ).style( sty_litle );
    ws.cell(row, 4, row, 5, true).string( "DESCRIPCIÓN" ).style( sty_litle );
    ws.cell(row, 6).string( "AÑO MODELO" ).style( sty_litle );
    row++;

    /*ws.cell(row, 1).string( '' ).style( sty_bgcolor );
    ws.cell(row, 2, row, 3, true).string( json.catalogo ).style( sty_bgcolor );
    ws.cell(row, 4, row, 5, true).string( json.descripcion ).style( sty_bgcolor );
    ws.cell(row, 6).number( json.anio ).style( sty_bgcolor ).style( sty_left );*/
    row++;
    row++;

    // Datos generales del inventario
    ws.cell(row, 1).string( "FOLIO DE REVISIÓN" ).style( sty_litle );
    ws.cell(row, 2, row, 3, true).string( "FECHA / HORA DE LEVANTAMIENTO" ).style( sty_litle );
    ws.cell(row, 6).string( "USUARIO" ).style( sty_litle );
    row++;

    ws.cell(row, 1).string( '' ).style( sty_bgcolor );
    ws.cell(row, 2, row, 3, true).string( '' ).style( sty_bgcolor );
    ws.cell(row, 6).string( '' ).style( sty_bgcolor );
    row++;
    
    row++;
    row++;
    // Se insertan las cabeceras de la tabla
    ws.cell( row, 1 ).string( 'No' ).style( sty_th ).style( sty_center );
    ws.cell( row, 2 ).string( 'DESCRIPCIÓN HERRAMIENTA' ).style( sty_th );
    ws.cell( row, 3 ).string( 'CANTIDAD RECIBIDA' ).style( sty_th );
    ws.cell( row, 4 ).string( 'CANTIDAD DAÑADA' ).style( sty_th );
    ws.cell( row, 5, row, 6, true ).string( 'OBSERVACIONES' ).style( sty_th ).style( sty_center );
    row++;

    // Se registra de forma dinámica cada uno de los accesorios
    /*var consecutivo = 1;
    json.accesorios.forEach(function( item, key ){
        ws.cell( row, 1 ).number( consecutivo ).style( sty_border ).style( sty_center );
        ws.cell( row, 2 ).string( item.descripcion ).style( sty_border );
        ws.cell( row, 3 ).string( '' ).style( sty_border ).style( sty_center );
        ws.cell( row, 4 ).string( '' ).style( sty_border ).style( sty_center );
        ws.cell( row, 5, row, 6, true ).string( '' ).style( sty_border );
        ws.row( row ).setHeight(20);

        consecutivo++;
        row++;
    });*/

    row++;
    row++;

    ws.cell( row, 1, row, 2, true ).string( 'OBSERVACIONES GENERALES' ).style( sty_th );
    ws.cell( row, 3, row, 6, true ).string( '' ).style( sty_fill ).style( sty_bgcolor );
    // Se escribe el documento de excel
    var nameLayout = 'INV_' + 'excelPrueba' + '_' + '2017';

    nameLayout.replace(/[^a-zA-Z 0-9.]+/g,'_');
    nameLayout = nameLayout.replaceAll(" ", "_");
    nameLayout = nameLayout.replaceAll("/", "_");
    nameLayout += '.xlsx';

    // var nameLayout =  new Date().getTime() + '.xlsx'
    wb.write( 'app/static/ExportarExcel/' + nameLayout, function( err, stats ){
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
            fs.unlink('app/static/ExportarExcel/' + nameLayout, function(err) {
               if (err) {
                   return console.error(err);
               }
            });            
        }, 5000 );
    });
};

module.exports = excelExport;