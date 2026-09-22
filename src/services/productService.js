// src/services/productService.js
// SINGLE frontend entry point for the Product API (Laravel peak-burger backend:
// routes/api.php `apiResource('products')` + Api/ProductController).
import api from "./api";

// Reads the ApiResponseTrait envelope { success, message, data }. Resilient to
// Laravel's paginate() wrapping the rows one level deeper as
// { data: { data: [...], current_page, ... } } — before this fix, that shape
// made `rows.map is not a function` throw and get swallowed silently by the
// component's .catch(), making the whole section vanish with no console output.
function unwrap(res) {
    const body = res.data?.data;
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.data)) return body.data;
    return body;
}

// Logs the real cause (status + response body) before rethrowing, so a
// caller's existing .catch()/fallback still runs — but you actually SEE why.
function logAndRethrow(label) {
    return (err) => {
        console.error(`[productService] ${label} failed:`, err.response?.status, err.response?.data ?? err.message);
        throw err;
    };
}

function normalizeProduct(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        slug: raw.slug,
        name: raw.name,
        description: raw.description,
        category: raw.category?.slug ?? raw.category,
        categoryId: raw.category?.id ?? raw.category_id ?? null,
        price: raw.price !== null && raw.price !== undefined ? Number(raw.price) : null,
        image: raw.image,
        active: Boolean(Number(raw.active ?? 1)),
        popular: Boolean(Number(raw.popular ?? 0)),
        isNew: Boolean(Number(raw.is_new ?? 0)),
        sizes: raw.sizes
            ? raw.sizes.map((s) => ({
                  id: s.size_key ?? s.id,
                  label: s.label ?? { en: s.label_en, ar: s.label_ar },
                  price: Number(s.price),
              }))
            : undefined,
        sauceOptions: raw.sauce_options ?? raw.sauceOptions ?? undefined,
        ingredients: raw.ingredients ?? { en: [], ar: [] },
    };
}

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
    if (payload.imageFile) fd.append("image", payload.imageFile);
    return fd;
}

export const productService = {
    // GET /api/products
    getAll: () =>
        api
            .get("/products")
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct))
            .catch(logAndRethrow("getAll")),

    // GET /api/products?popular=1 then filter on the real `popular` flag.
    getPopular: () =>
        api
            .get("/products", { params: { popular: 1 } })
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct))
            .then((rows) => rows.filter((p) => p.popular))
            .catch(logAndRethrow("getPopular")),

    // GET /api/products/{id} (numeric id — Laravel route-model binding)
    getById: (id) =>
        api
            .get(`/products/${id}`)
            .then(unwrap)
            .then(normalizeProduct)
            .catch((err) => {
                if (err.response?.status === 404) return null;
                return logAndRethrow("getById")(err);
            }),

    // Admin uses the same product index as the customer menu.
    getAllAdmin: () =>
        api
            .get("/products")
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct))
            .catch(logAndRethrow("getAllAdmin")),

    // ---- Admin CRUD ----

    create: (payload) =>
        api
            .post("/products", buildProductFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })
            .then(unwrap)
            .then(normalizeProduct)
            .catch(logAndRethrow("create")),

    update: (id, payload) => {
        const fd = buildProductFormData(payload);
        fd.append("_method", "PUT");
        return api
            .post(`/products/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
            .then(unwrap)
            .then(normalizeProduct)
            .catch(logAndRethrow("update"));
    },

    remove: (id) =>
        api
            .delete(`/products/${id}`)
            .then(() => true)
            .catch(logAndRethrow("remove")),

    toggleActive: (product) =>
        productService.update(product.id, {
            categoryId: product.categoryId,
            nameEn: product.name.en,
            nameAr: product.name.ar,
            descriptionEn: product.description?.en,
            descriptionAr: product.description?.ar,
            price: product.price,
            popular: product.popular,
            isNew: product.isNew,
            active: !(product.active !== false),
        }),
};
