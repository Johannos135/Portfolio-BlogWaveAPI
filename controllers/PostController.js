// controllers/PostController.js
const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

/**
 * Controller for managing posts.
 * Provides methods for creating, retrieving, updating, and deleting posts.
 */
class PostController {
  /**
   * Creates a new post.
   * @param {Request} req - The Express request object containing the post data in the body.
   * @param {Response} res - The Express response object.
   */
  static async createPost(req, res) {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const postsCollection = dbClient.db.collection("posts");

    try {
      const result = await postsCollection.insertOne({
        title,
        content,
        userId: new ObjectId(userId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Invalidate cache
      await redisClient.del("posts");

      res.status(201).json({ id: result.insertedId, title, content });
    } catch (error) {
      res.status(500).json({ error: "Error creating post" });
    }
  }

  /**
   * Retrieves all posts or a specific post by ID.
   * If no ID is provided, retrieves all posts.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static async getPosts(req, res) {
    const cachedPosts = await redisClient.get("posts");

    if (cachedPosts) {
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const postsCollection = dbClient.db.collection("posts");

    try {
      const posts = await postsCollection.find().toArray();
      await redisClient.set("posts", JSON.stringify(posts), 3600); // Cache for 1 hour
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching posts" });
    }
  }

  /**
   * Updates a post by ID.
   * @param {Request} req - The Express request object containing the post ID in the params and update data in the body.
   * @param {Response} res - The Express response object.
   */
  static async updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ error: "No update data provided" });
    }

    const postsCollection = dbClient.db.collection("posts");

    try {
      const result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, content, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Invalidate cache
      await redisClient.del("posts");

      res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating post" });
    }
  }

  /**
   * Deletes a post by ID.
   * @param {Request} req - The Express request object containing the post ID in the params.
   * @param {Response} res - The Express response object.
   */
  static async deletePost(req, res) {
    const { id } = req.params;

    const postsCollection = dbClient.db.collection("posts");

    try {
      const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Invalidate cache
      await redisClient.del("posts");

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting post" });
    }
  }
}

module.exports = PostController;
