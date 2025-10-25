const axios = require("axios");

const PRODUCT_SERVICE_URL = "https://c5585f3d521799.lhr.life/api/v1/products";

async function getBulkProductDetails(productIds) {
  // if (!PRODUCT_SERVICE_URL) {
  //   throw new Error(
  //     "PRODUCT_SERVICE_URL is not configured in environment variables."
  //   );
  // }

  // Assuming the bulk fetch endpoint is /products/details or similar
  const url = `${PRODUCT_SERVICE_URL}/get-by-ids`;

  // The required payload structure
  const payload = { productIds: productIds };
  // Skip call if no product IDs are provided (e.g., empty cart)
  if (productIds.length === 0) {
    return [];
  }
  try {
    console.log(
      `[Product Service] Bulk fetching details for ${productIds.length} products from ${url}`
    );

    // --- AXIOS POST REQUEST ---
    const response = await axios.post(url, payload, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 && Array.isArray(response.data)) {
      // The response data is an array of product objects
      return response.data;
    }

    // Handle cases where the response is technically 200 but data is invalid
    throw new Error(
      `Invalid response structure from Product Service bulk fetch.`
    );
  } catch (error) {
    // Handle common HTTP and network errors
    if (error.response) {
      console.error(
        `Product Service Bulk HTTP Error: ${error.response.status}`,
        error.response.data
      );
      throw new Error(
        `Product Service bulk fetch failed with status ${error.response.status}.`
      );
    } else if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
      console.error(`Product Service bulk connection error: ${error.message}`);
      throw new Error(`Product Service is unreachable or timed out.`);
    } else {
      throw error;
    }
  }
}

module.exports = { getBulkProductDetails };
