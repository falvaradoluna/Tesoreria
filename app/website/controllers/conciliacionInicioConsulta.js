var conciliacionInicioConsultaView = require('../views/reference'),
    conciliacionInicioConsultaModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var http = require('http');
var fs = require('fs');
var JSZip = require("jszip");
var zip = new JSZip();


var conciliacionInicioConsulta = function (conf) {
    this.conf = conf || {};

    this.view = new conciliacionInicioConsultaView();
    this.model = new conciliacionInicioConsultaModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


//LQMA 27022017 add obtiene totales de abonos y cargos no relacionados
conciliacionInicioConsulta.prototype.post_totalAbonoCargo = function (req, res, next) {

    var self = this;

    var params = [{ name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
    { name: 'noCuenta', value: req.body.noCuenta, type: self.model.types.STRING },
    { name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING },
    { name: 'fechaElaboracion', value: req.body.fechaElaboracion, type: self.model.types.STRING },
    { name: 'fechaCorte', value: req.body.fechaCorte, type: self.model.types.STRING },
    { name: 'polizaPago', value: req.body.polizaPago, type: self.model.types.STRING },
    { name: 'opcion', value: req.body.opcion, type: self.model.types.INT },
    { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
    { name: 'opcion', value: req.body.opcion, type: self.model.types.INT },
    { name: 'tipoReporte', value: req.body.tipoReporte, type: self.model.types.INT } //LQMA ADD 06032018
    ];
    
    this.model.query('SEL_TOTAL_ABONOCARGO_SP_H', params, function (error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


//LQMA 27022017 add obtiene totales de abonos y cargos no relacionados
conciliacionInicioConsulta.prototype.get_gerenteContador = function (req, res, next) {


    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    this.model.query('SEL_GERENTE_CONTADOR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

//LAGP 
//../historico
conciliacionInicioConsulta.prototype.get_historico = function (req, res, next) {
    var self = this;
    var idUsuario = req.query.idUsuario;
    var idBanco = req.query.idBanco;
    var idEmpresa = req.query.idEmpresa;
    var cuentaContable = req.query.cuentaContable;
    var cuentaBancaria = req.query.cuentaBancaria;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    self.view.expositor(res, {
        
        result: "LLegue we"
    });
    // this.model.query('SEL_GERENTE_CONTADOR_SP', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });
};

//Ing. LAGP03052018
//api/meses
conciliacionInicioConsulta.prototype.get_meses = function(req, res, next) {
    
    var self = this;
    var params = [];

    this.model.query('SEL_MESES_ACTIVOS_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = conciliacionInicioConsulta;
