import { reviewApi } from "../utils/api";

export const reviewService = {
  // Get reviews for a product
  async getProductReviews(productId, params = {}) {
    return reviewApi.getProductReviews(productId, params);
  },

  // Create a review
  async createReview(reviewData) {
    return reviewApi.createReview(reviewData);
  },

  // Vote helpful on a review
  async voteHelpful(reviewId) {
    return reviewApi.voteHelpful(reviewId);
  },
};
