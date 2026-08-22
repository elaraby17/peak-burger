import { orderStatusHistoryStore } from "../data/orderStatusHistoryStore";

const LATENCY = 200;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const orderStatusHistoryService = {
  // Future Laravel endpoint: GET /api/admin/order-status-history
  getAll: () => delay([...orderStatusHistoryStore.getAll()]),

  // Future Laravel endpoint: GET /api/admin/orders/{orderId}/status-history
  getByOrderId: (orderId) => delay(orderStatusHistoryStore.getAll().filter((h) => h.orderId === orderId)),
};
