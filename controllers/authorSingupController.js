const Author = require('../models/author');

exports.authorSingUp = async (req, res, next) => {
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await author.save();
    res.json(author);
  } catch (err) {
    next(err);
  }
};
