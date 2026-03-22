import React from "react";
import { Icons } from "./Icons";

export const QuantityControl = ({ qty, setQty, max = 99 }) => {
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "2px solid #e5ddd0",
        borderRadius: 8,
        overflow: "hidden",
        width: "fit-content",
      }}
    >
      <button
        onClick={handleDecrement}
        disabled={qty <= 1}
        style={{
          width: 34,
          height: 34,
          background: qty <= 1 ? "#f5f0e8" : "none",
          border: "none",
          cursor: qty <= 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: qty <= 1 ? "#b8aa98" : "#1a1008",
          transition: "all 0.15s",
        }}
      >
        <Icons.Minus />
      </button>
      <input
        type="number"
        min="1"
        max={max}
        value={qty}
        onChange={handleChange}
        style={{
          width: 40,
          textAlign: "center",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          borderLeft: "2px solid #e5ddd0",
          borderRight: "2px solid #e5ddd0",
          outline: "none",
          padding: 0,
        }}
      />
      <button
        onClick={handleIncrement}
        disabled={qty >= max}
        style={{
          width: 34,
          height: 34,
          background: qty >= max ? "#f5f0e8" : "none",
          border: "none",
          cursor: qty >= max ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: qty >= max ? "#b8aa98" : "#1a1008",
          transition: "all 0.15s",
        }}
      >
        <Icons.Plus />
      </button>
    </div>
  );
};
