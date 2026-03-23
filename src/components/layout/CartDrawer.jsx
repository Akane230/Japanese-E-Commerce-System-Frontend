import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/helpers";
import { Icons } from "../common/Icons";
import { QuantityControl } from "../common/QuantityControl";
import "../../styles/layout/CartDrawer.css";

export function CartDrawer({ onNavigate }) {
  const { items, total, isOpen, setIsOpen, updateQuantity, removeItem } =
    useCart();
  // Use the first item's currency, or default to JPY
  const currency = items.length > 0 ? items[0]?.currency || "JPY" : "JPY";

  // console.log(
  //   "CartDrawer render - items:",
  //   items,
  //   "total:",
  //   total,
  //   "isOpen:",
  //   isOpen,
  // );
  const shipping = total >= 80 ? 0 : 12.99;
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsClosing(false);
        setVisible(true);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        setIsClosing(true);
      }, 0);
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setVisible(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  if (!isOpen && !visible && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${visible && !isClosing ? "cart-backdrop--visible" : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`cart-panel ${visible && !isClosing ? "cart-panel--visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header__content">
            <h2 className="cart-header__title">
              Shopping Cart
              <span className="cart-header__subtitle">
                {items.length === 0
                  ? "Empty"
                  : `${items.length} item${items.length !== 1 ? "s" : ""}`}
              </span>
            </h2>
            <button
              onClick={handleClose}
              className="cart-header__close"
              aria-label="Close cart"
            >
              <Icons.X size={18} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h3 className="cart-empty__title">Your cart is empty</h3>
              <p className="cart-empty__message">
                Discover authentic Japanese goods worth adding
              </p>
              <button
                onClick={() => {
                  handleClose();
                  onNavigate("products");
                }}
                className="btn btn--primary"
              >
                Browse Products
                <span className="btn__icon" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.product_id || item.id || `item-${index}`}
                className="cart-item"
              >
                <div className="cart-item__media">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__image"
                    loading="lazy"
                  />
                  <span className="cart-item__quantity-badge">{item.qty}</span>
                </div>

                <div className="cart-item__content">
                  <div className="cart-item__header">
                    <h4 className="cart-item__title">{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="cart-item__remove"
                      aria-label="Remove item"
                    >
                      <Icons.X size={12} />
                    </button>
                  </div>

                  <div className="cart-item__price">
                    {formatPrice(item.salePrice || item.price || 0, currency)}{" "}
                    each
                  </div>

                  <div className="cart-item__footer">
                    <QuantityControl
                      qty={item.qty}
                      setQty={(q) => updateQuantity(item.id, q)}
                    />
                    <span className="cart-item__total">
                      {formatPrice(
                        (item.salePrice || item.price || 0) * item.qty,
                        currency,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer__summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="summary-row__value">
                  {formatPrice(total, currency)}
                </span>
              </div>
              <div className="summary-row summary-row--total">
                <span>Total</span>
                <span className="summary-row__total">
                  {formatPrice(total + shipping, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                handleClose();
                onNavigate("checkout");
              }}
              className="btn btn--primary btn--block btn--lg"
            >
              Checkout
              <span className="btn__icon" aria-hidden="true">
                →
              </span>
            </button>

            <button
              onClick={() => {
                handleClose();
                onNavigate("cart");
              }}
              className="cart-footer__view-cart"
            >
              View full cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
