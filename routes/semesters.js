var mongo = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");

var mongoCfg = require('../mongo_cfg');
var colName = 'Semesters';

function createAutoId(index) {
    var number = 6;
    return Array(number - String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {

    router.get('/semester/id/:id', function(req, res) {
        db.collection(colName).findOne({
            _id: req.params.id
        }, function(error, semester) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                semester: semester
            });
        });
    });

    router.get('/semesters/', function(req, res) {

        var courses =  db.collection('Courses').find({
            semesters: true
        });

        var sem = courses.map(function(c) {
            return c.semesters;
        });
        
        var data = db.collection(colName).find({
            _id: {
                $in: sem
            }
        }).sort({
            "name": 1
        });
        console.log(data);
        // .toArray(function(error, semester) {
        //     if (error) {
        //         return res.
        //         status(301).
        //         json({
        //             error: error.toString()
        //         });
        //     } else {
        //         // for (var i = 0, len = semester.length; i < len; i++) {
        //         //     // console.log(semester[i]._id);
        //         //     db.collection('Courses').findOne({
        //         //         semesters: semester[i]._id
        //         //     }, function(error, courses) {
        //         //         if (courses) {
        //         //             console.log(courses);
        //         //         }

        //         //     });
        //         // }

        //     }


            res.json({
                semesters: data
            });
        // });
    });

    router.post('/semester/id/:id', function(req, res) {
        db.collection(colName).update({
            _id: req.params.id
        }, req.body, function(error, semester) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                semester: semester
            });
        });
    });

    // create new 
    router.put('/semester', function(req, res) {
        db.collection(colName, {
            strict: true
        }, function(err, collection) { // check exists collection
            if (err != null) { // if exists
                req.body._id = createAutoId(1);
                db.collection(colName).insert(req.body, function(error, semester) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert semester..."
                        });
                    }
                    res.json({
                        semester: semester
                    });
                });
            }

            autoIncrement.getNextSequence(db, colName, function(err, autoIndex) {
                req.body._id = createAutoId(autoIndex);
                db.collection(colName).insert(req.body, function(error, semester) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert semester..."
                        });
                    }
                    res.json({
                        semester: semester
                    });
                });
            });

        });
    });

    // detele
    router.delete('/semester/id/:id', function(req, res) {
        db.collection(colName).deleteOne({
            _id: req.params.id
        }, function(error, professor) {
            if (error) {
                return res.
                status(400).
                json({
                    error: "Can't delete professor..."
                });
            }
            res.json({
                success: "Delete success."
            });
        });
    });

});

module.exports = router;