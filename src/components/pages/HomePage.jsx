import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { Stars } from "../common/Stars";
import { Chip } from "../common/Chip";
import { useProducts, useFeaturedProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { getApiErrorMessage } from "../../utils/api";
import { getCategoryName, getCategoryNameJa } from "../../utils/helpers";
import { useToggleWishlist } from "../../hooks/useAuthMutations";

export const HomePage = ({ onNavigate, addToCart }) => {
  const [bestsellers, setBestsellers] = useState([]);

  const { mutateAsync: toggleWishlist } = useToggleWishlist();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    data: featured = [],
    isLoading: featuredLoading,
    error: featuredError,
  } = useFeaturedProducts();
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useProducts({ page: 1, page_size: 200 });

  const loading = categoriesLoading || featuredLoading || productsLoading;
  const error =
    categoriesError || featuredError || productsError
      ? getApiErrorMessage(
          categoriesError || featuredError || productsError,
          "Failed to load homepage data.",
        )
      : "";

  // For bestsellers, show products but fallback to featured
  React.useEffect(() => {
    const candidates = products.length ? products : featured;
    if (candidates.length > 0) {
      setBestsellers(candidates.slice(0, 8));
    }
  }, [products, featured]);

  return (
    <div style={{ background: "#faf7f2" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .hero-badge { animation: fadeUp 0.6s ease 0.1s both; }
        .hero-h1 { animation: fadeUp 0.6s ease 0.25s both; }
        .hero-p { animation: fadeUp 0.6s ease 0.4s both; }
        .hero-ctas { animation: fadeUp 0.6s ease 0.55s both; }
        .hero-trust { animation: fadeUp 0.6s ease 0.7s both; }
        .cat-btn { transition: transform 0.22s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.22s ease, border-color 0.2s; }
        .cat-btn:hover { transform: translateY(-4px) !important; box-shadow: 0 10px 28px rgba(26,16,8,0.1) !important; border-color: #d4c4b4 !important; }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 20px 90px",
          textAlign: "center",
          background:
            "linear-gradient(145deg, #0f0a04 0%, #1a1008 40%, #2d1a0e 70%, #3d2415 100%)",
          color: "#faf7f2",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,99,122,0.18) 0%, transparent 70%)",
              top: "-10%",
              left: "-5%",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,147,58,0.14) 0%, transparent 70%)",
              top: "20%",
              right: "-8%",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(232,99,122,0.1) 0%, transparent 70%)",
              bottom: "-10%",
              left: "40%",
            }}
          />
          {/* Subtle dot grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(250,247,242,0.06) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div
            className="hero-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(232,99,122,0.15)",
              border: "1px solid rgba(232,99,122,0.3)",
              borderRadius: 30,
              padding: "5px 14px 5px 10px",
              fontSize: 11.5,
              fontWeight: 700,
              color: "#f5a3b0",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 14 }}>🌸</span> Authentic Japanese Goods
          </div>

          <h1
            className="hero-h1"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "clamp(36px, 6.5vw, 64px)",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            Taste the Spirit
            <br />
            of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #e8637a, #f09b70)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Japan
            </span>
          </h1>

          <p
            className="hero-p"
            style={{
              fontSize: 16,
              color: "#b8aa98",
              maxWidth: 440,
              margin: "0 auto 32px",
              lineHeight: 1.75,
            }}
          >
            Curated artisan foods, teas &amp; delicacies — shipped worldwide
            with love from Japan.
          </p>

          <div
            className="hero-ctas"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <HeroBtn primary onClick={() => onNavigate("products")}>
              Shop Now →
            </HeroBtn>
            <HeroBtn onClick={() => onNavigate("categories")}>
              Browse Categories
            </HeroBtn>
          </div>

          <div
            className="hero-trust"
            style={{
              marginTop: 44,
              display: "flex",
              justifyContent: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              ["🚚", "Free Shipping", "Orders over $80"],
              ["🌿", "100% Authentic", "Direct from Japan"],
              ["📦", "Secure Packaging", "Arrives fresh"],
            ].map(([ico, title, sub]) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{ico}</div>
                <div
                  style={{ fontSize: 12.5, fontWeight: 700, color: "#e8d5c0" }}
                >
                  {title}
                </div>
                <div style={{ fontSize: 11, color: "#7a6d5e", marginTop: 2 }}>
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <Section label="Browse by Category" title="カテゴリー">
        {error ? (
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(232,99,122,0.08)",
              border: "1px solid rgba(232,99,122,0.22)",
              borderRadius: 14,
              color: "#8b3b46",
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        ) : null}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="cat-btn"
              onClick={() => onNavigate("products")}
              style={{
                background: "white",
                border: "1.5px solid #ede5d8",
                borderRadius: 18,
                padding: "18px 10px",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(26,16,8,0.04)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {cat.emoji || "📦"}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#1a1008",
                  lineHeight: 1.3,
                }}
              >
                {getCategoryName(cat)}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: "#b8aa98",
                  marginTop: 3,
                  fontFamily: "'Noto Serif JP', serif",
                }}
              >
                {getCategoryNameJa(cat)}
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#e8637a",
                  background: "rgba(232,99,122,0.08)",
                  padding: "2px 7px",
                  borderRadius: 10,
                }}
              >
                {cat.product_count || cat.count || 0} items
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* ── FEATURED ── */}
      <Section
        label="Hand-Picked"
        title="Featured Products"
        action={
          <GhostBtn onClick={() => onNavigate("products")}>View All →</GhostBtn>
        }
      >
        {featured.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 18,
            }}
          >
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: "#8c7e6e", fontSize: 13.5 }}>
            No featured products available right now.
          </div>
        )}
      </Section>

      {/* ── PROMO BANNER ── */}
      <div style={{ padding: "0 20px 52px", maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, #e8637a 0%, #d44f67 40%, #c9933a 100%)",
            borderRadius: 22,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(232,99,122,0.35)",
          }}
        >
          {/* Background texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div style={{ position: "relative" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 6,
              }}
            >
              Limited Time Offer
            </div>
            <h3
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 24,
                color: "white",
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              Spring Sale 🌸
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 13.5,
                margin: 0,
              }}
            >
              Up to 30% off select items · Free shipping on orders over $80
            </p>
          </div>
          <button
            onClick={() => onNavigate("products")}
            style={{
              background: "rgba(26,16,8,0.9)",
              color: "#faf7f2",
              border: "none",
              borderRadius: 12,
              padding: "13px 26px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a1008";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,16,8,0.9)";
              e.currentTarget.style.transform = "none";
            }}
          >
            Shop the Sale →
          </button>
        </div>
      </div>

      {/* ── BESTSELLERS ── */}
      <Section
        label="Customer Favorites"
        title="Best Sellers"
        accentColor="#c9933a"
      >
        {bestsellers.length ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 18,
            }}
          >
            {bestsellers.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: "#8c7e6e", fontSize: 13.5 }}>
            No best sellers available right now.
          </div>
        )}
      </Section>

      {/* ── REVIEWS ── */}
      <section
        style={{
          background: "linear-gradient(180deg, #f0ebe0 0%, #e8e0d0 100%)",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#e8637a",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Global Customers
            </div>
            <h2
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
              }}
            >
              What People Say
            </h2>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: "22px",
              border: "1.5px solid #e5ddd0",
              boxShadow: "0 2px 12px rgba(26,16,8,0.04)",
              color: "#8c7e6e",
              fontSize: 13.5,
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Customer reviews aren’t available yet (the backend doesn’t expose a
            reviews endpoint).
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#0f0a04",
          color: "#b8aa98",
          padding: "52px 20px 28px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 32,
              marginBottom: 36,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "linear-gradient(135deg, #e8637a, #c9933a)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                >
                  🌸
                </div>
                <span
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    color: "#faf7f2",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  さくらShop
                </span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, margin: 0 }}>
                Authentic Japanese food &amp; artisan goods. Shipped worldwide
                from Japan.
              </p>
            </div>

            {[
              ["Shop", ["All Products", "Tea & Matcha", "Snacks", "Beverages"]],
              ["Help", ["Shipping Info", "Returns", "Contact", "FAQ"]],
              ["Legal", ["Privacy Policy", "Terms", "Cookies"]],
            ].map(([title, links]) => (
              <div key={title}>
                <div
                  style={{
                    color: "#faf7f2",
                    fontWeight: 700,
                    marginBottom: 12,
                    fontSize: 11.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  {title}
                </div>
                {links.map((l) => (
                  <div
                    key={l}
                    style={{
                      fontSize: 12.5,
                      marginBottom: 8,
                      cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#faf7f2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#b8aa98")
                    }
                  >
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 20,
              textAlign: "center",
              fontSize: 12.5,
            }}
          >
            © 2025 さくらShop · Made with ❤️ in Japan · Serving customers
            worldwide 🌍
          </div>
        </div>
      </footer>
    </div>
  );
};

function Section({ label, title, accentColor = "#e8637a", action, children }) {
  return (
    <section style={{ padding: "52px 20px", maxWidth: 1240, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accentColor,
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            {label}
          </div>
          <h2
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              color: "#1a1008",
            }}
          >
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function HeroBtn({ primary, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "13px 28px",
        background: primary
          ? "linear-gradient(135deg, #e8637a, #d44f67)"
          : "transparent",
        color: primary ? "white" : "rgba(250,247,242,0.85)",
        border: primary ? "none" : "1.5px solid rgba(250,247,242,0.25)",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
        boxShadow: primary ? "0 4px 18px rgba(232,99,122,0.45)" : "none",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        if (primary)
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(232,99,122,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        if (primary)
          e.currentTarget.style.boxShadow = "0 4px 18px rgba(232,99,122,0.45)";
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "1.5px solid #e5ddd0",
        borderRadius: 10,
        padding: "8px 16px",
        fontSize: 12.5,
        fontWeight: 600,
        color: "#3d2415",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f0ebe0";
        e.currentTarget.style.borderColor = "#c9b8a4";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.borderColor = "#e5ddd0";
      }}
    >
      {children}
    </button>
  );
}
