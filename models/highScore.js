/* Load what we need */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Define the schema for our model */
var highScoreSchema = mongoose.Schema({

		level: 		String,
		scores:  	[String]  
});

/* Create the model for users and expose it to the app */
module.exports = mongoose.model('HighScore', highScoreSchema);
