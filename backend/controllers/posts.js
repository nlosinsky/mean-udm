const Post = require('../models/Post');

exports.getPosts = (req, res, next) => {
  const currentPage = +req.query.page;
  const pageSize = +req.query.pageSize;
  const postQuery = Post.find({});

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
    })
    .catch(() => {
      res.status(500).json({
        message: 'Retrieving posts failed'
      });
    });
};

exports.getPost = (req, res, next) => {
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
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching post  failed'
      });
    });
};

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post added successfully",
        post: getPostData(post)
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Creating a post failed'
      })
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }

  const { id, ...rest } = req.body;
  const data = {
    ...rest,
    imagePath,
    creator: req.userData.userId
  };

  Post.findByIdAndUpdate(id, data)
    .then((post) => {
      res.status(200).json({
        message: "Post updated successfully",
        post: getPostData(post)
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Unable to update post'
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post.creator.toString() !== req.userData.userId) {
        return res.status(401).json({
          message: "Not authorized"
        });
      }

      return post.delete();
    })
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(() => {
      res.status(400).json({
        message: 'Deleting post failed'
      });
    });

};

function getPostData(post) {
  const { _id, title, content, imagePath, creator } = post;
  return {
    id: _id,
    title,
    content,
    imagePath,
    creator
  }
}
