// src/services/authService.js — استبدل بالكامل
import api from "./api";
import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from "../utils/storage";

// Backed by AuthController (routes/api.php: /api/auth/*).
// register/login return { success, message, data: { user, token } } per the
// recommended controller patch. Sessions are persisted to localStorage the
// same way the old mock version did, so api.js's request interceptor keeps
// attaching the token automatically.

function normalizeUser(raw) {
    if (!raw) return null;
    return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        avatar: raw.avatar,
    };
}

const unwrap = (res) => res.data.data;

function persistSession(session) {
    writeStorage(STORAGE_KEYS.USER, session);
    return session;
}

export const authService = {
    // POST /api/auth/register
    register: ({ name, email, phone, password, avatarFile }) => {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("email", email);
        fd.append("phone", phone);
        fd.append("password", password);
        // StoreUserRequest requires `confirmed`, i.e. a matching
        // password_confirmation field - the register form only asks once, so
        // we fill it in automatically here rather than adding a second field.
        fd.append("password_confirmation", password);
        if (avatarFile) fd.append("avatar", avatarFile);

        return api
            .post("/auth/register", fd)
            .then(unwrap)
            .then(({ user, token }) => persistSession({ ...normalizeUser(user), token }));
    },

    // POST /api/auth/login
    login: ({ email, password }) =>
        api
            .post("/auth/login", { email, password })
            .then(unwrap)
            .then(({ user, token }) => persistSession({ ...normalizeUser(user), token })),

    // POST /api/auth/logout
    logout: () =>
        api
            .post("/auth/logout")
            .catch(() => {}) // still clear the local session even if the request fails
            .then(() => {
                removeStorage(STORAGE_KEYS.USER);
                return true;
            }),

    // GET /api/auth/user - re-validates the stored token and refreshes profile fields
    getCurrentUser: () => {
        const stored = readStorage(STORAGE_KEYS.USER, null);
        if (!stored?.token) return Promise.resolve(null);
        return api
            .get("/auth/user")
            .then(unwrap)
            .then((user) => persistSession({ ...normalizeUser(user), token: stored.token }))
            .catch(() => {
                removeStorage(STORAGE_KEYS.USER); // token expired/invalid
                return null;
            });
    },

    // PUT /api/auth/profile - not built on the backend yet, wire up once it exists
    updateProfile: (updates) => {
        const stored = readStorage(STORAGE_KEYS.USER, null);
        return api
            .put("/auth/profile", updates)
            .then(unwrap)
            .then((user) => persistSession({ ...normalizeUser(user), token: stored?.token }));
    },
};
