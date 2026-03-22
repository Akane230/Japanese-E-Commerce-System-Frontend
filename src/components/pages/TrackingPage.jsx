import React, { useState, useEffect } from "react";
import { orderApi } from "../../utils/api";

export function TrackingPage({ orderNumber: initialOrderNumber, onNavigate }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-search if order number was passed
  useEffect(() => {
    if (initialOrderNumber && !order) {
      handleSearch();
    }
  }, [initialOrderNumber]);

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await orderApi.byNumber(orderNumber.trim()));
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Order not found. Please check the number.",
      );
    } finally {
      setLoading(false);
    }
  };

  const statusColors = { delivered: "#2d6a4f", Delivered: "#2d6a4f" };
  const isDelivered =
    order && (order.status === "delivered" || order.status === "Delivered");

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => onNavigate("dashboard")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: 8,
              color: "#8c7e6e",
              fontSize: 16,
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f0e8")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            ← Back
          </button>
        </div>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e8637a",
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          Order Status
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 26,
            margin: "0 0 10px",
            color: "#1a1008",
            fontWeight: 700,
          }}
        >
          Track your order
        </h1>
        <p
          style={{
            color: "#8c7e6e",
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.65,
          }}
        >
          Enter your order number (e.g. JP-12345) to see the latest status and
          shipping updates.
        </p>
      </div>

      {/* Search */}
      <div
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Order number (e.g. JP-12345)"
          style={{
            flex: 1,
            minWidth: 0,
            padding: "11px 14px",
            border: "1.5px solid #ede5d8",
            borderRadius: 11,
            fontSize: 14,
            outline: "none",
            background: "#faf7f2",
            fontFamily: "inherit",
            color: "#1a1008",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#e8637a")}
          onBlur={(e) => (e.target.style.borderColor = "#ede5d8")}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "11px 22px",
            background: loading
              ? "#b8aa98"
              : "linear-gradient(135deg, #e8637a, #d44f67)",
            color: "white",
            border: "none",
            borderRadius: 11,
            fontSize: 13.5,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            fontFamily: "inherit",
            transition: "transform 0.15s",
            boxShadow: loading ? "none" : "0 4px 14px rgba(232,99,122,0.4)",
          }}
          onMouseEnter={(e) =>
            !loading && (e.currentTarget.style.transform = "translateY(-1px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          {loading ? "Searching…" : "Track →"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#fde8ec",
            border: "1px solid #f5c4cc",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 13.5,
            color: "#c44d62",
            marginBottom: 16,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span>⚠️</span> {error}
        </div>
      )}

      {order && (
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #ede5d8",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(26,16,8,0.06)",
            animation: "fadeUp 0.35s ease",
          }}
        >
          {/* Order header */}
          <div
            style={{
              padding: "20px 22px",
              background: isDelivered
                ? "linear-gradient(135deg, #d8f3e3, #e8f8ef)"
                : "linear-gradient(135deg, #fdf3e3, #fef9f0)",
              borderBottom: "1.5px solid #ede5d8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#1a1008",
                  marginBottom: 3,
                }}
              >
                Order {order.order_number || order.id}
              </div>
              <div style={{ fontSize: 12.5, color: "#8c7e6e" }}>
                {order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : ""}
              </div>
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: isDelivered ? "#2d6a4f" : "#c9933a",
                background: isDelivered
                  ? "rgba(45,106,79,0.1)"
                  : "rgba(201,147,58,0.1)",
                padding: "5px 12px",
                borderRadius: 20,
              }}
            >
              {order.status_label || order.status || "Pending"}
            </div>
          </div>

          <div style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 13.5, marginBottom: 14 }}>
              <strong>Total:</strong>{" "}
              <span style={{ color: "#e8637a", fontWeight: 700 }}>
                ${(parseFloat(order.grand_total) || 0).toFixed(2)}
              </span>
            </div>

            {order.shipping_address && (
              <div
                style={{
                  background: "#f5f0e8",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 5, color: "#3d2415" }}
                >
                  📍 Shipping to
                </div>
                <div style={{ color: "#5c4a37", lineHeight: 1.65 }}>
                  {order.shipping_address.name}, {order.shipping_address.street}{" "}
                  {order.shipping_address.building}{" "}
                  {order.shipping_address.city}{" "}
                  {order.shipping_address.postal_code},{" "}
                  {order.shipping_address.country}
                </div>
              </div>
            )}

            {Array.isArray(order.status_history) &&
              order.status_history.length > 0 && (
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: 14,
                      fontSize: 13.5,
                      color: "#1a1008",
                    }}
                  >
                    Status Timeline
                  </div>
                  <div
                    style={{ paddingLeft: 16, borderLeft: "2px solid #ede5d8" }}
                  >
                    {order.status_history.map((h, idx) => (
                      <div
                        key={idx}
                        style={{ marginBottom: 16, position: "relative" }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: -21,
                            top: 2,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: idx === 0 ? "#e8637a" : "#e5ddd0",
                            border: "2px solid white",
                            boxShadow:
                              idx === 0
                                ? "0 0 0 3px rgba(232,99,122,0.2)"
                                : "none",
                          }}
                        />
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: "#1a1008",
                          }}
                        >
                          {h.label || h.status}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: "#8c7e6e",
                            marginTop: 2,
                          }}
                        >
                          {h.timestamp &&
                            new Date(h.timestamp).toLocaleString()}
                        </div>
                        {h.note && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#5c4a37",
                              marginTop: 3,
                            }}
                          >
                            {h.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
