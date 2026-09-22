import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { cn } from "../utils/cn";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-surface text-text">
      <Navbar />
      <main className={cn("flex-1 bg-surface text-text", !isHome && "pt-20")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
