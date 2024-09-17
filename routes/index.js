// routes/index.js
const express = require('express');
const AppController = require('../controllers/AppController');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getPosts);
router.put('/posts/:id', PostController.updatePost);
router.delete('/posts/:id', PostController.deletePost);

module.exports = router;