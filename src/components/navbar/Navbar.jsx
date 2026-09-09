import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu as MenuIcon, X, Languages } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/peak-burger-logo.jpeg";
import { cn } from "../../utils/cn";

const navLinks = [
  { to: "/", label: { en: "Home", ar: "الرئيسية" } },
  { to: "/menu", label: { en: "Menu", ar: "المنيو" } },
  { to: "/offers", label: { en: "Offers", ar: "العروض" } },
  { to: "/about", label: { en: "About", ar: "من نحن" } },
];

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const { itemCount, justAddedId } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (justAddedId) {
      setBump(true);
      const timeout = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [justAddedId]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/menu?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-md sm:backdrop-blur-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Peak Burger" className="h-10 w-10 rounded-full object-cover" />
          <span className="hidden font-display text-lg font-extrabold text-ink sm:block">Peak Burger</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-white",
                  isActive && "bg-white text-secondary shadow-card"
                )
              }
            >
              {t(link.label)}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleLang}
            className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-ink-soft hover:bg-white sm:flex"
            aria-label="Switch language"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "AR" : "EN"}
          </button>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white sm:flex"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            to="/account/favorites"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white sm:flex"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                className={cn(
                  "absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[11px] font-bold text-white",
                  bump && "animate-badgeBounce"
                )}
              >
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-white"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink/5 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-2">
            <Search className="h-4 w-4 text-ink-soft" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "ar" ? "دور على أكلة..." : "Search the menu..."}
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/50"
            />
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50  transition-opacity duration-300 lg:hidden",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
        <div
          className={cn(
            "absolute top-0 h-full w-72 bg-white p-6 shadow-card-hover transition-transform duration-300",
            lang === "ar" ? "end-0" : "start-0",
            drawerOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"
          )}
        >
          <div className="mb-6 flex  items-center justify-between">
            <img src={logo} alt="Peak Burger" className="h-10 w-10 rounded-full object-cover" />
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6 text-ink" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 font-display font-semibold text-ink-soft",
                    isActive && "bg-primary-100 text-secondary"
                  )
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
            <Link
              to="/account/favorites"
              onClick={() => setDrawerOpen(false)}
              className="rounded-xl px-4 py-3 font-display font-semibold text-ink-soft"
            >
              {lang === "ar" ? "المفضلة" : "Favorites"}
            </Link>
            <button
              onClick={() => {
                toggleLang();
                setDrawerOpen(false);
              }}
              className="mt-2 flex items-center gap-2 rounded-xl bg-cream-100 px-4 py-3 text-start font-display font-semibold text-ink-soft"
            >
              <Languages className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
