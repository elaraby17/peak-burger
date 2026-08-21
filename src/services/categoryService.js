import { categories, getCategoryById } from "../data/categories";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

// GET /api/categories, GET /api/categories/{id} once Laravel exists.
export const categoryService = {
  getAll: () => delay([...categories]),
  getById: (id) => delay(getCategoryById(id) ?? null),
};
