import { categoriesStore } from "../data/categoriesStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

const nextId = (rows) => {
  const ids = rows.map((r) => r.id).filter((id) => typeof id === "string" && id.startsWith("cat-"));
  return `cat-${ids.length + 1}-${Date.now().toString(36)}`;
};

export const categoryService = {
  // Future Laravel endpoint: GET /api/categories
  getAll: () => delay([...categoriesStore.getAll()]),

  // Future Laravel endpoint: GET /api/categories/{id}
  getById: (id) => delay(categoriesStore.getAll().find((c) => c.id === id) ?? null),

  // ---- Admin CRUD ----

  // Future Laravel endpoint: POST /api/admin/categories
  create: (category) => {
    const rows = categoriesStore.getAll();
    const created = { id: category.slug || nextId(rows), active: true, ...category };
    categoriesStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/categories/{id}
  update: (id, updates) => {
    const rows = categoriesStore.getAll();
    let updated = null;
    const next = rows.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, ...updates };
      return updated;
    });
    categoriesStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/categories/{id}
  remove: (id) => {
    const rows = categoriesStore.getAll();
    categoriesStore.setAll(rows.filter((c) => c.id !== id));
    return delay(true);
  },

  // Future Laravel endpoint: PATCH /api/admin/categories/{id}/toggle-active
  toggleActive: (id) => {
    const rows = categoriesStore.getAll();
    let updated = null;
    const next = rows.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, active: !(c.active !== false) };
      return updated;
    });
    categoriesStore.setAll(next);
    return delay(updated);
  },
};
