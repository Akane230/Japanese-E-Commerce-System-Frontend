import React, { useEffect } from "react";
import { useCartStore } from "../stores/cartStore";

export const CartProvider = ({ children }) => {
  const { loadCart } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return children;
};
