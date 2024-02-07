const router = require('express').Router();
const authorLoginController = require('../controllers/authorLoginController');
const skipAuth = require('../middlewares/skipAuth');

// Post request to login author
router.post('/', skipAuth, authorLoginController.authorLogIn);

module.exports = router;
