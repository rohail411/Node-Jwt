const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String,
		min: 6,
		max: 255
	},

	email: {
		required: true,
		type: String,
		min: 10,
		max: 255
	},

	password: {
		required: true,
		type: String,
		min: 10,
		max: 1024
	},

	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userSchema);
