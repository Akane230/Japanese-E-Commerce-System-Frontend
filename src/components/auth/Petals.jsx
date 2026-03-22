import React from "react";
import "../../styles/auth.css";

const PETAL_DATA = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 12 + Math.random() * 10,
  size: 12 + Math.random() * 10,
  sway: 3 + Math.random() * 3
}));

export const Petals = () => {
  return (
    <div className="petal-container">
      {PETAL_DATA.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
            "--sway-duration": `${p.sway}s`
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
};