import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Icons } from "../common/Icons";
import { Button } from "../common/Button";
import { QuantityControl } from "../common/QuantityControl";

export function CartDrawer({ onNavigate }) {
  const { items, total, isOpen, setIsOpen, updateQuantity, removeItem } =
    useCart();

  console.log("CartDrawer render - items:", items, "total:", total, "isOpen:", isOpen);
  const shipping = total >= 80 ? 0 : 12.99;
  const freeShippingProgress = Math.min((total / 80) * 100, 100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      if (isOpen) {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      } else {
        setVisible(false);
      }
    };

    updateVisibility();
    return () => {
      setVisible(false);
    };
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  return (
    <>
      <style>{`
        @keyframes drawerIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes drawerOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .cart-drawer-panel {
          animation: drawerIn 0.3s cubic-bezier(0.32,0.72,0,1) forwards;
        }
        .cart-drawer-panel.closing {
          animation: drawerOut 0.25s cubic-bezier(0.32,0,0.67,0) forwards;
        }
        .cart-item-row {
          transition: background 0.15s;
        }
        .cart-item-row:hover {
          background: #f8f4ef !important;
        }
      `}</style>

      <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,16,8,0.5)",
            backdropFilter: "blur(3px)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        {/* Panel */}
        <div
          className={`cart-drawer-panel${!visible ? " closing" : ""}`}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "min(420px, 100vw)",
            background: "#faf7f2",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(26,16,8,0.18)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 22px 18px",
              borderBottom: "1.5px solid #ede5d8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "white",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  margin: 0,
                  color: "#1a1008",
                }}
              >
                Your Cart
              </h2>
              <div style={{ fontSize: 12, color: "#b8aa98", marginTop: 2 }}>
                {items.length === 0
                  ? "Nothing here yet"
                  : `${items.length} item${items.length !== 1 ? "s" : ""}`}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                background: "#f0ebe0",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8c7e6e",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e5ddd0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f0ebe0")
              }
            >
              <Icons.X />
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div
              style={{
                padding: "12px 22px",
                background: "#fdf9f4",
                borderBottom: "1px solid #ede5d8",
              }}
            >
              {shipping === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: "#2d6a4f",
                    fontWeight: 600,
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span>🎉</span> You've unlocked free shipping!
                </div>
              ) : (
                <div>
                  <div
                    style={{ fontSize: 12, color: "#8c7e6e", marginBottom: 6 }}
                  >
                    Add{" "}
                    <strong style={{ color: "#c9933a" }}>
                      ${(80 - total).toFixed(2)}
                    </strong>{" "}
                    more for free shipping
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: "#ede5d8",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${freeShippingProgress}%`,
                        background: "linear-gradient(90deg, #e8637a, #c9933a)",
                        borderRadius: 4,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            {items.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  paddingTop: 60,
                  color: "#8c7e6e",
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 6,
                    color: "#3d2415",
                  }}
                >
                  Your cart is empty
                </div>
                <div
                  style={{ fontSize: 13, marginBottom: 22, lineHeight: 1.6 }}
                >
                  Discover authentic Japanese
                  <br />
                  goods worth adding
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate("products");
                  }}
                  style={{
                    background: "#1a1008",
                    color: "#faf7f2",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 22px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  Browse Products →
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.product_id || item.id || `item-${index}`}
                  className="cart-item-row"
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 10,
                    padding: "12px 14px",
                    background: "white",
                    borderRadius: 14,
                    border: "1.5px solid #ede5d8",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 10,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#e8637a",
                        color: "white",
                        fontSize: 9,
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.qty}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: "#1a1008",
                        marginBottom: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#b8aa98",
                        marginBottom: 6,
                      }}
                    >
                      ${(item.salePrice || item.price || 0).toFixed(2)} each
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <QuantityControl
                        qty={item.qty}
                        setQty={(q) => updateQuantity(item.id, q)}
                      />
                      <strong style={{ color: "#e8637a", fontSize: 14 }}>
                        $
                        {(
                          (item.salePrice || item.price || 0) * item.qty
                        ).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#c9b8a4",
                      padding: "2px",
                      alignSelf: "flex-start",
                      borderRadius: 6,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#e8637a")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#c9b8a4")
                    }
                  >
                    <Icons.X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              style={{
                padding: "16px 20px 22px",
                borderTop: "1.5px solid #ede5d8",
                background: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 13,
                  color: "#8c7e6e",
                }}
              >
                <span>Subtotal</span>
                <span style={{ color: "#1a1008", fontWeight: 600 }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  fontSize: 13,
                  color: "#8c7e6e",
                }}
              >
                <span>Shipping</span>
                <span
                  style={{
                    color: shipping === 0 ? "#2d6a4f" : "#1a1008",
                    fontWeight: 600,
                  }}
                >
                  {shipping === 0 ? "🎁 FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 16,
                  paddingTop: 12,
                  borderTop: "1px solid #ede5d8",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span
                  style={{ fontWeight: 800, fontSize: 20, color: "#e8637a" }}
                >
                  ${(total + shipping).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate("checkout");
                }}
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
                  letterSpacing: "0.02em",
                  transition: "opacity 0.2s, transform 0.15s",
                  boxShadow: "0 4px 14px rgba(26,16,8,0.3)",
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
                Checkout — ${(total + shipping).toFixed(2)} →
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate("cart");
                }}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8c7e6e",
                  fontSize: 12.5,
                  textDecoration: "underline",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2415")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8c7e6e")}
              >
                View full cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
