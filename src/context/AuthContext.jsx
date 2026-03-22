import React, { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export function AuthProvider({ children }) {
  const { loadCurrentUser } = useAuthStore();

  useEffect(() => {
    const hasTokens = !!localStorage.getItem("access");
    if (hasTokens) {
      loadCurrentUser();
    } else {
      useAuthStore.setState({ loading: false });
    }
  }, [loadCurrentUser]);

  return children;
}
