import React from "react";
import { Icons } from "./Icons";
import "../../styles/common/QuantityControl.css";

export const QuantityControl = ({
  qty,
  setQty,
  max = 99,
  size = "medium", // 'small', 'medium', 'large'
}) => {
  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleIncrement = () => {
    if (qty < max) {
      setQty(qty + 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= max) {
      setQty(value);
    }
  };

  return (
    <div className={`quantity-control quantity-control--${size}`}>
      <button
        onClick={handleDecrement}
        disabled={qty <= 1}
        className="quantity-control__btn quantity-control__btn--decrement"
        aria-label="Decrease quantity"
      >
        <Icons.Minus size={size === "small" ? 12 : 14} />
      </button>

      <input
        type="number"
        min="1"
        max={max}
        value={qty}
        onChange={handleChange}
        className="quantity-control__input"
        aria-label="Quantity"
      />

      <button
        onClick={handleIncrement}
        disabled={qty >= max}
        className="quantity-control__btn quantity-control__btn--increment"
        aria-label="Increase quantity"
      >
        <Icons.Plus size={size === "small" ? 12 : 14} />
      </button>
    </div>
  );
};
