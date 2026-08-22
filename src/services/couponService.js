import { couponStore } from "../data/couponStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const couponService = {
  // Future Laravel endpoint: GET /api/admin/coupons
  getAll: () => delay([...couponStore.getAll()]),

  // Future Laravel endpoint: POST /api/admin/coupons
  create: (coupon) => {
    const rows = couponStore.getAll();
    const created = { id: (rows.at(-1)?.id ?? 0) + 1, used: 0, active: true, ...coupon };
    couponStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/coupons/{id}
  update: (id, updates) => {
    const rows = couponStore.getAll();
    let updated = null;
    const next = rows.map((c) => {
      if (c.id !== id) return c;
      updated = { ...c, ...updates };
      return updated;
    });
    couponStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/coupons/{id}
  remove: (id) => {
    couponStore.setAll(couponStore.getAll().filter((c) => c.id !== id));
    return delay(true);
  },
};
