import React from "react";
import { getCategoryName } from "../../utils/helpers";

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
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1.5px solid #ede5d8",
        padding: "18px 20px",
        marginBottom: 24,
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "flex-end",
        boxShadow: "0 2px 12px rgba(26,16,8,0.04)",
      }}
    >
      {/* Search */}
      <FilterGroup label="Search" flex="1 1 180px">
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.4,
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            style={{
              width: "100%",
              padding: "9px 12px 9px 30px",
              border: "1.5px solid #ede5d8",
              borderRadius: 10,
              fontSize: 13.5,
              outline: "none",
              background: "#faf7f2",
              color: "#1a1008",
              fontFamily: "inherit",
              boxSizing: "border-box",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#e8637a";
              e.target.style.boxShadow = "0 0 0 3px rgba(232,99,122,0.08)";
              e.target.style.background = "white";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ede5d8";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#faf7f2";
            }}
          />
        </div>
      </FilterGroup>

      {/* Category */}
      <FilterGroup label="Category" flex="1 1 140px">
        <StyledSelect
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug || c.id}>
              {getCategoryName(c)}
            </option>
          ))}
        </StyledSelect>
      </FilterGroup>

      {/* Sort */}
      <FilterGroup label="Sort by" flex="1 1 140px">
        <StyledSelect
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </StyledSelect>
      </FilterGroup>

      {/* Price Range */}
      <FilterGroup
        label={
          <>
            Max Price:{" "}
            <span style={{ color: "#e8637a", fontWeight: 700 }}>
              ${maxPrice}
            </span>
          </>
        }
        flex="1 1 150px"
      >
        <div style={{ paddingTop: 4 }}>
          <input
            type="range"
            min={10}
            max={1000}
            value={maxPrice}
            onChange={(e) => onPriceChange(+e.target.value)}
            style={{ width: "100%", accentColor: "#e8637a", cursor: "pointer" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#b8aa98",
              marginTop: 2,
            }}
          >
            <span>$10</span>
            <span>$1000</span>
          </div>
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, flex, children }) {
  return (
    <div style={{ flex }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#b8aa98",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "9px 12px",
        border: "1.5px solid #ede5d8",
        borderRadius: 10,
        fontSize: 13.5,
        background: "#faf7f2",
        color: "#1a1008",
        fontFamily: "inherit",
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.15s",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8aa98' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        paddingRight: 30,
      }}
      onFocus={(e) => (e.target.style.borderColor = "#e8637a")}
      onBlur={(e) => (e.target.style.borderColor = "#ede5d8")}
    >
      {children}
    </select>
  );
}
