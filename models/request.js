var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	name: String,
	date: Object,
	state: String,
	grades: String,
	crag: String,
	style: String,
	contact: String,
	info: String,
	geo: Object
});

var Request = mongoose.model('request', requestSchema);
module.exports = Request;