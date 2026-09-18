import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/ui/Button";

import heroBg1 from "../../assets/hero/hero-bg.webp";
import heroBg2 from "../../assets/hero/image.jpeg"; // ضيف صورة تانية (مثلاً برجر مقفول عليه أو صورة سايد ديش)
import heroBg3 from "../../assets/hero/images.jpeg"; // صورة تالتة (عرض/كومبو)

const AUTOPLAY_MS = 6000;

export default function Hero() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const slides = [
    {
      image: heroBg1,
      badge: isAr ? "المفضل رقم 1 في المدينة" : "#1 Smash Burger in Town",
      title: isAr ? (
        <>البرجر <span className="text-primary">المثالي</span></>
      ) : (
        <>THE PERFECT <span className="text-primary">BURGER</span></>
      ),
      subtitle: isAr ? "فريش. سخن. لا يُنسى." : "Fresh. Hot. Unforgettable.",
    },
    {
      image: heroBg2,
      badge: isAr ? "لحم بقري 100%" : "100% Beef Patties",
      title: isAr ? (
        <>مشوي على <span className="text-primary">النار مباشرة</span></>
      ) : (
        <>SMASHED <span className="text-primary">FRESH DAILY</span></>
      ),
      subtitle: isAr ? "كل طلبية بتتحضر لحظة ما تطلبها." : "Every order made fresh the moment you order.",
    },
    {
      image: heroBg3,
      badge: isAr ? "عرض اليوم" : "Today's Combo",
      title: isAr ? (
        <>كومبو <span className="text-primary">بسعر مميز</span></>
      ) : (
        <>COMBO <span className="text-primary">DEAL</span></>
      ),
      subtitle: isAr ? "برجر + بطاطس + مشروب بسعر واحد." : "Burger + fries + drink, one great price.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => {
    setIndex((i + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [isPaused, slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      // في RTL السحب لليمين معناه اللي بعده
      if (isAr) (delta > 0 ? next() : prev());
      else (delta > 0 ? prev() : next());
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-ink pt-16 h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0"
              }`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt=""
              className={`h-full w-full object-cover object-center transition-transform duration-[6000ms] ease-linear ${i === index ? "scale-110" : "scale-100"
                }`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div key={index} className="animate-slideUp max-w-xl text-center md:text-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" />
            {slides[index].badge}
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            {slides[index].title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-cream-100/80 md:mx-0">
            {slides[index].subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link to="/menu" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full">
                {isAr ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
            </Link>
            <Link to="/menu" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full !border-white/30 !text-white hover:!bg-white hover:!text-ink"
              >
                {isAr ? "تصفح المنيو" : "Explore Menu"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label={isAr ? "السلايد السابق" : "Previous slide"}
        className="absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 md:block ltr:left-4 rtl:right-4"
      >
        <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
      </button>
      <button
        onClick={next}
        aria-label={isAr ? "السلايد التالي" : "Next slide"}
        className="absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20 md:block ltr:right-4 rtl:left-4"
      >
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`${isAr ? "اذهب للسلايد" : "Go to slide"} ${i + 1}`}
            className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/25"
          >
            {i === index && (
              <span
                key={index}
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{
                  animation: isPaused ? "none" : `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                }}
              />
            )}
            {i < index && <span className="absolute inset-0 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* <div className="peak-divider relative">
        <svg viewBox="0 0 1200 34" preserveAspectRatio="none">
          <polygon
            points="0,34 0,20 100,4 220,24 340,8 460,26 600,2 740,22 860,10 1000,28 1120,6 1200,20 1200,34"
            fill="#FFFBF3"
          />
        </svg>
      </div> */}
    </section>
  );
}