var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Document = new Schema({
    'title': { type: String, index: true },
	'data': String,
	'tags':  [String]
});

Document.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Document = function(db){
	return mongoose.model('Document', Document);
};


// Post

var Post = new Schema({
    'title': { type: String, index: true },
	'body': String,
	'tags':  [String],
	'published': { type: Boolean, default: false },
	'visibility': String,
	'showlikes': String,
	'showsharing': String,
	'featimage': String,
	'categories': { type: String, default: 'Uncategorized' },
	'format': String,
	'created': { type: Date, default: Date.now },
	'modified': Date,
	'pubdate': Date,
	'trashed': { type: Boolean, default: false }
});

Post.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Post = function(db){
	return mongoose.model('Post', Post);
};


// Page

var Page = new Schema({
    'title': { type: String, index: true },
	'body': String,
	'published': { type: Boolean, default: false },
	'visibility': { type: String, default: 'Public' },
	'showlikes': String,
	'showsharing': String,
	'parent': { type: String, default: '(no parent)' },
	'template': String,
	'order': { type: Number, default: 0 },
	'created': { type: Date, default: Date.now },
	'modified': Date,
	'pubdate': Date
});

Page.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Page = function(db){
	return mongoose.model('Page', Page);
};


// Media

var Media = new Schema({
	'name': { type: String, index: true },
	'alt': String,
	'caption': String,
	'desc': String,
	'filename': String,
	'created': { type: Date, default: Date.now }
});

Media.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Media = function(db){
	return mongoose.model('Media', Media);
};


// Link

var Link = new Schema({
	'name': String,
	'webaddr': String,
	'desc': String,
	'categories': [String],
	'private': String,
	'target': String,
	'notes': String,
	'rating': Number,
	'private': { type: Boolean, default: false }
});

Link.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Link = function(db){
	return mongoose.model('Link', Link);
};


// Comment

var Comment = new Schema({
	'text': String,
	'user': String,
	'date': Date,
	'post': String,
	'approved': { type: Boolean, default: false },
	'spam': { type: Boolean, default: false }
});

Comment.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Comment = function(db){
	return mongoose.model('Comment', Comment);
};


// Feedback

var Feedback = new Schema({
	'text': String,
	'user': String,
	'useremail': String
});

Feedback.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Feedback = function(db){
	return mongoose.model('Feedback', Feedback);
};


// Category

var Category = new Schema({
	'name': String,
	'parent': { type: String, default: 'None' },
	'desc': String
});

Category.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Category = function(db){
	return mongoose.model('Category', Category);
};


// Tag

var Tag = new Schema({
	'name': String,
	'desc': String
});

Tag.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.Tag = function(db){
	return mongoose.model('Tag', Tag);
};


// User

var User = new Schema({
	'username': String,
	'password': String,
	'email': String,
	'date_created': Date,
	'url': String,
	'blog': String
});

User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

exports.User = function(db){
	return mongoose.model('User', User);
};


// Setting

var Setting = new Schema({
	'general': {
		'sitetitle': String,
		'tagline': String,
		'email': String,
		'timezone': Number,
		'image': String
	},
	'writing': {
		'def_post_cat': String,
		'def_post_format': String,
		'def_link_cat': String
	},
	'reading': {
		'fpage_display': String,
		'fpage': String,
		'ppage': String,
		'num_posts': Number
	}
});

exports.Setting = function(db){
	return mongoose.model('Setting', Setting);
};