const mongoose = require("mongoose");

module.exports = mongoose.model(
	"Posts",
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		room_num: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
	})
);
