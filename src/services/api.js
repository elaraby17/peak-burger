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

export default api;
