const skipAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return res.status(403).json({ message: 'Already logged in!' });
  }
  next();
};

module.exports = skipAuth;
