import { productApi } from "../utils/api";

export const productService = {
  // Fetch products with filters
  async getProducts(params = {}) {
    return productApi.list(params);
  },

  // Fetch featured products
  async getFeaturedProducts() {
    return productApi.featured();
  },

  // Search products
  async searchProducts(query) {
    return productApi.search(query);
  },

  // Get product details
  async getProduct(slug) {
    return productApi.detail(slug);
  },
};
