import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";
import { generateOrderId } from "../utils/format";
import { orderStatusHistoryStore } from "../data/orderStatusHistoryStore";
import { branchStore } from "../data/branchStore";

const LATENCY = 300;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const orderService = {
  // Future Laravel endpoint: POST /api/orders
  create: async (orderDraft) => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    const branches = branchStore.getAll().filter((b) => b.active);
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "pending",
      branchId: branches[0]?.id ?? null,
      ...orderDraft,
    };
    writeStorage(STORAGE_KEYS.ORDERS, [order, ...orders]);
    logStatusChange(order.id, "pending", "System");
    return delay(order);
  },

  // Future Laravel endpoint: GET /api/orders
  getAll: async () => delay(readStorage(STORAGE_KEYS.ORDERS, [])),

  // Future Laravel endpoint: GET /api/orders/{id}
  getById: async (id) => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    return delay(orders.find((o) => o.id === id) ?? null);
  },

  // ---- Admin ----

  // Future Laravel endpoint: GET /api/admin/orders
  getAllAdmin: async () => delay([...readStorage(STORAGE_KEYS.ORDERS, [])]),

  // Future Laravel endpoint: PATCH /api/admin/orders/{id}/status
  updateStatus: async (id, status, changedBy = "Admin") => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    let updated = null;
    const next = orders.map((o) => {
      if (o.id !== id) return o;
      updated = { ...o, status };
      return updated;
    });
    writeStorage(STORAGE_KEYS.ORDERS, next);
    if (updated) logStatusChange(id, status, changedBy);
    return delay(updated);
  },

  // Future Laravel endpoint: GET /api/admin/dashboard/stats
  getDashboardStats: async () => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    const todayKey = new Date().toDateString();
    const todaysOrders = orders.filter((o) => new Date(o.date).toDateString() === todayKey);
    const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
    return delay({
      todaysOrders: todaysOrders.length,
      todaysRevenue,
      pendingOrders,
      totalOrders: orders.length,
    });
  },
};

function logStatusChange(orderId, status, changedBy) {
  const rows = orderStatusHistoryStore.getAll();
  const entry = { id: rows.length + 1, orderId, status, changedBy, date: new Date().toISOString() };
  orderStatusHistoryStore.setAll([entry, ...rows]);
}
