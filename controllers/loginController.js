const Author = require('../models/author');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.logInPost = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const author = await Author.findOne(
      { email: email },
      'email password'
    ).exec();

    if (email === author.email) {
      if (password === author.password) {
        const options = {};
        options.expiresIn = 120 * 60 * 60;
        const secret = process.env.SECRET;
        const token = jwt.sign(
          { id: author._id, email: author.email },
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
};
