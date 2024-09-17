// controllers/CommentController.js
const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db");

/**
 * Class representing the CommentController.
 * Handles requests related to adding and retrieving comments.
 */
class CommentController {
  /**
   * Adds a new comment to a post.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise}
   */
  static async addComment(req, res) {
    const { postId, content } = req.body;
    const userId = req.userId;

    if (!postId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const commentsCollection = dbClient.db.collection("comments");

    try {
      const result = await commentsCollection.insertOne({
        postId: new ObjectId(postId),
        userId: new ObjectId(userId),
        content,
        createdAt: new Date(),
      });

      res.status(201).json({ id: result.insertedId, content });
    } catch (error) {
      res.status(500).json({ error: "Error adding comment" });
    }
  }

  /**
   * Gets comments for a specific post.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise}
   */
  static async getComments(req, res) {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const commentsCollection = dbClient.db.collection("comments");

    try {
      const [comments, total] = await Promise.all([
        commentsCollection
          .find({ postId: new ObjectId(postId) })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        commentsCollection.countDocuments({ postId: new ObjectId(postId) }),
      ]);

      res.status(200).json({
        comments,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching comments" });
    }
  }
}

module.exports = CommentController;
