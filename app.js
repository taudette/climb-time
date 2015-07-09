var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var mongoose = require('mongoose');
//allows you to use mongolab if truthy, if not use localhost
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/final');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
//need to serve up static 
app.use(express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', indexController.index);
app.get('/templates/:templateName', indexController.templates);
app.post('/api', indexController.addRequest);
app.get('/api', indexController.getAll);
app.delete('/api/:requestId', indexController.deleteRequest);
app.put('/api/:requestId', indexController.update);
var server = app.listen(process.env.PORT || 3735, function() {
	console.log('Express server listening on port ' + server.address().port);
});
