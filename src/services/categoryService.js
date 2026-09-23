// src/services/categoryService.js — استبدل بالكامل
import api, { adminApi } from "./api";

function normalizeCategory(raw) {
    if (!raw) return null;
    return {
        id: raw.slug ?? String(raw.id),
        numericId: raw.id,
        name: raw.name,
        description: raw.description,
        icon: raw.icon,
        active: Boolean(Number(raw.active ?? 1)),
    };
}

const unwrap = (res) => res.data.data;

function toApiPayload(payload) {
    return {
        name_en: payload.name?.en ?? payload.nameEn,
        name_ar: payload.name?.ar ?? payload.nameAr,
        description_en: payload.description?.en ?? payload.descriptionEn ?? "",
        description_ar: payload.description?.ar ?? payload.descriptionAr ?? "",
        icon: payload.icon,
        active: payload.active ? 1 : 0,
    };
}

export const categoryService = {
    // GET /api/categories
    getAll: () =>
        api
            .get("user/categories")
            .then(unwrap)
            .then((rows) => rows.map(normalizeCategory)),

    // GET /api/categories/{id}
    getById: (id) =>
        api
            .get(`user/categories/${id}`)
            .then(unwrap)
            .then(normalizeCategory)
            .catch((err) => {
                if (err.response?.status === 404) return null;
                throw err;
            }),

    // ---- Admin CRUD (adminApi + admin token) ----

    // POST /api/admin/categories
    create: (payload) => adminApi.post("admin/categories", toApiPayload(payload)).then(unwrap).then(normalizeCategory),

    // PUT /api/admin/categories/{numericId}
    // NOTE: Laravel route-model-binds on the numeric id, not the slug - pass
    // the numeric id here (categories.find(c => c.id === slug).numericId).
    update: (numericId, payload) => adminApi.put(`admin/categories/${numericId}`, toApiPayload(payload)).then(unwrap).then(normalizeCategory),

    // DELETE /api/admin/categories/{numericId}
    remove: (numericId) => adminApi.delete(`admin/categories/${numericId}`).then(() => true),

    // No dedicated toggle-active route yet - reuse update() with current fields.
    toggleActive: (category) =>
        categoryService.update(category.numericId, {
            name: category.name,
            description: category.description,
            icon: category.icon,
            active: !(category.active !== false),
        }),
};
