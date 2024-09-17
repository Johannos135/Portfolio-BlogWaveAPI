// routes/index.js
const express = require('express');
const AppController = require('../controllers/AppController');
const AuthController = require('../controllers/AuthController');
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

router.get('/posts', PostController.getPosts);
router.post('/posts', authMiddleware, PostController.createPost);
router.put('/posts/:id', authMiddleware, PostController.updatePost);
router.delete('/posts/:id', authMiddleware, PostController.deletePost);

module.exports = router;