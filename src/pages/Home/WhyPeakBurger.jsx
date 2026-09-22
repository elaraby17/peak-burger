import { Flame, Truck, Leaf, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";

const points = [
  { icon: Flame, title: { en: "Smashed to order", ar: "سماش على الطلب" }, text: { en: "Every patty hits the grill only after you order.", ar: "كل قطعة بتتحضر بعد ما تطلب مباشرة." } },
  { icon: Truck, title: { en: "Fast delivery", ar: "توصيل سريع" }, text: { en: "Hot food, at your door, fast.", ar: "أكل سخن يوصلك بسرعة." } },
  { icon: Leaf, title: { en: "Fresh ingredients", ar: "مكونات طازجة" }, text: { en: "Sourced daily, never frozen buns.", ar: "مكونات طازجة يوميًا." } },
  { icon: ShieldCheck, title: { en: "Quality checked", ar: "جودة مضمونة" }, text: { en: "Every order checked before it leaves.", ar: "كل طلب بيتفحص قبل ما يوصلك." } },
];

const support = {
  en: "From the first smash on the grill to the ring of your doorbell, every detail is handled like it matters.",
  ar: "من أول سماشة على الشواية لحد رنة جرس بابك، كل تفصيلة بتتعمل باهتمام.",
};

export default function WhyPeakBurger() {
  const { t, lang } = useLanguage();
  const { ref, inView } = useInView(0.15);

  return (
    <section
      id="why"
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0A] py-20 sm:py-28"
    >
      {/* barely-visible yellow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(245,180,0,0.06), transparent 38%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className={`font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm ${inView ? "animate-fadeIn" : "opacity-0"}`}
        >
          {lang === "ar" ? "ليه بيك برجر" : "Why Peak Burger"}
        </p>

        <h2
          className={`mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl ${inView ? "animate-slideUp" : "opacity-0"}`}
        >
          {lang === "ar" ? "مبني على الجودة" : "Built On Quality"}
        </h2>

        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed text-[#A1A1A1] sm:text-lg ${inView ? "animate-fadeIn [animation-delay:100ms]" : "opacity-0"}`}
        >
          {t(support)}
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {points.map((p, i) => (
            <li
              key={p.title.en}
              className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111111] p-7 transition-all duration-300 hover:-translate-y-[3px] hover:bg-[#222222] hover:border-white/[0.14] sm:p-8 ${inView ? "animate-slideUp" : "opacity-0"}`}
              style={{ animationDelay: `${100 + i * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#181818] text-[#F5B400] transition-shadow duration-300 group-hover:shadow-[0_0_20px_rgba(245,180,0,0.25)]">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white">
                {t(p.title)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
                {t(p.text)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}