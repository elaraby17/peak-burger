import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getProductBySlugOrId } from "../../data/products";
import Price from "../../components/ui/Price";
import Button from "../../components/ui/Button";

export default function FeaturedBurger() {
  const { t, lang } = useLanguage();
  const featured = getProductBySlugOrId("peek-burger-ultimate");
  if (!featured) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 rounded-3xl bg-secondary p-8 text-white sm:p-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            {lang === "ar" ? "الطبق المميز" : "Featured"}
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">{t(featured.name)}</h2>
          <p className="mt-3 max-w-md text-white/80">{t(featured.description)}</p>
          <div className="mt-6 flex items-center gap-5">
            <Price value={featured.price} className="text-2xl text-primary" />
            <Link to={`/menu/${featured.slug}`}>
              <Button variant="gold">{lang === "ar" ? "اطلبه دلوقتي" : "Order it now"}</Button>
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <img
            src={featured.image}
            alt={t(featured.name)}
            className="mx-auto aspect-square w-full max-w-sm rounded-3xl object-cover shadow-card-hover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%238F1014'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EPeak Burger%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      </div>
    </section>
  );
}
