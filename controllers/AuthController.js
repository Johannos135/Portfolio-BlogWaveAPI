// controllers/AuthController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbClient = require("../utils/db");
require("dotenv").config();

/**
 * Controller for handling user authentication.
 * Provides methods for user registration and login.
 */
class AuthController {
  /**
   * Registers a new user.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static async register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usersCollection = dbClient.db.collection("users");

    try {
      const result = await usersCollection.insertOne({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ id: result.insertedId, username, email });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  }

  /**
   * Logs in an existing user.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const usersCollection = dbClient.db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  }
}

module.exports = AuthController;
