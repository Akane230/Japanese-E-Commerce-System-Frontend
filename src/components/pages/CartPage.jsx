import React from "react";
import { useCart } from "../../hooks/useCart";
import { Button } from "../common/Button";
import { QuantityControl } from "../common/QuantityControl";

export const CartPage = ({ onNavigate }) => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const shipping = total >= 80 ? 0 : 12.99;
  const freeShippingProgress = Math.min((total / 80) * 100, 100);

  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fde8ec, #fdf3e3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            margin: "0 auto 22px",
            boxShadow: "0 4px 20px rgba(232,99,122,0.15)",
          }}
        >
          🛒
        </div>
        <h2
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 24,
            margin: "0 0 10px",
            color: "#1a1008",
          }}
        >
          Cart is empty
        </h2>
        <p
          style={{
            color: "#8c7e6e",
            marginBottom: 28,
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Discover our authentic Japanese products and find something you love.
        </p>
        <button
          onClick={() => onNavigate("products")}
          style={{
            background: "linear-gradient(135deg, #e8637a, #d44f67)",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "13px 28px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(232,99,122,0.4)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
        >
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
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
          Review Items
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 26,
            margin: 0,
            color: "#1a1008",
            fontWeight: 700,
          }}
        >
          Shopping Cart
        </h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 310px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Items */}
        <div>
          {items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 16,
                padding: "18px",
                background: "white",
                borderRadius: 18,
                border: "1.5px solid #ede5d8",
                marginBottom: 12,
                boxShadow: "0 2px 8px rgba(26,16,8,0.04)",
                transition: "box-shadow 0.2s",
                animation: `fadeUp 0.4s ease ${idx * 0.06}s both`,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 14,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    marginBottom: 2,
                    color: "#1a1008",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#b8aa98",
                    marginBottom: 12,
                    fontFamily: "'Noto Serif JP', serif",
                  }}
                >
                  {item.nameJa}
                </div>
                <div
                  style={{ fontSize: 12, color: "#8c7e6e", marginBottom: 10 }}
                >
                  ${(item.salePrice || item.price || 0).toFixed(2)} each
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <QuantityControl
                    qty={item.qty}
                    setQty={(q) => updateQuantity(item.id, q)}
                  />
                  <strong style={{ fontSize: 17, color: "#e8637a" }}>
                    $
                    {((item.salePrice || item.price || 0) * item.qty).toFixed(
                      2,
                    )}
                  </strong>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      marginLeft: "auto",
                      background: "none",
                      border: "1.5px solid #ede5d8",
                      padding: "5px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#8c7e6e",
                      fontFamily: "inherit",
                      transition:
                        "border-color 0.15s, color 0.15s, background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#e8637a";
                      e.currentTarget.style.color = "#e8637a";
                      e.currentTarget.style.background = "#fde8ec";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#ede5d8";
                      e.currentTarget.style.color = "#8c7e6e";
                      e.currentTarget.style.background = "none";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary sidebar */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #ede5d8",
            padding: "22px",
            position: "sticky",
            top: 80,
            boxShadow: "0 4px 20px rgba(26,16,8,0.06)",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: 16,
              margin: "0 0 18px",
              color: "#1a1008",
            }}
          >
            Order Summary
          </h3>

          {[
            ["Subtotal", `$${total.toFixed(2)}`],
            [
              "Shipping",
              shipping === 0 ? "🎁 FREE" : `$${shipping.toFixed(2)}`,
            ],
          ].map(([key, value]) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                fontSize: 13.5,
                color: "#8c7e6e",
              }}
            >
              <span>{key}</span>
              <span
                style={{
                  color:
                    shipping === 0 && key === "Shipping"
                      ? "#2d6a4f"
                      : "#1a1008",
                  fontWeight: 600,
                }}
              >
                {value}
              </span>
            </div>
          ))}

          {total < 80 && (
            <div style={{ marginBottom: 14 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#c9933a",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Add ${(80 - total).toFixed(2)} more for free shipping!
              </div>
              <div
                style={{
                  height: 5,
                  background: "#f0ebe0",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${freeShippingProgress}%`,
                    background: "linear-gradient(90deg, #e8637a, #c9933a)",
                    borderRadius: 5,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderTop: "1.5px solid #ede5d8",
              paddingTop: 14,
              marginBottom: 18,
              fontSize: 17,
              fontWeight: 800,
            }}
          >
            <span>Total</span>
            <span style={{ color: "#e8637a", fontSize: 20 }}>
              ${(total + shipping).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onNavigate("checkout")}
            style={{
              width: "100%",
              padding: "13px 0",
              background: "linear-gradient(135deg, #1a1008, #3d2415)",
              color: "#faf7f2",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 4px 14px rgba(26,16,8,0.3)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
          >
            Proceed to Checkout →
          </button>

          <button
            onClick={() => onNavigate("products")}
            style={{
              display: "block",
              width: "100%",
              marginTop: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8c7e6e",
              fontSize: 12.5,
              textAlign: "center",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2415")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8c7e6e")}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
