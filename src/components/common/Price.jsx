import React from 'react';
import { Chip } from './Chip';

export const Price = ({ price, salePrice }) => {
  const format = p => {
    const num = parseFloat(p);
    return isNaN(num) ? "¥0.00" : `¥${num.toFixed(2)}`;
  };
  
  return salePrice ? (
    <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <b style={{ fontSize: 20, color: "#e8637a" }}>{format(salePrice)}</b>
      <s style={{ fontSize: 14, color: "#8c7e6e" }}>{format(price)}</s>
      <Chip color="pink">Sale</Chip>
    </span>
  ) : (
    <b style={{ fontSize: 20 }}>{format(price)}</b>
  );
}