import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/ui/Loading";

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading className="min-h-[60vh]" />;

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}
