const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = null;

    if (!isValid) {
      error = new Error('Invalid mime type');
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('/',
  checkAuth,
  multer({storage}).single('image'),
  (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  }).save().then((post) => {
    res.status(201).json({
      message: "Post added successfully",
      post: getPostData(post)
    });
  });
});

router.put('/',
  checkAuth,
  multer({storage}).single('image'),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }

  const {id, ...rest} = req .body;
  const data = {
    ...rest,
    imagePath
  };

  Post.findByIdAndUpdate(id, data, {new: true})
    .then((post) => {
      res.status(200).json({
        message: "Post updated successfully",
        post: getPostData(post)
      });
    });
});

router.get('/', (req, res, next) => {
  const currentPage = +req.query.page;
  const pageSize = +req.query.pageSize;
  const postQuery = Post.find();

  if (typeof currentPage === 'number' && pageSize) {
    postQuery
      .skip(pageSize * currentPage)
      .limit(pageSize)
  }
  let posts = [];

  postQuery
    .then((documents) => {
      posts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts.map(getPostData),
        count
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({
          message: 'Post fetched successfully',
          post: getPostData(post)
        });
      } else {
        res.sendStatus(404);
      }

    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({message: 'success'});
    })
    .catch(err => {
      res.sendStatus(400);
    })

});

function getPostData(post) {
  const {_id, title, content, imagePath} = post;
  return {
    id: _id,
    title,
    content,
    imagePath
  }
}

module.exports = router;
