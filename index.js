var bodyparser = require('body-parser');
var express = require('express');
var jwt = require('express-jwt');

var courses = require('./routes/courses');
var professors = require('./routes/professors');
var groups = require('./routes/groups');
var institutions = require('./routes/institutions');
var ministries = require('./routes/ministries');
var students = require('./routes/students');

var port = 3000;
var app = express();

var jwtCheck = jwt({
	secret: new Buffer('Gsf23XaFgeIXxjKOt8hJ18ODyddubZNWHmuDlBuuiwOfKaOgsa1O6YWAadbtIkuM', 'base64'),
	audience: 'lHP3mrqgd5JYC2bnL6tF6w604DtIxjvj'
});

app.use(bodyparser.json());

//app.use('/api', jwtCheck);

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
