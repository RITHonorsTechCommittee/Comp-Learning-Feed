const _ = require('underscore');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let CompPostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CompPostSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName,
	},

	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account',
	},

	createdData: {
		type: Date,
		default: Date.now,
	},
});

CompPostSchema.statics.ToAPI = (doc) => ({
	name: doc.name,
	age: doc.age,
});

CompPostSchema.statics.findByOwner = (ownerId, callback) => {
	const search = {
		owner: convertId(ownerId),
	};

	return CompPostModel.find(search).select('name age').exec(callback);
};

CompPostModel = mongoose.model('CompPost', CompPostSchema);

module.exports.CompPostModel = CompPostModel;
module.exports.CompPostSchema = CompPostSchema;