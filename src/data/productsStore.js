// Mutable, localStorage-backed layer on top of src/data/products.js.
// products.js keeps exporting the original static array (used as the seed,
// and still fine to import directly for things that never change, like
// CURRENCY or sauceLabels). Anything that can be edited by the admin
// (name, price, active flag, sizes, sauce options...) should go through
// productService, which reads/writes through this store instead.
import { products as seedProducts } from "./products";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

// Give every seed product an explicit `active` flag (admin can deactivate).
const seedWithDefaults = () => seedProducts.map((p) => ({ active: true, ...p }));

export const productsStore = createStore(STORAGE_KEYS.PRODUCTS, seedWithDefaults);
