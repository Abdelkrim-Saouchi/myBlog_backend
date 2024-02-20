const Author = require('../models/author');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

exports.authorLogIn = [
  body('email', 'invalid email').trim().isLength({ min: 1 }).escape(),
  body('password', 'invalid password').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const author = await Author.findOne(
        { email: email },
        'email password'
      ).exec();

      if (email === author.email) {
        const match = await bcrypt.compare(password, author.password);
        if (match) {
          const options = {};
          options.expiresIn = 120 * 60 * 60;
          const secret = process.env.SECRET;
          const token = jwt.sign(
            { id: author._id, email: author.email, admin: true },
            secret,
            options
          );
          return res.json({
            message: 'auth passed',
            token: token,
          });
        }
      }
      res.status(401).json({ message: 'Auth failed' });
    } catch (err) {
      next(err);
    }
  },
];
