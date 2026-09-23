// src/services/sizeService.js — استبدل بالكامل
import api, { adminApi } from "./api";

// Backed by ProductSizeController. Note: ProductSizeResource names the
// nested product object "product_id" (it's actually the full Product
// resource, not a plain number) - normalizeSize() below unpacks that back
// into { productId, productName }.

function normalizeSize(raw) {
    if (!raw) return null;
    const product = raw.product_id; // nested Product object, despite the key name
    const rawLabel = raw.label ?? {};
    const labelObject = typeof rawLabel === "object" ? rawLabel : {};
    return {
        id: raw.id,
        productId: typeof product === "object" ? product?.id : product,
        productName: typeof product === "object" ? product?.name : undefined,
        sizeKey: raw.size_key,
        label:
            typeof labelObject.en !== "undefined"
                ? labelObject
                : { en: raw.label_en ?? labelObject, ar: raw.label_ar ?? labelObject },
        price: raw.price !== null && raw.price !== undefined ? Number(raw.price) : null,
        sortOrder: raw.sort_order,
        active: Boolean(Number(raw.active ?? 1)),
    };
}

const unwrap = (res) => res.data.data;

function toApiPayload(payload) {
    return {
        product_id: payload.productId,
        size_key: payload.sizeKey,
        label_en: payload.labelEn,
        label_ar: payload.labelAr,
        price: payload.price,
    };
}

export const sizeService = {
    // ---- User reads (api + user token) ----

    // GET /api/user/product-sizes
    getAll: () =>
        api
            .get("user/product-sizes")
            .then(unwrap)
            .then((rows) => rows.map(normalizeSize)),

    // GET /api/user/product-sizes/{id}
    getById: (id) =>
        api
            .get(`user/product-sizes/${id}`)
            .then(unwrap)
            .then(normalizeSize)
            .catch((err) => {
                if (err?.response?.status === 404) return null;
                throw err;
            }),

    // ---- Admin ops (adminApi + admin token) ----

    // GET /api/admin/product-sizes
    getAllAdmin: () =>
        adminApi
            .get("admin/product-sizes")
            .then(unwrap)
            .then((rows) => rows.map(normalizeSize)),

    // GET /api/admin/product-sizes/{id}
    getByIdAdmin: (id) =>
        adminApi
            .get(`admin/product-sizes/${id}`)
            .then(unwrap)
            .then(normalizeSize)
            .catch((err) => {
                if (err?.response?.status === 404) return null;
                throw err;
            }),

    // POST /api/admin/product-sizes
    create: (payload) => adminApi.post("admin/product-sizes", toApiPayload(payload)).then(unwrap).then(normalizeSize),

    // PUT /api/admin/product-sizes/{id}
    update: (id, payload) => adminApi.put(`admin/product-sizes/${id}`, toApiPayload(payload)).then(unwrap).then(normalizeSize),

    // DELETE /api/admin/product-sizes/{id}
    remove: (id) => adminApi.delete(`admin/product-sizes/${id}`).then(() => true),
};
