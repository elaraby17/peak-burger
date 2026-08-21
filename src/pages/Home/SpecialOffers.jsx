import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { offers } from "../../data/offers";
import Badge from "../../components/ui/Badge";

export default function SpecialOffers() {
  const { t, lang } = useLanguage();

  return (
    <section id="offers" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
        {lang === "ar" ? "لفترة محدودة" : "Limited Time"}
      </p>
      <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
        {lang === "ar" ? "عروض خاصة" : "Special Offers"}
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            to="/menu"
            className="group relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-card transition-transform hover:-translate-y-1"
          >
            <Badge tone={offer.badgeColor}>{t(offer.tag)}</Badge>
            <h3 className="mt-4 font-display text-xl font-bold">{t(offer.title)}</h3>
            <p className="mt-2 text-sm text-white/70">{t(offer.description)}</p>
            <div className="absolute -end-8 -bottom-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl transition-transform group-hover:scale-125" />
          </Link>
        ))}
      </div>
    </section>
  );
}
