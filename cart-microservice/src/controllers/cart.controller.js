const CartModel = require("../models/cart.model");
const { getBulkProductDetails } = require("./product.service.client");
// 1. ADD ITEM TO CART
exports.addItemToCart = async (req, res, next) => {
  const { userId, productId, quantity, price } = req.body;

  if (!userId || !productId || !quantity || !price) {
    return res.status(400).json({
      error: "Missing required fields: userId, productId, quantity, and price.",
    });
  }

  try {
    const result = await CartModel.addOrUpdateItem(
      userId,
      productId,
      quantity,
      price
    );
    res.status(201).json({
      message: "Item added/updated in cart successfully",
      rowsAffected: result.affectedRows,
    });
  } catch (error) {
    console.error("Error in addItemToCart controller:", error);
    next(error); // Pass to global error handler
  }
};

// 2. GET CART CONTENTS
exports.getCartByUserId = async (req, res, next) => {
  const { userId } = req.params;
  console.log("Fetching cart for userId:", userId);
  try {
    const items = await CartModel.getCartItems(userId);
    console.log("Items fetched:", items.length);
    // const products = await getBulkProductDetails(
    //   items.map((item) => item.productId)
    // );
    const url = "https://5a22f686919d5f.lhr.life/api/v1/products/get-by-ids";
    const payload = { productIds: items.map((item) => item.productId) };
    const products = axios.post(url, payload, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    res.status(200).json({
      userId,
      items: items,
      totalItems: totalItems,
      cartTotal: parseFloat(cartTotal).toFixed(2),
      products: products.data,
    });
  } catch (error) {
    console.error("Error in getCartByUserId controller:", error);
    next(error); // Pass to global error handler
  }
};

// 3. UPDATE ITEM QUANTITY
exports.updateItemQuantity = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || typeof quantity !== "number" || quantity < 1) {
    return res.status(400).json({
      error:
        "Missing or invalid fields: userId, productId, and a quantity >= 1.",
    });
  }

  try {
    const result = await CartModel.updateQuantity(userId, productId, quantity);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Item not found in cart for this user." });
    }

    res.status(200).json({ message: "Item quantity updated successfully." });
  } catch (error) {
    console.error("Error in updateItemQuantity controller:", error);
    next(error); // Pass to global error handler
  }
};

// 4. REMOVE ITEM FROM CART
exports.removeItemFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "Missing required fields: userId and productId." });
  }

  try {
    const result = await CartModel.removeItem(userId, productId);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Item not found in cart for this user." });
    }

    res.status(200).json({ message: "Item removed from cart successfully." });
  } catch (error) {
    console.error("Error in removeItemFromCart controller:", error);
    next(error); // Pass to global error handler
  }
};
