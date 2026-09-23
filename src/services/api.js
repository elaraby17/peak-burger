import axios from "axios";
import { STORAGE_KEYS, readStorage } from "../utils/storage";

// Base URL points at the future Laravel API. Until it exists, every service
// below reads/writes local data instead of calling `api` — but the client is
// wired up so switching over later is a service-layer change only.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach the auth token automatically once real login exists (Sanctum-style).
api.interceptors.request.use((config) => {
  const user = readStorage(STORAGE_KEYS.USER, null);
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Admin-scoped client. Same base URL but its own Authorization header so an
// admin token is never attached to customer endpoints and a customer token is
// never attached to admin endpoints.
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const session = readStorage(STORAGE_KEYS.ADMIN_AUTH, null);
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default api;
