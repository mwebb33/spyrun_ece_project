var express = require('express');
var router = express.Router();
var mqtt = require('mqtt')
var url = require('url');

//not sure why these are here//
var passport = require('passport');
var querystring = require('querystring');

// //Point to free cloudMQTT server
// var mqtt_url = url.parse('mqtt://zoxfulqd:3rFFpnfGqlgR@m11.cloudmqtt.com:11789');
// var auth = (mqtt_url.auth || ':').split(':');

// // Connect to cloudMQTT
// var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
//   username: auth[0],
//   password: auth[1]
// });

// /* Make sure that a user is logged in before accessing potentially private pages */

// router.post('/publish', function(req, res) {
//   var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
//     username: auth[0],
//     password: auth[1] 
//   });
//   client.on('connect', function() {
//     client.publish('t1', new Date().toString(), function() {
//       client.end();
//       res.writeHead(204, { 'Connection': 'keep-alive' });
//       res.end();
//     });
//   });
// });

// router.get('/stream', function(req, res) {
//   // set timeout as high as possible
//   req.socket.setTimeout(Infinity);

//   // send headers for event-stream connection
//   // see spec for more information
//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive'
//   });
//   res.write('\n');

//   // Timeout timer, send a comment line every 20 sec
//   var timer = setInterval(function() {
//     res.write(':' + '\n');
//   }, 20000);


//   var client = mqtt.createClient(mqtt_url.port, mqtt_url.hostname, {
//     username: auth[0],
//     password: auth[1] 
//   });
//   client.on('connect', function() {
//     client.subscribe('t1', function() {
//       client.on('message', function(topic, msg, pkt) {
//         res.write('data:' + msg + '\n\n');
//       });
//     });
//   });

//   // When the request is closed, e.g. the browser window
//   // is closed. We search through the open connections
//   // array and remove this connection.
//   req.on("close", function() {
//     clearTimeout(timer);
//     client.end();
//   });
// });


module.exports = router;
