/* Load the user model */
var mongoose = require('mongoose');
var highScoreSchema = require("../models/highScore");
var db = require("../models/dbConnection")

/* Create each of the models that we will be adding to the database */
var HighScore = db.HighScore.model('HighScore', highScoreSchema);

this.update = function(req, res, name, level, score, done) {
	
	HighScore.findOne({'level': level}, function(err, highscore) {

		if(err)
			throw err;
		else {
			/* Check that we have 10 people */
			if(highscore == null) {
				highscore = new HighScore();
				highscore.level = level;
				highscore.scores = [];
				highscore.scores.push(name);
				highscore.scores.push(score);

				highscore.save(function(err) {
					if(err)
						throw err;
					else {
						done(req, res);
					}
				});
			}
			else {
				var newScore = false;
				/* Check if we have a new high score */
				for(var i = 1; i < highscore.scores.length; i += 2) {

					if(parseInt(score) > parseInt(highscore.scores[i])) {
						newScore = true;
					}
					/* If we have a new position, add it */
					if(parseInt(score) < parseInt(highscore.scores[i]) && newScore == true) {
						var offset = 3;
						if(highscore.scores.length < 20) {
							highscore.scores.unshift("");
							highscore.scores.unshift("");
							offset = 1;
						}
						for(var n = 0; n < i - offset; n++) {
							highscore.scores[n] = highscore.scores[n+2];
						}
						highscore.scores[i-offset] = name;
						highscore.scores[i-offset+1] = score;
						console.log("1")
						break;
					}
					/* If we haven't reached 10 entries yet */
					if(highscore.scores.length < 20 && i == highscore.scores.length - 1 && !newScore) {
						highscore.scores.unshift(score);
						highscore.scores.unshift(name);
						console.log("2")
						break;
					}
					/* If this is the new top score and the list isn't full */
					if(highscore.scores.length < 20 && i == highscore.scores.length - 1 && newScore) {
						highscore.scores.push(name);
						highscore.scores.push(score);
						console.log("3")
						break;
					}
					/* If this is a new top score and the list is full */
					if(highscore.scores.length == 20 && i == highscore.scores.length - 1 && newScore) {
						for(var n = 0; n < highscore.scores.length - 2; n++) {
							highscore.scores[n] = highscore.scores[n+2];
						}
						highscore.scores[highscore.scores.length - 2] = name;
						highscore.scores[highscore.scores.length - 1] = score;
						console.log("4")
						break;
					}
				}

				var newHighScores = highscore.scores;
				HighScore.update({ _id: highscore._id }, { $set: { scores: newHighScores }}, function() {
					done(req, res);
				});
			}
		}
	});
};

this.get = function(req, res, level, done) {

	HighScore.findOne({'level': level}, function(err, highscore) {

		if(err)
			throw err;
		else
			var scores = [];
			if(highscore != null)
				scores = highscore.scores;

			done(req, res, scores);

	});
};