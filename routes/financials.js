var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'Financials';

function createAutoId(index) {
    var number = 6;
    return Array(number-String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    router.get('/financial/id/:id', function (req, res) {
        db.collection('Financials').findOne({ _id: req.params.id }, function (error, financial) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!financial) {
                return res.
                    status(404).
                    json({ error: 'Not found' });
            }
            res.json({ financial: financial });
        });
    });

    // search student id
    router.get('/financials/id/:id', function (req, res) {
        db.collection(colName).find({ studentID: { "$regex": req.params.id, "$options": "i" } }).toArray(function (error, financials) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!financials) {
                res.json({ financials: [] });
            } else {
                res.json({ financials: financials });
            }
        });
    });

    router.get('/financials/', function(req, res) {

        db.collection(colName).aggregate(
            [
                {
                    $lookup:
                    {
                      from: "Semesters",
                      localField: "semester",
                      foreignField: "_id",
                      as: "F_Semesters"
                    }        
               },
               { 
                    $lookup:
                    {
                      from: "Students",
                      localField: "studentID",
                      foreignField: "_id",
                      as: "F_Students"
                    }
                }
            ],
         function(error, financials) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                financials: financials
            });
        });
    });

    router.put('/financial', function(req, res) {  
    console.log(req.body)     ; 
        db.collection('Financials', {
            strict: true
        }, function(err, collection) { // check exists collection
            if (err != null) { // if exists
                req.body._id = createAutoId(1);
                db.collection('Financials').insert(req.body, function(error, financial) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert Financials..."
                        });
                    }
                    res.json({
                        financial: financial
                    });
                });
            }

            autoIncrement.getNextSequence(db, 'Financials', function(err, autoIndex) {
                req.body._id = createAutoId(autoIndex);
                db.collection('Financials').insert(req.body, function(error, financial) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert financial..."
                        });
                    }
                    res.json({
                        financial: financial
                    });
                });
            });

        });
    });

    router.post('/financial/id/:id', function (req, res) {
        db.collection('Financials').update({ _id: req.params.id }, req.body, function (error, financial) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ financial: financial });
        });
    });

    router.delete('/financial/id/:id', function (req, res) {
            db.collection('Financials').deleteOne({ _id: req.params.id }, function (error, financial) {
                 if (error) {
                    return res.
                        status(400).
                        json({ error: "Can't delete financial..." });
                }
                res.json({ msg: "Delete success." });
            });
    });
    
});

module.exports = router;