import React, { useState, useEffect } from "react";
import { orderApi } from "../../utils/api";
import { formatPrice } from "../../utils/helpers";
import { OrderProductCard } from "../common/OrderProductCard";
import "../../styles/pages/TrackingPage.css";

export function TrackingPage({ orderNumber: initialOrderNumber, onNavigate }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [error, setError] = useState("");

  const fetchOrder = async (num) => {
    if (!num?.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await orderApi.byNumber(num.trim()));
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Order not found. Please check the number.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when navigated here with an order number — no manual entry needed
  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = () => fetchOrder(orderNumber);

  const canCancel =
    order &&
    ![
      "shipped",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "refunded",
      "cancelled",
    ].includes(order.status);

  const handleCancel = async () => {
    if (!order?.id) return;
    setCanceling(true);
    setCancelMessage("");
    try {
      const updated = await orderApi.cancel(order.id, {});
      setOrder(updated);
      setCancelMessage("Order cancelled successfully.");
    } catch (e) {
      setCancelMessage(
        e?.response?.data?.message ||
          "Failed to cancel order. Please try again.",
      );
    } finally {
      setCanceling(false);
    }
  };

  const isDelivered =
    order && (order.status === "delivered" || order.status === "Delivered");

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <button
          className="tracking-back-btn"
          onClick={() => onNavigate("dashboard")}
        >
          ← Back
        </button>
        <div className="tracking-eyebrow">Order Status</div>
        <h1 className="tracking-title">Track your order</h1>
        <p className="tracking-subtitle">
          Enter your order number (e.g. JP-12345) to see the latest status and
          shipping updates.
        </p>
      </div>

      {/* Search */}
      <div className="tracking-search">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Order number (e.g. JP-12345)"
          className="tracking-input"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="tracking-submit-btn"
        >
          {loading ? "Searching…" : "Track →"}
        </button>
      </div>

      {error && (
        <div className="tracking-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {order && (
        <div className="tracking-card">
          {/* Order header */}
          <div
            className={`tracking-card-header ${
              isDelivered
                ? "tracking-card-header--delivered"
                : "tracking-card-header--pending"
            }`}
          >
            <div>
              <div className="tracking-order-number">
                Order {order.order_number || order.id}
              </div>
              <div className="tracking-order-date">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : ""}
              </div>
            </div>
            <div
              className={`tracking-status-badge ${
                isDelivered
                  ? "tracking-status-badge--delivered"
                  : "tracking-status-badge--pending"
              }`}
            >
              {order.status_label || order.status || "Pending"}
            </div>
          </div>

          <div className="tracking-card-body">
            <div className="tracking-total">
              <strong>Total:</strong>{" "}
              <span className="tracking-total-amount">
                {formatPrice(order.grand_total, order.currency || "JPY")}
              </span>
            </div>

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="tracking-cancel-btn"
              >
                {canceling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
            {cancelMessage && (
              <div className="tracking-cancel-message">{cancelMessage}</div>
            )}

            {order.shipping_address && (
              <div className="tracking-address">
                <div className="tracking-address-label">📍 Shipping to</div>
                <div className="tracking-address-text">
                  {order.shipping_address.name ||
                    order.shipping_address.recipient_name}
                  , {order.shipping_address.street}{" "}
                  {order.shipping_address.building}{" "}
                  {order.shipping_address.city}{" "}
                  {order.shipping_address.postal_code},{" "}
                  {order.shipping_address.country}
                </div>
              </div>
            )}

            {order.items && order.items.length > 0 && (
              <div className="tracking-products">
                <h3 className="tracking-section-title">
                  Products in this order
                </h3>
                <div className="tracking-products-list">
                  {order.items.map((item) => (
                    <OrderProductCard
                      key={item.product_id || item.slug || item.id}
                      item={item}
                      onClick={() => {
                        const productLink =
                          item.slug || item.product_id || item.id;
                        if (productLink) {
                          onNavigate("product", productLink);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(order.status_history) &&
              order.status_history.length > 0 && (
                <div>
                  <div className="tracking-timeline-title">Status Timeline</div>
                  <div className="tracking-timeline">
                    {order.status_history.map((h, idx) => (
                      <div key={idx} className="tracking-timeline-item">
                        <div
                          className={`tracking-timeline-dot ${
                            idx === 0
                              ? "tracking-timeline-dot--latest"
                              : "tracking-timeline-dot--past"
                          }`}
                        />
                        <div className="tracking-timeline-status">
                          {h.label || h.status}
                        </div>
                        <div className="tracking-timeline-timestamp">
                          {h.timestamp &&
                            new Date(h.timestamp).toLocaleString()}
                        </div>
                        {h.note && (
                          <div className="tracking-timeline-note">{h.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
