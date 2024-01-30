const router = require('express').Router();
const singUpController = require('../controllers/singupController');

// Post request to Signup new author
router.post('/', singUpController.singUpPost);

module.exports = router;
