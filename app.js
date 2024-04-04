const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const authorSignUpRouter = require("./routes/authorSignup");
const authorLoginRouter = require("./routes/authorLogin");
const userRouter = require("./routes/user");
const topicRouter = require("./routes/topic");

// use helmet
app.use(helmet());

// Config passport js
const passport = require("passport");
const jwtStrategy = require("./config/jwtStrategy");
passport.use(jwtStrategy);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// allow specific domain
app.use(
  cors({
    origin: [
      "https://author-krimo-blog.netlify.app",
      "https://krimo-blog.netlify.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    optionsSuccessStatus: 200,
  }),
);

// Config db
require("./config/db");

// compress all routes
app.use(compression());

// set up rate limiter : max of 20 requests per minute
const RateLimit = require("express-rate-limit");
app.use(
  RateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20,
  }),
);

// routes
app.use(indexRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/authors/signup", authorSignUpRouter);
app.use("/api/v1/authors/login", authorLoginRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/topics", topicRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  if (req.app.get("env") === "development") {
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

app.listen(3000, () => console.log("server Listening in port 3000"));
