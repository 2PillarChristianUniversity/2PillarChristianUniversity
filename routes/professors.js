var mongo = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'Professors';

function createAutoId(index) {
	var number = 6;
	return Array(number - String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {
	//	Get professor by ID
	router.get('/professor/id/:id', function(req, res) {
		db.collection('Professors').findOne({
			_id: req.params.id
		}, function(error, professor) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			res.json({
				professor: professor
			});
		});
	});

	//	Get professor by email
	router.get('/professor/email/:email', function(req, res) {
		db.collection(colName).findOne({
			email: req.params.email
		}, function(error, professor) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			res.json({
				professor: professor
			});
		});
	});

	//	Get list professor by ID (search function)
	router.get('/professors/id/:id', function(req, res) {
		db.collection('Professors').find({
			_id: {
				"$regex": req.params.id,
				"$options": "i"
			}
		}).toArray(function(error, professors) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			if (!professors) {
				res.json({
					professors: []
				});
			} else {
				res.json({
					professors: professors
				});
			}
		});
	});

	//	Get list professor by name (search function)
	router.get('/professors/name/:name', function(req, res) {
		db.collection('Professors').find({
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
		}).toArray(function(error, professors) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			if (!professors) {
				res.json({
					professors: []
				});
			} else {
				res.json({
					professors: professors
				});
			}
		});
	});

	//	Get list all professor
	router.get('/professors/', function(req, res) {
		db.collection('Professors').find({}).toArray(function(error, professors) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}
			if (!professors) {
				res.json({
					professors: []
				});
			} else {
				res.json({
					professors: professors
				});
			}

		});
	});

	// Get course by professor id
	router.get('/professor/courses/:id', function(req, res) {
		db.collection('Professors').aggregate(
            [
            	{
			        $match:
			        {
			            _id: req.params.id
			        }
			     },
			     {
					"$unwind": "$courses"
				},
			    {
			      $lookup:
			        {
			          from: "Courses",
			          localField: "courses",
			          foreignField: "_id",
			          as: "productObjects"
			        }
			   },
			   {
					"$unwind": "$productObjects"
				},
				{
				"$group": {
					"_id": "$_id",
					//         "products": { "$push": "$courses" },
					"Courses": {
						"$push": "$productObjects"
					}
				}
			}

            ],
        function(error, professor) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                professor: professor

            });
        });
	});


	//	Update professor
	router.post('/professor/id/:id', function(req, res) {
		db.collection(colName).update({
			_id: req.params.id
		}, req.body, function(error, professor) {
			if (error) {
				return res.
				status(500).
				json({
					error: error.toString()
				});
			}

			res.json({
				professor: professor
			});
		});
	});

	//	Insert professor
	router.put('/professor', function(req, res) {
		var colName = 'Professors';
		db.collection(colName).findOne({ email: req.body.email }, function (error, professor) {
			if(error) {
				return res.
					status(400).
					json({ error: "Can't insert professor..." });
			}
			if(professor) {
				return res.status(403)
          				.json({ error: "This email is already being used" });
			} else {
				db.collection(colName, {strict:true}, function(err, collection) { // check exists collection
					if(err != null) { // if not exists
						req.body._id = createAutoId(1);
						db.collection(colName).createIndex( { "email": 1 }, { unique: true } )
						db.collection(colName).insert(req.body, function (error, professor) {
							if (error) {
								return res.
									status(400).
									json({ error: "Can't insert professor..." });
							}
							res.json({ professor: professor });
							autoIncrement.getNextSequence(db, colName, function (err, autoIndex) {
								console.log('init auto id');
							});
						});
					} else {
						autoIncrement.getNextSequence(db, colName, function (err, autoIndex) {
							req.body._id = createAutoId(autoIndex);
							db.collection(colName).insert(req.body, function (error, professor) {
								if (error) {
									return res.
										status(400).
										json({ error: "Can't insert professor..." });
								}
								res.json({ professor: professor });
							});
						});
					}
				});
			}
		});
	});

	//	Delete professor
	router.delete('/professor/id/:id', function(req, res) {
		db.collection('Professors').deleteOne({
			_id: req.params.id
		}, function(error, professor) {
			if (error) {
				return res.
				status(400).
				json({
					error: "Can't delete professor..."
				});
			}
			res.json({
				msg: "Delete success."
			});
		});
	});

	//	 Professor's course
	router.post('/professor/courses/:id', function(req, res) {
		db.collection('Professors').aggregate([
		{
				$match: {
					_id: req.params.id
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
		], function(error, professor) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			res.json({ professor: professor });
		});
	});
});

module.exports = router;
