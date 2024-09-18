// routes/index.js
const express = require("express");
const AppController = require("../controllers/AppController");
const AuthController = require("../controllers/AuthController");
const PostController = require("../controllers/PostController");
const ReadingHistoryController = require("../controllers/ReadingHistoryController");
const CommentController = require("../controllers/CommentController");
const authMiddleware = require("../middleware/auth");
const upload = require("../utils/upload");

const router = express.Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

router.get("/posts", PostController.getPosts);
router.post(
  "/posts",
  authMiddleware,
  upload.single("headerImage"),
  PostController.createPost
);
router.put("/posts/:id", authMiddleware, PostController.updatePost);
router.delete("/posts/:id", authMiddleware, PostController.deletePost);

router.post("/users/reading-history", authMiddleware, ReadingHistoryController.addToHistory);
router.get("/users/reading-history", authMiddleware, ReadingHistoryController.getHistory);

router.post("/comments", authMiddleware, CommentController.addComment);
router.get("/posts/:postId/comments", CommentController.getComments);

module.exports = router;
