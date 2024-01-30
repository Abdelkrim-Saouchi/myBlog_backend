const router = require('express').Router();
const userController = require('../controllers/userController');

// POST request to sing up new user
router.post('/signup', userController.userSignUp);

// POST request to login the user
router.post('/login', userController.userLogin);

module.exports = router;
