var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

var mongoCfg = require('../mongo_cfg');

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/group/id/:id', function (req, res) {
        db.collection('Groups').findOne({ _id: req.params.id }, function (error, group) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!group) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ group: group });
        });
    });

    router.get('/groups', function (req, res) {
        db.collection('Groups').find({}).toArray(function (error, groups) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ groups: groups });
        });
    });

    router.post('/group/id/:id', function (req, res) {
        db.collection('Groups').update({ _id: req.params.id }, req.body, function (error, group) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ group: group });
        });
    });
});

module.exports = router;