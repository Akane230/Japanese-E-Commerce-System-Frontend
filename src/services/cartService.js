import { cartApi } from "../utils/api";

export const cartService = {
  // Get cart
  async getCart() {
    return cartApi.get();
  },

  // Add item to cart
  async addToCart(productId, quantity) {
    return cartApi.add({ product_id: productId, quantity });
  },

  // Update cart item
  async updateCartItem(productId, quantity) {
    return cartApi.update({ product_id: productId, quantity });
  },

  // Remove item from cart
  async removeFromCart(productId) {
    return cartApi.remove({ product_id: productId });
  },

  // Clear cart
  async clearCart() {
    return cartApi.clear();
  },
};
