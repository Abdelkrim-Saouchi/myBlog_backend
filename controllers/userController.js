const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.userSignUp = [
  body('username', 'Invalid username').trim().isLength({ min: 1 }).escape(),
  body('email', 'Invalid email').trim().isLength({ min: 1 }).escape(),
  body('password', 'Invalid password').trim().isLength({ min: 1 }).escape(),
  body('confirmation')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('Passwords do not match!'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    try {
      await user.save();
      res.json(user._id);
    } catch (err) {
      next(err);
    }
  },
];

exports.userLogin = [
  body('email', 'invalid email').trim().isLength({ min: 1 }).escape(),
  body('password', 'invalid password').trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email }).exec();
      if (email === user.email && password === user.password) {
        const options = {};
        options.expiresIn = '2 days';
        const secret = process.env.SECRET;
        const token = jwt.sign(
          { id: user._id, username: user.username, admin: false },
          secret,
          options
        );
        return res.json({
          message: 'Auth passed',
          token: token,
          userId: user._id,
        });
      }
      return res.status(401).json({ message: 'Auth failed!' });
    } catch (err) {
      next(err);
    }
  },
];
