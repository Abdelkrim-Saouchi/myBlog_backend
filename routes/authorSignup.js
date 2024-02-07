const router = require('express').Router();
const authorSingUpController = require('../controllers/authorSingupController');
const skipAuth = require('../middlewares/skipAuth');

// Post request to Signup new author
router.post('/', skipAuth, authorSingUpController.authorSingUp);

module.exports = router;
