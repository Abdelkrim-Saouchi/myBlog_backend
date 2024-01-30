const router = require('express').Router();
const passport = require('passport');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

// GET list of all posts
router.get('/', postController.getAllPostsList);

// POST request to create a post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postController.createPost
);

// GET request to get a specific post
router.get('/:postId', postController.getSpecificPost);

// DELETE request to delete a post
router.delete('/:postId', postController.deletePost);

// PUT request to update a post
router.put('/:postId', postController.updatePost);

// GET request to get all comments of specific post
router.get('/:postId/comments', commentController.getAllComments);

// POST request to create comment on specific post
router.post('/:postId/comments', commentController.createComment);

// DELETE request to delete specific comment on specific post
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

// PUT request to Update specific comment on specific post
router.put('/:postId/comments/:commentId', commentController.updateComment);

module.exports = router;
