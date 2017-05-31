var conciliacionDetalleRegistroView = require('../views/reference'),
    conciliacionDetalleRegistroModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var http = require('http');
var fs = require('fs');
var JSZip = require("jszip");
var zip = new JSZip();


var conciliacionDetalleRegistro = function(conf) {
    this.conf = conf || {};

    this.view = new conciliacionDetalleRegistroView();
    this.model = new conciliacionDetalleRegistroModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};
conciliacionDetalleRegistro.prototype.post_insertPuntoDeposito = function(req, res, next) {

    var self = this;


    var params = [{ name: 'idDepositoBanco', value: req.body.idDepositoBanco, type: self.model.types.INT },
        { name: 'idAuxiliarContable', value: req.body.idAuxiliarContable, type: self.model.types.INT },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idPadre', value: req.body.idPadre, type: self.model.types.INT }
    ];

    this.model.query('INS_PUNTEO_DEPOSITO_AUXILIAR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.get_auxiliarPunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING }
    ];

    this.model.query('SEL_PUNTEO_AUXILIAR_PADRES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.get_bancoPunteo = function(req, res, next) {

    var self = this;


    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.STRING }
    ];

    this.model.query('SEL_PUNTEO_DEPOSITOS_PADRES_SP', params, function(error, result) {


        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.post_eliminarPunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idPunteoAuxiliarBanco', value: req.body.idPunteoAuxiliarBanco, type: self.model.types.INT }];

    this.model.query('DEL_PUNTEO_AUXILIAR_DEPOSITO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.post_detallePunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idPunteoAuxiliarBanco', value: req.body.idPunteoAuxiliarBanco, type: self.model.types.INT }];

    this.model.query('SEL_PUNTEO_AUXILIAR_DEPOSITO_DETALLES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.post_reportePdf = function(req, res, next) {
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
    var request = http.request(options, function(response) {
        var chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function() {
            var body = Buffer.concat(chunks);

            fs.writeFile(filePath, body, function(err) {
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
conciliacionDetalleRegistro.prototype.get_viewpdf = function(req, res, next) {

    var filename = req.query.fileName;
    var filePath = path.dirname(require.main.filename) + "\\pdf\\" + filename + ".pdf";

    fs.readFile(filePath, function(err, file) {
        res.writeHead(200, { "Content-Type": "application/pdf" });
        res.write(file, "binary");
        res.end();
        fs.unlinkSync(filePath);
    });
};
conciliacionDetalleRegistro.prototype.post_sendMail = function(req, res, next) {
    var self = this;
    var params = [{ name: 'tipoParametro', value: 0, type: self.model.types.INT }];
    this.model.query('SEL_PARAMETROS_SP', params, function(error, result) {
        console.log(result[0].valor, 'result de ENVIOMAIL')
        console.log(error, 'error de ENVIOMAIL')

        // self.view.expositor(res, {
        //     error: error,
        //     result: result
        // });
        //req.body.nombreArchivo    
        var  nombreArchivo = req.body.nombreArchivo;
        var cuentaContable = req.body.cuentaContable;
        var nombreEmpresa = req.body.nombreEmpresa;
        var cuentaBancaria = req.body.cuentaBancaria;
        var nombreBanco = req.body.nombreBanco;
        var responsable = req.body.responsable;
        var object = {};   //Objeto que envía los parámetros
        var params = [];   //Referencia a la clase para callback    
        var files = [];
        var ruta = path.dirname(require.main.filename) + "\\pdf\\" + nombreArchivo + ".pdf";
        var extension = '.pdf';
        var carpeta = 'pdf'; 
        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');
        var transporter = nodemailer.createTransport(smtpTransport({
            host: '192.168.20.1',
            port: 25,
            secure: false,
            auth: {
                user: 'sistemas',
                pass: 's1st3m4s'
            },
            tls: { rejectUnauthorized: false }
        }));
        var mailOptions = {
            from: '<grupoandrade.reportes@grupoandrade.com.mx>', // sender address 
            to: result[2].valor, // list of receivers 
            subject: result[0].valor, // Subject line 
            text: result[1].valor, // plaintext body 
            html: '<b>' + result[1].valor + '</b><br/><br/><br/><b>Empresa: </b>' + nombreEmpresa + '<br/><b>Cuenta contable: </b>' + cuentaContable + '<br/><b>Banco: </b>'+ nombreBanco + '<br/><b>Cuenta bancaria: </b>'+ cuentaBancaria + '<br/><br/><b>Realizó: </b>' + responsable, // html body 
            attachments: [{ // file on disk as an attachment
                filename: req.body.nombreArchivo + '.pdf',
                path: ruta // stream this file
            }]
        };
        setTimeout(function() {
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    res.send(500);
                    console.log(error);
                } else {
                    res.send(200);
                    fs.stat(ruta, function(err, stats) {
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
        console.log(object.result)
        req.body = [];
    }); 
};
conciliacionDetalleRegistro.prototype.post_generaPunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
        { name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING },
        { name: 'cuentaBancaria', value: req.body.cuentaBancaria, type: self.model.types.STRING }
    ];

    this.model.query('UPD_GUARDAR_PUNTEO_FINAL_MES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = conciliacionDetalleRegistro;
