// ─── ProductsPage.jsx ──────────────────────────────────────────────────────────
import React, { useState } from "react";
import { ProductCard } from "../product/ProductCard";
import { ProductFilters } from "../product/ProductFilters";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../hooks/useAuth";
import { useToggleWishlist } from "../../hooks/useAuthMutations";
import { getApiErrorMessage } from "../../utils/api";

export const ProductsPage = ({
  onNavigate,
  addToCart,
  defaultCategory = null,
}) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [catFilter, setCatFilter] = useState(defaultCategory || "all");
  const [maxPrice, setMaxPrice] = useState(1000);

  // Build query params for server-side filtering
  const queryParams = {
    page: 1,
    page_size: 200,
    sort_by: sortBy,
    ...(catFilter !== "all" && { category_slug: catFilter }),
    ...(search && { search }),
    // Only apply max price filter when user lowers it below the default ceiling
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

  const loading = productsLoading || categoriesLoading;
  const error =
    productsError || categoriesError
      ? getApiErrorMessage(
          productsError || categoriesError,
          "Failed to load products.",
        )
      : "";

  const filtered = products; // Server-side filtering now

  // Keep category filter in sync when the parent navigation changes
  React.useEffect(() => {
    if (defaultCategory) {
      setCatFilter(defaultCategory);
    }
  }, [defaultCategory]);

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
          Explore
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h1
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 26,
              margin: 0,
              color: "#1a1008",
              fontWeight: 700,
            }}
          >
            All Products
          </h1>
          <span style={{ fontSize: 13, color: "#b8aa98", fontWeight: 600 }}>
            {productsData?.count || filtered.length} authentic Japanese goods
          </span>
        </div>
      </div>

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
      />

      {loading ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#f0ebe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 18px",
            }}
          >
            🌸
          </div>
          <h3
            style={{
              fontFamily: "'Noto Serif JP', serif",
              margin: "0 0 8px",
              fontSize: 18,
              color: "#3d2415",
            }}
          >
            Loading products…
          </h3>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            Fetching the latest catalog from the server.
          </p>
        </div>
      ) : error ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#f0ebe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 18px",
            }}
          >
            ⚠️
          </div>
          <h3
            style={{
              fontFamily: "'Noto Serif JP', serif",
              margin: "0 0 8px",
              fontSize: 18,
              color: "#3d2415",
            }}
          >
            Couldn’t load products
          </h3>
          <p style={{ margin: 0, fontSize: 13.5 }}>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "80px 0", color: "#8c7e6e" }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#f0ebe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 18px",
            }}
          >
            🔍
          </div>
          <h3
            style={{
              fontFamily: "'Noto Serif JP', serif",
              margin: "0 0 8px",
              fontSize: 18,
              color: "#3d2415",
            }}
          >
            No products found
          </h3>
          <p style={{ margin: 0, fontSize: 13.5 }}>
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 18,
          }}
        >
          {filtered.map((p, i) => (
            <div
              key={p.id}
              style={{
                animation: `fadeUp 0.35s ease ${Math.min(i, 8) * 0.05}s both`,
              }}
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
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
