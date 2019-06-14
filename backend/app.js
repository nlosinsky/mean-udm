const express = require('express');
const app = express();
const Post = require('./models/Post');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://nick:YYedynKAzRs3LXw0@mean-udm-5uz3d.mongodb.net/test?retryWrites=true&w=majority');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  new Post({
    title: req.body.title,
    content: req.body.content
  }).save().then((post) => {
    res.status(201).json({
      message: "Post added successfully",
      post
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find({})
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({message: 'success'});
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    })

});

module.exports = app;
