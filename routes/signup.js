const router = require('express').Router();
const Author = require('../models/author');

// Signup new author
router.post('/', async (req, res, next) => {
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
});

module.exports = router;
