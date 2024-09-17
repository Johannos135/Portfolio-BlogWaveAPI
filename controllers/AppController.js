// controllers/AppController.js
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");
/**
 * Controller for handling application-level operations.
 * Provides methods for checking service status and retrieving application statistics.
 */
class AppController {
  /**
   * Retrieves the status of Redis and database connections.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    res.status(200).send({ redis: redisStatus, db: dbStatus });
  }

  /**
   * Retrieves application statistics from Redis.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const postsCount = await dbClient.nbPosts();
      res.status(200).json({ users: usersCount, posts: postsCount });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = AppController;
