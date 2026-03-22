import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Store tokens
      if (data?.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
      }
      // Update global auth store
      if (data?.user) {
        useAuthStore.setState({ user: data.user, isAuthenticated: true });
      }
    },
  });
};

// Hook for register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Store tokens
      if (data?.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
      }
      // Update global auth store
      if (data?.user) {
        useAuthStore.setState({ user: data.user, isAuthenticated: true });
      }
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear cache and local storage
      queryClient.clear();
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      // Reset auth store
      useAuthStore.setState({ user: null, isAuthenticated: false });
    },
  });
};

// Hook for current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};
// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      // Update cached user
      queryClient.setQueryData(["user"], data);
      // Sync auth store
      useAuthStore.setState({ user: data, isAuthenticated: true });
    },
  });
};

// Hook for toggling wishlist items
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.toggleWishlist,
    onSuccess: (data) => {
      // Refresh user profile (which contains wishlist)
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Update auth store wishlist field if available
      if (data?.wishlist) {
        useAuthStore.setState((state) => ({
          user: state.user
            ? { ...state.user, wishlist: data.wishlist }
            : state.user,
        }));
      }
    },
  });
};
