import { offersStore } from "../data/offersStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const offerService = {
  // Future Laravel endpoint: GET /api/offers
  getAll: () => delay([...offersStore.getAll()]),

  // Future Laravel endpoint: GET /api/offers?active=1
  getActive: () => delay(offersStore.getAll().filter((o) => o.active)),

  // Future Laravel endpoint: POST /api/admin/offers
  create: (offer) => {
    const rows = offersStore.getAll();
    const created = { id: `offer-${rows.length + 1}-${Date.now().toString(36)}`, active: true, ...offer };
    offersStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/offers/{id}
  update: (id, updates) => {
    const rows = offersStore.getAll();
    let updated = null;
    const next = rows.map((o) => {
      if (o.id !== id) return o;
      updated = { ...o, ...updates };
      return updated;
    });
    offersStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/offers/{id}
  remove: (id) => {
    offersStore.setAll(offersStore.getAll().filter((o) => o.id !== id));
    return delay(true);
  },
};
