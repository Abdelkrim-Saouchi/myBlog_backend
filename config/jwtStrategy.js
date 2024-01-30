const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const Author = require('../models/author');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET;

module.exports = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const author = Author.findOne({ id: jwt_payload.id }).exec();
    if (author) {
      return done(null, true);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});
