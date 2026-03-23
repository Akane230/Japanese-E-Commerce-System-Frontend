import React from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../utils/helpers";
import { QuantityControl } from "../common/QuantityControl";
import "../../styles/pages/CartPage.css";

export const CartPage = ({ onNavigate }) => {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  // Use the first item's currency, or default to JPY
  const currency = items.length > 0 ? items[0]?.currency || "JPY" : "JPY";
  const shipping = total >= 80 ? 0 : 12.99;
  // const freeShippingProgress = Math.min((total / 80) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__text">
          Discover our authentic Japanese products and find something you love.
        </p>
        <button
          className="cart-empty__btn"
          onClick={() => onNavigate("products")}
        >
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="cart-eyebrow">Review Items</div>
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-count">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="cart-layout">
        {/* ── Item list ── */}
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item__img"
                />
              </div>

              <div className="cart-item__body">
                <div className="cart-item__name">{item.name}</div>
                {item.nameJa && (
                  <div className="cart-item__name-jp">{item.nameJa}</div>
                )}
                <div className="cart-item__unit-price">
                  {formatPrice(item.salePrice || item.price || 0, currency)}{" "}
                  each
                </div>

                <div className="cart-item__actions">
                  <QuantityControl
                    qty={item.qty}
                    setQty={(q) => updateQuantity(item.id, q)}
                  />
                  <span className="cart-item__line-total">
                    {formatPrice(
                      (item.salePrice || item.price || 0) * item.qty,
                      currency,
                    )}
                  </span>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary sidebar ── */}
        <div className="cart-summary">
          <div className="cart-summary__header">
            <div className="cart-summary__title">Order Summary</div>
            <div className="cart-summary__subtitle">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </div>
          </div>

          <div className="cart-summary__body">
            {/* Line rows */}
            <div className="cart-summary__row">
              <span className="cart-summary__row-label">Subtotal</span>
              <span className="cart-summary__row-value">
                {formatPrice(total, currency)}
              </span>
            </div>

            {/* Free shipping progress */}
            {/* {total < 80 && (
              <div className="cart-shipping-nudge">
                <div className="cart-shipping-nudge__label">
                  <span>
                    Add {formatPrice(80 - total, currency)} more for free shipping
                  </span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="cart-shipping-nudge__track">
                  <div
                    className="cart-shipping-nudge__fill"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )} */}

            <hr className="cart-summary__divider" />

            {/* Grand total */}
            <div className="cart-summary__total">
              <span className="cart-summary__total-label">Total</span>
              <span className="cart-summary__total-amount">
                {formatPrice(total + shipping, currency)}
              </span>
            </div>

            {/* CTA */}
            <button
              className="cart-checkout-btn"
              onClick={() => onNavigate("checkout")}
            >
              {isAuthenticated
                ? "Proceed to Checkout →"
                : "Login to Checkout →"}
            </button>

            <button
              className="cart-continue-btn"
              onClick={() => onNavigate("products")}
            >
              ← Continue Shopping
            </button>

            {/* Trust badges */}
            <div className="cart-trust">
              {[
                "🔒 Secure checkout",
                "📦 Tracked worldwide shipping",
                "↩️ 30-day returns",
              ].map((t) => (
                <div key={t} className="cart-trust__item">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
