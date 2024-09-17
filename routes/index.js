// routes/index.js
const express = require('express');
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

router.post('/posts', PostController.createPost);
router.get('/posts', PostController.getPosts);
router.put('/posts/:id', PostController.updatePost);
router.delete('/posts/:id', PostController.deletePost);

module.exports = router;