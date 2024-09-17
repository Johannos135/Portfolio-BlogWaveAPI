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
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "blogpost";

    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    this.client.connect((err) => {
      if (err) {
        console.error("MongoDB connection error:", err);
      } else {
        this.db = this.client.db(database);
        console.log("Connected to MongoDB");
      }
    });
  }

  /**
   * Check if the MongoDB client is connected.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return !!this.client && !!this.db;
  }

  /**
   * Get the number of documents in the users collection.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    if (!this.db) return 0;
    return this.db.collection("users").countDocuments();
  }

  /**
   * Get the number of documents in the posts collection.
   * @returns {Promise<number>} The number of posts.
   */
  async nbPosts() {
    if (!this.db) return 0;
    return this.db.collection("posts").countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
