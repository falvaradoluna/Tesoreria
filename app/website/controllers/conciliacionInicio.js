var conciliacionInicioView = require('../views/reference'),
    conciliacionInicioModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');
var http = require('http');
var fs = require('fs');
var JSZip = require("jszip");
var zip = new JSZip();


var conciliacionInicio = function(conf) {
    this.conf = conf || {};

    this.view = new conciliacionInicioView();
    this.model = new conciliacionInicioModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


//LQMA 27022017 add obtiene totales de abonos y cargos no relacionados
conciliacionInicio.prototype.post_totalAbonoCargo = function (req, res, next) {

    var self = this;

    var params = [
        { name: 'idBanco',          value: req.body.idBanco, type: self.model.types.INT },
        { name: 'idEmpresa',        value: req.body.idEmpresa, type: self.model.types.STRING },
        { name: 'noCuenta',         value: req.body.noCuenta, type: self.model.types.STRING },
        { name: 'cuentaContable',   value: req.body.cuentaContable, type: self.model.types.STRING },
        { name: 'fechaElaboracion', value: req.body.fechaElaboracion, type: self.model.types.STRING },
        { name: 'fechaCorte',       value: req.body.fechaCorte, type: self.model.types.STRING },
        { name: 'polizaPago',       value: req.body.polizaPago, type: self.model.types.STRING },
        { name: 'opcion',           value: req.body.opcion, type: self.model.types.INT },
        { name: 'idUsuario',        value: req.body.idUsuario, type: self.model.types.INT }, //LQMA ADD 06032018
        { name: 'idHistorico',      value: 0, type: self.model.types.INT } //LQMA ADD 06032018
    ];
    console.log( 'paramsJunio', params );
    this.model.query('SEL_TOTAL_ABONOCARGO_SP', params, function (error, result) {
        console.log( 'result', result );
        console.log( 'error', error );
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


//LQMA 27022017 add obtiene totales de abonos y cargos no relacionados
conciliacionInicio.prototype.get_gerenteContador = function(req, res, next) {
    

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idUsuario, type: self.model.types.INT }
                 ];

    this.model.query('SEL_GERENTE_CONTADOR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
//Ing. LAGP03052018
//api/meses
conciliacionInicio.prototype.get_meses = function(req, res, next) {
    
    var self = this;
    var params = [];

    this.model.query('SEL_MESES_ACTIVOS_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

//Ing. LAGP05062018
//api/ultimoMes
conciliacionInicio.prototype.get_ultimoMes = function(req, res, next) {
    
    var self = this;
    var params = [
        { name: 'anio', value: req.query.anio, type: self.model.types.INT }
    ];
    
    this.model.query('[dbo].[SEL_ULTIMO_MES_ABIERTO]', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

//Ing. LAGP06062018
//api/closeMes
conciliacionInicio.prototype.get_closeMes = function(req, res, next) {
    
    var self = this;
    var params = [
    ];
    console.log( 'AQUI EN PERRO' );
    this.model.query('[dbo].[INS_NUEVO_MES_SP]', params, function(error, result) {
        console.log( 'result', result );
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

conciliacionInicio.prototype.get_addMovimientoBancario = function(req, res, next) {
    var self = this;

    var params = [
                    { name: 'referencia',       value: req.query.referencia,      type: self.model.types.STRING },
                    { name: 'concepto',         value: req.query.concepto,        type: self.model.types.STRING },
                    { name: 'refAmpliada',      value: req.query.refAmpliada,     type: self.model.types.STRING },
                    { name: 'noCuenta',         value: req.query.noCuenta,        type: self.model.types.STRING },
                    { name: 'esCargo',          value: req.query.esCargo,         type: self.model.types.INT },
                    { name: 'importe',          value: req.query.importe,         type: self.model.types.STRING },
                    { name: 'fechaOperacion',   value: req.query.fechaOperacion,  type: self.model.types.STRING },
                    { name: 'idUsuario',        value: req.query.idUsuario,       type: self.model.types.INT },
                    { name: 'idEmpresa',        value: req.query.idEmpresa,       type: self.model.types.INT },
                    { name: 'idBanco',          value: req.query.idBanco,         type: self.model.types.INT },
                    { name: 'anio',             value: req.query.anio,            type: self.model.types.INT }
                 ];

    this.model.query('[dbo].[INT_CONCILIACION_ADDBANCOS_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result[0]
        });
    });
};

module.exports = conciliacionInicio;
