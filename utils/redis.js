const redis = require("redis");
const { promisify } = require("util");

/**
 * Redis client class to interact with a Redis server.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   * Initializes a Redis client and sets up error handling.
   */
  constructor() {
    this.client = redis.createClient();
    this.client.on("error", (error) => {
      console.error(`Redis error: ${error}`);
    });
  }

  /**
   * Checks if the Redis client is connected to the server.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
     * Retrieves the value associated with a given key from Redis.
     * @param {string} key - The key to retrieve the value for.
     * @returns {Promise<string|null>} The value associated with the
 key, or null if the key doesn't exist.
     */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return await getAsync(key);
  }

  /**
   * Sets a key-value pair in Redis with an optional expiration time.
   * @param {string} key - The key to set.
   * @param {string} value - The value to associate with the key.
   * @param {number} duration - The expiration time for the key in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    await setAsync(key, duration, value);
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
