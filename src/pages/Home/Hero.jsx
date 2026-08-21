import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/ui/Button";
import heroBg from "../../assets/hero/hero-bg.webp";

export default function Hero() {
  const { lang } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Real Peak Burger photo as the hero background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover object-center" />
        {/* Gradient overlay so the white text stays readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="animate-slideUp max-w-xl text-center md:text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" />
            {lang === "ar" ? "المفضل رقم 1 في المدينة" : "#1 Smash Burger in Town"}
          </span>

          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {lang === "ar" ? (
              <>
                البرجر <span className="text-primary">المثالي</span>
              </>
            ) : (
              <>
                THE PERFECT <span className="text-primary">BURGER</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-cream-100/80 md:mx-0">
            {lang === "ar" ? "فريش. سخن. لا يُنسى." : "Fresh. Hot. Unforgettable."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/menu" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full">
                {lang === "ar" ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
            </Link>
            <Link to="/menu" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full !border-white/30 !text-white hover:!bg-white hover:!text-ink">
                {lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="peak-divider relative">
        <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
          <polygon points="0,34 0,20 100,4 220,24 340,8 460,26 600,2 740,22 860,10 1000,28 1120,6 1200,20 1200,34" fill="#FFFBF3" />
        </svg>
      </div>
    </section>
  );
}
