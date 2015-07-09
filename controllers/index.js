var Request = require('../models/request.js');
var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	templates: function(req, res){
		res.render('templates/' + req.params.templateName);
	},
	addRequest: function(req, res){
		
		var request = new Request(req.body);
		// console.log(request);
		request.save(function(err, result){
			res.send(result);
		});
	},
	getAll : function(req, res){
		Request.find({}, function(err, results){	
			res.send(results);
		});
	},
	deleteRequest: function(req, res){
		Request.findByIdAndRemove(req.params.requestId, req.body, function(err, results){
			res.send(results);			
		});
	},
	update: function(req, res){
		console.log(req.body);
		Request.findByIdAndUpdate(req.params.requestId, {geo: req.body}, function(err, results){
			res.send(results);
		});
	}


};

module.exports = indexController;