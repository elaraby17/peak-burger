import { createContext, useContext, useEffect, useState } from "react";
import { adminAuthService } from "../services/adminAuthService";

// Mirrors AuthContext.jsx (customer auth) so the app has two clearly
// separate roles - "customer" (AuthContext/useAuth) and "admin"
// (AdminAuthContext/useAdminAuth) - without duplicating architecture.
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stored = await adminAuthService.getCurrentAdmin();
        if (!active) return;

        // No stored session - nothing to restore.
        if (!stored?.token) {
          setIsLoading(false);
          return;
        }

        // Adopt the stored session immediately for a fast first paint, then
        // re-validate the token against the backend.
        setAdmin(stored.admin);
        setToken(stored.token);

        const fresh = await adminAuthService.me();
        if (!active) return;
        if (fresh.invalid) {
          // 401 - the token is no longer accepted. Session was already
          // cleared from storage; clear the in-memory state so the protected
          // route redirects to /admin/login.
          setAdmin(null);
          setToken(null);
          return;
        }
        if (fresh.session) {
          setAdmin(fresh.session.admin);
          setToken(fresh.session.token);
        }
        // A transient failure keeps the restored session - the admin stays
        // logged in and remains in the Dashboard.
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const session = await adminAuthService.login(credentials);
    setAdmin(session.admin);
    setToken(session.token);
    return session;
  };

  const logout = async () => {
    await adminAuthService.logout();
    setAdmin(null);
    setToken(null);
  };

  const refreshAdmin = async () => {
    const { session, invalid } = await adminAuthService.me();
    if (invalid) {
      setAdmin(null);
      setToken(null);
      return null;
    }
    if (session) {
      setAdmin(session.admin);
      setToken(session.token);
    }
    return session;
  };

  const updateProfile = async (updates) => {
    const session = await adminAuthService.updateProfile(updates);
    setAdmin(session.admin);
    return session;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        // The token is the source of truth: the backend's login response only
        // carries a token (the admin profile is fetched via /admin/me), so
        // authentication is proven by the token, not by the admin object.
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
        refreshAdmin,
        updateProfile,
      }}
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