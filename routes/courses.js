var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/course/id/:id', function (req, res) {
        db.collection('Courses').findOne({ _id: new ObjectID(req.params.id) }, function (error, course) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!course) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ course: course });
        });
    });

    router.get('/courses/', function (req, res) {
        db.collection('Courses').find({}).toArray(function (error, courses) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ courses: courses });
        });
    });

    router.post('/course/id/:id', function (req, res) {
        db.collection('Courses').update({ _id: new ObjectID(req.params.id) }, req.body, function (error, course) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ course: course });
        });
    });
});

module.exports = router;