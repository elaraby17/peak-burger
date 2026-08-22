// Product sizes live embedded on each product (product.sizes), matching the
// existing customer-facing structure (ProductDetails size picker). This
// service just gives the admin a flat, table-friendly view over the same
// data, going through productsStore so edits are shared everywhere.
import { productsStore } from "../data/productsStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

function flatten() {
  return productsStore.getAll().flatMap((p) =>
    (p.sizes || []).map((s) => ({
      id: `${p.id}::${s.id}`,
      productId: p.id,
      productName: p.name,
      sizeKey: s.id,
      labelEn: s.label.en,
      labelAr: s.label.ar,
      price: s.price,
      isDefault: p.sizes[0]?.id === s.id,
      active: s.active !== false,
    }))
  );
}

export const sizeService = {
  // Future Laravel endpoint: GET /api/admin/product-sizes
  getAll: () => delay(flatten()),

  // Future Laravel endpoint: PUT /api/admin/product-sizes/{productId}/{sizeKey}
  update: (productId, sizeKey, updates) => {
    const rows = productsStore.getAll();
    let updatedRow = null;
    const next = rows.map((p) => {
      if (String(p.id) !== String(productId)) return p;
      const sizes = (p.sizes || []).map((s) => {
        if (s.id !== sizeKey) return s;
        const merged = {
          ...s,
          price: updates.price ?? s.price,
          active: updates.active ?? s.active,
          label: {
            en: updates.labelEn ?? s.label.en,
            ar: updates.labelAr ?? s.label.ar,
          },
        };
        updatedRow = merged;
        return merged;
      });
      return { ...p, sizes };
    });
    productsStore.setAll(next);
    return delay(updatedRow);
  },

  // Future Laravel endpoint: DELETE /api/admin/product-sizes/{productId}/{sizeKey}
  remove: (productId, sizeKey) => {
    const rows = productsStore.getAll();
    const next = rows.map((p) => {
      if (String(p.id) !== String(productId)) return p;
      return { ...p, sizes: (p.sizes || []).filter((s) => s.id !== sizeKey) };
    });
    productsStore.setAll(next);
    return delay(true);
  },
};
