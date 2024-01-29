const express = require('express');

const app = express();
const indexRouter = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config db
require('./config/db');

// routes
app.use(indexRouter);

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
