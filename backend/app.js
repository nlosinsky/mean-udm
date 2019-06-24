const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://nick:YYedynKAzRs3LXw0@mean-udm-5uz3d.mongodb.net/test?retryWrites=true&w=majority');

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
  const oldJson = res.json;

  res.json = function(data) {
    try {
      const token = req.get('Authorization').split(' ')[1];
      jwt.verify(token, 'secret');
    }  catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        data.logoutRequired = true;
      }
    } finally {
      oldJson.call(res, data);
    }
  };

  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
