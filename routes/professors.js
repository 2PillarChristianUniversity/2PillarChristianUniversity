var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

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
		db.collection('Professors').insert(req.body, function (error, professor) {
			if (error) {
				return res.
					status(400).
					json({ error: "Can't insert professor..." });
			}
			res.json({ professor: professor });
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