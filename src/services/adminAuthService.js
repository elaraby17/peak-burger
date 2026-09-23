import { adminApi } from "./api";
import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from "../utils/storage";

// Backed by Laravel admin auth endpoints:
//   POST /api/admin/auth/login  -> { success, message, data: { token }, errors }
//   POST /api/admin/auth/logout -> { success, message, data: null, errors }
//   GET  /api/admin/me          -> { success, message, data: {...admin}, errors }
// IMPORTANT: the login response carries ONLY the token - the admin profile
// object is fetched separately from /admin/me. The persisted session is always
// { token, admin } where admin is optionally enriched after login.

const unwrap = (res) => res.data.data;

function normalizeAdmin(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    avatar: raw.avatar,
  };
}

function persistSession(session) {
  writeStorage(STORAGE_KEYS.ADMIN_AUTH, session);
  return session;
}

// Reads the current token and safely tries to fetch + persist the admin
// profile from /admin/me. Returns null when there is no token or the request
// fails - it NEVER clears the stored session (callers decide on 401).
async function fetchAdminProfile() {
  const stored = readStorage(STORAGE_KEYS.ADMIN_AUTH, null);
  if (!stored?.token) return null;
  const res = await adminApi.get("/admin/me");
  const data = unwrap(res);
  const session = { token: stored.token, admin: normalizeAdmin(data?.admin ?? data) };
  return persistSession(session);
}

export const adminAuthService = {
  // POST /api/admin/auth/login
  login: async ({ email, password }) => {
    const res = await adminApi.post("/admin/auth/login", { email, password });
    const data = unwrap(res);
    const token = data?.token ?? data?.access_token ?? null;
    if (!token) throw new Error("Login succeeded but no token was returned.");
    // Persist the token immediately so authentication always succeeds, then
    // best-effort enrich the session with the real admin profile from /me.
    const session = persistSession({ token, admin: null });
    try {
      const fresh = await fetchAdminProfile();
      if (fresh) return fresh;
    } catch {
      // ignore - the token-only session is enough to stay authenticated. A 401
      // here must NOT delete the freshly-issued token.
    }
    return session;
  },

  // POST /api/admin/auth/logout - always clear the local session even if the
  // request fails.
  logout: async () => {
    try {
      await adminApi.post("/admin/auth/logout");
    } catch {
      // keep clearing locally
    } finally {
      removeStorage(STORAGE_KEYS.ADMIN_AUTH);
    }
    return true;
  },

  // GET /api/admin/me - re-validates the stored token and refreshes admin data.
  //
  // Returns:
  //   { session, invalid: false } - token accepted, admin profile refreshed
  //   { session: null, invalid: false } - transient failure (network / 5xx);
  //     the stored session is KEPT so a momentary blip does not log the
  //     admin out on refresh
  //   { session: null, invalid: true } - 401: the token was rejected, so the
  //     stored session is CLEARED (caller must also clear the auth state)
  me: async () => {
    try {
      return { session: await fetchAdminProfile(), invalid: false };
    } catch (err) {
      if (err?.response?.status === 401) {
        removeStorage(STORAGE_KEYS.ADMIN_AUTH);
        return { session: null, invalid: true };
      }
      return { session: null, invalid: false };
    }
  },

  // Reads the persisted admin session (no network round-trip).
  getCurrentAdmin: async () => readStorage(STORAGE_KEYS.ADMIN_AUTH, null),

  // Local profile passthrough until a dedicated backend endpoint exists.
  updateProfile: async (updates) => {
    const stored = readStorage(STORAGE_KEYS.ADMIN_AUTH, null);
    if (!stored) throw new Error("Not authenticated.");
    const session = { ...stored, admin: normalizeAdmin({ ...stored.admin, ...updates }) };
    return persistSession(session);
  },
};