var mongo = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');

function createAutoId(index) {
	var number = 6;
	return Array(number - String(index).length + 1).join('0') + index;
}
mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {
	router.post('/student/courses/:id', function(req, res) {
		db.collection('Students').aggregate([
		{
				$match: {
					_id: req.params.id,
					// $or: [
					// 	{ startDate: { $gt: req.body.start_date, $lt: req.body.end_date }} ,
					// 	{ endDate: { $gt: req.body.start_date, $lt: req.body.end_date }}
					// ]

				}
			},
			// Unwind the source
			{
				"$unwind": "$courses"
			},
			// Do the lookup matching
			{
				"$lookup": {
					"from": "Courses",
					"localField": "courses",
					"foreignField": "_id",
					"as": "productObjects"
				}
			},
			// Unwind the result arrays ( likely one or none )
			{
				"$unwind": "$productObjects"
			},
			// Group back to arrays
			{
				"$group": {
					"_id": "$_id",
					//         "products": { "$push": "$courses" },
					"Courses": {
						"$push": "$productObjects"
					}
				}
			}
		], function(error, student) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			res.json({
				student: student

			});
		});
	});


	router.get('/student/id/:id', function(req, res) {
		db.collection('Students').findOne({
			_id: req.params.id
		}, function(error, student) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			res.json({
				student: student
			});
		});
		db.collection('Students').aggregate([{
			$lookup: {
				from: "Financials",
				localField: "_id",
				foreignField: "studentID",
				as: "S_Financials"
			}
		}]);
	});

	router.get('/students/id/:id', function(req, res) {
		db.collection('Students').find({
			_id: {
				"$regex": req.params.id,
				"$options": "i"
			}
		}).toArray(function(error, students) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			if (!students) {
				res.json({
					students: []
				});
			} else {
				res.json({
					students: students
				});
			}
		});
	});

	router.get('/students/name/:name', function(req, res) {
		db.collection('Students').find({
			"$or": [{
				firstName: {
					"$regex": req.params.name,
					"$options": "i"
				}
			}, {
				middleName: {
					"$regex": req.params.name,
					"$options": "i"
				}
			}, {
				lastName: {
					"$regex": req.params.name,
					"$options": "i"
				}
			}]
		}).toArray(function(error, students) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			if (!students) {
				res.json({
					students: []
				});
			} else {
				res.json({
					students: students
				});
			}
		});
	});

	router.get('/students/', function(req, res) {
		db.collection('Students').find({}).toArray(function(error, students) {
			if (error) {
				return res.
				status(500).
				json({
					error: error
				});
			}
			res.json({
				students: students
			});
		});
	});

	router.post('/student/id/:id', function(req, res) {
		db.collection('Students').update({
			_id: req.params.id
		}, req.body, function(error, student) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			res.json({
				student: student
			});
		});
	});

	router.put('/student', function(req, res) {
		var colName = 'Students';
		db.collection(colName, {
			strict: true
		}, function(err, collection) { // check exists collection
			if (err != null) { // if exists
				req.body._id = createAutoId(1);
				db.collection(colName).createIndex({
					"email": 1
				}, {
					unique: true
				})
				db.collection(colName).insert(req.body, function(error, student) {
					if (error) {
						return res.
						status(400).
						json({
							error: "Can't insert student..."
						});
					}
					res.json({
						student: student
					});
				});
			}

			db.collection(colName).findOne({
				email: req.body.email
			}, function(error, course) {
				if (error) {
					return res.
					status(400).
					json({
						error: "Can't insert student..."
					});
				}
				if (course) {
					return res.status(403)
						.json({
							error: "This email is already being used"
						});
				} else {
					autoIncrement.getNextSequence(db, colName, function(err, autoIndex) {
						req.body._id = createAutoId(autoIndex);
						db.collection(colName).insert(req.body, function(error, student) {
							if (error) {
								return res.
								status(400).
								json({
									error: "Can't insert student..."
								});
							}
							res.json({
								student: student
							});
						});
					});
				}
			});
		});
	});

	router.delete('/student/id/:id', function(req, res) {
		db.collection('Students').deleteOne({
			_id: req.params.id
		}, function(error, student) {
			if (error) {
				return res.
				status(400).
				json({
					error: "Can't delete student..."
				});
			}
			res.json({
				msg: "Delete success."
			});
		});
	});

});

module.exports = router;
