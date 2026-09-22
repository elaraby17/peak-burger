import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { categoryService } from "../../services/categoryService";
import CategoryCard from "../../components/menu/CategoryCard";
import Button from "../../components/ui/Button";
import { useInView } from "../../hooks/useInView";

const header = {
  eyebrow: { en: "Browse", ar: "تصفح" },
  title: { en: "Explore Our Menu", ar: "اكتشف قائمتنا" },
  description: { en: "Choose what you're craving.", ar: "اختار اللي انت عايزه." },
};

function SkeletonTile() {
  return (
    <div className="min-h-[150px] rounded-3xl border border-white/[0.08] bg-[#111111] p-5 sm:min-h-[168px] sm:p-7">
      <div className="h-14 w-14 animate-pulse rounded-2xl bg-[#181818]" />
      <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-[#181818]" />
      <div className="mt-3 h-3.5 w-4/5 animate-pulse rounded bg-[#181818]" />
    </div>
  );
}

export default function Categories() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { ref, inView } = useInView(0.12);
  const [cats, setCats] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setCats(null);
    setLoadError(false);
    categoryService
      .getAll()
      .then((data) => setCats(data.filter((c) => c.active !== false)))
      .catch((err) => {
        console.error("Failed to load categories from API", err);
        setLoadError(true);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const goToCategory = (cat) => navigate(`/menu?category=${cat.id}`);

  return (
    <section
      id="browse"
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0A] py-20 sm:py-28"
    >
      {/* barely-visible yellow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(245,180,0,0.06), transparent 45%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* section header */}
        <div
          className={`flex items-center gap-4 ${inView ? "animate-fadeIn" : "opacity-0"}`}
        >
          <p className="shrink-0 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm">
            {t(header.eyebrow)}
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <div
          className={`mt-4 max-w-2xl ${inView ? "animate-slideUp" : "opacity-0"}`}
        >
          <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {t(header.title)}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#A1A1A1] sm:text-lg">
            {t(header.description)}
          </p>
        </div>

        {/* content */}
        <div className="mt-12">
          {cats === null && !loadError && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonTile key={i} />
              ))}
            </div>
          )}

          {loadError && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center">
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#D71920]/15">
                <AlertTriangle className="h-7 w-7 text-[#D71920]" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {lang === "ar" ? "تعذر تحميل الأقسام" : "Unable to load categories."}
              </h3>
              <p className="max-w-sm text-sm text-[#A1A1A1]">
                {lang === "ar"
                  ? "تأكد إن السيرفر شغال وحاول تاني."
                  : "Make sure the API is running and try again."}
              </p>
              <Button onClick={load} variant="gold" size="md" className="mt-2">
                {lang === "ar" ? "إعادة المحاولة" : "Try again"}
              </Button>
            </div>
          )}

          {cats !== null && !loadError && cats.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center">
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#181818]">
                <UtensilsCrossed className="h-7 w-7 text-[#F5B400]" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {lang === "ar"
                  ? "لا توجد أقسام متاحة حاليًا"
                  : "No categories available right now."}
              </h3>
            </div>
          )}

          {cats !== null && !loadError && cats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {cats.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`${inView ? "animate-slideUp" : "opacity-0"}`}
                  style={{ animationDelay: `${100 + i * 80}ms` }}
                >
                  <CategoryCard
                    variant="card"
                    category={cat}
                    onClick={() => goToCategory(cat)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}