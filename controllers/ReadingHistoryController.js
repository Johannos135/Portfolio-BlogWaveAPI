// controllers/ReadingHistoryController.js
const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db");

/**
 * Class representing the ReadingHistoryController.
 * Handles requests related to a user's reading history.
 */
class ReadingHistoryController {
  /**
   * Adds a post to a user's reading history.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise}
   */
  static async addToHistory(req, res) {
    const userId = req.userId;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Missing postId" });
    }

    const historyCollection = dbClient.db.collection("readingHistory");

    try {
      await historyCollection.updateOne(
        { userId: new ObjectId(userId), postId: new ObjectId(postId) },
        { $set: { readAt: new Date() } },
        { upsert: true }
      );

      res.status(200).json({ message: "Added to reading history" });
    } catch (error) {
      res.status(500).json({ error: "Error adding to reading history" });
    }
  }

  /**
   * Gets a user's reading history.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise}
   */
  static async getHistory(req, res) {
    const { userId } = req.body;

    const historyCollection = dbClient.db.collection("readingHistory");
    const postsCollection = dbClient.db.collection("posts");

    try {
      const history = await historyCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ readAt: -1 })
        .limit(20)
        .toArray();

      const postIds = history.map((item) => item.postId);
      const posts = await postsCollection
        .find({ _id: { $in: postIds } })
        .toArray();

      const result = history.map((item) => {
        const post = posts.find(
          (p) => p._id.toString() === item.postId.toString()
        );
        return {
          postId: item.postId,
          readAt: item.readAt,
          title: post.title,
          headerImage: post.headerImage,
        };
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error fetching reading history" });
    }
  }
}

module.exports = ReadingHistoryController;
