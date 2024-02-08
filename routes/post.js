const router = require('express').Router();
const passport = require('passport');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');
const checkPermission = require('../middlewares/checkPermission');

// GET list of all posts
router.get('/', postController.getAllPostsList);

// POST request to create a post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  postController.createPost
);

// GET request to get a specific post
router.get('/:postId', postController.getSpecificPost);

// DELETE request to delete a post
router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  postController.deletePost
);

// PUT request to update a post
router.put(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  postController.updatePost
);

// GET request to get all comments of specific post
router.get('/:postId/comments', commentController.getAllComments);

// POST request to create comment on specific post
router.post(
  '/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['user', 'author']),
  commentController.createComment
);

// DELETE request to delete specific comment on specific post
router.delete(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['user', 'author']),
  commentController.deleteComment
);

// PUT request to Update specific comment on specific post
router.put(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['user', 'author']),
  commentController.updateComment
);

// POST request to create like on specific post
router.post(
  '/:postId/likes',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['user']),
  likeController.createLike
);

// DELETE request to delete like on specific post
router.delete(
  '/:postId/likes/likeId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['user']),
  likeController.deleteLike
);

module.exports = router;
