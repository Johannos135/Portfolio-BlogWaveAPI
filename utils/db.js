// utils/db.js
const { MongoClient } = require("mongodb");

/**
 * DBClient class for managing MongoDB operations.
 * This class provides methods for connecting to MongoDB and performing basic operations.
 */
class DBClient {
  /**
   * Create a new DBClient instance.
   * Initializes a connection to MongoDB using environment variables or default values.
   */
  constructor() {
    this.host = process.env.DB_HOST || "localhost";
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || "blogspot";
    this.client = new MongoClient(
      `mongodb://${this.host}:${this.port}/${this.database}`
    );
  }

  /**
   * Connects to the database.
   * @async
   * @returns {Promise<void>}
   */
  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Returns the number of users in the database
   * @returns {Promise<number>}
   */
  async nbUsers() {
    const usersCollection = this.client.db().collection("users");
    return await usersCollection.countDocuments();
  }

  /**
   * Returns the number of posts in the database
   * @returns {Promise<number>}
   */
  async nbPosts() {
    const postsCollection = this.client.db().collection("posts");
    return await postsCollection.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
