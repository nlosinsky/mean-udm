const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;

  res.status(201).json({
    message: "Post added successfully",
    post
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'asd123',
      title: 'Post title',
      content:'some content'
    },
    {
      id: 'asdas34123',
      title: 'Post title2',
      content:'some content2'
    },
  ];
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts
  });
});

module.exports = app;
