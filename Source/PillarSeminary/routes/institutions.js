var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/institution/id/:id', function (req, res) {
        db.collection('Institutions').findOne({ _id: req.params.id }, function (error, institution) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!institution) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ institution: institution });
        });
    });

    router.get('/institutions/', function (req, res) {
        db.collection('Institutions').find({}).toArray(function (error, institutions) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ institutions: institutions });
        });
    });

    router.post('/institution/id/:id', function (req, res) {
        db.collection('Institutions').update({ _id: req.params.id }, req.body, function (error, institution) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ institution: institution });
        });
    });
});

module.exports = router;