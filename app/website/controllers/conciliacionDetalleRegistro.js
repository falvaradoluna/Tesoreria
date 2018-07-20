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
var soap = require('soap');
var parseString = require('xml2js').parseString;

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
        { name: 'tipoPunteo', value: req.body.tipoPunteo, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
        { name: 'esCargoBanco', value: req.body.esCargoBanco, type: self.model.types.INT }, //LQMA 01042018
        { name: 'esCargoContable', value: req.body.esCargoContable, type: self.model.types.INT } //LQMA 01042018
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

    var params = [{ name: 'idDepositoBanco', value: req.body.idDepositoBanco, type: self.model.types.INT },
        { name: 'idAuxiliarContable', value: req.body.idAuxiliarContable, type: self.model.types.INT },
        { name: 'descripcion', value: req.body.descripcion, type: self.model.types.STRING },
        { name: 'idEstatus', value: req.body.idEstatus, type: self.model.types.INT },
        { name: 'idPadre', value: req.body.idPadre, type: self.model.types.INT },
        { name: 'idOpcion', value: req.body.idOpcion, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
        { name: 'tipoPunteo', value: req.body.tipoPunteo, type: self.model.types.INT },
        { name: 'idBmerPadre', value: req.body.idBmerPadre, type: self.model.types.INT }, //LQMA add 10032018
        { name: 'esCargoBanco', value: req.body.esCargoBanco, type: self.model.types.INT }, //LQMA 01042018
        { name: 'esCargoContable', value: req.body.esCargoContable, type: self.model.types.INT } //LQMA 01042018
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
//Luis Anotnio Garcia Perrusquia
conciliacionDetalleRegistro.prototype.get_bancoPunteo = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'rpun_idAplicado', value: req.query.rpun_idAplicado, type: self.model.types.INT }
    ];
    
    this.model.queryAllRecordSet('[DBO].[SEL_PUNTEO_DETALLE_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.get_bancoDPI = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idMes', value: req.query.idMes, type: self.model.types.INT }
    ];
    console.log( 'paramsDPI', params );
    this.model.query('SEL_DEPOSITOSDPI', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.post_eliminarPunteo = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'grupo', value: req.body.idDatoBusqueda, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[DEL_PUNTEO_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.post_detallePunteo = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'grupo', value: req.body.grupo, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('[dbo].[SEL_PUNTEO_DETALLE_GRUPO_SP]', params, function(error, result) {

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



        var  nombreArchivo = req.body.nombreArchivo;
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
// Luis Antonio Garcia Perrusquia
conciliacionDetalleRegistro.prototype.post_generaPunteo = function(req, res, next) {

    var self = this;

    var params = [];

    this.model.query('[dbo].[UPD_PUNTEO_APLICAR_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


conciliacionDetalleRegistro.prototype.post_insertDPI = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idAbonoBanco', value: req.body.idAbonoBanco, type: self.model.types.INT },
        { name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.INT },
        { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT }
    ];

    this.model.query('UPD_AUXILIARDEPOSITO_DPI_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


conciliacionDetalleRegistro.prototype.get_bancoReferenciado = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];

    this.model.query('SEL_REG_BANCOS_REFERENCIADOS', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.get_contableReferenciado = function(req, res, next) {
    var self = this;
    var params = [{ name: 'numCuenta', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'cuentaBancaria', value: req.query.cuentaBanco, type: self.model.types.STRING },
        { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
        { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago', value: req.query.polizaPago, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT }
    ];
    this.model.query('SEL_REG_CONTABLES_REF', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.get_detalleRelacionBancos = function(req, res, next) {
    var self = this;
    var params = [{ name: 'referenciaAmpliada', value: req.query.ReferenciaAmpliada, type: self.model.types.STRING },
        { name: 'tipoDato', value: req.query.TipoRegistro, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
        { name: 'polizaPago', value: req.query.polizaPago, type: self.model.types.STRING },
        { name: 'noCuenta', value: req.query.cuentaBanco, type: self.model.types.STRING },
        { name: 'idRegistroBanco', value: req.query.idRegistroBancario, type: self.model.types.INT }
    ];

    this.model.query('SEL_RELACION_REG_BANCOS_REF_SP', params, function(error, result) {
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
conciliacionDetalleRegistro.prototype.get_detalleRegistroAbono = function(req, res, next) {

    var self = this;
    var idAbono = req.query.idAbono;

    var params = [{ name: 'idAbono', value: idAbono, type: self.model.types.INT }];

    this.model.queryAllRecordSet('[dbo].[SEL_DOC_PAG_BY_ABONO_ID_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/registrosBancariosCargos
 */
conciliacionDetalleRegistro.prototype.get_registrosBancariosCargos = function(req, res, next) {

    var self = this;

    var params = [];

    this.model.query('[dbo].[SEL_ALL_CARGOS_BANCARIO]', params, function(error, result) {

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
conciliacionDetalleRegistro.prototype.get_detalleRegistrosBancariosCargos = function(req, res, next) {

    var self = this;
    var idCargo = req.query.idCargo;

    var params = [{ name: 'idCargo', value: idCargo, type: self.model.types.INT }];

    this.model.query('[dbo].[SEL_DOC_PAG_BY_CARGO_ID_SP]', params, function(error, result) {

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
conciliacionDetalleRegistro.prototype.get_detalleRegistrosBancariosAbonos = function(req, res, next) {

    var self = this;
    var idAbono = req.query.idAbono;

    var params = [{ name: 'IDABONOSBANCOS', value: idAbono, type: self.model.types.INT }];

    this.model.queryAllRecordSet('[dbo].[SEL_CONCILIADOS_ABONOBAN_CARGOCON_SP]', params, function(error, result) {

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
conciliacionDetalleRegistro.prototype.get_detalleRegistrosContablesAbonos = function(req, res, next) {

    var self = this;
    var idAuxiliar = req.query.idAuxiliar;

    var params = [{ name: 'IDCARGOS_COMPLETO', value: idAuxiliar, type: self.model.types.INT }];

    this.model.queryAllRecordSet('[dbo].[SEL_CONCILIADOS_CARGOCON_ABONOBAN_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/totalUniverso
 */
conciliacionDetalleRegistro.prototype.get_totalUniverso = function(req, res, next) {

    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idBanco = req.query.idBanco;
    var noCuenta = req.query.noCuenta;
    var cuentaContable = req.query.cuentaContable;
    var fechaElaboracion = req.query.fechaElaboracion;
    var fechaCorte = req.query.fechaCorte;
    var polizaPago = req.query.polizaPago;
    var opcion = req.query.opcion;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte', value: fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago', value: polizaPago, type: self.model.types.STRING },
        { name: 'opcion', value: opcion, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_CONTABLE_TODO_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

/** 
 * ING. LAGP
 * api/conciliacionDetalleRegistro/totalUniversoBancario
 */
conciliacionDetalleRegistro.prototype.get_totalUniversoBancario = function(req, res, next) {

    var self = this;
    var idEmpresa = req.query.idEmpresa;
    var idBanco = req.query.idBanco;
    var noCuenta = req.query.noCuenta;
    var cuentaContable = req.query.cuentaContable;
    var fechaElaboracion = req.query.fechaElaboracion;
    var fechaCorte = req.query.fechaCorte;
    var polizaPago = req.query.polizaPago;
    var opcion = req.query.opcion;
    var idUsuario = req.query.idUsuario;

    var params = [
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte', value: fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago', value: polizaPago, type: self.model.types.STRING },
        { name: 'opcion', value: opcion, type: self.model.types.INT },
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT }
    ];

    this.model.query('[dbo].[SEL_BANCARIO_TODO_SP]', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

//../guardarHistorico
conciliacionDetalleRegistro.prototype.get_guardarHistorico = function(req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var idBanco = req.query.idBanco;
    var idEmpresa = req.query.idEmpresa;
    var cuentaBancaria = req.query.cuentaBancaria;
    var cuentaContable = req.query.cuentaContable;
    var fechaElaboracion = req.query.fechaElaboracion;
    var fechaCorte = req.query.fechaCorte;
    var polizaPago = req.query.polizaPago;
    var opcion = req.query.opcion;

    var params = [
        { name: 'idUsuario', value: idUsuario, type: self.model.types.INT },
        { name: 'idBanco', value: idBanco, type: self.model.types.INT },
        { name: 'idEmpresa', value: idEmpresa, type: self.model.types.INT },
        { name: 'cuentaBancaria', value: cuentaBancaria, type: self.model.types.STRING },
        { name: 'cuentaContable', value: cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte', value: fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago', value: polizaPago, type: self.model.types.STRING },
        { name: 'opcion', value: opcion, type: self.model.types.INT },
    ];

    this.model.queryAllRecordSet('INS_GUARDAHISTORICO_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionDetalleRegistro.prototype.post_cancelaDPI = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'rpun_grupoPunteo', value: req.body.grupo, type: self.model.types.INT },
        { name: 'usuario', value: req.body.usuario, type: self.model.types.INT }
    ];

    this.model.queryAllRecordSet('CancelarDPI_INS', params, function(error, result) {
        self.view.expositor(res, {

            error: error,
            result: result
        });
    });
};
conciliacionDetalleRegistro.prototype.get_archivoPdf = function(req, res, next) {
    var self = this;
    console.log(req.body);

    var url = this.conf.parameters.WSDetallePoliza;
    if (req.query.tipo && req.query.anio && req.query.mes && req.query.folio && req.query.idEmpresa) {
        var args = {
            PolTipo: req.query.tipo,
            PolAnio: req.query.anio,
            PolMes: req.query.mes,
            PolNo: req.query.folio,
            Empresa: req.query.idEmpresa

        };
        soap.createClient(url, function(err, client) {

            if (err) {
                console.log('Error 4', err)

                self.view.expositor(res, {
                    mensaje: "Hubo un problema intente de nuevo",
                });
            } else {

                client.GeneraPdfPolizaCompra(args, function(err, result, raw) {
                    if (err) {


                        self.view.expositor(res, {
                            mensaje: "Hubo un problema intente de nuevo",
                        });
                    } else {

                        parseString(raw, function(err, result) {
                            if (err) {


                                self.view.expositor(res, {
                                    mensaje: "Hubo un problema intente de nuevo",
                                });
                            } else {

                                var arrayBits = result["soap:Envelope"]["soap:Body"][0]["GeneraPdfPolizaCompraResponse"][0]["GeneraPdfPolizaCompraResult"][0];
                                self.view.expositor(res, {
                                    //mensaje: mensaje,
                                    result: {
                                        arrayBits: arrayBits
                                    }
                                });
                            }
                        });
                    }

                });
            }
        });
    } else {

        self.view.expositor(res, {
            mensaje: "Hubo un problema intente de nuevo",
        });
    }

}
module.exports = conciliacionDetalleRegistro;