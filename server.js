/**
 * Express server setup and configuration.
 * Imports necessary modules, initializes the Express app, 
 * sets up middleware, defines routes
, and starts the server.
 */
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.listen(port, () => {
  console.log(`BlogSpot server running on port ${port}`);
});
