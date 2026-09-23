

import api from "./api";


function unwrap(res) {
    const payload = res?.data;

    if (!payload) {
        return [];
    }

    // Normal API response
    if (Array.isArray(payload.data)) {
        return payload.data;
    }

    // Paginated API response
    if (
        payload.data &&
        typeof payload.data === "object" &&
        Array.isArray(payload.data.data)
    ) {
        return payload.data.data;
    }

    // Some endpoints may return an array directly
    if (Array.isArray(payload)) {
        return payload;
    }

    return [];
}

/**
 * Log API errors and rethrow them.
 */
function logAndRethrow(label) {
    return (err) => {
        console.error(
            `[productService] ${label} failed:`,
            err?.response?.status,
            err?.response?.data ?? err?.message
        );

        throw err;
    };
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

        category:
            raw.category?.slug ??
            raw.category ??
            raw.category_slug ??
            null,

        categoryId:
            raw.category?.id ??
            raw.category_id ??
            null,

        price:
            raw.price !== null && raw.price !== undefined
                ? Number(raw.price)
                : null,

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

            price:
                size.price !== null && size.price !== undefined
                    ? Number(size.price)
                    : 0,
        })),

        sauceOptions:
            raw.sauce_options ??
            raw.sauceOptions ??
            undefined,

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
        console.warn(
            "[productService] Expected product array but received:",
            rows
        );

        return [];
    }

    return rows
        .map(normalizeProduct)
        .filter(Boolean);
}

/**
 * Build multipart FormData for product create/update.
 */
function buildProductFormData(payload) {
    const fd = new FormData();

    fd.append("category_id", payload.categoryId);
    fd.append("name_en", payload.nameEn);
    fd.append("name_ar", payload.nameAr);
    fd.append("description_en", payload.descriptionEn ?? "");
    fd.append("description_ar", payload.descriptionAr ?? "");
    fd.append("price", payload.price);
    fd.append("active", payload.active ? 1 : 0);
    fd.append("popular", payload.popular ? 1 : 0);
    fd.append("is_new", payload.isNew ? 1 : 0);

    if (payload.imageFile) {
        fd.append("image", payload.imageFile);
    }

    return fd;
}

export const productService = {
    // GET all products
    getAll: () =>
        api
            .get("/products")
            .then(unwrap)
            .then(normalizeProducts)
            .catch(logAndRethrow("getAll")),

    // GET popular products
    getPopular: () =>
        api
            .get("/products/popular")
            .then(unwrap)
            .then(normalizeProducts)
            .then((products) => {
                console.log(
                    "[productService] Popular products:",
                    products
                );

                return products;
            })
            .catch(logAndRethrow("getPopular")),

    // GET product by ID or slug
    getById: (idOrSlug) =>
        api
            .get(`/products/${idOrSlug}`)
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

                return logAndRethrow("getById")(err);
            }),

    // GET products by category
    getByCategory: (categoryId) =>
        api
            .get(`/categories/${categoryId}/products`)
            .then(unwrap)
            .then(normalizeProducts)
            .catch(logAndRethrow("getByCategory")),

    // Search products
    search: (query) => {
        const q = query.trim();

        if (!q) {
            return Promise.resolve([]);
        }

        return api
            .get("/products", {
                params: { q },
            })
            .then(unwrap)
            .then(normalizeProducts)
            .catch(logAndRethrow("search"));
    },

     //-------- Admin CRUD --------------//

    //  get all products
    getAllAdmin: () =>
        api
            .get("/products")
            .then(unwrap)
            .then(normalizeProducts)
            .catch(logAndRethrow("getAllAdmin")),

    // Create product
    create: (payload) =>
        api
            .post(
                "/products",
                buildProductFormData(payload),
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then(unwrap)
            .then(normalizeProduct)
            .catch(logAndRethrow("create")),

    // Update product
    update: (id, payload) => {
        const fd = buildProductFormData(payload);

        fd.append("_method", "PUT");

        return api
            .post(`/products/${id}`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(unwrap)
            .then(normalizeProduct)
            .catch(logAndRethrow("update"));
    },

    // Delete product
    remove: (id) =>
        api
            .delete(`/products/${id}`)
            .then(() => true)
            .catch(logAndRethrow("remove")),

    // Toggle product active status
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