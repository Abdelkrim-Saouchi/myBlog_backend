const router = require('express').Router();
const passport = require('passport');
const postController = require('../controllers/postController');

// GET list of all posts
router.get('/', postController.getAllPostsList);

// POST request to create a post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  postController.createPost
);

// GET request to get a specific post
router.get('/:id', postController.getSpecificPost);

module.exports = router;
