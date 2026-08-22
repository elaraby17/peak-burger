import { sauceStore } from "../data/sauceStore";
import { productsStore } from "../data/productsStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const sauceService = {
  // Future Laravel endpoint: GET /api/admin/sauces
  getAll: () => delay([...sauceStore.getAll()]),

  // Future Laravel endpoint: POST /api/admin/sauces
  create: (sauce) => {
    const rows = sauceStore.getAll();
    const created = { id: sauce.id || sauce.nameEn.toLowerCase().replace(/\s+/g, "-"), active: true, ...sauce };
    sauceStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/sauces/{id}
  update: (id, updates) => {
    const rows = sauceStore.getAll();
    let updated = null;
    const next = rows.map((s) => {
      if (s.id !== id) return s;
      updated = { ...s, ...updates };
      return updated;
    });
    sauceStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/sauces/{id}
  remove: (id) => {
    sauceStore.setAll(sauceStore.getAll().filter((s) => s.id !== id));
    return delay(true);
  },

  // Future Laravel endpoint: PUT /api/admin/products/{productId}/sauces
  // Toggles whether `sauceId` is one of a product's available sauce options.
  toggleForProduct: (productId, sauceId) => {
    const rows = productsStore.getAll();
    let updatedProduct = null;
    const next = rows.map((p) => {
      if (String(p.id) !== String(productId)) return p;
      const current = p.sauceOptions || [];
      const has = current.includes(sauceId);
      updatedProduct = { ...p, sauceOptions: has ? current.filter((s) => s !== sauceId) : [...current, sauceId] };
      return updatedProduct;
    });
    productsStore.setAll(next);
    return delay(updatedProduct);
  },
};
