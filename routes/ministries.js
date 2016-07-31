var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/ministry/id/:id', function (req, res) {
        db.collection('Ministries').findOne({ _id: req.params.id }, function (error, ministry) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!ministry) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ ministry: ministry });
        });
    });

    router.get('/ministries/', function (req, res) {
        db.collection('Ministries').find({}).toArray(function (error, ministries) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ ministries: ministries });
        });
    });

    router.post('/ministry/id/:id', function (req, res) {
        db.collection('Ministries').update({ _id: req.params.id }, req.body, function (error, ministry) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ ministry: ministry });
        });
    });
});

module.exports = router;