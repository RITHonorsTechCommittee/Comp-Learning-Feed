const _ = require('underscore');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let CompPostModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setDescription = (descrip) => _.escape(descrip).trim();
const setLocation = (loc) => _.escape(loc).trim();
const setEmail = (email) => _.escape(email).trim();
const setPhoneNumber = (phone) => _.escape(phone).trim();

const CompPostSchema = new mongoose.Schema({

	// Title/info about the event
	title: {
		type: String,
		required: true,
		trim: true,
		set: setName,
	},
	// Info about the event
	description: {
		type: String,
		required: true,
		trim: true,
		set: setDescription,
	},
	// Timestamp - when the event starts
	eventStart: {
		type: Date,
		required: true,
		default: Date.now,
	},
	// Timestamp - when the event ends
	eventEnd: {
		type: Date,
		required: true,
		default: Date.now,
	},
	// Event location
	location: {
		type: String,
		required: true,
		trim: true,
		set: setLocation,
	},
	// Contact email
	contactEmail: {
		type: String,
		required: true,
		default: undefined,
		set: setEmail,
	},
	// Contact phone number
	contactPhone: {
		type: String,
		required: true,
		default: undefined,
		set: setPhoneNumber,
	},
	// Tags for the event
	tags: {
		type: Array,
		required: false,
	},
	// Assoc. user account
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account',
	},
	// Metadata
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

	return CompPostModel.find(search).exec(callback);
};

// NOT FULLY IMPLEMENTED
CompPostSchema.statics.findByTag = (tag, callback) => {
	const search = {
		tag: [], //TODO: make this actually find the right tag
	};

	return CompPostModel.find(search).exec(callback);
}

CompPostModel = mongoose.model('CompPost', CompPostSchema);

module.exports.CompPostModel = CompPostModel;
module.exports.CompPostSchema = CompPostSchema;