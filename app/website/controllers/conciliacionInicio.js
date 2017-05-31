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
conciliacionInicio.prototype.post_totalAbonoCargo = function(req, res, next) {

    console.log('entro a post_totalAbonoCargo')
    console.log('idBanco',req.body.idBanco)
    console.log('idEmpresa',req.body.idEmpresa)
    console.log('noCuenta',req.body.noCuenta)
    console.log('cuentaContable',req.body.cuentaContable)
    console.log('opcion',req.body.opcion)

    var self = this;

    var params = [{ name: 'idBanco', value: req.body.idBanco, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
                  { name: 'noCuenta', value: req.body.noCuenta, type: self.model.types.STRING },
                  { name: 'cuentaContable', value: req.body.cuentaContable, type: self.model.types.STRING},
                  { name: 'opcion', value: req.body.opcion, type: self.model.types.INT}];

    this.model.query('SEL_TOTAL_ABONOCARGO_SP', params, function(error, result) {

        console.log('error')
            console.log(error)
        console.log(result)    

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


//LQMA 27022017 add obtiene totales de abonos y cargos no relacionados
conciliacionInicio.prototype.get_gerenteContador = function(req, res, next) {

    console.log('entro a get_gerenteContador')
    console.log(req.query)

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    this.model.query('SEL_GERENTE_CONTADOR_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = conciliacionInicio;
