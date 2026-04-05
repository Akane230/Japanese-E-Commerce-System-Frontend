import axios from "axios";

/**
 * API Configuration and Interceptors
 *
 * Configures axios instance with authentication, token refresh handling,
 * and response normalization for the Django backend API.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor to attach JWT access token to all requests
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Token refresh queue management
let isRefreshing = false;
let refreshQueue = [];

const runRefreshQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  refreshQueue = [];
};

/**
 * Response interceptor to handle 401 Unauthorized errors
 *
 * Automatically attempts to refresh the access token when a 401 occurs.
 * Queues multiple requests that fail during refresh to prevent multiple refresh attempts.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue requests if a refresh is already in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const res = await axios.post("/api/auth/token/refresh/", { refresh });
      const newAccess = res.data?.data?.access || res.data?.access;

      if (!newAccess) {
        throw new Error("No access token in refresh response");
      }

      localStorage.setItem("access", newAccess);
      isRefreshing = false;
      runRefreshQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      runRefreshQueue(err, null);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return Promise.reject(err);
    }
  },
);

/**
 * API Response Utilities
 *
 * Helper functions to normalize API responses and extract error messages.
 */

// Extracts data from the standard API response envelope { success, message, data }
const unwrap = (response) => response.data?.data ?? response.data;

/**
 * Extracts a user-friendly error message from an API error response
 *
 * Handles various error formats including DRF serializer errors,
 * string responses, and nested error objects.
 *
 * @param {Error} error - The error object from a failed request
 * @param {string} fallback - Default message if no specific error can be extracted
 * @returns {string} User-friendly error message
 */
export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.detail) return data.detail;

  if (data.errors && typeof data.errors === "object") {
    const firstKey = Object.keys(data.errors)[0];
    const val = data.errors[firstKey];
    if (Array.isArray(val) && val[0]) return String(val[0]);
    if (typeof val === "string") return val;
  }
  return fallback;
}

function unwrapListPayload(response) {
  const raw = response.data?.data ?? response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.results)) return raw.results; // DRF pagination
  if (Array.isArray(raw?.data?.results)) return raw.data.results;
  return [];
}

/**
 * Product Data Normalization
 *
 * Normalizes product objects from various API response formats into a consistent
 * structure expected by the UI components. Generates proper Cloudinary URLs.
 *
 * @param {Object} prod - Raw product object from API
 * @returns {Object} Normalized product with consistent field names and structure
 */
function normalizeProduct(prod) {
  if (!prod || typeof prod !== "object") return prod;

  const p = { ...prod };
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "djtdar2ex";

  // Helper to generate Cloudinary URL
  const getCloudinaryUrl = (publicId, options = {}) => {
    if (!publicId) return "";

    // If no options are provided, return the original (full-res) asset URL.
    const hasTransforms = Object.keys(options).length > 0;
    if (!hasTransforms) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
    }

    const { width, height, crop = "fill", quality = "auto" } = options;

    const transforms = [];
    if (crop) transforms.push(`c_${crop}`);
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (quality) transforms.push(`q_${quality}`);

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
  };

  // Core identifiers
  p.id = p.id || p._id || "";

  // Handle bilingual fields (en/ja)
  if (p.name && typeof p.name === "object") {
    p.nameJa = p.name.ja || p.nameJa || "";
    p.name = p.name.en || p.nameJa || "";
  }

  if (p.description && typeof p.description === "object") {
    p.descriptionJa = p.description.ja || p.descriptionJa || "";
    p.description = p.description.en || p.descriptionJa || "";
  }

  // Pricing
  p.price = p.price || p.pricing?.base_price || 0;
  p.salePrice = p.sale_price || p.salePrice || p.pricing?.sale_price || null;
  p.currency = p.currency || p.pricing?.currency || "JPY";

  // Defaults
  p.name = p.name || "Unnamed Product";
  p.slug = p.slug || "";

  // Media handling - generate Cloudinary URLs
  if (p.media) {
    // Generate thumbnail URL (use original full resolution)
    if (p.media.thumbnail) {
      p.thumbnail = getCloudinaryUrl(p.media.thumbnail);
      p.image = p.thumbnail; // Use as primary image
    }

    // Generate image URLs array
    if (p.media.images && Array.isArray(p.media.images)) {
      p.images = p.media.images.map((imgId) =>
        getCloudinaryUrl(imgId, { width: 800 }),
      );
    } else {
      p.images = [];
    }

    // Generate video URL
    if (p.media.video_url) {
      p.videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${p.media.video_url}`;
    }
  }

  // Fallback to thumbnail_url if provided by serializer
  if (!p.image && p.thumbnail_url) {
    p.image = p.thumbnail_url;
  }

  // Ensure we always have an images array
  if (!p.images || !p.images.length) {
    p.images = p.image ? [p.image] : [];
  }

  // Attributes
  p.brand = p.brand || p.attributes?.brand || "";
  p.rating = p.rating || p.rating_summary?.average || 0;
  p.reviews = p.reviews || p.rating_summary?.count || 0;
  p.category = p.category || p.category_ids?.[0] || "";
  p.isFeatured = p.is_featured || p.isFeatured || false;
  p.isBestseller = p.is_bestseller || p.isBestseller || false;
  p.ships = p.ships_internationally || p.ships || false;
  p.shelfLife = p.shelf_life_days || p.shelfLife || 0;
  p.certifications = p.certifications || p.attributes?.certifications || [];
  p.ingredients = p.ingredients || p.attributes?.ingredients || [];
  p.allergens = p.allergens || p.attributes?.allergens || [];

  // Inventory fields from API detail endpoint
  p.quantity_available =
    p.quantity_available !== undefined && p.quantity_available !== null
      ? p.quantity_available
      : p.inventory?.quantity_available || 0;
  p.in_stock =
    p.in_stock !== undefined && p.in_stock !== null ? p.in_stock : true;
  p.is_low_stock =
    p.is_low_stock !== undefined && p.is_low_stock !== null
      ? p.is_low_stock
      : false;

  return p;
}
function normalizeProducts(list) {
  if (!Array.isArray(list)) return list;
  return list.map(normalizeProduct);
}

/**
 * API Service Modules
 *
 * Organized by domain with consistent error handling and response normalization.
 * Each method returns normalized data and throws errors with user-friendly messages.
 */

// ============================================================================
// Authentication API
// ============================================================================

export const authApi = {
  async register(payload) {
    try {
      const res = await api.post("/auth/register/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Registration failed:", error);
      throw error;
    }
  },

  async login(payload) {
    try {
      const res = await api.post("/auth/login/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Login failed:", error);
      throw error;
    }
  },

  async logout() {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return;

    try {
      await api.post("/auth/logout/", { refresh });
    } catch (error) {
      console.error("[Auth API] Logout failed:", error);
      throw error;
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  },

  async me() {
    try {
      const res = await api.get("/auth/me/");
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to fetch user profile:", error);
      throw error;
    }
  },

  async updateProfile(payload) {
    try {
      const res = await api.put("/auth/profile/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Profile update failed:", error);
      throw error;
    }
  },

  async changePassword(payload) {
    try {
      const res = await api.post("/auth/change-password/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Password change failed:", error);
      throw error;
    }
  },

  async addAddress(payload) {
    try {
      const res = await api.post("/auth/addresses/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to add address:", error);
      throw error;
    }
  },

  async updateAddress(idx, payload) {
    try {
      const res = await api.put(`/auth/addresses/${idx}/update/`, payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to update address:", error);
      throw error;
    }
  },

  async removeAddress(idx) {
    try {
      const res = await api.delete(`/auth/addresses/${idx}/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to remove address:", error);
      throw error;
    }
  },

  async setDefaultAddress(idx) {
    try {
      const res = await api.post(`/auth/addresses/${idx}/set-default/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to set default address:", error);
      throw error;
    }
  },

  async addPaymentMethod(payload) {
    try {
      const res = await api.post("/auth/payment-methods/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Failed to add payment method:", error);
      throw error;
    }
  },

  async toggleWishlist(id) {
    try {
      const res = await api.post(`/auth/wishlist/${id}/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Auth API] Wishlist toggle failed:", error);
      throw error;
    }
  },
};

// ============================================================================
// Products & Categories API
// ============================================================================

export const productApi = {
  /**
   * Fetches paginated list of products with optional filters
   * @param {Object} params - Query parameters (page, category, sort, etc.)
   */
  async list(params = {}) {
    try {
      const res = await api.get("/products/", { params });
      const list = unwrapListPayload(res);
      return normalizeProducts(list);
    } catch (error) {
      console.error("[Product API] Failed to fetch product list:", error);
      throw error;
    }
  },

  async featured() {
    try {
      const res = await api.get("/products/featured/");
      let data = unwrap(res);
      return normalizeProducts(data);
    } catch (error) {
      console.error("[Product API] Failed to fetch featured products:", error);
      throw error;
    }
  },

  async search(q) {
    try {
      const res = await api.get("/products/search/", { params: { q } });
      const list = unwrapListPayload(res);
      return normalizeProducts(list);
    } catch (error) {
      console.error("[Product API] Search failed:", error);
      throw error;
    }
  },

  async detail(slug) {
    try {
      const res = await api.get(`/products/${slug}/`);
      let data = unwrap(res);
      return normalizeProduct(data);
    } catch (error) {
      console.error("[Product API] Failed to fetch product detail:", error);
      throw error;
    }
  },
};

export const categoryApi = {
  async list(params = {}) {
    try {
      const res = await api.get("/categories/", { params });
      return unwrap(res);
    } catch (error) {
      console.error("[Category API] Failed to list categories:", error);
      throw error;
    }
  },

  async detail(slug) {
    try {
      const res = await api.get(`/categories/${slug}/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Category API] Failed to fetch category detail:", error);
      throw error;
    }
  },
};

// ============================================================================
// Cart API
// ============================================================================

export const cartApi = {
  async get() {
    try {
      const res = await api.get("/cart/");
      return unwrap(res);
    } catch (error) {
      console.error("[Cart API] Failed to fetch cart:", error);
      throw error;
    }
  },

  async add({ product_id, quantity }) {
    try {
      const res = await api.post("/cart/add/", {
        product_id: String(product_id),
        quantity: Number(quantity),
      });
      return unwrap(res);
    } catch (error) {
      console.error("[Cart API] Failed to add item:", error);
      throw error;
    }
  },

  async update({ product_id, quantity }) {
    try {
      const res = await api.put("/cart/update/", {
        product_id: String(product_id),
        quantity: Number(quantity),
      });
      return unwrap(res);
    } catch (error) {
      console.error("[Cart API] Failed to update item:", error);
      throw error;
    }
  },

  async remove({ product_id }) {
    try {
      const res = await api.delete("/cart/remove/", {
        data: { product_id: String(product_id) },
      });
      return unwrap(res);
    } catch (error) {
      console.error("[Cart API] Failed to remove item:", error);
      throw error;
    }
  },

  async clear() {
    try {
      const res = await api.delete("/cart/clear/");
      return unwrap(res);
    } catch (error) {
      console.error("[Cart API] Failed to clear cart:", error);
      throw error;
    }
  },
};

// ============================================================================
// Orders API
// ============================================================================

export const orderApi = {
  async create(payload) {
    try {
      const res = await api.post("/orders/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Order API] Failed to create order:", error);
      throw error;
    }
  },

  async list() {
    try {
      const res = await api.get("/orders/list/");
      return unwrapListPayload(res);
    } catch (error) {
      console.error("[Order API] Failed to list orders:", error);
      throw error;
    }
  },

  async detail(id) {
    try {
      const res = await api.get(`/orders/${id}/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Order API] Failed to fetch order detail:", error);
      throw error;
    }
  },

  async byNumber(num) {
    try {
      const res = await api.get(`/orders/number/${num}/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Order API] Failed to fetch order by number:", error);
      throw error;
    }
  },

  async cancel(id, payload) {
    try {
      const res = await api.post(`/orders/${id}/cancel/`, payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Order API] Failed to cancel order:", error);
      throw error;
    }
  },
};

// ============================================================================
// Payments API
// ============================================================================

export const paymentApi = {
  async methods() {
    try {
      const res = await api.get("/payments/methods/");
      return unwrap(res);
    } catch (error) {
      console.error("[Payment API] Failed to fetch payment methods:", error);
      throw error;
    }
  },

  async instructions(orderId) {
    try {
      const res = await api.get(`/payments/instructions/${orderId}/`);
      return unwrap(res);
    } catch (error) {
      console.error(
        "[Payment API] Failed to fetch payment instructions:",
        error,
      );
      throw error;
    }
  },

  async submit(payload) {
    try {
      const res = await api.post("/payments/submit/", payload);
      return unwrap(res);
    } catch (error) {
      console.error("[Payment API] Failed to submit payment:", error);
      throw error;
    }
  },

  async upload(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/payments/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return unwrap(res);
    } catch (error) {
      console.error("[Payment API] Failed to upload payment proof:", error);
      throw error;
    }
  },
};

// ============================================================================
// Reviews API
// ============================================================================

export const reviewApi = {
  async getProductReviews(productId, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `/reviews/product/${productId}/${query ? `?${query}` : ""}`;
      const res = await api.get(url);
      return unwrapListPayload(res);
    } catch (error) {
      console.error("[Review API] Failed to fetch product reviews:", error);
      throw error;
    }
  },

  async createReview(reviewData) {
    try {
      const res = await api.post("/reviews/", reviewData);
      return unwrap(res);
    } catch (error) {
      console.error("[Review API] Failed to create review:", error);
      throw error;
    }
  },

  async voteHelpful(reviewId) {
    try {
      const res = await api.post(`/reviews/${reviewId}/helpful/`);
      return unwrap(res);
    } catch (error) {
      console.error("[Review API] Failed to vote helpful:", error);
      throw error;
    }
  },
};

export default api;
