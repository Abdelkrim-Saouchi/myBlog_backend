const Author = require('../models/author');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.authorSingUp = [
  body('firstName', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'email must not be empty').trim().isLength({ min: 1 }).escape(),
  body('password', 'password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('confirmation')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match!')
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Invalid inputs', errors: errors.array() });
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) return next(err);

      const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      });

      try {
        await author.save();
        res.json(author);
      } catch (err) {
        next(err);
      }
    });
  },
];
