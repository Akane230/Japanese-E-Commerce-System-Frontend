## Overview

The frontend is a React SPA built with Vite, providing customer-facing e-commerce UX: browsing, search, categories, product detail, cart, checkout, order tracking and customer dashboard.

## Tech Stack

- React with Vite
- Axios for HTTP
- @tanstack/react-query for data fetching and caching
- LocalStorage for JWT tokens
- CSS and component-based styles

## Project Structure

- src/App.jsx: presentational navigation manager (page state, slug, category, tracking)
- src/context/AuthContext.jsx, CartContext.jsx
- src/hooks/ for useProducts, useCategories, useCart, useOrders, etc.
- src/services/ for backend API calls
- src/components/ for pages, product cards, layout, modals
- src/utils/api.js handles token/interceptor, error extraction, and product normalization

## API Integration

Base API endpoint configured by VITE_API_URL in .env.

Usage includes:

- /api/auth/ handles auth and user profile
- /api/products/, /api/categories/ for product catalog
- /api/cart/, /api/orders/, /api/payments/ for checkout flow
- /api/reviews/ for product reviews

Token refresh chain is implemented for 401 responses.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Navigation chooses page by in-app state, not a router package.
- CartContext syncs user actions to API and local storage.
- AuthContext stores login state and controls session refresh.
