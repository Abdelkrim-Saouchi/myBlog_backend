const checkPermission = (roleArray) => {
  return (req, res, next) => {
    if (!roleArray.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Not allowed to access the resource' });
    }
    next();
  };
};

module.exports = checkPermission;
