const router = require('express').Router();
const passport = require('passport');

// GET list of all posts
router.get('/', (req, res) => {
  res.json({ posts: ['Hello'] });
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'post created' });
  }
);

module.exports = router;
