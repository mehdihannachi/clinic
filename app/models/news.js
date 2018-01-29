var mongoose = require("mongoose");
var newsSchema = new mongoose.Schema({
	title: String,
	created_at: {
		type: Date,
		default: Date.now
	},
	content: String,
	introduction: String,
	as_draft: {
		type: Boolean,
		default: false
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	cover_photo: String
})

/*var deepPopulate = require('mongoose-deep-populate')(mongoose);
newsSchema.plugin(deepPopulate,{});*/

module.exports = mongoose.model('news', newsSchema, 'news');
