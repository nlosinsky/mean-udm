module.exports = (req, res, next) => {
  if (!req.userData) {
    return res.status(401).json({
      message: 'Auth Failed'
    });
  }

  return next();
};
