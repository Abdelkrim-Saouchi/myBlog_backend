const router = require('express').Router();
const loginController = require('../controllers/loginController');

// Post request to login author
router.post('/', loginController.logInPost);

module.exports = router;
