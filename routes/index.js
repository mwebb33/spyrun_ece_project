var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')
var url = require('url');


//not sure why these are here//
var passport = require('passport');
var querystring = require('querystring');

/* Make sure that a user is logged in before accessing potentially private pages */

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index' , {loginMessage: req.flash('loginMessage') });
});

module.exports = router;
