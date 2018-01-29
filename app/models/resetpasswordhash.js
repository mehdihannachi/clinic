// load the things we need
var mongoose = require('mongoose');

// define the schema for our agency model
var resetpasswordhashSchema = mongoose.Schema({

	hash: String,
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	  expire    : { type: Boolean , default: false },
	  created_at    : { type: Date },
	  updated_at    : { type: Date }


});

resetpasswordhashSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


// create the model for users and expose it to our app
module.exports = mongoose.model('resetpasswordhash', resetpasswordhashSchema);