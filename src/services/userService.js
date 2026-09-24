
import api from "./api";

import { productService } from "./productService";
import { categoryService } from "./categoryService";
import { sizeService } from "./sizeService";
import { sauceService } from "./sauceService";

export const userService = {
  // Catalog

  getProducts: () => productService.getAll(),

  getPopularProducts: () => productService.getPopular(),

  getProductById: (id) => productService.getById(id),

  getCategories: () => categoryService.getAll(),

  getCategoryById: (id) => categoryService.getById(id),

  getProductSizes: () => sizeService.getAll(),

  getProductSizeById: (id) => sizeService.getById(id),

  getSauces: () => sauceService.getAll(),

  getSauceById: (id) => sauceService.getById(id),

  // Favorites

  getFavorites: async () => {
    const response = await api.get("user/favorites");
    return response.data;
  },

  addFavorite: async (productId) => {
    const response = await api.post("user/favorites", {
      product_id: productId,
    });

    return response.data;
  },

  removeFavorite: async (favoriteId) => {
    const response = await api.delete(`user/favorites/${favoriteId}`);
    return response.data;
  },
};
