import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from "../utils/storage";

// Frontend-only auth simulation. Every function still returns a Promise and
// throws the same shape of error a Laravel Sanctum API would, so AuthContext
// and the UI don't have to change when POST /api/login etc. are wired up.

const USERS_KEY = "peakburger_registered_users";
const LATENCY = 350;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
const fail = (message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), LATENCY));

function getRegisteredUsers() {
  return readStorage(USERS_KEY, []);
}

export const authService = {
  // POST /api/register
  register: async ({ name, email, phone, password }) => {
    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return fail("An account with this email already exists.");
    }
    const user = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone,
      password, // demo-only: never store plain-text passwords against a real API
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    writeStorage(USERS_KEY, [...users, user]);
    const session = toSession(user);
    writeStorage(STORAGE_KEYS.USER, session);
    return delay(session);
  },

  // POST /api/login
  login: async ({ email, password }) => {
    const users = getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      return fail("Incorrect email or password.");
    }
    const session = toSession(user);
    writeStorage(STORAGE_KEYS.USER, session);
    return delay(session);
  },

  // POST /api/logout
  logout: async () => {
    removeStorage(STORAGE_KEYS.USER);
    return delay(true);
  },

  // GET /api/user
  getCurrentUser: async () => delay(readStorage(STORAGE_KEYS.USER, null)),

  // PUT /api/profile
  updateProfile: async (updates) => {
    const current = readStorage(STORAGE_KEYS.USER, null);
    if (!current) return fail("Not authenticated.");

    const users = getRegisteredUsers();
    const updatedUsers = users.map((u) => (u.id === current.id ? { ...u, ...updates } : u));
    writeStorage(USERS_KEY, updatedUsers);

    const updatedSession = { ...current, ...updates };
    writeStorage(STORAGE_KEYS.USER, updatedSession);
    return delay(updatedSession);
  },
};

function toSession(user) {
  // Mimics what a Sanctum response might look like (user + token).
  const { password, ...safeUser } = user;
  return { ...safeUser, token: `demo-token-${user.id}` };
}
