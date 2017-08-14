var excelExportView = require('../views/reference'),
    excelExportModel = require('../models/dataAccess');


var excelExport = function (conf) {
    this.conf = conf || {};

    this.view = new excelExportView();
    this.model = new excelExportModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

excelExport.prototype.get_insExcel = function(req,res,next){
	var self = this;

	var params = [{name: "idBmer", value: req.query.idBmer, type: self.model.types.STRING},
		         {name: "IdBanco", value: req.query.IdBanco, type: self.model.types.STRING},
		         {name: "txtOrigen", value: req.query.txtOrigen, type: self.model.types.STRING},
		         {name: "registro", value: req.query.registro, type: self.model.types.STRING},
		         {name: "noMovimiento", value: req.query.noMovimiento, type: self.model.types.STRING},
		         {name: "referencia", value: req.query.referencia, type: self.model.types.STRING},
		         {name: "concepto", value: req.query.concepto, type: self.model.types.STRING}
	        ];


    this.model.query('INS_EXCEL_DATA', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = excelExport;