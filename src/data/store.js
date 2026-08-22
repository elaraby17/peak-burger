// Generic "seeded store" used by every admin-manageable entity.
//
// Why this exists: the admin dashboard and the customer frontend must read
// and write the SAME data (see project brief - "shared data" section). Data
// files like products.js/categories.js export static arrays used only as the
// initial seed. The first time a store is read, it's copied into
// localStorage; every read/write after that goes through localStorage, so
// admin edits are immediately visible to the customer pages that go through
// the service layer, and persist across reloads (same pattern already used
// by CartContext/FavoritesContext/orderService).
//
// Swapping to Laravel later means only changing the *service* files
// (see the "Future Laravel endpoint" comments in each service) - this store
// stays purely as local mock persistence.

import { readStorage, writeStorage } from "../utils/storage";

export function createStore(key, seedFactory) {
  const load = () => {
    const existing = readStorage(key, null);
    if (existing !== null) return existing;
    const seeded = seedFactory();
    writeStorage(key, seeded);
    return seeded;
  };

  return {
    getAll: () => load(),
    setAll: (rows) => {
      writeStorage(key, rows);
      return rows;
    },
    reset: () => {
      const seeded = seedFactory();
      writeStorage(key, seeded);
      return seeded;
    },
  };
}
