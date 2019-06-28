module.exports = (req, res, next) => {
  if (!req.userData) {
    return res.status(401).json({
      message: 'You are not authenticated'
    });
  }

  return next();
};
