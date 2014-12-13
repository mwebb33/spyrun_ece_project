var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')
var url = require('url');

var HighScore = require('../config/highScore');
var User = require('../config/user');


//not sure why these are here//
var passport = require('passport');
var querystring = require('querystring');

/* Make sure that a user is logged in before accessing potentially private pages */

/* GET home page. */
router.get('/', function(req, res) {
	res.render('login' , {loginMessage: req.flash('loginMessage') });
});

/* GET login page */
router.get('/game', function(req, res) {

	/* Grab all of the information from the query string */
	var url = querystring.parse(req.url.replace(/^.*\?/, ''));
	var level = url.level;

	User.getHighScore(req, res, req.session.tokenid, level, function(req, res, highscore) {
		HighScore.get(req, res, level, function(req, res, topten) {
			console.log("Highscore: " + topten)
			if(highscore == undefined)
				highscore = 0;
			res.render('index', {highscore: highscore, level: level, topten: topten});
		});
	});
	
});

/* Redirect for logging in */
router.get('/login', function(req, res) {

	/* Grab all of the information from the query string */
	var url = querystring.parse(req.url.replace(/^.*\?/, ''));
	var tokenid = url.id;
	var name = url.name;

	/* Set the user's ID and redirect to the game */
	req.session.tokenid = tokenid;
	req.session.name = name;
	User.get(req, res, req.session.tokenid, function(req, res, user) { //Make sure the user exists
		res.redirect('/game?level=1');
	});
});

/* POST for adding high score */
router.get('/addHighScore', function(req, res) {

	/* Grab all of the information from the query string */
	var url = querystring.parse(req.url.replace(/^.*\?/, ''));
	var score = url.score;
	var level = url.level;

	console.log("INDEX SCORE: " + level);
	User.addHighScore(req, res, req.session.tokenid, level, score, function(req, res) {
		HighScore.update(req, res, req.session.name, level, score, function(req, res) {
			//console.log("Score: " + user);
			res.redirect('/game?level=' + level);
		});
	});
});

router.get('/test', function(req, res) {
	var url = querystring.parse(req.url.replace(/^.*\?/, ''));
	var score = url.score;
	var level = url.level;

	HighScore.update(req, res, 'Test', level, score, function(req, res) {
		//console.log("Score: " + user);
		res.render('error', {});
	});

});

/* POST for adding high score */
//router.post('/addHighScore', function(req, res) {

//});


module.exports = router;
