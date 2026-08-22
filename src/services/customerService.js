import { readStorage } from "../utils/storage";

// Reads the same "registered users" list authService.js already writes to
// (peakburger_registered_users) so admin/customers is not a second dataset -
// it's a management view over the exact accounts created through
// /register. Order stats are joined in from peakburger_orders.

const USERS_KEY = "peakburger_registered_users";
const LATENCY = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));

export const customerService = {
  // Future Laravel endpoint: GET /api/admin/customers
  getAll: () => {
    const users = readStorage(USERS_KEY, []);
    const orders = readStorage("peakburger_orders", []);
    const rows = users.map((u) => {
      const own = orders.filter((o) => o.customer?.email?.toLowerCase() === u.email.toLowerCase());
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        joinedDate: u.createdAt,
        ordersCount: own.length,
        totalSpent: own.reduce((sum, o) => sum + (o.total || 0), 0),
        status: "active",
      };
    });
    return delay(rows);
  },

  // Future Laravel endpoint: GET /api/admin/customers/{id}
  getById: (id) => {
    const users = readStorage(USERS_KEY, []);
    const user = users.find((u) => u.id === id);
    if (!user) return delay(null);
    const orders = readStorage("peakburger_orders", []).filter(
      (o) => o.customer?.email?.toLowerCase() === user.email.toLowerCase()
    );
    return delay({ ...user, orders });
  },
};
