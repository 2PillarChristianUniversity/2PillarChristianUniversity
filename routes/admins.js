var mongo = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var autoIncrement = require("mongodb-autoincrement");
var mongoCfg = require('../mongo_cfg');
var requiresLogin = require('../requiresLogin');

function createAutoId(index) {
	var number = 6;
	return Array(number-String(index).length + 1).join('0') + index;
}
mongo.connect('mongodb://' + mongoCfg.server + ':' + mongoCfg.port + '/' + mongoCfg.db_name, function(err, db) {


	//	Get admin by email
	router.get('/admin/email/:email', function (req, res) {
		db.collection('Admins').findOne({ email: req.params.email }, function (error, admin) {
			if (error) {
				return res.
					status(500).
					json({ error: error.toString() });
			}
			res.json({ admin: admin });
		});
	});
});





module.exports = router;
