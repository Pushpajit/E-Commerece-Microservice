const express = require("express");
const app = express();
const cartRoutes = require("./routes/cart.routes");

// Middleware to parse JSON bodies
app.use(express.json());

// --- API Routes ---
// All cart-related routes will be prefixed with /cart
app.use("/cart", cartRoutes);

// --- Health Check Route ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// --- 404 Handler ---
// Catch-all for routes that don't exist
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
