import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((current) => {
      setUser(current);
      setIsLoading(false);
    });
  }, []);

  const login = async (credentials) => {
    const session = await authService.login(credentials);
    setUser(session);
    return session;
  };

  const register = async (details) => {
    const session = await authService.register(details);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const session = await authService.updateProfile(updates);
    setUser(session);
    return session;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
