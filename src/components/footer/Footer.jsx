import { Link } from "react-router-dom";
import { Facebook, Instagram, MapPin, Phone, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/logo/peak-burger-logo.jpeg";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com" },
];

export default function Footer() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: { en: "Explore", ar: "تصفح" },
      links: [
        { to: "/", label: { en: "Home", ar: "الرئيسية" } },
        { to: "/menu", label: { en: "Menu", ar: "المنيو" } },
        { to: "/offers", label: { en: "Offers", ar: "العروض" } },
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
    <footer className="relative mt-16 bg-ink-deep text-text-soft">

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ---- brand ---- */}
          <div>
            <Link to="/" className="mb-3 inline-flex items-center gap-2">
              <img src={logo} alt="Peak Burger" className="h-11 w-11 rounded-full object-cover" />
              <span className="font-display text-lg font-extrabold text-white">Peak Burger</span>
            </Link>
            <p className="max-w-xs text-sm text-text-muted">
              {lang === "ar" ? "فريش. سخن. لا يُنسى." : "Fresh. Hot. Unforgettable."}
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-text-soft transition-colors duration-300 hover:bg-primary hover:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* ---- link columns ---- */}
          {columns.map((col) => (
            <nav key={col.title.en} aria-label={t(col.title)}>
              <h4 className="mb-3 font-display font-bold text-white">{t(col.title)}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-muted transition-colors duration-300 hover:text-primary"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ---- contact ---- */}
          <div>
            <h4 className="mb-3 font-display font-bold text-white">
              {lang === "ar" ? "تواصل معنا" : "Contact"}
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {lang === "ar" ? "السويس، مصر" : "Suez, Egypt"}
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href="tel:+201000000000" className="transition-colors duration-300 hover:text-primary" dir="ltr">
                  +20 100 000 0000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {lang === "ar" ? "يوميًا 12 ظهرًا – 2 فجرًا" : "Daily, 12 PM – 2 AM"}
              </li>
            </ul>
          </div>
        </div>

        {/* ---- bottom bar ---- */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-line pt-6 text-center text-xs text-text-muted sm:flex-row sm:justify-between sm:text-start">
          <p>
            © {year} Peak Burger. {lang === "ar" ? "كل الحقوق محفوظة." : "All rights reserved."}
          </p>
          <p>
            {lang === "ar" ? "تطوير" : "Developed by"}{" "}
            <a
              href="https://www.facebook.com/mohamed.el.araby.833588/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-text-soft transition-colors duration-300 hover:text-primary"
            >
              El Araby
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}