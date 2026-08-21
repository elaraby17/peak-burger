import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/ui/Button";

export default function CTA() {
  const { lang } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center">
        <div className="absolute -end-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
        <h2 className="relative font-display text-3xl font-extrabold text-ink sm:text-4xl">
          {lang === "ar" ? "جاهز تطلب؟" : "Ready to order?"}
        </h2>
        <p className="relative mx-auto mt-2 max-w-md text-ink/70">
          {lang === "ar" ? "أكلك المفضل على بعد دقايق بس." : "Your favorite meal is minutes away."}
        </p>
        <Link to="/menu" className="relative mt-6 inline-block">
          <Button variant="primary" size="lg">
            {lang === "ar" ? "اطلب الآن" : "Order Now"}
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
