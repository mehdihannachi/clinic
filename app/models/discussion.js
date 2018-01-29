var mongoose = require('mongoose');

// define the schema 
var discussionSchema = mongoose.Schema({

  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message'

  }],
  correspondant: Object()

}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});




// create the model and expose it to our app
module.exports = mongoose.model('discussion', discussionSchema, 'discussion');
