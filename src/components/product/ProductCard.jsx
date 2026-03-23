import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { Stars } from "../common/Stars";
import { Price } from "../common/Price";
import "../../styles/pages/ProductCard.css";

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
    <article
      className={`product-card ${hovered ? "product-card--hovered" : ""}`}
      onClick={() => onNavigate("product", product.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && onNavigate("product", product.slug)
      }
      aria-label={`View ${product.name}`}
    >
      <div className="product-card__media">
        <div className="product-card__image-wrapper">
          <img
            src={getImageUrl()}
            alt={product.name}
            onError={handleImageError}
            className={`product-card__image ${hovered ? "product-card__image--zoomed" : ""}`}
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="product-card__badges">
          {product.salePrice && product.salePrice < product.price && (
            <span className="product-card__badge product-card__badge--sale">
              SALE
            </span>
          )}
          {product.isBestseller && (
            <span className="product-card__badge product-card__badge--bestseller">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card__wishlist ${wished ? "product-card__wishlist--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setWished((prev) => !prev);
            if (onToggleWishlist) onToggleWishlist(product.id);
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
        >
          <Icons.Heart filled={wished} />
        </button>
      </div>

      <div className="product-card__content">
        <div className="product-card__brand">
          {product.brand || "Sakura Shop"}
        </div>
        <h3 className="product-card__title">{product.name}</h3>
        <div className="product-card__title-jp">{product.nameJa}</div>

        <div className="product-card__rating">
          <Stars rating={product.rating || 0} count={product.reviews || 0} />
        </div>

        <div className="product-card__footer">
          <Price
            price={product.price}
            salePrice={product.salePrice}
            currency={product.currency || "JPY"}
          />
          <button
            className={`product-card__cart-btn ${added ? "product-card__cart-btn--added" : ""}`}
            onClick={handleAdd}
            aria-label={added ? "Added to cart" : "Add to cart"}
            aria-live="polite"
          >
            {added ? <Icons.Check size={16} /> : <Icons.Plus size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}
