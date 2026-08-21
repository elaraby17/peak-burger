import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { categories } from "../../data/categories";
import CategoryCard from "../../components/menu/CategoryCard";

export default function Categories() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="bg-cream-100/60 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
          {lang === "ar" ? "تصفح" : "Browse"}
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {lang === "ar" ? "الأقسام" : "Categories"}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} onClick={() => navigate(`/menu?category=${cat.id}`)} />
          ))}
        </div>
      </div>
    </section>
  );
}
