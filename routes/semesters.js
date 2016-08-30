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

    router.get('/treelist/', function(req, res) {

        db.collection(colName).find().toArray(function(error, semesters) {


            db.collection('Courses').aggregate([{
                $lookup: {
                    from: "Students",
                    localField: "_id",
                    foreignField: "courses",
                    as: "students"
                }
            }]).toArray(function(error, courses) {
                
                res.json({
                    semesters: semesters,
                    courses: courses
                });

            });
        });


        // db.collection('treeList').find().toArray(function (error, semester) {
        //      console.log(semester);
        //      if (error) {
        //          return res.
        //              status(500).
        //              json({ error: error });
        //      }
        //      res.json({ semester: semester });
        //  });


    });

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

        db.collection(colName).aggregate([
        {
                $match: {
                    is_deleted: "false",
                }
            },
        {
            $lookup: {
                from: "Courses",
                localField: "_id",
                foreignField: "semesters",
                as: "Courses"
            }
        }], function(error, semesters) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                semesters: semesters
            });
        });
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