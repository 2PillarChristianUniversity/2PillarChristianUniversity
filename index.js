
var util = require('util'),
    express = require('express'),
    bodyparser = require('body-parser'),
    jwt = require('express-jwt'),
    expressValidator = require('express-validator');

var courses = require('./routes/courses'),
    groups = require('./routes/groups'),
    professors = require('./routes/professors'),
    institutions = require('./routes/institutions'),
    ministries = require('./routes/ministries'),
    students = require('./routes/students');
// var debug = require('debug')('app4');

var port = 3000;
var app = express();

var jwtCheck = jwt({
	secret: new Buffer('Gsf23XaFgeIXxjKOt8hJ18ODyddubZNWHmuDlBuuiwOfKaOgsa1O6YWAadbtIkuM', 'base64'),
	audience: 'lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj'
});

app.use(bodyparser.json());
app.use(expressValidator());
app.use('/api', jwtCheck);

app.use('/api', courses);
app.use('/api', groups);
app.use('/api', institutions);
app.use('/api', ministries);
app.use('/api', students);
app.use('/api', professors);

app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
	console.log('Running on port ' + port);
});
