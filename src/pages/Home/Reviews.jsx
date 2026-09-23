import { Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useInView } from "../../hooks/useInView";

const reviews = [
  { name: "Ahmed S.", rating: 5, text: { en: "Best smash burger in Suez, hands down. The BBQ Rings is unreal.", ar: "أفضل سماش برجر في السويس من غير منازع. الباربيكيو رينج تحفة." } },
  { name: "Mona K.", rating: 5, text: { en: "Fast delivery and the burgers actually arrive hot.", ar: "توصيل سريع والأكل بيوصل سخن فعلاً." } },
  { name: "Youssef R.", rating: 4, text: { en: "Juicy Lucy is my go-to now. Huge portions.", ar: "جوسي لوسي بقت الأكلة المفضلة عندي. الكمية كبيرة." } },
];

export default function Reviews() {
  const { t, lang } = useLanguage();
  const { ref, inView } = useInView(0.15);

  return (
    <section
      id="reviews"
      ref={ref}
      className="relative overflow-hidden bg-[#050505] py-20 sm:py-28"
    >
      {/* subtle oversized quote mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute start-4 top-2 select-none font-display text-[11rem] font-extrabold leading-none text-[#F5B400]/[0.06] sm:text-[16rem]"
      >
        &quot;
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className={`font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm ${inView ? "animate-fadeIn" : "opacity-0"}`}
        >
          {lang === "ar" ? "آراء عملائنا" : "Reviews"}
        </p>

        <h2
          className={`mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl ${inView ? "animate-slideUp" : "opacity-0"}`}
        >
          {lang === "ar" ? "الناس بتقول إيه" : "What People Are Saying"}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className={`relative flex flex-col rounded-3xl border border-white/[0.08] bg-[#111111] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#181818] sm:p-8 ${i === 1 ? "lg:translate-y-5" : ""} ${inView ? "animate-slideUp" : "opacity-0"}`}
              style={{ animationDelay: `${100 + i * 120}ms` }}
            >
              <div className="flex gap-1 text-[#F5B400]">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s < r.rating ? "fill-[#F5B400]" : "fill-white/20 text-white/20"}`}
                  />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white sm:text-lg">
                &quot;{t(r.text)}&quot;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#181818] font-display text-sm font-bold text-[#F5B400]"
                >
                  {r.name.charAt(0)}
                </span>
                <span className="font-display text-base font-bold text-[#D4D4D4]">
                  {r.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}