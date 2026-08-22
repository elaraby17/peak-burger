import { reviewStore } from "../data/reviewStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const reviewService = {
  // Future Laravel endpoint: GET /api/admin/reviews
  getAll: () => delay([...reviewStore.getAll()]),

  // Future Laravel endpoint: PATCH /api/admin/reviews/{id}/status
  updateStatus: (id, status) => {
    const rows = reviewStore.getAll();
    let updated = null;
    const next = rows.map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, status };
      return updated;
    });
    reviewStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/reviews/{id}
  remove: (id) => {
    reviewStore.setAll(reviewStore.getAll().filter((r) => r.id !== id));
    return delay(true);
  },
};
