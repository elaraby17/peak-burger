import api, { adminApi } from "./api";
import { productsStore } from "../data/productsStore";

// Backed by SauceController (routes/api.php):
//   GET    /api/user/sauces           -> user-facing read
//   GET    /api/admin/sauces          -> admin listing
//   POST   /api/admin/sauces          -> admin create
//   PUT    /api/admin/sauces/{id}     -> admin update
//   DELETE /api/admin/sauces/{id}     -> admin delete
//
// The Sauces table exposes { name_en, name_ar, icon, active, order } and the
// Admin/Sauces page consumes { id, nameEn, nameAr, active } - normalizeSauce()
// is the single place mapping between the two.

function normalizeSauce(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        nameEn: raw.name_en ?? raw.nameEn,
        nameAr: raw.name_ar ?? raw.nameAr,
        icon: raw.icon,
        active: Boolean(Number(raw.active ?? 1)),
        order: raw.order,
    };
}

const unwrap = (res) => res.data.data;

export const sauceService = {
    // ---- User reads (api + user token) ----

    // GET /api/user/sauces
    getAll: () =>
        api
            .get("user/sauces")
            .then(unwrap)
            .then((rows) => rows.map(normalizeSauce)),

    // GET /api/user/sauces/{id}
    getById: (id) =>
        api
            .get(`user/sauces/${id}`)
            .then(unwrap)
            .then(normalizeSauce)
            .catch((err) => {
                if (err?.response?.status === 404) return null;
                throw err;
            }),

    // ---- Admin ops (adminApi + admin token) ----

    // GET /api/admin/sauces
    getAllAdmin: () =>
        adminApi
            .get("admin/sauces")
            .then(unwrap)
            .then((rows) => rows.map(normalizeSauce)),

    // GET /api/admin/sauces/{id}
    getByIdAdmin: (id) =>
        adminApi
            .get(`admin/sauces/${id}`)
            .then(unwrap)
            .then(normalizeSauce)
            .catch((err) => {
                if (err?.response?.status === 404) return null;
                throw err;
            }),

    // POST /api/admin/sauces
    create: (payload) =>
        adminApi
            .post("admin/sauces", {
                name_en: payload.nameEn,
                name_ar: payload.nameAr,
                icon: payload.icon,
                active: payload.active ?? 1,
                order: payload.order,
            })
            .then(unwrap)
            .then(normalizeSauce),

    // PUT /api/admin/sauces/{id}
    update: (id, payload) =>
        adminApi
            .put(`admin/sauces/${id}`, {
                name_en: payload.nameEn,
                name_ar: payload.nameAr,
                icon: payload.icon,
                active: payload.active ?? 1,
                order: payload.order,
            })
            .then(unwrap)
            .then(normalizeSauce),

    // DELETE /api/admin/sauces/{id}
    remove: (id) => adminApi.delete(`admin/sauces/${id}`).then(() => true),

    // toggleForProduct keeps working against the local products store because
    // the Laravel routes expose no product-to-sauce assignment endpoint - we
    // must NOT invent one. It only flips sauceOptions on locally-seeded data.
    toggleForProduct: (productId, sauceId) => {
        const rows = productsStore.getAll();
        let updatedProduct = null;
        const next = rows.map((p) => {
            if (String(p.id) !== String(productId)) return p;
            const current = p.sauceOptions || [];
            const has = current.includes(sauceId);
            updatedProduct = { ...p, sauceOptions: has ? current.filter((s) => s !== sauceId) : [...current, sauceId] };
            return updatedProduct;
        });
        productsStore.setAll(next);
        return Promise.resolve(updatedProduct);
    },
};