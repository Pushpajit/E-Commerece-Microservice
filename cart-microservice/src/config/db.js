const mysql = require("mysql2/promise");
const fs = require("fs");

function getSslConfig() {
  // Default to SSL enabled (Aiven/managed MySQL often requires it)
  const val = (process.env.DB_SSL || "true").toLowerCase();
  const shouldUseSsl = ["true", "1", "require"].includes(val);
  if (!shouldUseSsl) return undefined;

  const rua = (process.env.DB_SSL_REJECT_UNAUTHORIZED || "true").toLowerCase();
  const ssl = { rejectUnauthorized: rua !== "false" };

  if (process.env.DB_SSL_CA) {
    // Allow multiline certs passed via env (escaped \n)
    ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, "\n");
  } else if (process.env.DB_SSL_CA_PATH) {
    try {
      ssl.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8");
    } catch (_) {
      // Ignore read errors; connection may still succeed without CA
    }
  }
  return ssl;
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: getSslConfig(),
};

let pool;

// Function to establish database connection
async function connectToDatabase() {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to MySQL database.");
    connection.release();

    // Ensure the cart_items table exists
    await createCartTable();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Rethrow error to be caught by startServer
    throw error;
  }
}

// Function to create the cart_items table if it doesn't exist
async function createCartTable() {
  const createTableSql = `
        CREATE TABLE IF NOT EXISTS cart_items (
            item_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL, -- Foreign key reference to User Service
            product_id INT NOT NULL,       -- Foreign key reference to Product Service
            quantity INT NOT NULL DEFAULT 1,
            -- Snapshot of the price at the time of adding to cart.
            price DECIMAL(10, 2) NOT NULL, 
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_cart_item (user_id, product_id)
        );
    `;
  await pool.execute(createTableSql);
  console.log("📦 Cart table checked/created successfully.");
}

/**
 * Gets the active database connection pool.
 * @returns {mysql.Pool} The active database connection pool.
 */
function getDb() {
  if (!pool) {
    throw new Error("Database not connected. Call connectToDatabase first.");
  }
  return pool;
}

module.exports = { connectToDatabase, getDb };
