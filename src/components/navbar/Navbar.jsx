import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  Languages,
  Phone,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import logo from "../../assets/logo/peak-burger-logo.jpeg";
import { cn } from "../../utils/cn";

const navLinks = [
  { to: "/", label: { en: "Home", ar: "الرئيسية" } },
  { to: "/menu", label: { en: "Menu", ar: "المنيو" } },
  { to: "/offers", label: { en: "Offers", ar: "العروض" } },
  { to: "/about", label: { en: "About", ar: "من نحن" } },
];

const PHONE_NUMBER = "+20 1069880640";
const ORDER_ROUTE = "/menu"; // same route Hero's "Order Now" uses

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const { itemCount, justAddedId } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (justAddedId) {
      setBump(true);
      const timeout = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [justAddedId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close the search field whenever the header docks, so it never
  // lingers open over the (now solid) scrolled header.
  useEffect(() => {
    if (scrolled) setSearchOpen(false);
  }, [scrolled]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/menu?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    // Fixed + transparent: the header floats over the Hero instead of
    // reserving its own row above it. See the note at the bottom of the
    // reply about giving non-Hero pages top padding to clear this.
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Cinematic gradient behind the header, only while parked on the Hero.
          Independent of scrolled state's solid background below. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-deep/75 via-ink-deep/35 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-0" : "opacity-100"
        )}
      />

      <div
        className={cn(
          "relative transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-white/10 bg-ink-deep/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent backdrop-blur-[2px]"
        )}
      >
        {/* Utility strip — collapses away once docked, desktop only */}
        <div
          className={cn(
            "hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
          )}
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center px-6 text-xs font-medium text-cream-100/75 lg:px-8">
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 border-e border-cream-100/20 pe-4 transition-colors hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" />
              {PHONE_NUMBER}
            </a>
            <span className="flex items-center gap-1.5 ps-4">
              <Clock className="h-3.5 w-3.5" />
              {lang === "ar" ? "مفتوح يوميًا حتى 12 منتصف الليل" : "Open daily until 12 AM"}
            </span>
            <button
              onClick={toggleLang}
              className="ms-auto flex items-center gap-1.5 transition-colors hover:text-primary"
              aria-label="Switch language"
            >
              <Languages className="h-3.5 w-3.5" />
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-6 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
            scrolled ? "h-16" : "h-20"
          )}
        >
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="Peak Burger"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
            />
            <div className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-extrabold tracking-tight text-white">
                Peak Burger
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold text-primary">
                {lang === "ar" ? "شواء طازة كل يوم" : "Flame-grilled daily"}
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "border-b-2 px-3.5 py-2 text-sm font-bold transition-colors",
                    isActive
                      ? "border-primary text-white"
                      : "border-transparent text-cream-100/80 hover:text-white"
                  )
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10",
                searchOpen && "bg-white/10 text-primary"
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/account/favorites"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10 sm:flex"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className={cn(
                    "absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[11px] font-bold text-white shadow-sm",
                    bump && "animate-badgeBounce"
                  )}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-white/10 sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            <span className="mx-1 hidden h-6 w-px bg-white/15 lg:block" />

            <Link to={ORDER_ROUTE} className="hidden lg:block">
              <Button variant="gold" size="sm" className="gap-1.5 !px-4">
                {lang === "ar" ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Search bar — solid card so it stays readable over the Hero image too */}
        <div
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-white/10 bg-ink-deep/95 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-7xl items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
            >
              <Search className="h-4 w-4 shrink-0 text-cream-100/60" />
              <input
                autoFocus={searchOpen}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === "ar" ? "دور على أكلة..." : "Search the menu..."}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-cream-100/40"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300 lg:hidden",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-ink-deep/50 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 flex h-full w-80 max-w-[85vw] flex-col bg-surface shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out",
            lang === "ar" ? "end-0" : "start-0",
            drawerOpen ? "translate-x-0" : lang === "ar" ? "translate-x-full" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between bg-ink-deep px-6 py-5">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Peak Burger" className="h-10 w-10 rounded-full object-cover ring-2 ring-cream/20" />
              <span className="font-display text-base font-extrabold text-cream">Peak Burger</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-4 py-3 font-display font-bold transition-colors",
                    isActive ? "bg-primary text-text-dark" : "text-text-muted hover:bg-white/5 hover:text-text"
                  )
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
            <Link
              to="/account/favorites"
              onClick={() => setDrawerOpen(false)}
              className="rounded-xl px-4 py-3 font-display font-bold text-cream-100/70 transition-colors hover:bg-white/5 hover:text-cream"
            >
              {lang === "ar" ? "المفضلة" : "Favorites"}
            </Link>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              onClick={() => setDrawerOpen(false)}
              className="rounded-xl px-4 py-3 font-display font-bold text-cream-100/70 transition-colors hover:bg-white/5 hover:text-cream"
            >
              {isAuthenticated ? (lang === "ar" ? "حسابي" : "My Account") : (lang === "ar" ? "تسجيل الدخول" : "Log In")}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 px-4 py-4">
            <Link to={ORDER_ROUTE} onClick={() => setDrawerOpen(false)}>
              <Button variant="gold" size="lg" className="w-full gap-1.5">
                {lang === "ar" ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-cream-100/70"
            >
              <Phone className="h-4 w-4" /> {PHONE_NUMBER}
            </a>
            <button
              onClick={() => {
                toggleLang();
                setDrawerOpen(false);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-cream-100/70 hover:text-cream"
            >
              <Languages className="h-4 w-4" /> {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}