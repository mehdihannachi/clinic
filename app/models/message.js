// load the things we need
var mongoose = require('mongoose');

// define the schema 
var messageSchema = mongoose.Schema({
    discussion : String,
    content : String,
    date : { type: Date, default: Date.now},
    seen : { type: Boolean, default: false},
    from: {
            type: mongoose.Schema.Types.Object,
            ref: 'user'
          },
    to: {
            type: mongoose.Schema.Types.Object,
            ref: 'user'
          }
});

 


// create the model and expose it to our app
module.exports = mongoose.model('message', messageSchema, 'message');