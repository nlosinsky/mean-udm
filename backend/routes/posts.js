const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/', (req, res, next) => {
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

router.put('/', (req, res, next) => {
  const {id, title, content} = req .body;

  Post.findByIdAndUpdate(id, {title, content})
    .then((post) => {
      res.status(200).json({
        message: "Post updated successfully",
        post
      });
    });
});

router.get('/', (req, res, next) => {
  Post.find({})
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({
          message: 'Post fetched successfully',
          post
        });
      } else {
        res.sendStatus(404);
      }

    });
});

router.delete('/:id', (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({message: 'success'});
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    })

});

module.exports = router;
