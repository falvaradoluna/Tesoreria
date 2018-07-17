var conciliacionDetalleRegistroConsultaView = require('../views/reference'),
    conciliacionDetalleRegistroConsultaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var http = require('http');
var fs = require('fs');
var JSZip = require("jszip");
var zip = new JSZip();


var conciliacionDetalleRegistroConsulta = function (conf) {
    this.conf = conf || {};

    this.view = new conciliacionDetalleRegistroConsultaView();
    this.model = new conciliacionDetalleRegistroConsultaModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

conciliacionDetalleRegistroConsulta.prototype.post_totalAbonoCargo = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
        { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.body.noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: req.body.fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte', value: req.body.fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago', value: req.body.polizaPago, type: self.model.types.STRING },
        { name: 'opcion', value: req.body.opcion, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'tipoReporte', value: req.body.tipoReporte, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_TOTAL_ABONOCARGO_SP_H', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


conciliacionDetalleRegistroConsulta.prototype.get_depositos = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'idEstatus', value: req.query.idEstatus, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.cuentaBancaria, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('[dbo].[SEL_TODO_BANCARIO_SP_H]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


conciliacionDetalleRegistroConsulta.prototype.get_auxiliarContable = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT },
    ];
    
    this.model.queryAllRecordSet('[dbo].[SEL_TODO_CONTABLE_SP_H]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

//Luis Anotnio Garcia Perrusquia
conciliacionDetalleRegistroConsulta.prototype.get_bancoPunteo = function (req, res, next) {

    var self = this;
    
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT },
        { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING }
    ];
    
    this.model.queryAllRecordSet('[DBO].[SEL_PUNTEO_DETALLE_SP_H]', params, function (error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistroConsulta.prototype.get_auxiliarPunteo = function (req, res, next) {
    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT },
        { name: 'idEstatus', value: req.query.idEstatus, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_PUNTEO_AUXILIAR_PADRES_SP_H', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistroConsulta.prototype.post_detallePunteo = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'grupo', value: req.body.grupo, type: self.model.types.INT },
        { name: 'idHistorico', value: req.body.idHistorico, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[SEL_PUNTEO_DETALLE_GRUPO_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistroConsulta.prototype.get_bancoDPI = function (req, res, next) {

    var self = this;
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT }
    ];
    this.model.query('SEL_DEPOSITOSDPI_H', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistroConsulta.prototype.get_bancoReferenciado = function (req, res, next) {

    var self = this;
    
    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT }
    ];
    this.model.query('SEL_REG_BANCOS_REFERENCIADOS_H', params, function (error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


conciliacionDetalleRegistroConsulta.prototype.post_reportePdf = function (req, res, next) {
    var filename = guid();
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";
    var options = {
        "method": "POST",
        "hostname": "189.204.141.193",
        "port": "5488",
        "path": "/api/report",
        "headers": {
            "content-type": "application/json"
        }
    };
    var request = http.request(options, function (response) {
        var chunks = [];

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            var body = Buffer.concat(chunks);

            fs.writeFile(filePath, body, function (err) {
                if (err) return console.log(err);
            });

        });
    });
    request.write(JSON.stringify(req.body.values));
    request.end();
    var self = this;
    self.view.expositor(res, {
        error: null,
        result: filename
    });
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
        s4() + '_' + s4() + s4() + s4();
};

conciliacionDetalleRegistroConsulta.prototype.get_viewpdf = function (req, res, next) {

    var filename = req.query.fileName;
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";

    fs.readFile(filePath, function (err, file) {
        res.writeHead(200, { "Content-Type": "application/pdf" });
        res.write(file, "binary");
        res.end();
        fs.unlinkSync(filePath);
    });
};

conciliacionDetalleRegistroConsulta.prototype.post_sendMail = function (req, res, next) {
    var self = this;
    var params = [{ name: 'tipoParametro', value: 0, type: self.model.types.INT }];
    this.model.query('SEL_PARAMETROS_SP', params, function (error, result) {



        var  nombreArchivo = req.body.nombreArchivo;
        var cuentaContable = req.body.cuentaContable;
        var nombreEmpresa = req.body.nombreEmpresa;
        var cuentaBancaria = req.body.cuentaBancaria;
        var nombreBanco = req.body.nombreBanco;
        var responsable = req.body.responsable;
        var urlFile = req.body.fileUrl;
        var object = {};   //Objeto que envía los parámetros
        var params = [];   //Referencia a la clase para callback    
        var files = [];
        var ruta = path.dirname(require.main.filename) + "\\pdf\\" + nombreArchivo + ".pdf";
        var extension = '.pdf';
        var carpeta = 'pdf';
        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport({
            host: '192.168.20.17',
            port: 25,
            secure: false,
            auth: {
                user: 'noreply',
                pass: 'P4n4m4!'
            },
            tls: { rejectUnauthorized: false }
        }));
        var mailOptions = {
            from: '<grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
            to: 'rolivares@bism.com.mx', // list of receivers 
            subject: 'Prueba si envia subject', // Subject line 
            text: result[1].valor, // plaintext body 
            html: '<b>' + result[1].valor + '</b><br/><br/><br/><b>Empresa: </b>' + nombreEmpresa + '<br/><b>Cuenta contable: </b>' + cuentaContable + '<br/><b>Banco: </b>' + nombreBanco + '<br/><b>Cuenta bancaria: </b>' + cuentaBancaria + '<br/><br/><b>Realizó: </b>' + responsable, // html body 
            attachments: [{ // file on disk as an attachment
                filename: nombreArchivo + '.pdf',
                path: ruta // stream this file
            }]
        };
        setTimeout(function () {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.send(500);
                    console.log(error);
                } else {
                    res.send(200);
                    fs.stat(ruta, function (err, stats) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            });
        }, 4000)


        transporter.close;
        object.error = null;
        object.result = 1;

        req.body = [];
    });
};


conciliacionDetalleRegistroConsulta.prototype.get_contableReferenciado = function (req, res, next) {
    var self = this;
    var params = [{ name: 'numCuenta', value: req.query.numCuenta, type: self.model.types.STRING },
        { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'idHistorico', value: req.query.idHistorico, type: self.model.types.INT }
    ];
    
    this.model.query('SEL_REG_CONTABLES_REF_H', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/detalleRegistroAbono
*/
conciliacionDetalleRegistroConsulta.prototype.get_detalleRegistroAbono = function (req, res, next) {

    var self = this;
    var idAbono = req.query.idAbono;
    var idHistorico = req.query.idHistorico;

    var params = [{ name: 'idAbono', value: idAbono, type: self.model.types.INT },
    { name: 'idHistorico', value: idHistorico, type: self.model.types.INT }];
    
    this.model.queryAllRecordSet('[dbo].[SEL_DOC_PAG_BY_ABONO_ID_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/detalleRegistrosBancariosCargos
*/
conciliacionDetalleRegistroConsulta.prototype.get_detalleRegistrosBancariosCargos = function (req, res, next) {

    var self = this;
    var idCargo = req.query.idCargo;
    var idHistorico = req.query.idHistorico;

    var params = [
        { name: 'idCargo', value: idCargo, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_DOC_PAG_BY_CARGO_ID_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/detalleRegistrosBancariosAbonos
*/
conciliacionDetalleRegistroConsulta.prototype.get_detalleRegistrosBancariosAbonos = function (req, res, next) {

    var self = this;
    var idAbono = req.query.idAbono;
    var idHistorico = req.query.idHistorico;

    var params = [
        { name: 'IDABONOSBANCOS', value: idAbono, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('[dbo].[SEL_CONCILIADOS_ABONOBAN_CARGOCON_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/detalleRegistrosContablesAbonos
*/
conciliacionDetalleRegistroConsulta.prototype.get_detalleRegistrosContablesAbonos = function (req, res, next) {

    var self = this;
    var idAuxiliar = req.query.idAuxiliar;
    var idHistorico = req.query.idHistorico;

    var params = [
        { name: 'IDCARGOS_COMPLETO', value: idAuxiliar, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('[dbo].[SEL_CONCILIADOS_CARGOCON_ABONOBAN_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/detalleRegistrosContablesAbonos
*/
conciliacionDetalleRegistroConsulta.prototype.get_getUniversoContable = function (req, res, next) {

    var self = this;
    var idAuxiliar = req.query.idAuxiliar;
    var idHistorico = req.query.idHistorico;

    var params = [
        { name: 'IDCARGOS_COMPLETO', value: idAuxiliar, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('[dbo].[SEL_CONCILIADOS_CARGOCON_ABONOBAN_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/universoContableConsulta
*/
conciliacionDetalleRegistroConsulta.prototype.get_universoContableConsulta = function (req, res, next) {

    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idUsuario = req.query.idUsuario;
    var idHistorico = req.query.idHistorico;
    var noCuenta = req.query.noCuenta;
    var cuentaContable = req.query.cuentaContable;
    var fechaElaboracion = req.query.fechaElaboracion;
    var polizaPago = req.query.polizaPago;
    var idBanco = req.query.idBanco;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT },
        { name: 'noCuenta', value: noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: fechaElaboracion, type: self.model.types.STRING },
        { name: 'polizaPago', value: polizaPago, type: self.model.types.STRING },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_CONTABLE_TODO_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/universoBancarioConsulta
*/
conciliacionDetalleRegistroConsulta.prototype.get_universoBancarioConsulta = function (req, res, next) {

    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idUsuario = req.query.idUsuario;
    var idHistorico = req.query.idHistorico;
    var noCuenta = req.query.noCuenta;
    var cuentaContable = req.query.cuentaContable;
    var fechaElaboracion = req.query.fechaElaboracion;
    var fechaCorte = req.query.fechaCorte;
    var polizaPago = req.query.polizaPago;
    var idBanco = req.query.idBanco;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idHistorico', value: idHistorico, type: self.model.types.INT },
        { name: 'noCuenta', value: noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: fechaElaboracion, type: self.model.types.STRING },
        { name: 'polizaPago', value: polizaPago, type: self.model.types.STRING },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_BANCARIO_TODO_SP_H]', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = conciliacionDetalleRegistroConsulta;
