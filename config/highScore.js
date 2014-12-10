/* Load the user model */
var mongoose = require('mongoose');
var highScoreSchema = require("../models/highScore");
var db = require("../models/dbConnection")

/* Create each of the models that we will be adding to the database */
var HighScore = db.HighScore.model('HighScore', highScoreSchema);

this.add = function(req, res, done) {

	var newHighScore = new HighScore();
	newHighScore.username = req.session.username;
	newHighScore.score = res.session.score;
	
	newHighScore.save(function(err) {
		if(err)
			throw err;
		else {

			done(req, res);
		}
	});
};

this.get = function(req, res, done) {

	HighScore.findOne('username': req.session.username, function(err, highscore) {

		if(err)
			throw err;
		else
			done(req, res, highscore);

	});
};