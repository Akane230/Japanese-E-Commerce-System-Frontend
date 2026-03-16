import React, { useState } from "react";
import { Icons } from "../common/Icons";
import { Stars } from "../common/Stars";
import { Price } from "../common/Price";
import { Chip } from "../common/Chip";
import { QuantityControl } from "../common/QuantityControl";
import { useProduct } from "../../hooks/useProducts";
import { useProductReviews, useCreateReview } from "../../hooks/useReviews";
import { getApiErrorMessage } from "../../utils/api";

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
  const mediaImages = product?.media?.image_urls?.length
    ? product.media.image_urls
    : product?.media?.thumbnail_url
      ? [product.media.thumbnail_url]
      : [];

  const videoUrl = product?.media?.video_url_full || null;

  // video appears as last "slide" if present
  const totalSlides = mediaImages.length + (videoUrl ? 1 : 0);
  const isVideoSlide = videoUrl && imgIdx === totalSlides - 1;

  // Fix: This was incorrectly placed
  const error = productError
    ? getApiErrorMessage(productError, "Failed to load product.")
    : "";

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            marginBottom: 14,
            animation: "pulse 1.4s ease infinite",
          }}
        >
          🌸
        </div>
        <p style={{ color: "#b8aa98", fontSize: 14 }}>Loading product…</p>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.95)} 50%{opacity:1;transform:scale(1.05)} }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#8c7e6e", fontSize: 14 }}>
          {error || "Product not found."}
        </p>
      </div>
    );
  }

  // Safe property access with defaults
  const productNameJa = product.nameJa || product.name;
  const productDescription = product.description || "";
  const productDescriptionJa = product.descriptionJa || productDescription;
  const productBrand = product.brand || "Generic";
  const productShelfLife = product.shelfLife || 0;
  const productCertifications = product.certifications || [];
  const productIngredients = product.ingredients || [];
  const productAllergens = product.allergens || [];
  const productShips = product.ships || false;
  const productIsFeatured = product.isFeatured || false;
  const productIsBestseller = product.isBestseller || false;
  const productRating = product.rating || 0;
  const productReviews = product.reviews || 0;
  const productPrice = product.price || 0;
  const productSalePrice = product.salePrice || null;

  const tabs = ["description", "ingredients", "shipping", "reviews"];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          marginBottom: 24,
          fontSize: 12.5,
          color: "#b8aa98",
        }}
      >
        {[
          ["Home", "home"],
          ["Products", "products"],
        ].map(([label, route]) => (
          <React.Fragment key={route}>
            <button
              onClick={() => onNavigate(route)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#b8aa98",
                fontSize: 12.5,
                fontFamily: "inherit",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3d2415")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#b8aa98")}
            >
              {label}
            </button>
            <Icons.ChevR />
          </React.Fragment>
        ))}
        <span style={{ color: "#1a1008", fontWeight: 600 }}>
          {product.name}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44 }}>
        {/* Gallery */}
        <div>
          <div
            style={{
              borderRadius: 22,
              overflow: "hidden",
              background: "#f5efe6",
              paddingTop: "100%",
              position: "relative",
              marginBottom: 12,
              boxShadow: "0 4px 24px rgba(26,16,8,0.08)",
            }}
          >
            {isVideoSlide ? (
              <video
                src={videoUrl}
                controls
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <img
                src={mediaImages[imgIdx]}
                alt={product.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.25s ease",
                }}
              />
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {mediaImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `2px solid ${imgIdx === i ? "#e8637a" : "#ede5d8"}`,
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                  transform: imgIdx === i ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    imgIdx === i ? "0 3px 10px rgba(232,99,122,0.3)" : "none",
                }}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </button>
            ))}
            {videoUrl && (
              <button
                onClick={() => setImgIdx(totalSlides - 1)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `2px solid ${isVideoSlide ? "#e8637a" : "#ede5d8"}`,
                  background: "#1a1008",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  transition: "border-color 0.2s",
                  transform: isVideoSlide ? "scale(1.05)" : "scale(1)",
                  boxShadow: isVideoSlide
                    ? "0 3px 10px rgba(232,99,122,0.3)"
                    : "none",
                }}
              >
                ▶
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {productIsFeatured && <Chip>Featured</Chip>}
            {productIsBestseller && <Chip color="dark">Best Seller</Chip>}
            {productShips && <Chip color="green">Ships Globally</Chip>}
          </div>

          <h1
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 4px",
              lineHeight: 1.25,
              color: "#1a1008",
            }}
          >
            {product.name}
          </h1>
          <div
            style={{
              fontSize: 14,
              color: "#b8aa98",
              marginBottom: 14,
              fontFamily: "'Noto Serif JP', serif",
            }}
          >
            {productNameJa}
          </div>

          <Stars rating={productRating} count={productReviews} size={16} />

          <div style={{ margin: "16px 0" }}>
            <Price price={productPrice} salePrice={productSalePrice} />
          </div>

          <div
            style={{
              background: "#f5f0e8",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 13,
              color: "#3d2415",
            }}
          >
            <strong>Brand:</strong> {productBrand} &nbsp;·&nbsp;{" "}
            <strong>Shelf life:</strong> {productShelfLife} days
          </div>

          {productShips && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                background: "#d8f3e3",
                borderRadius: 12,
                marginBottom: 16,
                fontSize: 13,
                color: "#2d6a4f",
                fontWeight: 600,
              }}
            >
              <Icons.Truck /> International shipping · Est. 7–14 business days
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <QuantityControl qty={qty} setQty={setQty} />
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                minWidth: 150,
                padding: "13px 20px",
                background: addedAnim
                  ? "linear-gradient(135deg, #2d6a4f, #40916c)"
                  : "linear-gradient(135deg, #e8637a, #d44f67)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.3s, transform 0.15s",
                boxShadow: addedAnim
                  ? "0 4px 14px rgba(45,106,79,0.4)"
                  : "0 4px 14px rgba(232,99,122,0.4)",
                fontFamily: "inherit",
                transform: addedAnim ? "scale(0.98)" : "scale(1)",
              }}
            >
              {addedAnim ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={() => setWished(!wished)}
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                border: `2px solid ${wished ? "#e8637a" : "#ede5d8"}`,
                background: wished ? "#fde8ec" : "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: wished ? "#e8637a" : "#8c7e6e",
                transition: "all 0.2s",
                flexShrink: 0,
                transform: wished ? "scale(1.08)" : "scale(1)",
              }}
            >
              <Icons.Heart filled={wished} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 52 }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            borderBottom: "2px solid #ede5d8",
            marginBottom: 28,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "11px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                fontFamily: "inherit",
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#e8637a" : "#8c7e6e",
                borderBottom: `2px solid ${tab === t ? "#e8637a" : "transparent"}`,
                marginBottom: -2,
                transition: "color 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "description" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[
                ["en", "English"],
                ["ja", "日本語"],
              ].map(([l, label]) => (
                <button
                  key={l}
                  onClick={() => setJa(l === "ja")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    border: "1.5px solid #ede5d8",
                    cursor: "pointer",
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    background: (ja ? l === "ja" : l === "en")
                      ? "#1a1008"
                      : "white",
                    color: (ja ? l === "ja" : l === "en")
                      ? "#faf7f2"
                      : "#3d2415",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: "#3d2415",
                fontFamily: ja ? "'Noto Serif JP', serif" : "inherit",
                margin: 0,
              }}
            >
              {ja ? productDescriptionJa : productDescription}
            </p>
            {productCertifications.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{ fontWeight: 700, marginBottom: 8, fontSize: 13.5 }}
                >
                  Certifications
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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

        {tab === "ingredients" && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>
                Ingredients
              </div>
              <p
                style={{
                  color: "#3d2415",
                  lineHeight: 1.75,
                  fontSize: 13.5,
                  margin: 0,
                }}
              >
                {productIngredients.join(", ") || "No ingredients listed"}
              </p>
            </div>
            {productAllergens.length > 0 ? (
              <div
                style={{
                  background: "#fde8ec",
                  border: "1px solid #f5c4cc",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{ fontWeight: 700, color: "#c44d62", marginBottom: 8 }}
                >
                  ⚠️ Allergens
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {productAllergens.map((a) => (
                    <Chip key={a} color="pink">
                      {a}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#d8f3e3",
                  border: "1px solid #b2e5c7",
                  borderRadius: 14,
                  padding: "14px 16px",
                  color: "#2d6a4f",
                  fontWeight: 600,
                  fontSize: 13.5,
                }}
              >
                ✓ No major allergens
              </div>
            )}
            <div
              style={{
                marginTop: 14,
                background: "#fdf3e3",
                border: "1px solid #f0d9b5",
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              <div
                style={{ fontWeight: 700, color: "#c9933a", marginBottom: 6 }}
              >
                Storage
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#3d2415",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                Store in a cool, dry place away from direct sunlight. Keep
                refrigerated after opening.
              </p>
            </div>
          </div>
        )}

        {tab === "shipping" && (
          <div
            style={{
              maxWidth: 580,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              [
                "🚚",
                "International Shipping",
                "Ships to 50+ countries. Estimated 7–14 business days via EMS Japan Post.",
              ],
              [
                "📦",
                "Packaging",
                "Carefully packaged with cold-chain support for perishables.",
              ],
              [
                "🔄",
                "Returns",
                "30-day returns for non-perishables. Contact support for assistance.",
              ],
              [
                "💴",
                "Customs",
                "International buyers are responsible for customs duties in their country.",
              ],
            ].map(([ico, title, body]) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "15px 16px",
                  background: "white",
                  borderRadius: 14,
                  border: "1.5px solid #ede5d8",
                  boxShadow: "0 2px 8px rgba(26,16,8,0.03)",
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{ico}</span>
                <div>
                  <div
                    style={{ fontWeight: 700, marginBottom: 4, fontSize: 13.5 }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#8c7e6e",
                      lineHeight: 1.65,
                    }}
                  >
                    {body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "reviews" && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 18,
                  fontSize: 14.5,
                  color: "#1a1008",
                }}
              >
                Customer Reviews ({reviews?.length || 0})
              </div>
              {reviewsLoading ? (
                <div
                  style={{
                    padding: "16px",
                    background: "white",
                    borderRadius: 16,
                    border: "1.5px solid #ede5d8",
                    textAlign: "center",
                    color: "#8c7e6e",
                  }}
                >
                  Loading reviews...
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      style={{
                        padding: "16px",
                        background: "white",
                        borderRadius: 16,
                        border: "1.5px solid #ede5d8",
                        boxShadow: "0 2px 8px rgba(26,16,8,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Stars rating={review.rating} size={12} />
                        <span style={{ fontSize: 11, color: "#8c7e6e" }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#3d2415",
                          margin: "8px 0",
                          lineHeight: 1.5,
                        }}
                      >
                        {review.body}
                      </p>
                      {review.is_verified_purchase && (
                        <Chip
                          color="green"
                          style={{ fontSize: 10, padding: "2px 8px" }}
                        >
                          Verified Purchase
                        </Chip>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    background: "white",
                    borderRadius: 16,
                    border: "1.5px solid #ede5d8",
                    boxShadow: "0 2px 8px rgba(26,16,8,0.03)",
                    color: "#8c7e6e",
                    fontSize: 13.5,
                    textAlign: "center",
                  }}
                >
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 18,
                  fontSize: 14.5,
                  color: "#1a1008",
                }}
              >
                Write a Review
              </div>
              {submitted ? (
                <div
                  style={{
                    background: "#d8f3e3",
                    borderRadius: 18,
                    padding: "40px 24px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
                  <div
                    style={{ fontWeight: 700, color: "#2d6a4f", fontSize: 15 }}
                  >
                    Review submitted! Thank you.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "22px",
                    border: "1.5px solid #ede5d8",
                    boxShadow: "0 2px 12px rgba(26,16,8,0.04)",
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#b8aa98",
                      }}
                    >
                      Rating
                    </label>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setRating(s)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 28,
                            color: s <= rating ? "#c9933a" : "#ddd",
                            transition: "color 0.15s, transform 0.15s",
                            padding: 0,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.15)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "none")
                          }
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        display: "block",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#b8aa98",
                      }}
                    >
                      Your Review
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                      placeholder="Share your experience…"
                      style={{
                        width: "100%",
                        padding: "11px 13px",
                        border: "1.5px solid #ede5d8",
                        borderRadius: 11,
                        fontSize: 13.5,
                        resize: "vertical",
                        outline: "none",
                        fontFamily: "inherit",
                        color: "#1a1008",
                        background: "#faf7f2",
                        boxSizing: "border-box",
                        transition: "border-color 0.15s",
                        minHeight: 100,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#e8637a")}
                      onBlur={(e) => (e.target.style.borderColor = "#ede5d8")}
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!body.trim()) return;
                      setReviewError("");
                      try {
                        await createReviewMutation.mutateAsync({
                          product_id: product.id,
                          rating,
                          body: body.trim(),
                          title: "", // Optional title
                        });
                        setSubmitted(true);
                        setBody("");
                        setRating(5);
                      } catch (error) {
                        setReviewError(
                          getApiErrorMessage(error, "Failed to submit review."),
                        );
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      background: body.trim()
                        ? "linear-gradient(135deg, #e8637a, #d44f67)"
                        : "#e5ddd0",
                      color: body.trim() ? "white" : "#8c7e6e",
                      border: "none",
                      borderRadius: 11,
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: body.trim() ? "pointer" : "default",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      boxShadow: body.trim()
                        ? "0 4px 14px rgba(232,99,122,0.35)"
                        : "none",
                    }}
                  >
                    Submit Review
                  </button>
                  {reviewError && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: "10px 14px",
                        background: "#fde8ec",
                        border: "1px solid #f5c4cc",
                        borderRadius: 10,
                        fontSize: 13,
                        color: "#c44d62",
                      }}
                    >
                      {reviewError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
