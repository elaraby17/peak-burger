// Centralized localStorage access so raw storage calls never scatter through the app.

export const STORAGE_KEYS = {
  USER: "peakburger_user",
  CART: "peakburger_cart",
  FAVORITES: "peakburger_favorites",
  ORDERS: "peakburger_orders",
  LANGUAGE: "peakburger_language",
  // Admin-managed data. Shared with the customer frontend so both sides
  // read/write through the same service layer (single source of truth).
  PRODUCTS: "peakburger_products",
  CATEGORIES: "peakburger_categories",
  SAUCES: "peakburger_sauces",
  OFFERS: "peakburger_offers",
  COUPONS: "peakburger_coupons",
  BRANCHES: "peakburger_branches",
  REVIEWS: "peakburger_reviews",
  PAYMENTS: "peakburger_payments",
  ORDER_STATUS_HISTORY: "peakburger_order_status_history",
  ADMIN_USER: "peakburger_admin_user",
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read "${key}" from storage`, err);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write "${key}" to storage`, err);
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`Failed to remove "${key}" from storage`, err);
    return false;
  }
}
