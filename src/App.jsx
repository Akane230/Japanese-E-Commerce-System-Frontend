import React, { useState } from "react";
import "./styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useCart } from "./hooks/useCart";

import { Navbar } from "./components/layout/Navbar";
import { CartDrawer } from "./components/layout/CartDrawer";

import { HomePage } from "./components/pages/HomePage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { CategoriesPage } from "./components/pages/CategoriesPage";
import { ProductDetailPage } from "./components/pages/ProductDetailsPage";
import { CartPage } from "./components/pages/CartPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { TrackingPage } from "./components/pages/TrackingPage";
import AuthPage from "./components/pages/AuthPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

function InnerApp({ page, slug, categoryFilter, orderNumber, onNavigate }) {
  const { addItem } = useCart();

  const handleAddToCart = (product, quantity = 1) => {
    addItem(product, quantity);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f2" }}>
      <Navbar onNavigate={onNavigate} />
      <CartDrawer onNavigate={onNavigate} />

      {page === "home" && (
        <HomePage onNavigate={onNavigate} addToCart={handleAddToCart} />
      )}
      {page === "products" && (
        <ProductsPage
          onNavigate={onNavigate}
          addToCart={handleAddToCart}
          defaultCategory={categoryFilter}
        />
      )}
      {page === "categories" && <CategoriesPage onNavigate={onNavigate} />}
      {page === "product" && (
        <ProductDetailPage
          slug={slug}
          onNavigate={onNavigate}
          addToCart={handleAddToCart}
        />
      )}
      {page === "cart" && <CartPage onNavigate={onNavigate} />}
      {page === "checkout" && <CheckoutPage onNavigate={onNavigate} />}
      {page === "dashboard" && <DashboardPage onNavigate={onNavigate} />}
      {page === "auth" && <AuthPage onNavigate={onNavigate} />}
      {page === "tracking" && (
        <TrackingPage orderNumber={orderNumber} onNavigate={onNavigate} />
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [slug, setSlug] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleNavigate = (newPage, param = null) => {
    setPage(newPage);

    // When navigating to product details, param is treated as slug
    if (newPage === "product") {
      setSlug(param);
    } else {
      setSlug(null);
    }

    // When navigating to product listing, param can be a category slug/id
    if (newPage === "products") {
      setCategoryFilter(param || null);
    }

    // When navigating to tracking, param is treated as order number
    if (newPage === "tracking") {
      setOrderNumber(param);
    }

    // Reset category filter on other pages
    if (newPage !== "products") {
      setCategoryFilter(null);
    }

    // Reset order number on other pages
    if (newPage !== "tracking") {
      setOrderNumber(null);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <InnerApp
            page={page}
            slug={slug}
            categoryFilter={categoryFilter}
            orderNumber={orderNumber}
            onNavigate={handleNavigate}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
