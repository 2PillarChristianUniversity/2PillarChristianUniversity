var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var crypto = require('crypto');
var bodyparser = require('body-parser');
var autoIncrement = require("mongodb-autoincrement");

var URL_ROOT = 'http://localhost:3000';

function createAutoId(index) {
	var number = 6;
	return Array(number-String(index).length+1).join('0')+index;
}

describe('Group API', function () {
	var server;

	before(function () {
		mongo.connect('mongodb://127.0.0.1:27017/pillarseminary', function (err, db) {
			var colName = 'Students';
			db.collection(colName, {strict:true}, function(err, collection) {
				if(err != null) {
					studentsCol._id = createAutoId(1);
					db.collection(colName).createIndex( { "email": 1 }, { unique: true } )
					db.collection(colName).insert(studentsCol, function (err, results) {
						assert.equal(null, err);
						console.log(err);
					});
				}
				autoIncrement.getNextSequence(db, colName, function (err, autoIndex) {
					studentsCol._id = createAutoId(autoIndex);
					db.collection(colName).insert(studentsCol, function (err, results) {
						assert.equal(null, err);
						console.log(err);
					});
				});
			});
		});

		var app = express();
		var students = require('./routes/students');

		app.use(bodyparser.json());

		app.use('/api', students);

		server = app.listen(3000);
	});

	after(function () {
		server.close();
	});


	var studentsCol =
	{
		email: "user1@domain.com",
		firstName: "John",
		middleName: "Y",
		lastName: "Doe",
		birthDate: "1990-02-23",
		gender: "M",
		phoneNumber: "555-555-5555",
	};

	it('can load a group by ID', function (done) {
		var url = URL_ROOT + '/api/group/id/Administrators';
		superagent.get(url, function (error, res) {
			done();
		});
	});
})
