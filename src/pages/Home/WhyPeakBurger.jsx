import { Flame, Truck, Leaf, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const points = [
  { icon: Flame, title: { en: "Smashed to order", ar: "سماش على الطلب" }, text: { en: "Every patty hits the grill only after you order.", ar: "كل قطعة بتتحضر بعد ما تطلب مباشرة." } },
  { icon: Truck, title: { en: "Fast delivery", ar: "توصيل سريع" }, text: { en: "Hot food, at your door, fast.", ar: "أكل سخن يوصلك بسرعة." } },
  { icon: Leaf, title: { en: "Fresh ingredients", ar: "مكونات طازجة" }, text: { en: "Sourced daily, never frozen buns.", ar: "مكونات طازجة يوميًا." } },
  { icon: ShieldCheck, title: { en: "Quality checked", ar: "جودة مضمونة" }, text: { en: "Every order checked before it leaves.", ar: "كل طلب بيتفحص قبل ما يوصلك." } },
];

export default function WhyPeakBurger() {
  const { t, lang } = useLanguage();

  return (
    <section className="bg-ink py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-primary">
          {lang === "ar" ? "ليه بيك برجر" : "Why Peak Burger"}
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
          {lang === "ar" ? "مبني على الجودة" : "Built On Quality"}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title.en}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-ink">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold">{t(p.title)}</h3>
              <p className="mt-1 text-sm text-white/60">{t(p.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
