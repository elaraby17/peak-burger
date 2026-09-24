import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Heart, User, Settings } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "../utils/cn";

const links = [
  { to: "/account", end: true, icon: LayoutDashboard, label: { en: "Overview", ar: "نظرة عامة" } },
  { to: "/account/orders", icon: Package, label: { en: "Orders", ar: "طلباتي" } },
  { to: "/account/favorites", icon: Heart, label: { en: "Favorites", ar: "المفضلة" } },
  { to: "/account/profile", icon: User, label: { en: "Profile", ar: "الملف الشخصي" } },
  { to: "/account/settings", icon: Settings, label: { en: "Settings", ar: "الإعدادات" } },
];

export default function AccountLayout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:items-start lg:grid-cols-[240px_1fr]">
          <aside className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors lg:shrink",
                    isActive
                      ? "border-transparent bg-[#F5B400] text-[#050505] shadow-[0_8px_24px_rgba(245,180,0,0.25)]"
                      : "border-white/[0.08] bg-[#111111] text-[#A1A1A1] hover:border-white/[0.14] hover:bg-[#181818] hover:text-white"
                  )
                }
              >
                <link.icon className="h-4.5 w-4.5" />
                <span className="whitespace-nowrap">{t(link.label)}</span>
              </NavLink>
            ))}
          </aside>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}