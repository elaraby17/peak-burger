import { Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const reviews = [
  { name: "Ahmed S.", rating: 5, text: { en: "Best smash burger in Suez, hands down. The BBQ Rings is unreal.", ar: "أفضل سماش برجر في السويس من غير منازع. الباربيكيو رينج تحفة." } },
  { name: "Mona K.", rating: 5, text: { en: "Fast delivery and the burgers actually arrive hot.", ar: "توصيل سريع والأكل بيوصل سخن فعلاً." } },
  { name: "Youssef R.", rating: 4, text: { en: "Juicy Lucy is my go-to now. Huge portions.", ar: "جوسي لوسي بقت الأكلة المفضلة عندي. الكمية كبيرة." } },
];

export default function Reviews() {
  const { t, lang } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
        {lang === "ar" ? "آراء عملائنا" : "Reviews"}
      </p>
      <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
        {lang === "ar" ? "الناس بتقول إيه" : "What People Are Saying"}
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-primary" : "fill-transparent text-ink/15"}`} />
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-soft">"{t(r.text)}"</p>
            <p className="mt-4 font-display font-bold text-ink">{r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
