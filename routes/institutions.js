var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'Institutions';

function createAutoId(index) {
    var number = 6;
    return Array(number-String(index).length + 1).join('0') + index;
}

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

    router.put('/institution', function (req, res) {

        db.collection('Institutions').insert(req.body, function (error, institution) {
            if (error) {
                return res.
                    status(400).
                    json({ error: "Can't insert institution..." });
            }
            res.json({ institution: institution });
        });
    });

    // router.put('/institution', function(req, res) {        
    //     db.collection(colName, {
    //         strict: true
    //     }, function(err, collection) { // check exists collection
    //         if (err != null) { // if exists
    //             req.body._id = createAutoId(1);
    //             db.collection(colName).insert(req.body, function(error, institution) {
    //                 if (error) {
    //                     return res.
    //                     status(400).
    //                     json({
    //                         error: "Can't insert institution..."
    //                     });
    //                 }
    //                 res.json({
    //                     institution: institution
    //                 });
    //             });
    //         }

    //         autoIncrement.getNextSequence(db, colName, function(err, autoIndex) {
    //             req.body._id = createAutoId(autoIndex);
    //             db.collection(colName).insert(req.body, function(error, institution) {
    //                 if (error) {
    //                     return res.
    //                     status(400).
    //                     json({
    //                         error: "Can't insert institution..."
    //                     });
    //                 }
    //                 res.json({
    //                     institution: institution
    //                 });
    //             });
    //         });

    //     });
    // });

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

    router.delete('/institution/id/:id', function (req, res) {
            db.collection('Institutions').deleteOne({ _id: req.params.id }, function (error, institution) {
                 if (error) {
                    return res.
                        status(400).
                        json({ error: "Can't delete institution..." });
                }
                res.json({ msg: "Delete success." });
            });
    });
    
});

module.exports = router;