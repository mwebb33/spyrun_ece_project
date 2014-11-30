//DEPENDENCIES

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mqtt = require('mqtt')
var url = require('url');

//var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var angular = require('angular');

var routes = require('./routes/index');
var users = require('./routes/users');

// create the app
var app = express();
var port = process.env.PORT || 5000;

//Point to free cloudMQTT server
var mqtt_url = url.parse('mqtt://zoxfulqd:3rFFpnfGqlgR@m11.cloudmqtt.com:11789');
var auth = (mqtt_url.auth || ':').split(':');

// Connect to cloudMQTT
var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
  username: auth[0],
  password: auth[1]
});

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/* Set the port */
app.set('port', port);
console.log("Listening on port " + port);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Required for passport */
app.use(session({ secret: 'thisisasecret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Connect to the database initial login database */
//mongoose.connect('mongodb://localhost/test2');
//var db = mongoose.connection;
//var db = mongoose.createConnection('mongodb://localhost/test2');

console.log("this is running in app.js")

app.use('/', routes);
// app.use('/users', users)

app.post('/publish', function(req, res) {
  var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
    username: auth[0],
    password: auth[1] 
  });
  client.on('connect', function() {
    client.publish('t1', new Date().toString(), function() {
      client.end();
      res.writeHead(204, { 'Connection': 'keep-alive' });
      res.end();
    });
  });
});

app.get('/stream', function(req, res) {
  // set timeout as high as possible
  req.socket.setTimeout(Infinity);

  // send headers for event-stream connection
  // see spec for more information
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // Timeout timer, send a comment line every 20 sec
  var timer = setInterval(function() {
    res.write(':' + '\n');
  }, 20000);


  var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
    username: auth[0],
    password: auth[1] 
  });
  client.on('connect', function() {
    client.subscribe('t1', function() {
      client.on('message', function(topic, msg, pkt) {
        res.write('data:' + msg + '\n\n');
      });
    });
  });

  // When the request is closed, e.g. the browser window
  // is closed. We search through the open connections
  // array and remove this connection.
  req.on("close", function() {
    clearTimeout(timer);
    client.end();
  });
});

/// ERROR HANDLERS ///

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
