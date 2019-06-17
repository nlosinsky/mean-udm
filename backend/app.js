const express = require('express');
const app = express();
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
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
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
