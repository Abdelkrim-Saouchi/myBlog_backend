const User = require('../models/user');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.userSignUp = async (req, res, next) => {
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
};

exports.userLogin = async (req, res, next) => {
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
      });
    }
    return res.status(401).json({ message: 'Auth failed!' });
  } catch (err) {
    next(err);
  }
};
