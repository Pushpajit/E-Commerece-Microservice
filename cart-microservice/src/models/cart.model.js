const { getDb } = require('../config/db');

class CartModel {

    // 1. ADD/UPDATE ITEM
    static async addOrUpdateItem(userId, productId, quantity, price) {
        const db = getDb();
        const sql = `
            INSERT INTO cart_items (user_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            quantity = quantity + VALUES(quantity), price = VALUES(price);
        `;
        const [result] = await db.execute(sql, [userId, productId, quantity, price]);
        return result;
    }

    // 2. GET CART ITEMS
    // static async getCartItems(userId) {
    //     const db = getTry {
    //     const db = getDb();
    //     const sql = 'SELECT product_id, quantity, price FROM cart_items WHERE user_id = ?';
    //     const [items] = await db.execute(sql, [userId]);
    //     return items;
    // } catch (error) {
    //     console.error('Error in getCartItems model:', error);
    //     throw error; // Re-throw to be caught by controller
    // }
    // }
    static async getCartItems(userId) {
      const db = getDb();
      const sql = 'SELECT product_id, quantity, price FROM cart_items WHERE user_id = ?';
      try {
          const [items] = await db.execute(sql, [userId]);
          return items;
      } catch (error) {
          console.error('Error in getCartItems model:', error);
          throw error; // Re-throw to be caught by controller
      }
    
    }

    // 3. UPDATE QUANTITY
    static async updateQuantity(userId, productId, quantity) {
        const db = getDb();
        const sql = 'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?';
        const [result] = await db.execute(sql, [quantity, userId, productId]);
        return result;
    }

    // 4. REMOVE ITEM
    static async removeItem(userId, productId) {
        const db = getDb();
        const sql = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
        const [result] = await db.execute(sql, [userId, productId]);
        return result;
    }
}

module.exports = CartModel;
