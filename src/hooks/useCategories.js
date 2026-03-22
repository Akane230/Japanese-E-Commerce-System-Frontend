import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../utils/api";

// Hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
