var mongo = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");
var mongoCfg = require('../mongo_cfg');
var colName = 'Courses';

function createAutoId(index) {
    var number = 6;
    return Array(number - String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {
    router.get('/course/id/:id', function (req, res) {
        db.collection('Courses').findOne({ _id: req.params.id }, function (error, course) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            res.json({ course: course });
        });
    });

    router.get('/courses/', function(req, res) {
        db.collection('Courses').find({}).toArray(function(error, courses) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                courses: courses
            });
        });
    });

    // search student id
    router.get('/courses/id/:id', function (req, res) {
        db.collection(colName).find({ studentID: { "$regex": req.params.id, "$options": "i" } }).toArray(function (error, courses) {
            if (error) {
                return res.
                    status(500).
                    json({ error: error.toString() });
            }
            if (!courses) {
                res.json({ courses: [] });
            } else {
                res.json({ courses: courses });
            }
        });
    });

    router.post('/course/id/:id', function(req, res) {
        db.collection('Courses').update({
            _id: req.params.id
        }, req.body, function(error, course) {
            if (error) {
                return res.
                status(500).
                json({
                    error: error.toString()
                });
            }
            res.json({
                course: course
            });
        });
    });

    // delete course
    router.delete('/course/id/:id', function(req, res) {
        db.collection('Courses').deleteOne({
            _id: req.params.id
        }, function(error, course) {
            if (error) {
                return res.
                status(400).
                json({
                    error: "Can't delete course..."
                });
            }
            res.json({
                msg: "Delete success."
            });
        });
    });

    // check email exits
    router.post('/course/emailExist', function(req, res) {
        db.collection('Courses').findOne({
            email: 'sagasg'
        }, function(error, course) {
            if (error) {
                return res.
                status(400).
                json({
                    error: "server Error"
                });
            }
            if (course) {
                return res.status(203)
                    .json({
                        msg: "This email is already being used"
                    });
            }

            res.json({
                msg: "Not found."
            });
        })
    });

    // create new
    router.put('/course', function(req, res) {
        db.collection('Courses', {
            strict: true
        }, function(err, collection) { // check exists collection
            if (err != null) { // if exists
                req.body._id = createAutoId(1);
                db.collection('Courses').insert(req.body, function(error, course) {
                    if (error) {
                        return res.
                        status(400).
                        json({
                            error: "Can't insert Courses..."
                        });
                    }
                    res.json({
                        course: course
                    });
                    autoIncrement.getNextSequence(db, 'Courses', function (err, autoIndex) {
                        console.log('init auto id');
                    });
                });
            } else {
                autoIncrement.getNextSequence(db, 'Courses', function(err, autoIndex) {
                    req.body._id = createAutoId(autoIndex);
                    db.collection('Courses').insert(req.body, function(error, course) {
                        if (error) {
                            return res.
                            status(400).
                            json({
                                error: "Can't insert course..."
                            });
                        }
                        res.json({
                            course: course
                        });
                    });
                });
            }
        });
    });
});

module.exports = router;
