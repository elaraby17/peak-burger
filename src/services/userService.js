import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const userService = {
  // GET /api/favorites
  getFavorites: async () => delay(readStorage(STORAGE_KEYS.FAVORITES, [])),

  // POST /api/favorites
  addFavorite: async (productId) => {
    const favorites = readStorage(STORAGE_KEYS.FAVORITES, []);
    const next = favorites.includes(productId) ? favorites : [...favorites, productId];
    writeStorage(STORAGE_KEYS.FAVORITES, next);
    return delay(next);
  },

  // DELETE /api/favorites/{id}
  removeFavorite: async (productId) => {
    const favorites = readStorage(STORAGE_KEYS.FAVORITES, []);
    const next = favorites.filter((id) => id !== productId);
    writeStorage(STORAGE_KEYS.FAVORITES, next);
    return delay(next);
  },
};
