import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { ProductFilters } from "../product/ProductFilters";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../hooks/useAuth";
import { useToggleWishlist } from "../../hooks/useAuthMutations";
import { getApiErrorMessage } from "../../utils/api";
import { getCategoryName } from "../../utils/helpers";
import { Icons } from "../common/Icons";
import "../../styles/pages/ProductsPage.css";

export const ProductsPage = ({
  onNavigate,
  addToCart,
  defaultCategory = null,
}) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [catFilter, setCatFilter] = useState(defaultCategory || "all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Build query params for server-side filtering
  const queryParams = {
    page: 1,
    page_size: 200,
    sort_by: sortBy,
    ...(catFilter !== "all" && { category_slug: catFilter }),
    ...(search && { search }),
    ...(maxPrice && maxPrice < 1000 ? { max_price: maxPrice } : {}),
  };

  const { user } = useAuth();
  const toggleWishlist = useToggleWishlist();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(queryParams);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const products = productsData?.results || productsData || [];
  const categories = categoriesData || [];
  const totalCount = productsData?.count || products.length;

  const loading = productsLoading || categoriesLoading;
  const error =
    productsError || categoriesError
      ? getApiErrorMessage(
          productsError || categoriesError,
          "Failed to load products.",
        )
      : "";

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div className="products-header__content">
            <span className="products-header__eyebrow">Explore</span>
            <h1 className="products-header__title">All Products</h1>
            <p className="products-header__subtitle">日本の製品</p>
          </div>
          {/* <div className="products-header__stats">
            <span className="products-stats__count">{totalCount}</span>
            <span className="products-stats__label">
              authentic Japanese goods
            </span>
          </div> */}
        </div>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          search={search}
          onSearchChange={setSearch}
          category={catFilter}
          onCategoryChange={setCatFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          maxPrice={maxPrice}
          onPriceChange={setMaxPrice}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={totalCount}
        />

        {/* Active Filters */}
        {(search || catFilter !== "all" || maxPrice < 1000) && (
          <div className="active-filters">
            <span className="active-filters__label">Active filters:</span>
            <div className="active-filters__list">
              {search && (
                <button className="filter-tag" onClick={() => setSearch("")}>
                  Search: "{search}"
                  <Icons.X size={12} />
                </button>
              )}
              {catFilter !== "all" && (
                <button
                  className="filter-tag"
                  onClick={() => setCatFilter("all")}
                >
                  Category:{" "}
                  {getCategoryName(
                    categories.find((c) => (c.slug || c.id) === catFilter),
                  ) || catFilter}
                  <Icons.X size={12} />
                </button>
              )}
              {maxPrice < 1000 && (
                <button
                  className="filter-tag"
                  onClick={() => setMaxPrice(1000)}
                >
                  Max price: ${maxPrice}
                  <Icons.X size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="products-loading">
            <div className="loading-spinner">
              <div className="spinner-circle" />
              <div className="spinner-circle" />
              <div className="spinner-circle" />
            </div>
            <h3 className="loading-title">Loading products…</h3>
            <p className="loading-message">
              Fetching the latest catalog from the server.
            </p>
          </div>
        ) : error ? (
          <div className="products-error">
            <div className="error-icon" aria-hidden="true">
              ⚠️
            </div>
            <h3 className="error-title">Couldn't load products</h3>
            <p className="error-message">{error}</p>
            <button
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <div className="empty-icon" aria-hidden="true">
              🔍
            </div>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-message">
              Try adjusting your filters or search terms
            </p>
            <button
              className="btn btn--secondary"
              onClick={() => {
                setSearch("");
                setCatFilter("all");
                setMaxPrice(1000);
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`products-grid products-grid--${viewMode}`}>
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="product-item"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                >
                  <ProductCard
                    product={p}
                    onNavigate={onNavigate}
                    onAddToCart={addToCart}
                    isWished={
                      Array.isArray(user?.wishlist) &&
                      user.wishlist.includes(String(p.id))
                    }
                    onToggleWishlist={() => toggleWishlist.mutate(p.id)}
                  />
                </div>
              ))}
            </div>

            {/* Results summary */}
            <div className="products-summary">
              <p>
                Showing <strong>{products.length}</strong> of{" "}
                <strong>{totalCount}</strong> products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
