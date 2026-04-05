import React, { useState } from "react";
import { formatPrice } from "../../utils/helpers";
import { Icons } from "./Icons";
import "../../styles/common/OrderProductCard.css";

const DEFAULT_IMAGE = "https://via.placeholder.com/160x160?text=No+Image";

export const OrderProductCard = ({ item, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "djtdar2ex";

  const getCloudinaryUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200/${src}`;
  };

  const getImageUrl = () => {
    if (imageError) return DEFAULT_IMAGE;

    const imgCandidate =
      item.image ||
      item.thumbnail ||
      item.thumbnail_url ||
      item.media?.thumbnail_url ||
      item.media?.thumbnail ||
      (item.media?.image_urls && item.media.image_urls[0]) ||
      (item.media?.images && item.media.images[0]) ||
      (item.images && item.images[0]);

    return imgCandidate ? getCloudinaryUrl(imgCandidate) : DEFAULT_IMAGE;
  };

  return (
    <button className="order-product-card" type="button" onClick={onClick}>
      <img
        src={getImageUrl()}
        alt={item.name || "Ordered product"}
        onError={() => setImageError(true)}
        className="order-product-card__image"
      />
      <div className="order-product-card__content">
        <div className="order-product-card__title">{item.name}</div>
        <div className="order-product-card__meta">
          <span>Qty: {item.quantity || item.qty || 1}</span>
          <span>
            {formatPrice(
              item.unit_price || item.price || 0,
              item.currency || "JPY",
            )}
          </span>
        </div>
      </div>
      <span className="order-product-card__arrow">
        <Icons.ChevR size={16} />
      </span>
    </button>
  );
};
