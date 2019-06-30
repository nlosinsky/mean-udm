const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const file = require('../middleware/file');
const postsController = require('../controllers/posts');

router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.post('/', checkAuth, file.storeImage, postsController.createPost);
router.put('/', checkAuth, file.storeImage, postsController.updatePost);
router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;
