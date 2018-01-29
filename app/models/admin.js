// load the things we need
var mongoose = require('mongoose');

// define the schema 
var AdminSchema = mongoose.Schema({

  user_id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  profile_picture: String,
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
module.exports = mongoose.model('admin', AdminSchema, 'admin');
