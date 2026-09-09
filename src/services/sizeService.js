// src/services/sizeService.js — استبدل بالكامل
import api from "./api";

// Backed by ProductSizeController. Note: ProductSizeResource names the
// nested product object "product_id" (it's actually the full Product
// resource, not a plain number) - normalizeSize() below unpacks that back
// into { productId, productName }.

function normalizeSize(raw) {
    if (!raw) return null;
    const product = raw.product_id; // nested Product object, despite the key name
    return {
        id: raw.id,
        productId: typeof product === "object" ? product?.id : product,
        productName: typeof product === "object" ? product?.name : undefined,
        sizeKey: raw.size_key,
        label: raw.label,
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
    // GET /api/product-sizes
    getAll: () =>
        api
            .get("/product-sizes")
            .then(unwrap)
            .then((rows) => rows.map(normalizeSize)),

    // POST /api/product-sizes
    create: (payload) => api.post("/product-sizes", toApiPayload(payload)).then(unwrap).then(normalizeSize),

    // PUT /api/product-sizes/{id}
    update: (id, payload) => api.put(`/product-sizes/${id}`, toApiPayload(payload)).then(unwrap).then(normalizeSize),

    // DELETE /api/product-sizes/{id}
    remove: (id) => api.delete(`/product-sizes/${id}`).then(() => true),
};
