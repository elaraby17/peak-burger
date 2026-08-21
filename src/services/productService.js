import { products, getProductBySlugOrId, getProductsByCategory, getPopularProducts } from "../data/products";

// Every function returns a Promise so callers already behave like they're
// hitting an async Laravel endpoint (GET /api/products, /api/products/{id}).
// Swap the body for an `api.get(...)` call when the backend is ready — the
// call sites in components won't need to change.

const LATENCY = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const productService = {
  getAll: () => delay([...products]),
  getById: (idOrSlug) => delay(getProductBySlugOrId(idOrSlug) ?? null),
  getByCategory: (categoryId) => delay(getProductsByCategory(categoryId)),
  getPopular: () => delay(getPopularProducts()),
  search: (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return delay([]);
    const results = products.filter((p) =>
      [p.name.en, p.name.ar, p.description.en, p.description.ar, p.category].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
    return delay(results);
  },
};
