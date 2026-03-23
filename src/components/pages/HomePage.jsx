import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { useProducts, useFeaturedProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { getApiErrorMessage } from "../../utils/api";
import { getCategoryName, getCategoryNameJa } from "../../utils/helpers";
import { useToggleWishlist } from "../../hooks/useAuthMutations";
import "../../styles/pages/HomePage.css";

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

  React.useEffect(() => {
    const candidates = products.length ? products : featured;
    if (candidates.length > 0) {
      setBestsellers(candidates.slice(0, 8));
    }
  }, [products, featured]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-bg" aria-hidden="true">
          <div className="home__hero-orb home__hero-orb--1" />
          <div className="home__hero-orb home__hero-orb--2" />
          <div className="home__hero-orb home__hero-orb--3" />
        </div>

        <div className="container">
          <div className="home__hero-content">
            <span className="home__hero-badge">
              <span className="home__hero-badge-icon" aria-hidden="true">
                🎌
              </span>
              Authentic Japanese Goods
            </span>

            <h1 className="home__hero-title">
              Taste the Spirit
              <br />
              of <span className="home__hero-title-accent">Japan</span>
            </h1>

            <p className="home__hero-description">
              Curated artisan foods, teas & delicacies — shipped worldwide with
              love from Japan.
            </p>

            <div className="home__hero-actions">
              <button
                className="btn btn--primary btn--lg"
                onClick={() => onNavigate("products")}
              >
                Shop Now
                <span className="btn__icon" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                className="btn btn--outline btn--lg"
                onClick={() => onNavigate("categories")}
              >
                Browse Categories
              </button>
            </div>

            <div className="home__trust-badges">
              {[
                ["🚚", "Free Shipping", "Orders over $80"],
                ["🌿", "100% Authentic", "Direct from Japan"],
                ["📦", "Secure Packaging", "Arrives fresh"],
              ].map(([icon, title, subtitle]) => (
                <div key={title} className="trust-badge">
                  <span className="trust-badge__icon" aria-hidden="true">
                    {icon}
                  </span>
                  <div className="trust-badge__content">
                    <div className="trust-badge__title">{title}</div>
                    <div className="trust-badge__subtitle">{subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home__section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-header__eyebrow">
                Browse by Category
              </span>
              <h2 className="section-header__title">Categories</h2>
              <p className="section-header__subtitle">探索する</p>
            </div>
            <button
              className="btn btn--ghost"
              onClick={() => onNavigate("categories")}
            >
              View All
              <span className="btn__icon" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="categories-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-card"
                onClick={() => onNavigate("products", cat.slug)}
              >
                <span className="category-card__emoji" aria-hidden="true">
                  {cat.emoji || "📦"}
                </span>
                <h3 className="category-card__title">{getCategoryName(cat)}</h3>
                <span className="category-card__title-jp">
                  {getCategoryNameJa(cat)}
                </span>
                <span className="category-card__count">
                  {cat.product_count || cat.count || 0} items
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home__section home__section--alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-header__eyebrow">Hand-Picked</span>
              <h2 className="section-header__title">Featured Products</h2>
              <p className="section-header__subtitle">おすすめ</p>
            </div>
            <button
              className="btn btn--ghost"
              onClick={() => onNavigate("products")}
            >
              View All
              <span className="btn__icon" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {featured.length ? (
            <div className="products-grid">
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
            <div className="empty-state">
              <p className="empty-state__message">
                No featured products available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* <section className="home__promo">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner__content">
              <span className="promo-banner__eyebrow">Limited Time Offer</span>
              <h3 className="promo-banner__title">Spring Sale 🌸</h3>
              <p className="promo-banner__description">
                Up to 30% off select items · Free shipping on orders over $80
              </p>
            </div>
            <button
              className="btn btn--primary btn--lg"
              onClick={() => onNavigate("products")}
            >
              Shop the Sale
              <span className="btn__icon" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </section> */}

      {/* Bestsellers */}
      <section className="home__section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-header__eyebrow">
                Customer Favorites
              </span>
              <h2 className="section-header__title">Best Sellers</h2>
              <p className="section-header__subtitle">人気商品</p>
            </div>
          </div>

          {bestsellers.length ? (
            <div className="products-grid">
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
            <div className="empty-state">
              <p className="empty-state__message">
                No best sellers available right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* <section className="home__section home__section--reviews">
        <div className="container">
          <div className="section-header section-header--centered">
            <span className="section-header__eyebrow">Global Customers</span>
            <h2 className="section-header__title">Customer Reviews</h2>
            <p className="section-header__subtitle">レビュー</p>
          </div>

          <div className="reviews-placeholder">
            <p>
              Customer reviews aren't available yet — we're working on bringing
              you authentic feedback from our customers.
            </p>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__logo">
                <span className="footer__logo-icon" aria-hidden="true">
                  🌸
                </span>
                <span className="footer__logo-text">さくらShop</span>
              </div>
              <p className="footer__description">
                Authentic Japanese food & artisan goods. Shipped worldwide from
                Japan.
              </p>
            </div>

            {[
              ["Shop", ["All Products", "Tea & Matcha", "Snacks", "Beverages"]],
              ["Help", ["Shipping Info", "Returns", "Contact", "FAQ"]],
              ["Legal", ["Privacy Policy", "Terms", "Cookies"]],
            ].map(([title, links]) => (
              <div key={title} className="footer__column">
                <h4 className="footer__column-title">{title}</h4>
                <ul className="footer__links">
                  {links.map((link) => (
                    <li key={link}>
                      <button className="footer__link">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <p>
              © 2025 さくらShop · Made with ❤️ in Japan · Serving customers
              worldwide 🌍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
