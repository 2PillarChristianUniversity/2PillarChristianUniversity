
var express = require('express');
var path = require('path');
var util = require('util'),
    jwt = require('express-jwt'),
    expressValidator = require('express-validator');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var courses = require('./routes/courses'),
    groups = require('./routes/groups'),
    professors = require('./routes/professors'),
    institutions = require('./routes/institutions'),
    ministries = require('./routes/ministries'),
    students = require('./routes/students'),
    semesters = require('./routes/semesters');
    financials = require('./routes/financials');
    grades = require('./routes/grades');
    admins = require('./routes/admins');

var port = Number(process.env.PORT || 3000);
var app = express();

// var jwtCheck = jwt({
// 	secret: new Buffer('Gsf23XaFgeIXxjKOt8hJ18ODyddubZNWHmuDlBuuiwOfKaOgsa1O6YWAadbtIkuM', 'base64'),
// 	audience: 'lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj'
// });

var jwtCheck = jwt({
    secret: new Buffer('uF28M9a41r8-s5ZL-Zc1yv1GYv_o7sOj-AKJyb480iyvnS-5MLS4sFQEs4UvV5s2', 'base64'),
    audience: '4f3JCR8Bp6PpNruh4WSrqGijapKol6m7'
});

app.use(cookieParser());

app.use(bodyParser.json());
app.use(expressValidator());
console.log();
// app.use('/api', jwtCheck);

app.use('/api', courses);
app.use('/api', groups);
app.use('/api', semesters);
app.use('/api', institutions);
app.use('/api', ministries);
app.use('/api', students);
app.use('/api', professors);
app.use('/api', financials);
app.use('/api', grades);
app.use('/api', admins);

app.use(express.static(__dirname + '/public'));

app.listen(port, function () {
	console.log('Running on port ' + port);
});
