import { useAuthStore } from "../stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useAuth = () => {
  return useAuthStore();
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
