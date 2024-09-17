// middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to verify user access tokens.
 * Checks
 for a valid JWT token in the Authorization header and decodes it.
 * If the token is valid, the decoded user ID is attached to the request object.
 * If the token is missing or invalid, an error response is sent.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the chain.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
