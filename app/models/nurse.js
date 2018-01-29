// load the things we need
var mongoose = require('mongoose');

// define the schema 
var NurseSchema = mongoose.Schema({

  user_id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  phoneNumber: Number,
  profile_picture: String,
  email: String,
  created_at: Date,
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});



// create the model and expose it to our app
module.exports = mongoose.model('nurse', NurseSchema, 'nurse');
