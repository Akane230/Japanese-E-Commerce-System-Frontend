import { create } from "zustand";
import { cartApi } from "../utils/api";

const normalizeCart = (data) => {
  const rawItems = data?.items ?? [];

  const items = rawItems.map((item) => {
    // Use the item directly since backend already provides normalized data
    const quantity = item.quantity ?? 1;
    const price = parseFloat(item.unit_price) || 0;

    return {
      id: String(item.product_id || ""),
      slug: item.slug || "",
      name: item.name || "Unnamed Product",
      image: item.image || item.thumbnail || "",
      price: price,
      salePrice: null, // Backend doesn't provide sale price in current structure
      qty: quantity,
      currency: item.currency || "JPY", // Store product's currency
    };
  });

  const backendSubtotal =
    data.subtotal && data.subtotal > 0 ? data.subtotal : 0;
  const calculatedSubtotal = items.reduce(
    (sum, i) => sum + (i.price || 0) * i.qty,
    0,
  );

  return {
    items,
    item_count: data.item_count ?? items.reduce((sum, i) => sum + i.qty, 0),
    subtotal: backendSubtotal || calculatedSubtotal,
    total: backendSubtotal || calculatedSubtotal,
    is_authenticated: data.is_authenticated ?? false,
  };
};

export const useCartStore = create((set, get) => ({
  items: [],
  item_count: 0,
  subtotal: 0,
  total: 0,
  is_authenticated: false,
  isOpen: false,
  loading: false,
  error: null,

  // get total() {
  //   const state = get();
  //   return (
  //     state.subtotal ||
  //     state.items.reduce(
  //       (sum, i) => sum + (i.salePrice || i.price || 0) * i.qty,
  //       0,
  //     )
  //   );
  // },

  get count() {
    const state = get();
    return state.item_count ?? state.items.reduce((sum, i) => sum + i.qty, 0);
  },

  loadCart: async () => {
    try {
      set({ loading: true, error: null });
      const data = await cartApi.get();
      const normalized = normalizeCart(data);
      set({ ...normalized, loading: false });
    } catch (error) {
      console.error("Failed to load cart:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to load cart",
      });
    }
  },

  addItem: async (product, quantity = 1) => {
    try {
      if (!product || !product.id) {
        throw new Error("Product ID is missing. Cannot add to cart.");
      }

      set({ loading: true, error: null });

      const productId = String(product.id);

      if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        throw new Error("Invalid product ID format");
      }

      const payload = { product_id: productId, quantity };

      const data = await cartApi.add(payload);
      const normalized = normalizeCart(data);
      set({ ...normalized, loading: false });

      return { success: true };
    } catch (error) {
      console.error("Failed to add item to cart:", error);

      let errorMessage = "Failed to add item to cart";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          errorMessage;
      }

      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      set({ loading: true, error: null });

      // If quantity is 0 or negative, remove the item instead
      if (quantity <= 0) {
        return get().removeItem(productId);
      }

      // Validate ObjectId format before sending
      if (!/^[0-9a-fA-F]{24}$/.test(String(productId))) {
        throw new Error("Invalid product ID format");
      }

      const data = await cartApi.update({
        product_id: String(productId),
        quantity,
      });

      const normalized = normalizeCart(data);
      set({ ...normalized, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Failed to update cart item:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update cart",
      });
      return { success: false };
    }
  },

  removeItem: async (productId) => {
    try {
      set({ loading: true, error: null });

      // Validate ObjectId format before sending
      if (!/^[0-9a-fA-F]{24}$/.test(String(productId))) {
        throw new Error("Invalid product ID format");
      }

      const data = await cartApi.remove({ product_id: String(productId) });
      const normalized = normalizeCart(data);
      set({ ...normalized, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to remove item",
      });
      return { success: false };
    }
  },

  clearCart: async () => {
    try {
      set({ loading: true, error: null });
      await cartApi.clear();
      set({
        items: [],
        item_count: 0,
        subtotal: 0,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to clear cart:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to clear cart",
      });
      return { success: false };
    }
  },

  setIsOpen: (isOpen) => set({ isOpen }),
}));
