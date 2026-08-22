import { createContext, useContext, useEffect, useState } from "react";
import { adminAuthService } from "../services/adminAuthService";

// Mirrors AuthContext.jsx (customer auth) so the app has two clearly
// separate roles - "customer" (AuthContext/useAuth) and "admin"
// (AdminAuthContext/useAdminAuth) - without duplicating architecture.
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAuthService.getCurrentAdmin().then((current) => {
      setAdmin(current);
      setIsLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const session = await adminAuthService.login(credentials);
    setAdmin(session);
    return session;
  };

  const logout = async () => {
    await adminAuthService.logout();
    setAdmin(null);
  };

  const updateProfile = async (updates) => {
    const session = await adminAuthService.updateProfile(updates);
    setAdmin(session);
    return session;
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, isAuthenticated: Boolean(admin), isLoading, login, logout, updateProfile }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
