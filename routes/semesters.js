var mongo = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");
var async = require('async');

var mongoCfg = require('../mongo_cfg');
var colName = 'Semesters';

function createAutoId(index) {
    var number = 6;
    return Array(number - String(index).length + 1).join('0') + index;
}

mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {
    router.get('/treelist/id/:id', function(req, res) {
        db.collection(colName).aggregate([{
            $match: {
                'is_deleted': 'false'
            },
        }, {
            $lookup: {
                from: "Courses",
                localField: "_id",
                foreignField: "semesters",
                as: "Courses"
            }
        }, {
            $match: {
                'Courses._id': {
                    $in: req.params.id.split(',')
                }
            }
        }]).toArray(function(error, semesters) {
            async.each(semesters, function(semester, callback) {
                async.each(semester.Courses, function(course, callback2) {
                    if (!course.students) {
                        course.students = [];
                    }
                    db.collection('Grades').aggregate([{
                        $match: {
                            'courseID': course._id
                        }
                    }, {
                        $lookup: {
                            from: "Students",
                            localField: "studentID",
                            foreignField: "_id",
                            as: "Students"
                        }
                    }, {
                        $unwind: "$Students"
                    }]).toArray(function(error, grades) {
                        if (error) {
                            return res.
                            status(400).
                            json({
                                error: error
                            });
                        }
                        grades.forEach(function(grade) {
                            course.students.push(grade.Students);
                        });
                        callback2();
                    });
                }, function(err2) {
                    if (err2) {
                        return console.log(err2);
                    }
                    callback();
                });
            }, function(err) {
                if (err) {
                    return console.log(err);
                }
                res.json({
                    semesters: semesters,
                    coursesProfessors: req.params.id.split(',')
                });
            });

        });

    });

    router.get('/treelist/', function(req, res) {

        db.collection(colName).find({
            "is_deleted": "false"
        }).toArray(function(error, semesters) {
            db.collection('Courses').find({}).toArray(function(error, courses) {
                async.each(courses, function(course, callback) {
                    if (!course.students) {
                        course.students = [];
                    }
                    db.collection('Grades').aggregate([{
                        $match: {
                            'courseID': course._id
                        }
                    }, {
                        $lookup: {
                            from: "Students",
                            localField: "studentID",
                            foreignField: "_id",
                            as: "Students"
                        }
                    }, {
                        $unwind: "$Students"
                    }]).toArray(function(error, grades) {
                        if (error) {
                            return res.
                            status(400).
                            json({
                                error: error
                            });
                        }
                        grades.forEach(function(grade) {
                            course.students.push(grade.Students);
                        });
                        callback();
                    });
                }, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    res.json({
                        semesters: semesters,
                        courses: courses
                    });
                });
            });



            // db.collection('Courses').aggregate([{
            //     $lookup: {
            //         from: "Students",
            //         localField: "_id",
            //         foreignField: "courses",
            //         as: "students"
            //     }
            // }]).toArray(function(error, courses) {

            //     if (error) {
            //         return res.
            //         status(400).
            //         json({
            //             error: error
            //         });
            //     }

            //     res.json({
            //         semesters: semesters,
            //         courses: courses
            //     });

            // });
        });

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

        db.collection(colName).aggregate([{
            $sort: {
                startDate: -1,
                endDate: -1
            }
        }, {
            $match: {
                is_deleted: "false",
            }
        }, {
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
            } else {

                db.collection('Courses').aggregate([{
                    $lookup: {
                        from: "Professors",
                        localField: "_id",
                        foreignField: "courses",
                        as: "professor"
                    }

                }], function(error, courses) {
                    if (error) {
                        res.json({
                            semesters: semesters,
                            courses: []
                        });
                    } else {
                        res.json({
                            semesters: semesters,
                            courses: courses
                        });
                    }

                });
            }

        });
    });

    router.post('/semester/id/:id', function(req, res) {
        console.log(req.body)
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
                    autoIncrement.getNextSequence(db, colName, function(err, autoIndex) {
                        console.log('init auto id');
                    });
                });
            } else {
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
            }

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