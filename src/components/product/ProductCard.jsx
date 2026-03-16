import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { Stars } from "../common/Stars";
import { Price } from "../common/Price";

export function ProductCard({
  product,
  onNavigate,
  onAddToCart,
  isWished = false,
  onToggleWishlist,
}) {
  const [wished, setWished] = useState(isWished);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setWished(isWished);
  }, [isWished]);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  /**
   * Get the best available image URL for the product
   */
  const getImageUrl = () => {
    if (imageError) {
      return "https://via.placeholder.com/300x300?text=Product+Image";
    }

    return (
      product.image ||
      product.thumbnail ||
      product.thumbnail_url ||
      (product.images && product.images[0]) ||
      "https://via.placeholder.com/300x300?text=Product+Image"
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      onClick={() => onNavigate("product", product.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        border: "1.5px solid",
        borderColor: hovered ? "#d4c4b4" : "#ede5d8",
        cursor: "pointer",
        transition:
          "transform 0.25s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.25s ease, border-color 0.2s",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered
          ? "0 16px 44px rgba(26,16,8,0.12), 0 4px 12px rgba(26,16,8,0.06)"
          : "0 2px 8px rgba(26,16,8,0.04)",
        position: "relative",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          paddingTop: "100%",
          background: "#f5efe6",
          overflow: "hidden",
        }}
      >
        <img
          src={getImageUrl()}
          alt={product.name}
          onError={handleImageError}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
          loading="lazy"
        />

        {/* Overlay gradient on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(26,16,8,0.18) 0%, transparent 50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {product.salePrice && product.salePrice < product.price && (
            <span
              style={{
                background: "linear-gradient(135deg, #e8637a, #d44f67)",
                color: "white",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 20,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(232,99,122,0.4)",
              }}
            >
              Sale
            </span>
          )}
          {product.isBestseller && (
            <span
              style={{
                background: "rgba(26,16,8,0.85)",
                backdropFilter: "blur(8px)",
                color: "#faf7f2",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 20,
                letterSpacing: "0.04em",
              }}
            >
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWished((prev) => !prev);
            if (onToggleWishlist) onToggleWishlist(product.id);
          }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: wished
              ? "rgba(232,99,122,0.95)"
              : "rgba(250,247,242,0.9)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s, transform 0.2s",
            transform: wished ? "scale(1.1)" : "scale(1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            color: wished ? "white" : "#8c7e6e",
          }}
        >
          <Icons.Heart filled={wished} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div
          style={{
            fontSize: 10,
            color: "#b8aa98",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 3,
            fontWeight: 600,
          }}
        >
          {product.brand || "Sakura Shop"}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13.5,
            color: "#1a1008",
            marginBottom: 1,
            lineHeight: 1.35,
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#b8aa98",
            marginBottom: 8,
            fontFamily: "'Noto Serif JP', serif",
          }}
        >
          {product.nameJa}
        </div>
        <Stars rating={product.rating || 0} count={product.reviews || 0} />

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Price price={product.price} salePrice={product.salePrice} />
          <button
            onClick={handleAdd}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              background: added
                ? "linear-gradient(135deg, #2d6a4f, #40916c)"
                : "linear-gradient(135deg, #e8637a, #d44f67)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.25s, transform 0.2s",
              transform: added ? "scale(0.92)" : "scale(1)",
              boxShadow: added
                ? "0 3px 10px rgba(45,106,79,0.35)"
                : "0 3px 10px rgba(232,99,122,0.35)",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              !added && (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = added
                ? "scale(0.92)"
                : "scale(1)")
            }
          >
            {added ? <Icons.Check /> : <Icons.Plus />}
          </button>
        </div>
      </div>
    </div>
  );
}
