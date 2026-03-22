import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { Icons } from "../common/Icons";
import "../../styles/layout/Navbar.css";

export function Navbar({ onNavigate }) {
  const { count, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSearch(false);
      onNavigate("products");
    }
    if (e.key === "Escape") setShowSearch(false);
  };

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="navbar__logo"
          aria-label="Home"
        >
          <div className="navbar__logo-icon" aria-hidden="true">
            🌸
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-main">さくら</span>
            <span className="navbar__logo-sub">SHOP</span>
          </div>
        </button>

        {/* Divider */}
        <div className="navbar__divider" aria-hidden="true" />

        {/* Navigation Links */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {[
            ["Products", "products"],
            ["Categories", "categories"],
          ].map(([label, route]) => (
            <button
              key={route}
              onClick={() => onNavigate(route)}
              className="navbar__nav-link"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="navbar__controls">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="navbar__icon-btn"
            aria-label="Search"
            aria-expanded={showSearch}
          >
            <Icons.Search />
          </button>

          <button
            onClick={() => onNavigate(isAuthenticated ? "dashboard" : "auth")}
            className="navbar__icon-btn"
            aria-label="Account"
          >
            <Icons.User />
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="navbar__cart-btn"
            aria-label="Shopping cart"
            aria-live="polite"
          >
            <Icons.Cart />
            <span className="navbar__cart-text">Cart</span>
            {count > 0 && (
              <span
                className="navbar__cart-badge"
                aria-label={`${count} items in cart`}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`navbar__search ${showSearch ? "navbar__search--visible" : ""}`}
      >
        <div className="navbar__search-container">
          <input
            ref={(input) => input && showSearch && input.focus()}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search Japanese products… 日本語も可"
            className="navbar__search-input"
            aria-label="Search products"
          />
          {searchVal && (
            <button
              className="navbar__search-clear"
              onClick={() => setSearchVal("")}
              aria-label="Clear search"
            >
              <Icons.X size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
