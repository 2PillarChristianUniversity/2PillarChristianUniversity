var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var crypto = require('crypto');
var bodyparser = require('body-parser');

var URL_ROOT = 'http://localhost:3000';

describe('Group API', function () {
	var server;

	before(function () {
		mongo.connect('mongodb://127.0.0.1:27017/pillarseminary', function (err, db) {
			db.collection('Groups').deleteMany({}, function (err, results) {
				assert.ifError(err);
				db.collection('Groups').insertMany(groupsCol, function (err, results) {
					assert.equal(null, err);
					db.collection('Institutions').deleteMany({}, function (err, results) {
						assert.ifError(err);
						db.collection('Institutions').insertMany(institutionsCol, function (err, results) {
							assert.equal(null, err);
							db.collection('Ministries').deleteMany({}, function (err, results) {
								assert.ifError(err);
								db.collection('Ministries').insertMany(ministriesCol, function (err, results) {
									assert.equal(null, err);
									db.collection('Students').deleteMany({}, function (err, results) {
										assert.ifError(err);
										db.collection('Students').insertMany(studentsCol, function (err, results) {
											assert.equal(null, err);
										});
									});
								});
							});
						});
					});
				});
			});
		});

		var app = express();
		var courses = require('./routes/courses');
		var groups = require('./routes/groups');
		var institutions = require('./routes/institutions');
		var ministries = require('./routes/ministries');
		var students = require('./routes/students');

		app.use(bodyparser.json());

		app.use('/api', courses);
		app.use('/api', groups);
		app.use('/api', institutions);
		app.use('/api', ministries);
		app.use('/api', students);
		app.use('/api', financials);

		server = app.listen(3000);
	});

	after(function () {
		server.close();
	});

	var groupsCol = [
		{ _id: 'Administrators', description: "Administrators Group" },
		{ _id: 'Faculty', description: "Faculty Group" },
		{ _id: 'Office', description: "Office Group" },
		{ _id: 'Student', description: "Student Group" }
	];

	var usersCol = [
		{ _id: "adminuser", password: crypto.createHash('md5').update('password1').digest('hex'), groups: ["Administrators"] },
		{ _id: "teacher", password: crypto.createHash('md5').update('password2').digest('hex'), groups: ["Faculty"] },
		{ _id: "secretary", password: crypto.createHash('md5').update('password3').digest('hex'), groups: ["Office"] },
		{ _id: "hruser", password: crypto.createHash('md5').update('password4').digest('hex'), groups: ["Faculty", "Office"] },
		{ _id: "johndoe", password: crypto.createHash('md5').update('password5').digest('hex'), groups: ["Student"] }
	];

	var institutionsCol = [
		{
			_id: "Metropolitan State University",
			phoneNumber: "651-555-2222",
			addressLine1: "123 Main St",
			city: "St. Paul",
			state: "MN",
			zipCode: "55555"
		},
		{
			_id: "University of Minnesota",
			phoneNumber: "512-222-2222",
			addressLine1: "222 University Ave",
			city: "Minneapolis",
			state: "MN",
			zipCode: "55412"
		}
	];

	var ministriesCol = [
		{
			_id: "St. Gerard Church",
			phoneNumber: "763-424-7770",
			addressLine1: "9600 Regent Ave N",
			city: "Brooklyn Park",
			state: "MN",
			zipCode: "55443",
			country: "USA"
		}
	];

	var studentsCol = [
		{
			_id: "000001",
			email: "user1@domain.com",
			firstName: "John",
			middleName: "Y",
			lastName: "Doe",
			birthDate: "1990-02-23",
			gender: "M",
			phoneNumber: "555-555-5555",
			addressLine1: "12345 President Ln",
			city: "Some City",
			state: "MN",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "Metropolitan State University",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "Metropolitan State University",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Jane",
					middleName: "J",
					lastName: "Doe",
					email: "jane@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Sister"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Jane",
					middleName: "J",
					lastName: "Doe",
					email: "jane@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Sister"
				}
			]
		},
		{
			_id: "000002",
			email: "user2@domain.com",
			firstName: "Janet",
			middleName: "E",
			lastName: "Smith",
			gender: "F",
			birthDate: "1998-04-20",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		},
		{
			_id: "000003",
			email: "user3@domain.com",
			firstName: "Jane",
			middleName: "F",
			lastName: "Smith",
			gender: "F",
			birthDate: "1996-05-28",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		},
		{
			_id: "000004",
			email: "user4@domain.com",
			firstName: "David",
			middleName: "E",
			lastName: "Kelly",
			gender: "M",
			birthDate: "1988-08-20",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		},
		{
			_id: "000005",
			email: "user5@domain.com",
			firstName: "George",
			middleName: "E",
			lastName: "Doe",
			gender: "M",
			birthDate: "1978-04-20",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		},
		{
			_id: "000006",
			email: "user6@domain.com",
			firstName: "Eddie",
			middleName: "E",
			lastName: "Money",
			gender: "M",
			birthDate: "1958-04-20",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		},
		{
			_id: "000007",
			email: "user7@domain.com",
			firstName: "Mary",
			middleName: "A",
			lastName: "Davis",
			gender: "F",
			birthDate: "1998-04-20",
			phoneNumber: "555-555-5555",
			addressLine1: "54321 Main Ln.",
			city: "Some City",
			state: "CO",
			zipCode: "55555",
			undergraduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "B.S.",
					field: "Math",
					graduationDate: '2014-01-22'
				}
			],
			graduateDegrees: [
				{
					institutionName: "University of Minnesota",
					degree: "M.S.",
					field: "Math",
					graduationDate: '2016-01-22'
				}
			],
			ministries: [
				{
					ministryName: "St. Gerard Church",
					ministrySupervisor: "Mr. Smith",
					ministrySupervisorTitle: "Business Administrator",
					ministrySupervisorPhoneNumber: "763-424-7770",
					ministryDescription: "Served in the name of God"
				}
			],
			references: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			],
			graduationDate: '2018-01-22',
			applicationDate: '2016-05-01',
			acceptanceNotificationDate: '2016-05-30',
			emergencyContacts: [
				{
					firstName: "Bob",
					middleName: "B",
					lastName: "Smith",
					email: "bob@domain.com",
					phoneNumber: "222-333-4444",
					relationship: "Father"
				}
			]
		}
	];

	it('can load a group by ID', function (done) {
		var url = URL_ROOT + '/api/group/id/Administrators';
		superagent.get(url, function (error, res) {
			assert.ifError(error);
			var result;
			assert.doesNotThrow(function () {
				result = JSON.parse(res.text);
			});
			assert.ok(result.group);
			assert.equal(result.group._id, 'Administrators');
			done();
		});
	});

	it('can load all groups', function (done) {
		var url = URL_ROOT + '/api/groups/';
		superagent.get(url, function (error, res) {
			assert.ifError(error);
			var result;
			assert.doesNotThrow(function () {
				result = JSON.parse(res.text);
			});
			assert.equal(result.groups.length, 4);
			assert.equal(result.groups[0]._id, 'Administrators');
			assert.equal(result.groups[1]._id, 'Faculty');
			assert.equal(result.groups[2]._id, 'Office');
			assert.equal(result.groups[3]._id, 'Student');
			done();
		});
	});

	it('can load student by ID', function (done) {
		var url = URL_ROOT + '/api/student/id/000001';
		superagent.get(url, function (error, res) {
			assert.ifError(error);
			var result;
			assert.doesNotThrow(function () {
				result = JSON.parse(res.text);
			});
			assert.ok(result.student);
			assert.equal(result.student._id, '000001');
			done();
		});
	});
})
