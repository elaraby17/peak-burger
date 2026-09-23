import api, { adminApi } from "./api";

function normalizeSauce(raw) {
  if (!raw) return null;

  return {
    id: raw.id,
    nameEn: raw.name_en ?? raw.nameEn,
    nameAr: raw.name_ar ?? raw.nameAr,
    icon: raw.icon,
    active: Boolean(Number(raw.active ?? 0)),
    order: raw.order,
  };
}

const unwrap = (res) => res.data.data;

export const sauceService = {
  // =========================
  // User
  // =========================

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

  // =========================
  // Admin
  // =========================

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
  remove: (id) =>
    adminApi
      .delete(`admin/sauces/${id}`)
      .then(() => true),
};

export default sauceService;