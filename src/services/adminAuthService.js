import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from "../utils/storage";
import { adminUserSeed } from "../data/adminUsers";

// Frontend-only admin auth simulation, mirroring authService.js's shape
// (same Promise-based API, same "session in localStorage" pattern) so it's
// a drop-in swap for Laravel Sanctum later.

const LATENCY = 300;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
const fail = (message) => new Promise((_, reject) => setTimeout(() => reject(new Error(message)), LATENCY));

function toSession(admin) {
  const { password, ...safe } = admin;
  return { ...safe, token: `demo-admin-token-${admin.id}` };
}

export const adminAuthService = {
  // Future Laravel endpoint: POST /api/admin/login
  login: async ({ email, password }) => {
    const admin = adminUserSeed.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!admin || admin.password !== password) {
      return fail("Incorrect email or password.");
    }
    const session = toSession(admin);
    writeStorage(STORAGE_KEYS.ADMIN_USER, session);
    return delay(session);
  },

  // Future Laravel endpoint: POST /api/admin/logout
  logout: async () => {
    removeStorage(STORAGE_KEYS.ADMIN_USER);
    return delay(true);
  },

  // Future Laravel endpoint: GET /api/admin/user
  getCurrentAdmin: async () => delay(readStorage(STORAGE_KEYS.ADMIN_USER, null)),

  // Future Laravel endpoint: PUT /api/admin/profile
  updateProfile: async (updates) => {
    const current = readStorage(STORAGE_KEYS.ADMIN_USER, null);
    if (!current) return fail("Not authenticated.");
    const updated = { ...current, ...updates };
    writeStorage(STORAGE_KEYS.ADMIN_USER, updated);
    return delay(updated);
  },
};
