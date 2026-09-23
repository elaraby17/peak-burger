import { useEffect } from "react";
import { Flame, Truck, Leaf, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo/peak-burger-logo.jpeg";

const values = [
  { icon: Flame, title: { en: "Smashed to order", ar: "سماش على الطلب" } },
  { icon: Truck, title: { en: "Fast delivery", ar: "توصيل سريع" } },
  { icon: Leaf, title: { en: "Fresh ingredients", ar: "مكونات طازجة" } },
  { icon: ShieldCheck, title: { en: "Quality checked", ar: "جودة مضمونة" } },
];

export default function About() {
  const { t, lang } = useLanguage();

  useEffect(() => {
    document.title = "About — Peak Burger";
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <img src={logo} alt="Peak Burger" className="mx-auto h-20 w-20 rounded-full object-cover" />
      <h1 className="mt-6 font-display text-4xl font-extrabold text-text">
        {lang === "ar" ? "قصة بيك برجر" : "The Peak Burger Story"}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-text-muted">
        {lang === "ar"
          ? "بدأنا بفكرة بسيطة: برجر سماش فريش، مكونات حقيقية، وسرعة في التوصيل. من مطبخنا لباب بيتك، كل قطعة بتتحضر لحظة ما تطلب."
          : "Peak Burger started with one idea: fresh smash burgers, real ingredients, and speed you can count on. From our kitchen to your door, every patty is smashed to order."}
      </p>

      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {values.map((v) => (
          <div key={v.title.en} className="rounded-2xl border border-line bg-surface-50 p-5 shadow-card">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-100 text-primary">
              <v.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-text">{t(v.title)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
