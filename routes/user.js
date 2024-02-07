const router = require('express').Router();
const userController = require('../controllers/userController');
const skipAuth = require('../middlewares/skipAuth');

// POST request to sing up new user
router.post('/signup', skipAuth, userController.userSignUp);

// POST request to login the user
router.post('/login', skipAuth, userController.userLogin);

module.exports = router;
