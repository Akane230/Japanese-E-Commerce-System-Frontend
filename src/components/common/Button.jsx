import React from 'react';

export const Button = ({ children, onClick, variant = "primary", full = false, size = "md", disabled = false, style: customStyle = {} }) => {
  const variants = {
    primary: { background: "#e8637a", color: "#fff", border: "none" },
    dark:    { background: "#1a1008", color: "#faf7f2", border: "none" },
    ghost:   { background: "transparent", color: "#1a1008", border: "2px solid #e5ddd0" },
    outline: { background: "transparent", color: "#8c7e6e", border: "2px solid #e5ddd0" },
  };
  
  const sizes = { sm: "8px 14px", md: "11px 22px", lg: "15px 30px" };
  const fontSizes = { sm: 13, md: 14, lg: 16 };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        padding: sizes[size],
        fontSize: fontSizes[size],
        width: full ? "100%" : "auto",
        borderRadius: 10,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.15s",
        letterSpacing: "0.01em",
        ...customStyle
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}