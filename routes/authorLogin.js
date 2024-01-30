const router = require('express').Router();
const authorLoginController = require('../controllers/authorLoginController');

// Post request to login author
router.post('/', authorLoginController.authorLogIn);

module.exports = router;
