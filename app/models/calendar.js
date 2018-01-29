var mongoose = require("mongoose");
var newsSchema = new mongoose.Schema({
	events: [{}],
	update_at: Date,
	update_by: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
	token: String
})





module.exports = mongoose.model('calendar', newsSchema, 'calendar');