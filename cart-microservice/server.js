/**
 * Main Server Entry Point: server.js
 * * This file is responsible for three things:
 * 1. Loading environment variables (like DB credentials and PORT).
 * 2. Connecting to the MySQL database.
 * 3. Starting the Express application defined in src/app.js.
 */

// Load environment variables from .env file
require("dotenv").config();

const app = require("./src/app");
const { connectToDatabase } = require("./src/config/db");

// Use the PORT defined in the .env file, or default to 3000
const port = process.env.PORT || 3000;

/**
 * Executes the startup sequence: connect to DB, then start server.
 */
async function startServer() {
  try {
    // 1. Connect to the database (and ensure tables exist)
    await connectToDatabase();

    // 2. Start the Express server after successful DB connection
    app.listen(port, () => {
      console.log(`🚀 Cart Microservice running on http://localhost:${port}`);
    });
  } catch (error) {
    // Log the error and exit the process if connection or startup fails
    console.error(
      "❌ Failed to start server: Critical Error during startup or DB connection.",
      error.message
    );
    process.exit(1);
  }
}

startServer();
