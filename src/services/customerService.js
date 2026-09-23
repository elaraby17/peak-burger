import { adminApi } from "./api";

// Backed by the real Laravel admin API. Assumes the backend already joins
// order stats server-side (orders_count, total_spent) rather than the client
// computing them from a separate orders list.
//
// TODO: confirm the exact field names below once a real response sample is
// available — normalizeCustomer() is the only place that needs to change if
// Laravel's naming differs (e.g. orders_count vs total_orders).

function normalizeCustomer(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        avatar: raw.avatar ?? raw.avatar_url ?? null,
        joinedDate: raw.created_at ?? raw.joined_at,
        ordersCount: Number(raw.orders_count ?? raw.ordersCount ?? 0),
        totalSpent: Number(raw.total_spent ?? raw.totalSpent ?? 0),
        // TODO: confirm how Laravel represents this — boolean, 0/1, or an enum
        // string ("active" | "banned" | "inactive"). Assuming a string for now.
        status: raw.status ?? (Number(raw.is_active ?? 1) ? "active" : "inactive"),
    };
}

const unwrap = (res) => res.data.data;

// payload shape for create/update: { name, email, phone, password? }
// password is only relevant on create (Laravel-side account creation);
// omit it entirely on update so an empty field doesn't overwrite a real one.
function buildCustomerPayload(payload) {
    const body = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
    };
    if (payload.password) body.password = payload.password;
    return body;
}

export const customerService = {
    // GET /api/admin/customers
    // Optional params: { q, status } for search/filtering.
    getAll: (params = {}) =>
        adminApi
            .get("/admin/customers", { params })
            .then(unwrap)
            .then((rows) => rows.map(normalizeCustomer)),

    // GET /api/admin/customers/{id}
    // Assumes the detail endpoint also returns an embedded `orders` array —
    // adjust the destructure below if Laravel nests it differently
    // (e.g. under `recent_orders` or requires a separate call).
    getById: (id) =>
        adminApi
            .get(`/admin/customers/${id}`)
            .then(unwrap)
            .then((raw) => {
                if (!raw) return null;
                return {
                    ...normalizeCustomer(raw),
                    orders: raw.orders ?? raw.recent_orders ?? [],
                };
            })
            .catch((err) => {
                if (err.response?.status === 404) return null;
                throw err;
            }),

    // POST /api/admin/customers
    // For admin-created accounts (walk-in customers, manual entry, etc).
    // TODO: confirm whether Laravel requires a password on admin-created
    // accounts or issues an invite/reset-link flow instead.
    create: (payload) => adminApi.post("/admin/customers", buildCustomerPayload(payload)).then(unwrap).then(normalizeCustomer),

    // PUT /api/admin/customers/{id}
    update: (id, payload) => adminApi.put(`/admin/customers/${id}`, buildCustomerPayload(payload)).then(unwrap).then(normalizeCustomer),

    // DELETE /api/admin/customers/{id}
    remove: (id) => adminApi.delete(`/admin/customers/${id}`).then(() => true),

    // PATCH /api/admin/customers/{id}/status
    // No confirmed route yet — included as a likely admin action (block/unblock
    // a customer). Remove or adjust once the real route is confirmed.
    updateStatus: (id, status) => adminApi.patch(`/admin/customers/${id}/status`, { status }).then(unwrap).then(normalizeCustomer),
};