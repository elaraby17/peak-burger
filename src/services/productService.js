// src/services/productService.js — استبدل بالكامل
import api from "./api";

// Backed by the real Laravel API (see ProductController / StoreProductRequest
// you shared). Laravel expects category_id (numeric), name_en/name_ar as
// separate flat fields, is_new (snake_case), and a real uploaded file for
// image (multipart/form-data) - not the nested {en,ar} / URL-string shape
// the rest of the app uses. Everything below adapts between the two shapes
// so ProductForm.jsx and every other component keep working unchanged.

function normalizeProduct(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        slug: raw.slug,
        name: raw.name,
        description: raw.description,
        // Frontend filters/links use the category *slug* as a string id.
        category: raw.category?.slug ?? raw.category,
        // Kept so we can send category_id back on update (Laravel needs the
        // numeric id, not the slug).
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

const unwrap = (res) => res.data.data;

// payload here is the shape ProductForm.jsx builds (see the updated form):
// { categoryId, nameEn, nameAr, descriptionEn, descriptionAr, price,
//   popular, isNew, active, imageFile }
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
            .then((rows) => rows.map(normalizeProduct)),

    // GET /api/products/{idOrSlug}
    getById: (idOrSlug) =>
        api
            .get(`/products/${idOrSlug}`)
            .then(unwrap)
            .then(normalizeProduct)
            .catch((err) => {
                if (err.response?.status === 404) return null;
                throw err;
            }),

    // GET /api/categories/{categoryId}/products
    getByCategory: (categoryId) =>
        api
            .get(`/categories/${categoryId}/products`)
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct)),

    // GET /api/products?popular=1
    getPopular: () =>
        api
            .get("/products", { params: { popular: 1 } })
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct))
            .then((rows) => rows.filter((p) => p.popular)),

    // GET /api/products?q=
    search: (query) => {
        const q = query.trim();
        if (!q) return Promise.resolve([]);
        return api
            .get("/products", { params: { q } })
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct));
    },

    // ---- Admin CRUD ----

    // GET /api/admin/products (or /api/products if you haven't split admin routes yet)
    getAllAdmin: () =>
        api
            .get("/products")
            .then(unwrap)
            .then((rows) => rows.map(normalizeProduct)),

    // POST /api/products  (multipart/form-data - image is a real file)
    create: (payload) =>
        api
            .post("/products", buildProductFormData(payload), { headers: { "Content-Type": "multipart/form-data" } })
            .then(unwrap)
            .then(normalizeProduct),

    // POST /api/products/{id} + _method=PUT  (Laravel method-spoofing: PHP
    // can't parse multipart bodies on native PUT requests)
    update: (id, payload) => {
        const fd = buildProductFormData(payload);
        fd.append("_method", "PUT");
        return api
            .post(`/products/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
            .then(unwrap)
            .then(normalizeProduct);
    },

    // DELETE /api/products/{id}
    remove: (id) => api.delete(`/products/${id}`).then(() => true),

    // No dedicated toggle-active route on the backend yet - reuses update()
    // with the product's current fields plus a flipped `active`, so it works
    // with today's controller (add a PATCH /toggle-active route later if you
    // want a lighter-weight call).
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
