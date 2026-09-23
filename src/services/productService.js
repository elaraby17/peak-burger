// src/services/productService.js

// SINGLE frontend entry point for the Product API.
//
// Laravel Peak Burger backend:
// - GET    /api/products
// - GET    /api/products/popular
// - GET    /api/products/{id}
// - POST   /api/products
// - POST   /api/products/{id} with _method=PUT
// - DELETE /api/products/{id}

import api, { adminApi } from "./api";

/**
 * Unwrap Laravel ApiResponseTrait responses.
 *
 * Supported responses:
 *
 * {
 *   success: true,
 *   data: [...]
 * }
 *
 * and Laravel pagination:
 *
 * {
 *   success: true,
 *   data: {
 *     data: [...],
 *     current_page: 1,
 *     ...
 *   }
 * }
 */
function unwrap(res) {
    const payload = res?.data;

    if (!payload) {
        return [];
    }

    // Normal API response:
    // { success, data: [...] }
    if (Array.isArray(payload.data)) {
        return payload.data;
    }

    // Paginated API response:
    // { success, data: { data: [...] } }
    if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) {
        return payload.data.data;
    }

    // Some endpoints may return an array directly.
    if (Array.isArray(payload)) {
        return payload;
    }

    // Nothing usable.
    return [];
}

/**
 * Rethrow the actual API error.
 *
 * The component is responsible for displaying
 * the error to the user.
 *
 * Example:
 *
 * try {
 *     await productService.create(payload);
 * } catch (error) {
 *     // Show error with alert / SweetAlert in component
 * }
 */
function rethrowError(err) {
    throw err;
}

/**
 * Normalize a single product from Laravel API
 * into the frontend Product shape.
 */
function normalizeProduct(raw) {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const rawSizes = Array.isArray(raw.sizes) ? raw.sizes : [];

    return {
        id: raw.id,

        slug: raw.slug,

        name: raw.name ?? {
            en: raw.name_en ?? "",
            ar: raw.name_ar ?? "",
        },

        description: raw.description ?? {
            en: raw.description_en ?? "",
            ar: raw.description_ar ?? "",
        },

        category: raw.category?.slug ?? raw.category ?? raw.category_slug ?? null,

        categoryId: raw.category?.id ?? raw.category_id ?? null,

        price: raw.price !== null && raw.price !== undefined ? Number(raw.price) : null,

        image: raw.image ?? null,

        active: Boolean(Number(raw.active ?? 1)),

        popular: Boolean(Number(raw.popular ?? 0)),

        isNew: Boolean(Number(raw.is_new ?? raw.isNew ?? 0)),

        sizes: rawSizes.map((size) => ({
            id: size.size_key ?? size.id ?? null,

            label: size.label ?? {
                en: size.label_en ?? "",
                ar: size.label_ar ?? "",
            },

            price: size.price !== null && size.price !== undefined ? Number(size.price) : 0,
        })),

        sauceOptions: raw.sauce_options ?? raw.sauceOptions ?? undefined,

        ingredients: raw.ingredients ?? {
            en: [],
            ar: [],
        },
    };
}

/**
 * Normalize an array of products safely.
 */
function normalizeProducts(rows) {
    if (!Array.isArray(rows)) {
        return [];
    }

    return rows.map(normalizeProduct).filter(Boolean);
}

/**
 * Build multipart FormData for product create/update.
 */
function buildProductFormData(payload = {}) {
    const fd = new FormData();

    fd.append("category_id", payload.categoryId ?? "");

    fd.append("name_en", payload.nameEn ?? "");

    fd.append("name_ar", payload.nameAr ?? "");

    fd.append("description_en", payload.descriptionEn ?? "");

    fd.append("description_ar", payload.descriptionAr ?? "");

    fd.append("price", payload.price ?? "");

    fd.append("active", payload.active ? "1" : "0");

    fd.append("popular", payload.popular ? "1" : "0");

    fd.append("is_new", payload.isNew ? "1" : "0");

    if (payload.imageFile instanceof File) {
        fd.append("image", payload.imageFile);
    }

    return fd;
}

export const productService = {
    /**
     * GET /api/products
     */
    getAll: () => api.get("user/products").then(unwrap).then(normalizeProducts).catch(rethrowError),

    /**
     * GET /api/products/popular
     *
     * Backend already filters popular products.
     */
    getPopular: () => api.get("user/products/popular").then(unwrap).then(normalizeProducts).catch(rethrowError),

    /**
     * GET /api/products/{id}
     */
    getById: (id) =>
        api
            .get(`user/products/${id}`)
            .then(unwrap)
            .then((data) => {
                if (Array.isArray(data)) {
                    return normalizeProduct(data[0]);
                }

                return normalizeProduct(data);
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    return null;
                }

                return rethrowError(err);
            }),

    /**
     * Admin listing - GET /api/admin/products (adminApi + admin token).
     */
    getAllAdmin: () => adminApi.get("admin/products").then(unwrap).then(normalizeProducts).catch(rethrowError),

    /**
     * Admin read - GET /api/admin/products/{id} (adminApi + admin token).
     */
    getByIdAdmin: (id) =>
        adminApi
            .get(`admin/products/${id}`)
            .then(unwrap)
            .then(normalizeProduct)
            .catch((err) => {
                if (err?.response?.status === 404) {
                    return null;
                }

                return rethrowError(err);
            }),

    /**
     * Create product - POST /api/admin/products (admin token).
     */
    create: (payload) =>
        adminApi
            .post("admin/products", buildProductFormData(payload), {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(unwrap)
            .then(normalizeProduct)
            .catch(rethrowError),

    /**
     * Update product - PUT /api/admin/products/{id} (admin token).
     */
    update: (id, payload) => {
        const fd = buildProductFormData(payload);

        fd.append("_method", "PUT");

        return adminApi
            .post(`admin/products/${id}`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(unwrap)
            .then(normalizeProduct)
            .catch(rethrowError);
    },

    /**
     * Delete product - DELETE /api/admin/products/{id} (admin token).
     */
    remove: (id) =>
        adminApi
            .delete(`admin/products/${id}`)
            .then(() => true)
            .catch(rethrowError),

    /**
     * Toggle product active status.
     */
    toggleActive: (product) =>
        productService.update(product.id, {
            categoryId: product.categoryId,

            nameEn: product.name?.en ?? "",

            nameAr: product.name?.ar ?? "",

            descriptionEn: product.description?.en ?? "",

            descriptionAr: product.description?.ar ?? "",

            price: product.price,

            popular: product.popular,

            isNew: product.isNew,

            active: product.active === false,
        }),
};

export default productService;
