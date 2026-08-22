import { categories as seedCategories } from "./categories";
import { createStore } from "./store";
import { STORAGE_KEYS } from "../utils/storage";

const seedWithDefaults = () => seedCategories.map((c) => ({ active: true, ...c }));

export const categoriesStore = createStore(STORAGE_KEYS.CATEGORIES, seedWithDefaults);
