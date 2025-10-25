const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

console.log("Setting up cart routes..."); 
// 1. ADD ITEM TO CART (CREATE)
// POST /cart/add
router.post("/add", cartController.addItemToCart);

// 2. GET CART CONTENTS (READ)
// GET /cart/:userId
router.get("/:userId", cartController.getCartByUserId);

// 3. UPDATE ITEM QUANTITY (UPDATE)
// PUT /cart/update
router.put("/update", cartController.updateItemQuantity);

// 4. REMOVE ITEM FROM CART (DELETE)
// DELETE /cart/remove
router.delete("/remove", cartController.removeItemFromCart);

module.exports = router;
