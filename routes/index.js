var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')
var url = require('url');

var HighScore = require('../config/highScore');


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
	res.render('index', {highscore: '4000'});
});

/* POST for adding high score */
router.post('/addHighScore', function(req, res) {

});

/* POST for adding high score */
//router.post('/addHighScore', function(req, res) {

//});


module.exports = router;
