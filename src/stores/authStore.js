import { create } from "zustand";
import { authApi } from "../utils/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  loadCurrentUser: async () => {
    try {
      const profile = await authApi.me();
      set({ user: profile, loading: false, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      set({ user: null, loading: false, isAuthenticated: false });
    }
  },

  login: async ({ email, password }) => {
    try {
      const data = await authApi.login({ email, password });

      if (data?.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
      }

      if (data?.user) {
        set({ user: data.user, isAuthenticated: true });
      } else {
        await get().loadCurrentUser();
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  register: async (payload) => {
    try {
      const data = await authApi.register(payload);
      // Auto-login after successful registration if tokens are returned
      if (data?.tokens) {
        localStorage.setItem("access", data.tokens.access);
        localStorage.setItem("refresh", data.tokens.refresh);
        if (data?.user) {
          set({ user: data.user, isAuthenticated: true });
        } else {
          await get().loadCurrentUser();
        }
      } else {
        // Fallback: try logging in with the same credentials
        await get().login({ email: payload.email, password: payload.password });
      }
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      set({ user: null, isAuthenticated: false });
    }
  },

  reloadProfile: async () => {
    await get().loadCurrentUser();
  },
}));
