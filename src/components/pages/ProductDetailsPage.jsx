import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { Stars } from "../common/Stars";
import { Price } from "../common/Price";
import { Chip } from "../common/Chip";
import { QuantityControl } from "../common/QuantityControl";
import { useProduct } from "../../hooks/useProducts";
import { useProductReviews, useCreateReview } from "../../hooks/useReviews";
import { getApiErrorMessage } from "../../utils/api";
import "../../styles/pages/ProductDetailPage.css";

export const ProductDetailPage = ({ slug, onNavigate, addToCart }) => {
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [wished, setWished] = useState(false);
  const [ja, setJa] = useState(false);
  const [tab, setTab] = useState("description");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [addedAnim, setAddedAnim] = useState(false);

  const {
    data: product,
    isLoading: loading,
    error: productError,
  } = useProduct(slug);

  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(
    product?.id,
  );

  const createReviewMutation = useCreateReview();

  // Handle media images and video
  const mediaImages = [];
  if (product?.media?.thumbnail_url) {
    mediaImages.push(product.media.thumbnail_url);
  }
  if (product?.media?.image_urls) {
    product.media.image_urls.forEach((url) => {
      if (!mediaImages.includes(url)) {
        mediaImages.push(url);
      }
    });
  }

  const videoUrl = product?.media?.video_url_full || null;

  // video appears as last "slide" if present
  const totalSlides = mediaImages.length + (videoUrl ? 1 : 0);
  const isVideoSlide = videoUrl && imgIdx === totalSlides - 1;

  const error = productError
    ? getApiErrorMessage(productError, "Failed to load product.")
    : "";

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  // Safe property access with defaults
  const productNameJa = product?.nameJa || product?.name || "";
  const productDescription = product?.description || "";
  const productDescriptionJa = product?.descriptionJa || productDescription;
  const productBrand = product?.brand || "Generic";
  const productShelfLife = product?.shelfLife || 0;
  const productCertifications = product?.certifications || [];
  const productIngredients = product?.ingredients || [];
  const productAllergens = product?.allergens || [];
  const productShips = product?.ships || false;
  const productIsFeatured = product?.isFeatured || false;
  const productIsBestseller = product?.isBestseller || false;
  const productRating = product?.rating || 0;
  const productReviews = product?.reviews || 0;
  const productPrice = product?.price || 0;
  const productSalePrice = product?.salePrice || null;

  const tabs = [
    { id: "description", label: "Description", icon: "📝" },
    { id: "ingredients", label: "Ingredients", icon: "🥘" },
    { id: "shipping", label: "Shipping", icon: "🚚" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
  ];

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-sakura">🌸</div>
        <p className="loading-text">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <div className="error-icon">😕</div>
        <p className="error-text">{error || "Product not found."}</p>
        <button
          className="btn btn--primary"
          onClick={() => onNavigate("products")}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol className="breadcrumb__list">
            <li className="breadcrumb__item">
              <button
                className="breadcrumb__link"
                onClick={() => onNavigate("home")}
              >
                Home
              </button>
              <Icons.ChevR className="breadcrumb__separator" />
            </li>
            <li className="breadcrumb__item">
              <button
                className="breadcrumb__link"
                onClick={() => onNavigate("products")}
              >
                Products
              </button>
              <Icons.ChevR className="breadcrumb__separator" />
            </li>
            <li className="breadcrumb__item breadcrumb__item--current">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Main */}
        <div className="product-main">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__main">
              {isVideoSlide ? (
                <video
                  src={videoUrl}
                  controls
                  className="product-gallery__video"
                />
              ) : (
                <img
                  src={mediaImages[imgIdx]}
                  alt={product.name}
                  className="product-gallery__image"
                />
              )}

              {/* Badges */}
              <div className="product-gallery__badges">
                {productSalePrice && (
                  <span className="badge badge--sale">Sale</span>
                )}
                {productIsBestseller && (
                  <span className="badge badge--bestseller">Bestseller</span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="product-thumbnails">
              {mediaImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`thumbnail-btn ${imgIdx === i ? "thumbnail-btn--active" : ""}`}
                  aria-label={`View image ${i + 1}`}
                  aria-current={imgIdx === i}
                >
                  <img src={img} alt="" className="thumbnail-btn__image" />
                </button>
              ))}
              {videoUrl && (
                <button
                  onClick={() => setImgIdx(totalSlides - 1)}
                  className={`thumbnail-btn thumbnail-btn--video ${isVideoSlide ? "thumbnail-btn--active" : ""}`}
                  aria-label="View video"
                  aria-current={isVideoSlide}
                >
                  <span className="thumbnail-btn__play">▶</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Tags */}
            <div className="product-tags">
              {productIsFeatured && (
                <Chip size="small" color="pink">
                  Featured
                </Chip>
              )}
              {productIsBestseller && (
                <Chip size="small" color="dark">
                  Best Seller
                </Chip>
              )}
              {productShips && (
                <Chip size="small" color="green">
                  Global Shipping
                </Chip>
              )}
            </div>

            {/* Title */}
            <h1 className="product-title">
              {product.name}
              <span className="product-title__jp">{productNameJa}</span>
            </h1>

            {/* Rating */}
            <div className="product-rating">
              <Stars rating={productRating} count={productReviews} size={16} />
            </div>

            {/* Price */}
            <div className="product-price">
              <Price price={productPrice} salePrice={productSalePrice} />
            </div>

            {/* Product Meta */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-item__label">Brand</span>
                <span className="meta-item__value">{productBrand}</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Shelf Life</span>
                <span className="meta-item__value">
                  {productShelfLife} days
                </span>
              </div>
            </div>

            {/* Shipping Notice */}
            {productShips && (
              <div className="shipping-notice">
                <Icons.Truck className="shipping-notice__icon" />
                <div className="shipping-notice__content">
                  <span className="shipping-notice__title">
                    International Shipping
                  </span>
                  <span className="shipping-notice__text">
                    Est. 7–14 business days
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="product-actions">
              <QuantityControl
                qty={qty}
                setQty={setQty}
                max={99}
                size="large"
              />
              <button
                onClick={handleAddToCart}
                className={`btn btn--primary btn--large btn--block ${addedAnim ? "btn--success" : ""}`}
                aria-label="Add to cart"
                aria-live="polite"
              >
                {addedAnim ? (
                  <>
                    <Icons.Check size={16} />
                    Added to Cart!
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={() => setWished(!wished)}
                className={`wishlist-btn ${wished ? "wishlist-btn--active" : ""}`}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wished}
              >
                <Icons.Heart filled={wished} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="trust-badge__icon">🔒</span>
                <span className="trust-badge__text">Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__icon">✨</span>
                <span className="trust-badge__text">Authentic Products</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__icon">💝</span>
                <span className="trust-badge__text">
                  Satisfaction Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls={`tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`}
              >
                <span className="tab-btn__icon" aria-hidden="true">
                  {t.icon}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="tabs-content">
            {/* Description Tab */}
            {tab === "description" && (
              <div id="tab-description" role="tabpanel" className="tab-panel">
                <div className="language-toggle">
                  <button
                    onClick={() => setJa(false)}
                    className={`lang-btn ${!ja ? "lang-btn--active" : ""}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setJa(true)}
                    className={`lang-btn ${ja ? "lang-btn--active" : ""}`}
                  >
                    日本語
                  </button>
                </div>

                <div className="description-content">
                  <p
                    className={`description-text ${ja ? "description-text--jp" : ""}`}
                  >
                    {ja ? productDescriptionJa : productDescription}
                  </p>
                </div>

                {productCertifications.length > 0 && (
                  <div className="certifications">
                    <h3 className="certifications__title">Certifications</h3>
                    <div className="certifications__list">
                      {productCertifications.map((c) => (
                        <Chip key={c} color="green">
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients Tab */}
            {tab === "ingredients" && (
              <div id="tab-ingredients" role="tabpanel" className="tab-panel">
                <div className="ingredients-section">
                  <h3 className="section-title">Ingredients</h3>
                  <p className="ingredients-text">
                    {productIngredients.join(", ") || "No ingredients listed"}
                  </p>
                </div>

                {productAllergens.length > 0 ? (
                  <div className="allergens-warning">
                    <h4 className="allergens-warning__title">
                      <span className="warning-icon">⚠️</span>
                      Allergens
                    </h4>
                    <div className="allergens-list">
                      {productAllergens.map((a) => (
                        <Chip key={a} color="pink">
                          {a}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="allergens-safe">
                    <span className="safe-icon">✓</span>
                    No major allergens
                  </div>
                )}

                <div className="storage-info">
                  <h4 className="storage-info__title">Storage Instructions</h4>
                  <p className="storage-info__text">
                    Store in a cool, dry place away from direct sunlight. Keep
                    refrigerated after opening.
                  </p>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {tab === "shipping" && (
              <div id="tab-shipping" role="tabpanel" className="tab-panel">
                <div className="shipping-grid">
                  {[
                    {
                      icon: "🚚",
                      title: "International Shipping",
                      text: "Ships to 50+ countries. Estimated 7–14 business days via EMS Japan Post.",
                    },
                    {
                      icon: "📦",
                      title: "Packaging",
                      text: "Carefully packaged with cold-chain support for perishables.",
                    },
                    {
                      icon: "🔄",
                      title: "Returns",
                      text: "30-day returns for non-perishables. Contact support for assistance.",
                    },
                    {
                      icon: "💴",
                      title: "Customs",
                      text: "International buyers are responsible for customs duties in their country.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="shipping-card">
                      <span className="shipping-card__icon">{item.icon}</span>
                      <div className="shipping-card__content">
                        <h4 className="shipping-card__title">{item.title}</h4>
                        <p className="shipping-card__text">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {tab === "reviews" && (
              <div id="tab-reviews" role="tabpanel" className="tab-panel">
                <div className="reviews-grid">
                  {/* Reviews List */}
                  <div className="reviews-list">
                    <h3 className="reviews-list__title">
                      Customer Reviews ({reviews?.length || 0})
                    </h3>

                    {reviewsLoading ? (
                      <div className="reviews-loading">Loading reviews...</div>
                    ) : reviews && reviews.length > 0 ? (
                      <div className="reviews-container">
                        {reviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-card__header">
                              <Stars rating={review.rating} size={12} />
                              <span className="review-card__date">
                                {new Date(
                                  review.created_at,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="review-card__body">{review.body}</p>
                            {review.is_verified_purchase && (
                              <Chip size="small" color="green">
                                Verified Purchase
                              </Chip>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="reviews-empty">
                        <p>
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Write Review Form */}
                  <div className="review-form">
                    <h3 className="review-form__title">Write a Review</h3>

                    {submitted ? (
                      <div className="review-success">
                        <div className="success-icon">✅</div>
                        <p>Review submitted! Thank you.</p>
                      </div>
                    ) : (
                      <form
                        className="review-form__content"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="form-group">
                          <label className="form-label">Rating</label>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className={`star-btn ${s <= rating ? "star-btn--active" : ""}`}
                                aria-label={`Rate ${s} stars`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="review-text">
                            Your Review
                          </label>
                          <textarea
                            id="review-text"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                            placeholder="Share your experience…"
                            className="form-textarea"
                          />
                        </div>

                        {reviewError && (
                          <div className="form-error">{reviewError}</div>
                        )}

                        <button
                          type="button"
                          onClick={async () => {
                            if (!body.trim()) return;
                            setReviewError("");
                            try {
                              await createReviewMutation.mutateAsync({
                                product_id: product.id,
                                rating,
                                body: body.trim(),
                                title: "",
                              });
                              setSubmitted(true);
                              setBody("");
                              setRating(5);
                            } catch (error) {
                              setReviewError(
                                getApiErrorMessage(
                                  error,
                                  "Failed to submit review.",
                                ),
                              );
                            }
                          }}
                          className="btn btn--primary btn--block"
                          disabled={!body.trim()}
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
