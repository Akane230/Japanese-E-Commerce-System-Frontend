import { useAuthStore } from "../stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useAuth = () => {
  return useAuthStore();
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressData) => authService.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      useAuthStore.getState().reloadProfile();
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idx, addressData }) =>
      authService.updateAddress(idx, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      useAuthStore.getState().reloadProfile();
    },
  });
};

export const useRemoveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idx) => authService.removeAddress(idx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      useAuthStore.getState().reloadProfile();
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idx) => authService.setDefaultAddress(idx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      useAuthStore.getState().reloadProfile();
    },
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      useAuthStore.getState().reloadProfile();
    },
  });
};
