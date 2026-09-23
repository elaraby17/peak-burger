import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";
import { productService } from "./productService";
import { categoryService } from "./categoryService";
import { sizeService } from "./sizeService";
import { sauceService } from "./sauceService";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const userService = {
  // ---- Catalog reads (User-facing API - GET endpoints only) ----
  // These delegate to the shared resource services so there is a single
  // source of truth; this file is the User API surface.

  // GET /api/user/products
  getProducts: () => productService.getAll(),

  // GET /api/user/products/popular
  getPopularProducts: () => productService.getPopular(),

  // GET /api/user/products/{id}
  getProductById: (id) => productService.getById(id),

  // GET /api/user/categories
  getCategories: () => categoryService.getAll(),

  // GET /api/user/categories/{id}
  getCategoryById: (id) => categoryService.getById(id),

  // GET /api/user/product-sizes
  getProductSizes: () => sizeService.getAll(),

  // GET /api/user/product-sizes/{id}
  getProductSizeById: (id) => sizeService.getById(id),

  // GET /api/user/sauces
  getSauces: () => sauceService.getAll(),

  // GET /api/user/sauces/{id}
  getSauceById: (id) => sauceService.getById(id),

  // ---- Favorites (kept as is) ----

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