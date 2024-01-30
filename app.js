const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const signUpRouter = require('./routes/signup');
const loginRouter = require('./routes/login');

// Config passport js
const passport = require('passport');
const jwtStrategy = require('./config/jwtStrategy');
passport.use(jwtStrategy);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config db
require('./config/db');

// routes
app.use(indexRouter);
app.use('/api/v1/posts', postRouter);
app.use('/signup', signUpRouter);
app.use('/login', loginRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (req.app.get('env') === 'development') {
    res.json({
      message: err.message,
      error: err,
    });
  } else {
    res.json({
      message: err.message,
      error: {},
    });
  }
});

app.listen(3000, () => console.log('server Listening in port 3000'));
