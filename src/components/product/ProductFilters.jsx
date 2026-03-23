import React from "react";
import { getCategoryName, formatPrice } from "../../utils/helpers";
import { Icons } from "../common/Icons";
import "../../styles/pages/ProductFilter.css";

export function ProductFilters({
  categories = [],
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  maxPrice,
  onPriceChange,
  totalResults = 0,
  currency = "JPY",
}) {
  // Helper function to safely get category name
  const getSafeCategoryName = (category) => {
    const name = getCategoryName(category);
    return typeof name === "string" ? name : category.name || "Category";
  };

  return (
    <div className="filters-panel">
      <div className="filters-panel__header">
        <div className="filters-header">
          <h2 className="filters-header__title">Filters</h2>
          <span className="filters-header__count">{totalResults} results</span>
        </div>
      </div>

      <div className="filters-panel__content">
        {/* Search */}
        <div className="filter-group">
          <label className="filter-group__label">Search</label>
          <div className="search-field">
            <Icons.Search className="search-field__icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="search-field__input"
              aria-label="Search products"
            />
            {search && (
              <button
                className="search-field__clear"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <Icons.X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-group__label" htmlFor="category-select">
            Category
          </label>
          <div className="select-wrapper">
            <select
              id="category-select"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="filter-select"
              aria-label="Select category"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug || c.id}>
                  {getSafeCategoryName(c)}
                </option>
              ))}
            </select>
            <Icons.ChevronDown className="select-icon" />
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group">
          <label className="filter-group__label" htmlFor="sort-select">
            Sort by
          </label>
          <div className="select-wrapper">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
              aria-label="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            <Icons.ChevronDown className="select-icon" />
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group filter-group--range">
          <div className="price-range-header">
            <label className="filter-group__label">Max Price</label>
            <span className="price-range-value">
              {formatPrice(maxPrice, currency)}
            </span>
          </div>
          <div className="price-range">
            <input
              type="range"
              min={100}
              max={10000}
              value={maxPrice}
              onChange={(e) => onPriceChange(+e.target.value)}
              className="price-range__slider"
              aria-label="Maximum price"
            />
            <div className="price-range__labels">
              <span>{formatPrice(100, currency)}</span>
              <span>{formatPrice(10000, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
