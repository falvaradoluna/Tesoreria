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
        { name: 'idPadre', value: req.body.idPadre, type: self.model.types.INT },
        { name: 'idOpcion', value: req.body.idOpcion, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
        { name: 'tipoPunteo', value: req.body.tipoPunteo, type: self.model.types.INT}
    ];

    this.model.query('INS_PUNTEO_DEPOSITO_AUXILIAR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.post_insertPunteoBancoAC = function(req, res, next) {
 var self = this;

 var params = [ { name: 'idDepositoBanco', value: req.body.idDepositoBanco, type: self.model.types.INT },
                { name: 'idAuxiliarContable', value: req.body.idAuxiliarContable, type: self.model.types.INT },
                { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
                { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
                { name: 'idPadre', value: req.body.idPadre, type: self.model.types.INT },
                { name: 'idOpcion', value: req.body.idOpcion, type: self.model.types.INT},
                { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
                { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
                { name: 'tipoPunteo', value: req.body.tipoPunteo, type: self.model.types.INT}
              ];

       this.model.query('INS_PUNTEO_DEPOSITO_AUXILIAR_SP', params, function(error, result){
       self.view.expositor(res,{
           error: error,
           result: result  
       });
     });
};


conciliacionDetalleRegistro.prototype.get_auxiliarPunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
                  { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
                  { name: 'fechaelaboracion', value: req.query.fechaInicio, type: self.model.types.STRING },
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING }
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
                  { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.STRING },
                  { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
                  { name: 'fechaelaboracion', value: req.query.fechaInicio, type: self.model.types.STRING },
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING }
    ];
    

    this.model.query('SEL_PUNTEO_DEPOSITOS_PADRES_SP', params, function(error, result) {
        

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.get_bancoDPI = function(req, res, next) {

    var self = this;


    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: req.query.cuentaBancaria, type: self.model.types.STRING }
    ];

    this.model.query('SEL_DEPOSITOSDPI', params, function(error, result) {


        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



conciliacionDetalleRegistro.prototype.post_eliminarPunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idDatoBusqueda', value: req.body.idDatoBusqueda, type: self.model.types.INT },
                  { name: 'opcion', value: req.body.opcion, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
                  { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT }

                  ];

    this.model.query('DEL_PUNTEO_AUXILIAR_DEPOSITO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.post_detallePunteo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idDatoBusqueda', value: req.body.idPunteoAuxiliarBanco, type: self.model.types.INT },
                   {name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
                   {name: 'noCuenta', value: req.body.noCuenta, type: self.model.types.INT },
                   {name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING },
                   {name: 'accionBusqueda', value: req.body.accionBusqueda, type: self.model.types.INT }
                   ];

    this.model.queryAllRecordSet('SEL_PUNTEO_AUXILIAR_DEPOSITO_DETALLES_SP', params, function(error, result) {
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
        

           
        var nombreArchivo = req.body.nombreArchivo;
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
            html: '<b>' + result[1].valor + '</b><br/><br/><br/><b>Empresa: </b>' + nombreEmpresa + '<br/><b>Cuenta contable: </b>' + cuentaContable + '<br/><b>Banco: </b>'+ nombreBanco + '<br/><b>Cuenta bancaria: </b>'+ cuentaBancaria + '<br/><br/><b>Realizó: </b>' + responsable, // html body 
            attachments: [{ // file on disk as an attachment
                filename: nombreArchivo + '.pdf',
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


conciliacionDetalleRegistro.prototype.post_insertDPI = function(req,res,next) {
   var self = this;

   var params = [ {name: 'idAbonoBanco', value: req.body.idAbonoBanco, type: self.model.types.INT},
                  {name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT},
                  {name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT},
                  {name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT}
                ];

                    	

   this.model.query('UPD_AUXILIARDEPOSITO_DPI_SP', params, function(error,result){
    self.view.expositor(res,{
        error: error,
        result: result
        });
   });
   
};


conciliacionDetalleRegistro.prototype.get_bancoReferenciado = function(req, res, next) {

    var self = this;


    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
                  { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING},
                  { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING},
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING},
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT}
                 ];

        this.model.query('SEL_REG_BANCOS_REFERENCIADOS', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.get_contableReferenciado = function(req, res,next){
  var self = this;
  var params =[{name: 'numCuenta', value: req.query.cuentaContable, type: self.model.types.STRING},
               {name: 'cuentaBancaria', value: req.query.cuentaBanco, type: self.model.types.STRING},
               {name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING},
               {name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING},
               {name: 'polizaPago', value: req.query.polizaPago, type: self.model.types.STRING},
               {name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT},
               {name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT}
              ];
  this.model.query('SEL_REG_CONTABLES_REF', params, function(error, result){
       self.view.expositor(res,{
            error: error,
            result: result
       });
  });
};

conciliacionDetalleRegistro.prototype.get_detalleRelacionBancos = function(req, res, next){
var self = this;
var params =[{name: 'referenciaAmpliada', value: req.query.ReferenciaAmpliada ,type: self.model.types.STRING},
             {name: 'tipoDato', value: req.query.TipoRegistro ,type: self.model.types.STRING},
             {name: 'idEmpresa', value: req.query.idEmpresa ,type: self.model.types.INT},
             {name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING},
             {name: 'fecha', value: req.query.fecha, type: self.model.types.STRING},
             {name: 'polizaPago', value: req.query.polizaPago, type: self.model.types.STRING},
             {name: 'noCuenta', value: req.query.cuentaBanco, type: self.model.types.STRING},
             {name: 'idRegistroBanco', value: req.query.idRegistroBancario, type: self.model.types.INT}
            ];
    this.model.query('SEL_RELACION_REG_BANCOS_REF_SP', params, function(error, result){
     self.view.expositor(res,{
         error: error,
         result: result
       });
    });
};

module.exports = conciliacionDetalleRegistro;
