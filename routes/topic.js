const router = require('express').Router();
const topicController = require('../controllers/topicController');
const passport = require('passport');
const checkPermission = require('../middlewares/checkPermission');

// POST request to create topic
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  topicController.createTopic
);

// DELETE request to delete topic
router.delete(
  '/:topicId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  topicController.deleteTopic
);

// PUT request to update topic
router.put(
  '/:topicId',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['author']),
  topicController.updateTopic
);

module.exports = router;
