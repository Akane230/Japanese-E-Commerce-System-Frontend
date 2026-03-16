import { authApi } from "../utils/api";

export const authService = {
  // Register user
  async register(userData) {
    return authApi.register(userData);
  },

  // Login user
  async login(credentials) {
    return authApi.login(credentials);
  },

  // Logout user
  async logout() {
    return authApi.logout();
  },

  // Get current user
  async getCurrentUser() {
    return authApi.me();
  },

  // Update profile
  async updateProfile(profileData) {
    return authApi.updateProfile(profileData);
  },

  // Toggle wishlist item
  async toggleWishlist(productId) {
    return authApi.toggleWishlist(productId);
  },

  // Add address
  async addAddress(addressData) {
    return authApi.addAddress(addressData);
  },

  // Add payment method
  async addPaymentMethod(paymentData) {
    return authApi.addPaymentMethod(paymentData);
  },
};
