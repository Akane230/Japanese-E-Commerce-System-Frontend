import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";

// Hook for fetching product reviews
export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: ["reviews", "product", productId, params],
    queryFn: () => reviewService.getProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for creating reviews
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      // Invalidate reviews for the product
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", variables.product_id],
      });
    },
  });
};

// Hook for voting helpful
export const useVoteHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }) => reviewService.voteHelpful(reviewId),
    onSuccess: (data, variables) => {
      // Invalidate all reviews to update the helpful count
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
