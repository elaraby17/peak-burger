import { branchStore } from "../data/branchStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const branchService = {
  // Future Laravel endpoint: GET /api/branches
  getAll: () => delay([...branchStore.getAll()]),

  // Future Laravel endpoint: POST /api/admin/branches
  create: (branch) => {
    const rows = branchStore.getAll();
    const created = { id: (rows.at(-1)?.id ?? 0) + 1, active: true, ...branch };
    branchStore.setAll([...rows, created]);
    return delay(created);
  },

  // Future Laravel endpoint: PUT /api/admin/branches/{id}
  update: (id, updates) => {
    const rows = branchStore.getAll();
    let updated = null;
    const next = rows.map((b) => {
      if (b.id !== id) return b;
      updated = { ...b, ...updates };
      return updated;
    });
    branchStore.setAll(next);
    return delay(updated);
  },

  // Future Laravel endpoint: DELETE /api/admin/branches/{id}
  remove: (id) => {
    branchStore.setAll(branchStore.getAll().filter((b) => b.id !== id));
    return delay(true);
  },
};
