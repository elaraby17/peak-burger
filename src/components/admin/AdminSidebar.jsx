import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  LayoutGrid,
  Ruler,
  Droplet,
  Tag,
  Ticket,
  Building2,
  Users,
  Star,
  CreditCard,
  History,
  UserCog,
  Settings,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo/peak-burger-logo.jpeg";
import { cn } from "../../utils/cn";

const navItems = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: { en: "Dashboard", ar: "لوحة التحكم" } },
  { to: "/admin/orders", icon: ShoppingBag, label: { en: "Orders", ar: "الطلبات" } },
  { to: "/admin/products", icon: UtensilsCrossed, label: { en: "Products", ar: "المنتجات" } },
  { to: "/admin/categories", icon: LayoutGrid, label: { en: "Categories", ar: "الأقسام" } },
  { to: "/admin/product-sizes", icon: Ruler, label: { en: "Product Sizes", ar: "أحجام المنتجات" } },
  { to: "/admin/sauces", icon: Droplet, label: { en: "Sauces", ar: "الصوصات" } },
  { to: "/admin/offers", icon: Tag, label: { en: "Offers", ar: "العروض" } },
  { to: "/admin/coupons", icon: Ticket, label: { en: "Coupons", ar: "الكوبونات" } },
  { to: "/admin/branches", icon: Building2, label: { en: "Branches", ar: "الفروع" } },
  { to: "/admin/customers", icon: Users, label: { en: "Customers", ar: "العملاء" } },
  { to: "/admin/reviews", icon: Star, label: { en: "Reviews", ar: "التقييمات" } },
  { to: "/admin/payments", icon: CreditCard, label: { en: "Payments", ar: "المدفوعات" } },
  { to: "/admin/order-status-history", icon: History, label: { en: "Status History", ar: "سجل الحالات" } },
];

const bottomItems = [
  { to: "/admin/profile", icon: UserCog, label: { en: "Profile", ar: "الملف الشخصي" } },
  { to: "/admin/settings", icon: Settings, label: { en: "Settings", ar: "الإعدادات" } },
];

function NavItem({ item, onClick }) {
  const { t } = useLanguage();
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
          isActive ? "bg-primary text-text-dark shadow-pop" : "text-white/70 hover:bg-white/10 hover:text-white"
        )
      }
    >
      <item.icon className="h-4.5 w-4.5 shrink-0" />
      <span className="truncate">{t(item.label)}</span>
    </NavLink>
  );
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { lang } = useLanguage();

  const content = (
    <div className="flex h-full flex-col bg-ink-deep px-3 py-5">
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Peak Burger" className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="font-display text-sm font-extrabold text-white">Peak Burger</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {lang === "ar" ? "لوحة التحكم" : "Admin"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        {bottomItems.map((item) => (
          <NavItem key={item.to} item={item} onClick={onClose} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-ink-deep/60" onClick={onClose} />
        <div
          className={cn(
            "absolute top-0 h-full w-72 transition-transform duration-300",
            lang === "ar" ? "end-0" : "start-0",
            mobileOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
