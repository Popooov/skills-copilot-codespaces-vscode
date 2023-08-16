// Create web server for comments page
var express = require('express');
var router = express.Router();
var auth = require('../auth');
var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');

// Get request for all comments
router.get('/', function(req, res, next) {
    Comment.find({}, function(err, comments) {
        if (err) {
            res.send(err);
        } else {
            res.render('comments', { title: 'Comments', comments: comments });
        }
    });
});

// Get request for specific comment
router.get('/:id', function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            res.send(err);
        } else {
            res.render('comment', { title: 'Comment', comment: comment });
        }
    });
});

// Get request for new comment
router.get('/new', auth.checkLogin, function(req, res, next) {
    res.render('newComment', { title: 'New Comment' });
});

// Get request for edit comment
router.get('/:id/edit', auth.checkLogin, function(req, res, next) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            res.send(err);
        } else {
            res.render('editComment', { title: 'Edit Comment', comment: comment });
        }
    });
});

// Post request for new comment
router.post('/', auth.checkLogin, function(req, res, next) {
    var comment = new Comment({
        text: req.body.text,
        post: req.body.post,
        user: req.user._id
    });
    comment.save(function(err) {

        // If error, send error
        if (err) {
            res.send(err);

        // If no error, redirect to comments page
        } else {
            res.redirect('/comments');
        }
    }
    );
});