import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo/peak-burger-logo.jpeg";

export default function Footer() {
  const { t, lang } = useLanguage();

  const columns = [
    {
      title: { en: "Explore", ar: "تصفح" },
      links: [
        { to: "/", label: { en: "Home", ar: "الرئيسية" } },
        { to: "/menu", label: { en: "Menu", ar: "المنيو" } },
        { to: "/#offers", label: { en: "Offers", ar: "العروض" } },
        { to: "/about", label: { en: "About", ar: "من نحن" } },
      ],
    },
    {
      title: { en: "Customer", ar: "حسابي" },
      links: [
        { to: "/account", label: { en: "Account", ar: "حسابي" } },
        { to: "/account/orders", label: { en: "Orders", ar: "طلباتي" } },
        { to: "/account/favorites", label: { en: "Favorites", ar: "المفضلة" } },
      ],
    },
  ];

  return (
    <footer className="mt-16 bg-ink text-cream-100">
      <div className="peak-divider -translate-y-full">
        <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
          <polygon points="0,34 0,20 100,4 220,24 340,8 460,26 600,2 740,22 860,10 1000,28 1120,6 1200,20 1200,34" fill="#1A1512" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src={logo} alt="Peak Burger" className="h-11 w-11 rounded-full object-cover" />
              <span className="font-display text-lg font-extrabold text-white">Peak Burger</span>
            </div>
            <p className="max-w-xs text-sm text-cream-100/60">
              {lang === "ar" ? "فريش. سخن. لا يُنسى." : "Fresh. Hot. Unforgettable."}
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-ink"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-primary hover:text-ink"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title.en}>
              <h4 className="mb-3 font-display font-bold text-white">{t(col.title)}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-cream-100/70 hover:text-primary">
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-3 font-display font-bold text-white">{lang === "ar" ? "تواصل معنا" : "Contact"}</h4>
            <ul className="space-y-3 text-sm text-cream-100/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {lang === "ar" ? "السويس، مصر" : "Suez, Egypt"}
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                +20 100 000 0000
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {lang === "ar" ? "يوميًا 12 ظهرًا – 2 فجرًا" : "Daily, 12 PM – 2 AM"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-cream-100/50">
          © 2026 Peak Burger. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
