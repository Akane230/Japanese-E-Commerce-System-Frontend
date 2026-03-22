import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

// Hook for fetching products with filters
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for searching products
export const useProductSearch = (query, enabled = true) => {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productService.searchProducts(query),
    enabled: enabled && !!query,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Hook for fetching single product
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProduct(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
