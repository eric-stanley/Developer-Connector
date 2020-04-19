const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// post model
const Post = require('../../models/Post');
// profile model
const Profile = require('../../models/Profile');

// validation
const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');

// @route    GET api/posts
// @desc     get posts
// @access   public
router.get('/', (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
      err,
      no_posts_found: 'No posts found'
    }));
});

// @route    GET api/posts/:id
// @desc     get post by id
// @access   public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({
      err,
      no_post_found: 'No post found with that id'
    }));
});

// @route    POST api/posts
// @desc     create post
// @access   private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    // if any errors send 400 with errors objects
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(400).json(err));
});

// @route    DELETE api/posts/:id
// @desc     delete post by id
// @access   private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              not_authorized: 'User not authorized'
            });
          }

          post.remove().then(() => {
            return res.json({
              success: true
            });
          }).catch(err => res.status(404).json({
            err,
            error_occurred: 'Error occurred while deleting post'
          }));
        }).catch(err => res.status(404).json({
          err,
          post_not_found: 'Post not found'
        }));
    });
});

// @route    POST api/posts/like/:id
// @desc     like post
// @access   private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({
              already_liked: 'User already liked this post'
            })
          }
          // add user id to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save()
            .then(post => res.json(post))
            .catch(err => res.status(404).json({
              err,
              error_occurred: 'Error occurred while liking the post'
            }));
        }).catch(err => res.status(404).json({
          err,
          post_not_found: 'Post not found'
        }));
    });
});

// @route    POST api/posts/unlike/:id
// @desc     unlike post
// @access   private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
              not_liked: 'You have not yet liked this post'
            });
          }
          // get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // splie out of array
          post.likes.splice(removeIndex, 1);
          post.save().then(post => {
            res.json(post);
          }).catch(err => res.json({
            err,
            error_occurred: 'Error occurred while unliking post'
          }));
        }).catch(err => res.status(404).json({
          err,
          post_not_found: 'Post not found'
        }));
    });
});

// @route    POST api/posts/comment/:id
// @desc     add comment to post
// @access   private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateCommentInput(req.body);

  // check validation
  if (!isValid) {
    // if any errors send 400 with errors objects
    return res.status(400).json(errors);
  }

  Post.findById(req.params.id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }

      // add to comments array
      post.comments.unshift(newComment);
      post.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
          err,
          error_occurred: 'Error occurred while saving comment'
        }));
    }).catch(err => res.status(404).json({
      err,
      post_not_found: 'No post found'
    }));
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     delete comment from post
// @access   private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Post.findById(req.params.id)
    .then(post => {
      // check if the comment exist
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({
          comment_not_exist: 'Comment does not exist'
        });
      }

      // get the remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      //splice comment out of array
      post.comments.splice(removeIndex, 1);
      post.save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({
          err,
          error_occurred: 'Error occurred while deleting comment'
        }));
    }).catch(err => res.status(404).json({
      err,
      post_not_found: 'No post found'
    }));
});

module.exports = router;