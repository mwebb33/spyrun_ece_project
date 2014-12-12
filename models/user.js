/* Load what we need */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Define the schema for our model */
var userSchema = mongoose.Schema({

		tokenid:	String,
		name: 		String, 
		highscore: 	[String],
});

/* Create the model for users and expose it to the app */
module.exports = mongoose.model('User', userSchema);
