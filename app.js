const express = require('express');
const app = express();
const cors = require('cors');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const authorSignUpRouter = require('./routes/authorSignup');
const authorLoginRouter = require('./routes/authorLogin');
const userRouter = require('./routes/user');
const topicRouter = require('./routes/topic');

// Config passport js
const passport = require('passport');
const jwtStrategy = require('./config/jwtStrategy');
passport.use(jwtStrategy);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Config db
require('./config/db');

// routes
app.use(indexRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/authors/signup', authorSignUpRouter);
app.use('/api/v1/authors/login', authorLoginRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/topics', topicRouter);

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
