// load the things we need
var mongoose = require('mongoose');

// define the schema 
var locationSchema = mongoose.Schema({
    country: String,
    cities : [],
    city: String
    
});


// create the model and expose it to our app
module.exports = mongoose.model('location', locationSchema, 'locations');
