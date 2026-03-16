import React from 'react';
import { Icons } from './Icons';

export const Stars = ({ rating, count, size = 14 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? "#c9933a" : "#ddd" }}>
          <Icons.Star size={size} />
        </span>
      ))}
      {count != null && (
        <span style={{ fontSize: 12, color: "#8c7e6e", marginLeft: 2 }}>
          ({count})
        </span>
      )}
    </div>
  );
}