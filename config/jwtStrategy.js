const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const Author = require('../models/author');
const User = require('../models/user');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

const verifyAuthor = (payload, done) => {
  const author = Author.findOne({ id: payload.id }).exec();
  if (author) {
    return done(null, true);
  }
  return done(null, false);
};

const verifyUser = (payload, done) => {
  const user = User.findOne({ id: payload.id }).exec();
  if (user) {
    return done(null, true);
  }
  return done(null, false);
};

module.exports = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    if (jwt_payload.admin) {
      verifyAuthor(jwt_payload, done);
    } else {
      verifyUser(jwt_payload, done);
    }
  } catch (err) {
    return done(err, false);
  }
});
