var ConciliacionView = require('../views/reference'),
    ConciliacionModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');

var Conciliacion = function (conf) {
    this.conf = conf || {};

    this.view = new ConciliacionView();
    this.model = new ConciliacionModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Conciliacion.prototype.get_abonoContable = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },                  
                  { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
                  { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
                  { name: 'opcion', value: req.query.opcion, type: self.model.types.INT },
                  { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
                  { name: 'polizaPago', value: req.query.polizaPago, type: self.model.types.STRING },
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING }
                  ];

    this.model.query('SEL_ABONO_CONTABLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Conciliacion.prototype.get_cargoContable = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },                  
                  { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
                  { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
                  { name: 'opcion', value: req.query.opcion, type: self.model.types.INT },
                  { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING}];
                  
    /*var params = [{ name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
                  { name: 'noCuenta', value: req.body.noCuenta, type: self.model.types.STRING },
                  { name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING},
                  { name: 'opcion', value: req.body.opcion, type: self.model.types.INT}];              */

    this.model.query('SEL_CARGO_CONTABLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Conciliacion.prototype.get_abonoBancario = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },                  
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
        { name: 'opcion', value: req.query.opcion, type: self.model.types.INT },
        { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING }
    ];
                  
    this.model.query('SEL_ABONO_BANCARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Conciliacion.prototype.get_cargoBancario = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },                  
                  { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
                  { name: 'cuentaContable', value: req.query.cuentaContable, type: self.model.types.STRING },
                  { name: 'opcion', value: req.query.opcion, type: self.model.types.INT },
                  { name: 'fechaElaboracion', value: req.query.fechaElaboracion, type: self.model.types.STRING },
                  { name: 'fechaCorte', value: req.query.fechaCorte, type: self.model.types.STRING }];

    /*var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },                  
                  { name: 'fInicial', value: req.query.fInicial, type: self.model.types.STRING },
                  { name: 'fFinal', value: req.query.fFinal, type: self.model.types.STRING },
                  { name: 'opcion', value: req.query.opcion, type: self.model.types.INT }];*/

    this.model.query('SEL_CARGO_BANCARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Conciliacion.prototype.get_depositosPendientes = function(req, res, next) {
    

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },                  
                  { name: 'idEstatus', value: req.query.idEstatus, type: self.model.types.INT },
                  { name: 'idTipoAuxiliar', value: req.query.idTipoAuxiliar, type: self.model.types.INT },
                  { name: 'idDepositoBanco', value: req.query.idDepositoBanco, type: self.model.types.INT}];

    this.model.query('INS_DEPOSITOS_PENDIENTES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Conciliacion;