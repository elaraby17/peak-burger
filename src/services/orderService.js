import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";
import { generateOrderId } from "../utils/format";

const LATENCY = 300;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const orderService = {
  // POST /api/orders
  create: async (orderDraft) => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "pending",
      ...orderDraft,
    };
    writeStorage(STORAGE_KEYS.ORDERS, [order, ...orders]);
    return delay(order);
  },

  // GET /api/orders
  getAll: async () => delay(readStorage(STORAGE_KEYS.ORDERS, [])),

  // GET /api/orders/{id}
  getById: async (id) => {
    const orders = readStorage(STORAGE_KEYS.ORDERS, []);
    return delay(orders.find((o) => o.id === id) ?? null);
  },
};
