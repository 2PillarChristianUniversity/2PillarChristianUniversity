var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/studentGrade/id/:id', function (req, res) {
        db.collection('StudentGrades').findOne({ _id: req.params.id }, function (error, studentGrade) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!studentGrade) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ studentGrade: studentGrade });
        });
    });

    router.get('/studentGrades/', function (req, res) {
        db.collection('StudentGrades').find({}).toArray(function (error, studentGrades) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ studentGrades: studentGrades });
        });
    });

    router.post('/studentGrade/id/:id', function (req, res) {
        db.collection('StudentGrades').update({ _id: req.params.id }, req.body, function (error, studentGrade) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ studentGrade: studentGrade });
        });
    });
});

module.exports = router;