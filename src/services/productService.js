import { productsStore } from "../data/productsStore";
import { generateOrderId as genId } from "../utils/format";

// Every function returns a Promise so callers already behave like they're
// hitting an async Laravel endpoint. The data itself lives in
// productsStore (localStorage-backed, seeded from data/products.js) so the
// customer menu and the admin dashboard read/write the exact same records -
// there is no separate "admin products" dataset.
//
// Swap the body for `api.get('/api/products')` etc. when Laravel is ready;
// call sites in components don't need to change.

const LATENCY = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

const nextId = (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1);

export const productService = {
  // Future Laravel endpoint: GET /api/products
  getAll: () => delay([...productsStore.getAll()]),

  // Future Laravel endpoint: GET /api/products/{idOrSlug}
  getById: (idOrSlug) =>
    delay(productsStore.getAll().find((p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug)) ?? null),

  // Future Laravel endpoint: GET /api/categories/{categoryId}/products
  getByCategory: (categoryId) => delay(productsStore.getAll().filter((p) => p.category === categoryId)),

  // Future Laravel endpoint: GET /api/products?popular=1
  getPopular: () => delay(productsStore.getAll().filter((p) => p.popular && p.active !== false)),

  // Future Laravel endpoint: GET /api/products?q=
  search: (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return delay([]);
    const results = productsStore
      .getAll()
      .filter((p) =>
        [p.name?.en, p.name?.ar, p.description?.en, p.description?.ar, p.category].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    return delay(results);
  },

  // ---- Admin CRUD ----

  // Future Laravel endpoint: GET /api/admin/products
  getAllAdmin: () => delay([...productsStore.getAll()]),

  // Future Laravel endpoint: POST /api/admin/products
  create: (product) => {
    const rows = productsStore.getAll();
    const created = {
      id: nextId(rows),
      slug: product.slug || `product-${genId().toLowerCase()}`,
      active: true,
      popular: false,
      isNew: false,
      sizes: null,
      sauceOptions: null,
      ingredients: { en: [], ar: [] },
      ...product,
    };
    productsStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/products/{id}
  update: (id, updates) => {
    const rows = productsStore.getAll();
    let updated = null;
    const next = rows.map((p) => {
      if (String(p.id) !== String(id)) return p;
      updated = { ...p, ...updates };
      return updated;
    });
    productsStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/products/{id}
  remove: (id) => {
    const rows = productsStore.getAll();
    productsStore.setAll(rows.filter((p) => String(p.id) !== String(id)));
    return delay(true);
  },

  // Future Laravel endpoint: PATCH /api/admin/products/{id}/toggle-active
  toggleActive: (id) => {
    const rows = productsStore.getAll();
    let updated = null;
    const next = rows.map((p) => {
      if (String(p.id) !== String(id)) return p;
      updated = { ...p, active: !(p.active !== false) };
      return updated;
    });
    productsStore.setAll(next);
    return delay(updated);
  },
};
