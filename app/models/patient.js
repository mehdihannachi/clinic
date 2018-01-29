// load the things we need
var mongoose = require('mongoose');

// define the schema 
var PatientSchema = mongoose.Schema({

  user_id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  phoneNumber: Number,
  id_picture: String,
  birth: Date,
  gender: String,
  country: String,
  city: String,
  files:[],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location'
  },
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
module.exports = mongoose.model('patient', PatientSchema, 'patient');
