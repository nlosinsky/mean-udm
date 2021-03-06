const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => new User({ email, passwordHash: hash }).save())
    .then((newUser) => {
      res.status(201).json({
        message: 'User has been created successfully',
        user: newUser
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Invalid authentication credentials'
      })
    })
};

exports.userLogin = (req, res, next) => {
  let fetchedUser = null;

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Auth failed'
        })
      }

      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.passwordHash)
    })
    .then(valid => {
      if (!valid) {
        return res.status(401).json({
          message: 'Password is incorrect'
        });
      }

      jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        JWT_SECRET,
        { expiresIn: '4h' },
        (err, token) => {
          if (err) throw err;

          res.status(200).json({
            message: 'Auth Success',
            token,
            userId: fetchedUser._id
          })
        });
    })
    .catch((err) => {
      return res.status(404).json({
        message: 'Invalid authentication credentials'
      })
    });
};
