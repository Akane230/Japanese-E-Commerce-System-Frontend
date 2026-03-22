import React from 'react';

export function Chip({ children, color = "gold" }) {
  const colors = {
    gold: { bg: "#fdf3e3", fg: "#c9933a", border: "#f0d9b5" },
    pink: { bg: "#fde8ec", fg: "#e8637a", border: "#f5c4cc" },
    green: { bg: "#d8f3e3", fg: "#2d6a4f", border: "#b2e5c7" },
    dark: { bg: "#1a1008", fg: "#faf7f2", border: "transparent" },
  };
  
  const style = colors[color];
  
  return (
    <span style={{
      background: style.bg,
      color: style.fg,
      border: `1px solid ${style.border}`,
      fontSize: 11,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 99,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      display: "inline-block"
    }}>
      {children}
    </span>
  );
}