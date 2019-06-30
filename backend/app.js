const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');
const config = require('./config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb+srv://nick:${config.mongo_atlas_password}@mean-udm-5uz3d.mongodb.net/test?retryWrites=true&w=majority`);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

app.use((req, res, next) => {
  const header = req.get('Authorization');
  if (!header) return next();

  const token = header.split(' ')[1];
  if (!token) return next();

  try {
    req.userData = jwt.verify(token, config.jwt_secret);
  } catch(err) {
    return next();
  }

  return next();
});

app.use((req, res, next) => {
  const oldJson = res.json;

  res.json = function(data) {
    if (!req.userData) {
      data.logoutRequired = true;
    }

    oldJson.call(res, data);
  };

  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
