var controlDepositosView = require('../views/reference'),
    controlDepositosModel = require('../models/dataAccess'),
    moment = require('moment');
var phantom = require('phantom');
var path = require('path');
var webPage = require('webpage');
var request = require('request');


var controlDepositos = function(conf) {
    this.conf = conf || {};

    this.view = new controlDepositosView();
    this.model = new controlDepositosModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};




controlDepositos.prototype.get_createReference = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT },
        { name: 'idTipoDocumento', value: req.query.idTipoDocumento, type: self.model.types.INT },
        { name: 'serie', value: req.query.serie, type: self.model.types.STRING },
        { name: 'folio', value: req.query.folio, type: self.model.types.STRING },
        { name: 'idCliente', value: req.query.idCliente, type: self.model.types.INT },
        { name: 'idAlma', value: req.query.idAlma, type: self.model.types.STRING },
        { name: 'importeDocumento', value: req.query.importeDocumento, type: self.model.types.INT },
        { name: 'idTipoReferencia', value: req.query.idTipoReferencia, type: self.model.types.STRING }
    ];

    this.model.query('SEL_REFERENCIA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_insertReferenceDetails = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idDepartamento', value: req.query.idDepartamento, type: self.model.types.INT },
        { name: 'idTipoDocumento', value: req.query.idTipoDocumento, type: self.model.types.INT },
        { name: 'serie', value: req.query.serie, type: self.model.types.STRING },
        { name: 'folio', value: req.query.folio, type: self.model.types.STRING },
        { name: 'idCliente', value: req.query.idCliente, type: self.model.types.INT },
        { name: 'idAlma', value: req.query.idAlma, type: self.model.types.STRING },
        { name: 'importeDocumento', value: req.query.importeDocumento, type: self.model.types.DECIMAL }
    ];



    this.model.query('INS_DETALLE_REFERENCIA_LOTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};



controlDepositos.prototype.get_testApi = function(req, res, next) {

    //get utiliza params y lo recibe req.query ---> req.query.val1
    //post utiliza data y lo recibe req.body ---> req.body.val1    

    var self = this;

    var params = [
        { name: 'valorUno', value: req.query.val1, type: self.model.types.INT },
        { name: 'valorDos', value: req.query.val2, type: self.model.types.STRING }
    ];

    this.model.query('SEL_TEST_API', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};



controlDepositos.prototype.get_pendingReference = function(req, res, next) {

    var self = this;

    var params = [];

    this.model.query('SEL_CONTROLD_DEPOSITOS_PENDIENTES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


controlDepositos.prototype.get_pendingReferenceDetails = function(req, res, next) {



    var self = this;

    var params = [{ name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }];

    this.model.query('SEL_CONTROLD_DEPOSITOS_PENDIENTES_DETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


controlDepositos.prototype.get_applyReference = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }];

    this.model.query('INS_APLICA_REFERENCIAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


controlDepositos.prototype.get_setObservation = function(req, res, next) {

    var self = this;


    var params = [
        { name: 'idDepositoBanco', value: req.query.idDepositoBanco, type: self.model.types.INT },
        { name: 'observacion', value: req.query.observacion, type: self.model.types.STRING }
    ];

    this.model.query('UPD_OBSEVACION_DEPOSITO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};



controlDepositos.prototype.get_setReferencia = function(req, res, next) {

    var self = this;

    var params = [
        { name: 'idDepositoBanco', value: req.query.idDepositoBanco, type: self.model.types.INT },
        { name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }
    ];

    this.model.query('UPD_DEPOSITO_REFERENCIA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


controlDepositos.prototype.get_updCarteraVencidaReferencia = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }];

    this.model.query('UPD_CARTERA_VENCIDA_REFERENCIA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};

controlDepositos.prototype.get_delReferenciaGenerada = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }];

    this.model.query('DEL_REFERENCIA_GENERADA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });

};


controlDepositos.prototype.get_clientById = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [{
        name: 'idBusqueda',
        value: req.query.idBusqueda,
        type: self.model.types.INT
    }];

    this.model.query('SEL_CLIENTE_ID_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_clientByName = function (req, res, next) {

    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [{
        name: 'varBusqueda',
        value: req.query.clientName,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_CLIENTE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};




module.exports = controlDepositos;
