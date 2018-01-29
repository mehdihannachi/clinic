var mongoose = require('mongoose');

// define the schema 
var rdvDemandSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date,
    message: String,
    etat: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    type: String
        /*etat value:1 en attente, value:2 accepted, value:3 a revoir*/

});




// create the model and expose it to our app
module.exports = mongoose.model('rdvDemand', rdvDemandSchema, 'rdvDemand');
