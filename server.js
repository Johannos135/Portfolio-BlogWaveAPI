/**
 * Express server setup and configuration.
 * Imports necessary modules, initializes the Express app, 
 * sets up middleware, defines routes
, and starts the server.
 */
const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", routes);

app.listen(port, () => {
  console.log(`BlogSpot server running on port ${port}`);
});

module.exports = app;