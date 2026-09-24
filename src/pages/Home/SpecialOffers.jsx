import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { offers } from "../../data/offers";
import Price from "../../components/ui/Price";
import Button from "../../components/ui/Button";
import fallbackImage from "../../assets/hero/classic-combo.jpg";

const discountPercent = (offer) =>
  offer && Number(offer.oldPrice) > 0 && Number(offer.offerPrice) > 0
    ? Math.round((1 - Number(offer.offerPrice) / Number(offer.oldPrice)) * 100)
    : null;

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function SpecialOffers() {
  const { t, lang } = useLanguage();
  const { ref, inView } = useInView(0.12);

  const featured = offers[0];
  if (!featured) return null;

  const rest = offers.slice(1);
  const discount = discountPercent(featured);
  const isAr = lang === "ar";

  const words = t(featured.title).split(" ");
  const highlight = words.length > 1 ? words.pop() : null;
  const headline = words.join(" ");

  return (
    <section
      id="offers"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-[#0A0A0A] py-20 sm:py-28"
    >
      {/* subtle radial yellow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 75% 50%, rgba(245,180,0,0.08), transparent 42%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* eyebrow */}
        <div
          className={`flex items-center gap-3 ${inView ? "animate-fadeIn" : "opacity-0"}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F5B400]" />
          <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm">
            {isAr ? "عروض خاصة" : "Special Offers"}
          </p>
        </div>

        {/* featured offer */}
        <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/[0.08] bg-[#111111] shadow-2xl lg:grid-cols-2">
          {/* content */}
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <p
              className={`font-display text-xs font-bold uppercase tracking-[0.3em] text-[#F5B400] ${inView ? "animate-fadeIn" : "opacity-0"}`}
            >
              {t(featured.tag)}
            </p>

            <h2
              className={`mt-4 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl ${inView ? "animate-slideUp" : "opacity-0"}`}
            >
              {headline}
              {highlight && (
                <>
                  {" "}
                  <span className="text-[#F5B400]">{highlight}</span>
                </>
              )}
            </h2>

            <p
              className={`mt-5 max-w-md text-base leading-relaxed text-[#A1A1A1] sm:text-lg ${inView ? "animate-fadeIn [animation-delay:120ms]" : "opacity-0"}`}
            >
              {t(featured.description)}
            </p>

            {/* CTA + price */}
            <div
              className={`mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 ${inView ? "animate-slideUp [animation-delay:180ms]" : "opacity-0"}`}
            >
              <Button
                variant="primary"
              >
                {isAr ? "اطلب الآن" : "Order Now"}
                <ArrowRight className={`h-4 w-4 ${isAr ? "-scale-x-100" : ""}`} />
            
              </Button>

              <div className="flex items-baseline gap-3">
                {Number(featured.offerPrice) > 0 && (
                  <>
                    <Price
                      value={featured.oldPrice}
                      className="text-sm text-[#A1A1A1] line-through decoration-white/30"
                    />
                    <Price
                      value={featured.offerPrice}
                      className="text-2xl text-[#F5B400]"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#050505] lg:aspect-auto">
            {/* warm glow behind the food */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(245,180,0,0.10), transparent 55%)",
              }}
            />

            <img
              src={featured.image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
              alt={t(featured.title)}
              loading="lazy"
              className={`relative h-full min-h-[280px] w-full object-cover transition-transform duration-500 hover:scale-[1.03] ${inView ? "animate-fadeIn" : "opacity-0"}`}
            />

            {/* red promotional accent */}
            <span
              className={`absolute start-4 top-4 rounded-full bg-[#D71920] px-3 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white shadow-lg ${inView ? "animate-popIn" : "opacity-0"}`}
            >
              {isAr ? "محدود" : "Limited"}
            </span>

            {/* discount pop */}
            {discount !== null && (
              <span
                className={`absolute end-4 top-4 flex flex-col items-center rounded-xl bg-[#F5B400] px-3.5 py-2 text-center shadow-[0_8px_24px_rgba(245,180,0,0.25)] ${inView ? "animate-popIn [animation-delay:150ms]" : "opacity-0"}`}
              >
                <span className="font-display text-xl font-extrabold leading-none text-[#050505]">
                  -{discount}%
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#050505]/70">
                  {isAr ? "خصم" : "Off"}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* remaining offers - compact dark chips */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {rest.map((offer, i) => {
              const pct = discountPercent(offer);
              return (
                <Link
                  key={offer.id}
                  to="/menu"
                  className={`group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-5 transition-all duration-200 hover:border-white/15 hover:bg-[#111111] ${inView ? "animate-slideUp" : "opacity-0"}`}
                  style={{ animationDelay: `${220 + i * 100}ms` }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold text-white">
                      {t(offer.title)}
                    </p>
                    <p className="mt-0.5 text-sm text-[#A1A1A1]">
                      {t(offer.tag)}
                      {pct !== null && (
                        <span className="ms-2 font-bold text-[#F5B400]">
                          -{pct}%
                        </span>
                      )}
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 shrink-0 text-[#F5B400] transition-transform duration-200 group-hover:translate-x-1 ${isAr ? "-scale-x-100" : ""}`}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}