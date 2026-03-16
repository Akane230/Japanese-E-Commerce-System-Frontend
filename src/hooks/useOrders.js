import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/orderService";

// Hook for fetching user orders
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getOrders,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching single order
export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching order by number
export const useOrderByNumber = (orderNumber) => {
  return useQuery({
    queryKey: ["order", "number", orderNumber],
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for creating order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
