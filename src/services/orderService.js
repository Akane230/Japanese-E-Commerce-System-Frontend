import { orderApi } from "../utils/api";

export const orderService = {
  // Create order
  async createOrder(orderData) {
    return orderApi.create(orderData);
  },

  // Get user orders
  async getOrders() {
    return orderApi.list();
  },

  // Get order by number
  async getOrderByNumber(orderNumber) {
    return orderApi.getByNumber(orderNumber);
  },

  // Get order details
  async getOrder(orderId) {
    return orderApi.detail(orderId);
  },
};
