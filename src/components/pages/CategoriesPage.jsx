import React from "react";
import { useCategories } from "../../hooks/useCategories";
import { getCategoryName } from "../../utils/helpers";

export function CategoriesPage({ onNavigate }) {
  const { data: categories = [], isLoading, error } = useCategories();

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e8637a",
            fontWeight: 700,
            marginBottom: 5,
          }}
        >
          Browse by category
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif JP', serif",
            fontSize: 26,
            margin: 0,
            color: "#1a1008",
            fontWeight: 700,
          }}
        >
          Categories
        </h1>
      </div>

      {isLoading ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 18px",
              fontSize: 36,
            }}
          >
            🌸
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "'Noto Serif JP', serif",
              color: "#3d2415",
            }}
          >
            Loading categories…
          </div>
        </div>
      ) : error ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 18px",
              fontSize: 36,
            }}
          >
            ⚠️
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "'Noto Serif JP', serif",
              color: "#3d2415",
            }}
          >
            Failed to load categories
          </div>
          <div style={{ marginTop: 8 }}>{error?.message || String(error)}</div>
        </div>
      ) : categories.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 18px",
              fontSize: 36,
            }}
          >
            📦
          </div>
          <div
            style={{
              fontSize: 18,
              fontFamily: "'Noto Serif JP', serif",
              color: "#3d2415",
            }}
          >
            No categories found.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onNavigate("products", category.id)}
              style={{
                border: "1.5px solid #ede5d8",
                borderRadius: 20,
                background: "white",
                padding: "22px 18px",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(26,16,8,0.04)",
                transition:
                  "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(26,16,8,0.13)";
                e.currentTarget.style.borderColor = "#d4c4b4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(26,16,8,0.04)";
                e.currentTarget.style.borderColor = "#ede5d8";
              }}
            >
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#1a1008",
                }}
              >
                {getCategoryName(category)}
              </div>
              {category.product_count != null && (
                <div style={{ fontSize: 12, color: "#8c7e6e" }}>
                  {category.product_count} products
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
