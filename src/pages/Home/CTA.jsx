import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/ui/Button";
import { useInView } from "../../hooks/useInView";

const label = { en: "Ready to order?", ar: "جاهز تطلب؟" };
const headline = {
  en: { lead: "Your next", accent: "burger", tail: "is waiting." },
  ar: { lead: "برغرك", accent: "الجاي", tail: "بينتظرك" },
};
const description = {
  en: "Hot, fresh, and made to order — your favorite meal is minutes away.",
  ar: "سخن، طازج، وبيتعمل على طلبك — أكلك المفضل على بعد دقايق بس.",
};

export default function CTA() {
  const { t, lang } = useLanguage();
  const { ref, inView } = useInView(0.2);
  const head = headline[lang] ?? headline.en;

  return (
    <section
      id="order"
      ref={ref}
      className="bg-[#0A0A0A] pb-20 pt-2 sm:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#111111] px-6 py-14 sm:px-10 sm:py-16 lg:px-14">
          {/* subtle yellow glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 80% 50%, rgba(245,180,0,0.10), transparent 40%)",
            }}
          />

          {/* abstract burger rings - CSS decorative only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute end-8 top-1/2 hidden -translate-y-1/2 lg:block"
          >
            <div className="relative h-56 w-56">
              <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
              <div className="absolute inset-6 rounded-full border border-white/[0.12]" />
              <div className="absolute inset-12 rounded-full border border-[#F5B400]/20" />
              <span className="absolute left-1/2 top-7 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#F5B400]" />
              <span className="absolute right-7 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#F5B400]/60" />
              <span className="absolute bottom-9 left-9 h-1.5 w-1.5 rounded-full bg-[#F5B400]/40" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D71920]/60" />
            </div>
          </div>

          <div className="relative max-w-xl">
            <p
              className={`font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm ${inView ? "animate-fadeIn" : "opacity-0"}`}
            >
              {t(label)}
            </p>

            <h2
              className={`mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl ${inView ? "animate-slideUp" : "opacity-0"}`}
            >
              {head.lead} <span className="text-[#F5B400]">{head.accent}</span>{" "}
              {head.tail}
            </h2>

            <p
              className={`mt-4 max-w-lg text-base leading-relaxed text-[#A1A1A1] sm:text-lg ${inView ? "animate-fadeIn [animation-delay:100ms]" : "opacity-0"}`}
            >
              {t(description)}
            </p>

            <Link
              to="/menu"
              className={`mt-8 inline-block transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${inView ? "animate-slideUp [animation-delay:150ms]" : "opacity-0"}`}
            >
              <Button variant="gold" size="lg">
                {lang === "ar" ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}