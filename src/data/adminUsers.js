// Frontend-only mock admin credentials. Laravel auth replaces this later
// (see adminAuthService.js for the future endpoint comments).
export const adminUserSeed = [
  {
    id: "admin_1",
    name: "Peak Admin",
    email: "admin@peakburger.com",
    password: "admin123",
    phone: "+20 100 111 2222",
    avatar: null,
    role: "admin",
  },
];
