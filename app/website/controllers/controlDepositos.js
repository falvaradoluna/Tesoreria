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
        { name: 'importeDocumento', value: req.query.importeDocumento, type: self.model.types.DECIMAL },
        { name: 'idTipoReferencia', value: req.query.idTipoReferencia, type: self.model.types.STRING },
        { name: 'depositoID', value: req.query.depositoID, type: self.model.types.INT},
        { name: 'idBanco', value: req.query.IDBanco, type: self.model.types.INT },
        { name: 'importeAplica', value: req.query.importeAplicar, type: self.model.types.DECIMAL },
        { name: 'importeBPRO', value: req.query.importeBPRO, type: self.model.types.DECIMAL }
    ];

    this.model.query('SEL_REFERENCIA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_createTempReference = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'bancoNumberID', value: req.query.bancoNumberID, type: self.model.types.INT },
        { name: 'bancoConsTableID', value: req.query.bancoConsTableID, type: self.model.types.INT },
        { name: 'referenciaID', value: req.query.referenciaID, type: self.model.types.INT },
        { name: 'carteraVencidaID', value: req.query.carteraVencidaID, type: self.model.types.INT },
        { name: 'referenciaTemporal', value: req.query.referenciaTemporal, type: self.model.types.STRING },
        { name: 'estatusID', value: req.query.estatusID, type: self.model.types.INT },
        { name: 'tipoReferenciaID', value: req.query.tipoReferenciaID, type: self.model.types.INT }

    ];

    this.model.query('INS_REFERENCIA_TEMP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_quitarDPI = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idCargoBanco', value: req.query.idCargoBanco, type: self.model.types.INT },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }

    ];

    this.model.query('INS_QUITAR_DPI_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_actualizacartera = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }

    ];
    
    this.model.query('CARTERAACTUALIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_seguridad = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    this.model.query('SEL_SEGURUDAD_SP', params, function(error, result) {
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
        { name: 'importeDocumento', value: req.query.importeDocumento, type: self.model.types.DECIMAL },
        { name: 'importeAplica', value: req.query.importeAplicar, type: self.model.types.DECIMAL },
        { name: 'importeBPRO', value: req.query.importeBPRO, type: self.model.types.DECIMAL }
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

    var params = [
        { name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    this.model.query('INS_APLICA_REFERENCIAS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_eliminarReferencia = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT }];

    this.model.query('DEL_REFERENCIA_TEMPORAL_SP', params, function(error, result) {
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


controlDepositos.prototype.get_clientById = function(req, res, next) {
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

    this.model.query('SEL_CLIENTE_ID_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_clientByName = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [{
        name: 'varBusqueda',
        value: req.query.clientName,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_CLIENTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_comisiones = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'fechaIni', value: req.query.fechaIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING }
    ];

    this.model.query('SEL_COMISIONES', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_comisionesIva = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [
        { name: 'idDepositoBanco', value: req.query.idDepositoBanco, type: self.model.types.STRING },
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT }
    ];

    this.model.query('SEL_COMISIONES_IVA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_interesComision = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'interesID', value: req.query.interesID, type: self.model.types.INT },
        { name: 'comisionID', value: req.query.comisionID, type: self.model.types.INT },
        { name: 'bancoID', value: req.query.bancoID, type: self.model.types.INT },
        { name: 'userID', value: req.query.userID, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'agrupador', value: req.query.agrupador, type: self.model.types.INT },
        { name: 'statusID', value: req.query.statusID, type: self.model.types.INT }
    ];

    this.model.query('[INS_INTERESCOMISION_SP]', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_agrupadorComision = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'esGrupo', value: req.query.esGrupo, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT }
    ];

    this.model.query('SEL_AGRUPADORCOMISIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_updAplicaComisiones = function(req, res, next) {
    var self = this;

    var params = [{ name: 'interesComisionID', value: req.query.interesComisionID, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    this.model.query('UPD_APLICACOMISIONES_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_updAplicaComisionesGrupo = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
                  { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT }];

    this.model.query('UPD_APLICACOMISIONESGRUPO_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};



controlDepositos.prototype.get_delInteresComision = function(req, res, next) {
    var self = this;

    var params = [{ name: 'interesComisionID', value: req.query.interesComisionID, type: self.model.types.INT }];

    this.model.query('DEL_INTERESCOMISION_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_delInteresComisionGrupo = function(req, res, next) {
    var self = this;

    var params = [{ name: 'agrupador', value: req.query.agrupador, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    this.model.query('DEL_INTERESCOMISION_GRUPO_SP', params, function(error, result) {
        
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_selInteresComision = function(req, res, next) {
    var self = this;

    var params = [{ name: 'Estatus', value: req.query.Estatus, type: self.model.types.INT },
                  { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
                  { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT }];

    this.model.query('SEL_INTERESCOMISION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};




controlDepositos.prototype.get_selInteresComisionDetalle = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idcomisionInteres', value: req.query.idcomisionInteres, type: self.model.types.STRING }];

    this.model.query('SEL_INTERESCOMISIONDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_insCxpComisionesInteres = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'interesComisionID', value: req.query.interesComisionID, type: self.model.types.STRING },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.STRING },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING },
        { name: 'esGrupo', value: req.query.esGrupo, type: self.model.types.INT }
    ];

    this.model.query('INS_CXPCOMISIONESINTERESES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_insInteresComisionDetalle = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'cuentacontable', value: req.query.cuentacontable, type: self.model.types.STRING },
        { name: 'concepto', value: req.query.concepto, type: self.model.types.STRING },
        { name: 'cargo', value: req.query.cargo, type: self.model.types.STRING },
        { name: 'abono', value: req.query.abono, type: self.model.types.STRING },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING },
        { name: 'idpersona', value: req.query.idpersona, type: self.model.types.STRING },
        { name: 'idcomisionesintereses', value: req.query.idcomisionesintereses, type: self.model.types.STRING },
        { name: 'tipodocumento', value: req.query.tipodocumento, type: self.model.types.STRING },
        { name: 'fechavencimiento', value: req.query.fechavencimiento, type: self.model.types.STRING },
        { name: 'poriva', value: req.query.poriva, type: self.model.types.STRING },
        { name: 'referencia', value: req.query.referencia, type: self.model.types.STRING },
        { name: 'banco', value: req.query.banco, type: self.model.types.STRING },
        { name: 'referenciabancaria', value: req.query.referenciabancaria, type: self.model.types.STRING },
        { name: 'conpoliza', value: req.query.conpoliza, type: self.model.types.STRING },
        { name: 'consecutivo', value: req.query.lastConsecutivo, type: self.model.types.STRING },
        { name: 'idSucursalAplica', value: req.query.idSucursalAplica, type: self.model.types.STRING }
    ];

    this.model.query('INS_CXPCOMISIONESINTERESESDET_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_insertaRefAntipag = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'bankTableName', value: req.query.bankTableName, type: self.model.types.STRING },
        { name: 'currentBase', value: req.query.currentBase, type: self.model.types.STRING }
    ];

    this.model.query('INS_REFANTIPAG', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_departamentoBpro = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT }
    ];

    this.model.query('SEL_DEPARTAMENTOBPRO_SP', params, function(error, result) {

        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_interes = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [
        { name: 'idBanco', value: req.query.idBanco, type: self.model.types.INT },
        { name: 'noCuenta', value: req.query.noCuenta, type: self.model.types.STRING },
        { name: 'fechaIni', value: req.query.fechaIni, type: self.model.types.STRING },
        { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING }
    ];

    this.model.query('SEL_INTERESES', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_cancelaComisionAplicada = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'Agrupador', value: req.query.Agrupador, type: self.model.types.INT }
    ];

    this.model.query('DEL_COMISIONAPLICADA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


controlDepositos.prototype.get_interesIva = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [{ name: 'idDepositoBanco', value: req.query.idDepositoBanco, type: self.model.types.STRING }];

    this.model.query('SEL_INTERESES_IVA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_interesIva = function(req, res, next) {
    var self = this;
    //asignación de valores mediante parámetros del request
    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }];

    this.model.query('SEL_INTERESES_IVA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_seguridad = function(req, res, next) {
    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];

    this.model.query('SEL_SEGURUDAD_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

controlDepositos.prototype.get_guardausuario = function(req, res, next) {
    var self = this;

    var params = [
        { name: 'idReferencia', value: req.query.idReferencia, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }
    ];

    this.model.query('INS_GUARDAUSUARIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = controlDepositos;