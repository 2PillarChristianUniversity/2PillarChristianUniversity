var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'Professors';

function createAutoId(index) {
	var number = 6;
	return Array(number-String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
	router.get('/professor/id/:id', function (req, res) {
		db.collection('Professors').findOne({ _id: req.params.id }, function (error, professor) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			res.json({ professor: professor });
		});
	});

	router.get('/professors/id/:id', function (req, res) {
		db.collection('Professors').find({ _id: { "$regex": req.params.id, "$options": "i" } }).toArray(function (error, professors) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			if (!professors) {
				res.json({ professors: [] });
			} else {
				res.json({ professors: professors });
			}
		});
	});

	router.get('/professors/name/:name', function (req, res) {
		db.collection('Professors').find({ "$or": [{ firstName: { "$regex": req.params.name, "$options": "i" } }, { middleName: { "$regex": req.params.name, "$options": "i" } }, { lastName: { "$regex": req.params.name, "$options": "i" } }] }).toArray(function (error, professors) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			if (!professors) {
				res.json({ professors: [] });
			} else {
				res.json({ professors: professors });
			}
		});
	});

	router.get('/professors/', function (req, res) {
		db.collection('Professors').find({}).toArray(function (error, professors) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			res.json({ professors: professors });
		});
	});

	router.post('/professor/id/:id', function (req, res) {
		db.collection('Professors').update({ _id: req.params.id }, req.body, function (error, professor) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			res.json({ professor: professor });
		});
	});
	
	router.put('/professor', function (req, res) {		
		var colName = 'Professors';
		db.collection(colName, {strict:true}, function(err, collection) { // check exists collection
			if(err != null) { // if exists
				req.body._id = createAutoId(1);
				db.collection(colName).createIndex( { "email": 1 }, { unique: true } )
				db.collection(colName).insert(req.body, function (error, professor) {
					if (error) {
						return res.
							status(400).
							json({ error: "Can't insert professor..." });
					}
					res.json({ professor: professor });
				});
			}

			db.collection(colName).findOne({ email: req.body.email }, function (error, course) {
				if(error) {
					return res.
						status(400).
						json({ error: "Can't insert professor..." });
				}
				if(course) {
					return res.status(403)
	          				.json({ error: "This email is already being used" });            
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
		});
	});

	router.delete('/professor/id/:id', function (req, res) {
        db.collection('Professors').deleteOne({ _id: req.params.id }, function (error, professor) {
             if (error) {
                return res.
                    status(400).
                    json({ error: "Can't delete professor..." });
            }
            res.json({ msg: "Delete success." });
        });
    });


});

module.exports = router;