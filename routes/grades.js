var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var colName = 'Grades';

var mongoCfg = require('../mongo_cfg');
function createAutoId(index) {
    var number = 6;
    return Array(number-String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function (err, db) {
    // get grade by id
    router.get('/grade/id/:id', function (req, res) {
       db.collection(colName).aggregate(
            [{
                $match:{
                    courseID: req.params.id
                    }
                 },
                {
                    $lookup:
                    {
                      from: "Students",
                      localField: "studentID",
                      foreignField: "_id",
                      as: "Students"
                    }        
               }
            ],
         function(error, grade) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                grade: grade

            });
        });
    });

    router.get('/grades/', function (req, res) {
        db.collection('Grades').find({}).toArray(function (error, grades) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ grades: grades });
        });
    });

    // Update grade
    router.post('/grade/id/:id', function (req, res) {
        db.collection('Grades').update({ _id: req.params.id }, req.body, function (error, grade) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ grade: grade });
        });
    });

    // router.post('/grade/id/:id', function (req, res) {
    //     db.collection('Grades').update({ _id: req.params.id }, req.body, function (error, grade) {
    //         if (error) {
    //             return res.
    //                 status(500).
    //                 json({ error: error.toString() });
    //         }
    //         res.json({ grade: grade });
    //     });
    // });
});

module.exports = router;