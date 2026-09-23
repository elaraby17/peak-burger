// src/services/adminService.js — consolidated Admin API surface.
//
// Every method delegates to the dedicated resource service so there is a
// single source of truth and no duplicated logic. Everything here uses the
// adminApi client (admin token) and hits /api/admin/* endpoints - it never
// touches the User API or the user token.

import { customerService } from "./customerService";
import { productService } from "./productService";
import { categoryService } from "./categoryService";
import { sizeService } from "./sizeService";
import { sauceService } from "./sauceService";

export const adminService = {
  // ---- Customers ----
  // GET /api/admin/customers
  getCustomers: () => customerService.getAll(),
  // GET /api/admin/customers/{id}
  getCustomerById: (id) => customerService.getById(id),
  // POST /api/admin/customers
  createCustomer: (payload) => customerService.create(payload),
  // PUT /api/admin/customers/{id}
  updateCustomer: (id, payload) => customerService.update(id, payload),
  // DELETE /api/admin/customers/{id}
  deleteCustomer: (id) => customerService.remove(id),

  // ---- Categories ----
  // GET /api/admin/categories
  getCategories: () => categoryService.getAll(),
  // GET /api/admin/categories/{id}
  getCategoryById: (id) => categoryService.getById(id),
  // POST /api/admin/categories
  createCategory: (payload) => categoryService.create(payload),
  // PUT /api/admin/categories/{numericId}
  updateCategory: (numericId, payload) => categoryService.update(numericId, payload),
  // DELETE /api/admin/categories/{numericId}
  deleteCategory: (numericId) => categoryService.remove(numericId),

  // ---- Products ----
  // GET /api/admin/products
  getProducts: () => productService.getAllAdmin(),
  // GET /api/admin/products/{id}
  getProductById: (id) => productService.getByIdAdmin(id),
  // POST /api/admin/products
  createProduct: (payload) => productService.create(payload),
  // PUT /api/admin/products/{id}
  updateProduct: (id, payload) => productService.update(id, payload),
  // DELETE /api/admin/products/{id}
  deleteProduct: (id) => productService.remove(id),

  // ---- Product sizes ----
  // GET /api/admin/product-sizes
  getProductSizes: () => sizeService.getAllAdmin(),
  // GET /api/admin/product-sizes/{id}
  getProductSizeById: (id) => sizeService.getByIdAdmin(id),
  // POST /api/admin/product-sizes
  createProductSize: (payload) => sizeService.create(payload),
  // PUT /api/admin/product-sizes/{id}
  updateProductSize: (id, payload) => sizeService.update(id, payload),
  // DELETE /api/admin/product-sizes/{id}
  deleteProductSize: (id) => sizeService.remove(id),

  // ---- Sauces ----
  // GET /api/admin/sauces
  getSauces: () => sauceService.getAllAdmin(),
  // GET /api/admin/sauces/{id}
  getSauceById: (id) => sauceService.getByIdAdmin(id),
  // POST /api/admin/sauces
  createSauce: (payload) => sauceService.create(payload),
  // PUT /api/admin/sauces/{id}
  updateSauce: (id, payload) => sauceService.update(id, payload),
  // DELETE /api/admin/sauces/{id}
  deleteSauce: (id) => sauceService.remove(id),
};

export default adminService;