var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'OfficerAdmins';

function createAutoId(index) {
    var number = 6;
    return Array(number-String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/officerAdmin/id/:id', function (req, res) {
        db.collection(colName).findOne({ _id: req.params.id }, function (error, officerAdmin) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!officerAdmin) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ officerAdmin: officerAdmin });
        });
    });

    router.get('/officerAdmins/', function (req, res) {
        db.collection(colName).find({}).toArray(function (error, officerAdmins) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ officerAdmins: officerAdmins });
        });
    });

    // get officer admin by email
    router.get('/officerAdmin/email/:email', function (req, res) {
        db.collection(colName).findOne({ email: req.params.email }, function (error, officerAdmin) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ officerAdmin: officerAdmin });
        });
    });

    // create officerAdmin
    router.put('/officerAdmin', function(req, res) {
        db.collection(colName, {
            strict: true
        }, function(err, collection) { // check exists collection
            if (err != null) { // if exists
                req.body._id = createAutoId(1);
                db.collection(colName).insert(req.body, function(error, officerAdmin) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert officerAdmin..."
                        });
                    }
                    res.json({
                        officerAdmin: officerAdmin
                    });
                    autoIncrement.getNextSequence(db, colName, function (err, autoIndex) {
                        console.log('init auto id');
                    });
                });
            } else {
                autoIncrement.getNextSequence(db, colName, function(err, autoIndex) {
                    req.body._id = createAutoId(autoIndex);
                    db.collection(colName).insert(req.body, function(error, officerAdmin) {
                        if (error) {
                            return res.
                            status(400).
                            json({
                                error: "Can't insert officerAdmin..."
                            });
                        }
                        res.json({
                            officerAdmin: officerAdmin
                        });
                    });
                });
            }
        });
    });

    router.post('/officerAdmin/id/:id', function (req, res) {
        db.collection(colName).update({ _id: req.params.id }, req.body, function (error, officerAdmin) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ officerAdmin: officerAdmin });
        });
    });

    router.delete('/officerAdmin/id/:id', function (req, res) {
            db.collection(colName).deleteOne({ _id: req.params.id }, function (error, officerAdmin) {
                 if (error) {
                    return res.
                        status(400).
                        json({ error: "Can't delete officerAdmin..." });
                }
                res.json({ msg: "Delete success." });
            });
    });

});

module.exports = router;
