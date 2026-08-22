import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import Loading from "../components/ui/Loading";

export default function AdminGuestRoute() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) return <Loading className="min-h-screen" />;

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
