const router = require('express').Router();
const authorSingUpController = require('../controllers/authorSingupController');

// Post request to Signup new author
router.post('/', authorSingUpController.authorSingUp);

module.exports = router;
