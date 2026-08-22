import { paymentStore } from "../data/paymentStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const paymentService = {
  // Future Laravel endpoint: GET /api/admin/payments
  getAll: () => delay([...paymentStore.getAll()]),

  // Future Laravel endpoint: PATCH /api/admin/payments/{id}/status
  updateStatus: (id, status) => {
    const rows = paymentStore.getAll();
    let updated = null;
    const next = rows.map((p) => {
      if (p.id !== id) return p;
      updated = { ...p, status };
      return updated;
    });
    paymentStore.setAll(next);
    return delay(updated);
  },
};
