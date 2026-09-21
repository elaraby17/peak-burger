import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../../components/ui/Button";
import offers from "../../data/offersHero";
import fallbackImage from "../../assets/hero/hero-bg.webp"; // shown if an offer image is missing

const AUTOPLAY_MS = 6000;
const ORDER_ROUTE = "/menu";
const DEFAULT_CALLOUT = { en: "LIMITED TIME", ar: "لفترة محدودة" };
// Optional: add Caveat from Google Fonts for a nicer handwritten note.
const HAND_FONT = '"Caveat", "Segoe Print", "Bradley Hand", "Chalkboard SE", cursive';

/* ------------------------------------------------------------------ */
/* Scoped keyframes: the component does not need tailwind.config edits */
/* ------------------------------------------------------------------ */
const STYLES = `
@keyframes so-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes so-pop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: none; } }
@keyframes so-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes so-nudge { from { opacity: 0; transform: translate(-8px, 6px); } to { opacity: 1; transform: none; } }
@keyframes so-zoom { from { transform: scale(1.03); } to { transform: scale(1); } }
@keyframes so-progress { from { width: 0; } to { width: 100%; } }
.so-rise  { animation: so-rise 600ms cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
.so-pop   { animation: so-pop 450ms cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
.so-nudge { animation: so-nudge 700ms ease-out var(--d, 0ms) both; }
.so-draw  { stroke-dasharray: 1; animation: so-draw 700ms ease-out var(--d, 0ms) both; }
.so-zoom  { animation: so-zoom 1400ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .so-rise, .so-pop, .so-nudge, .so-draw, .so-zoom { animation: none; }
}
`;

const d = (ms) => ({ "--d": `${ms}ms` }); // animation delay helper

/* ------------------------------------------------------------------ */
/* Decorative SVGs (all drawn in code, nothing comes from the photo)   */
/* ------------------------------------------------------------------ */
function Sparkle({ className = "", style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
    </svg>
  );
}

function RoughUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 -bottom-2 h-3 w-full overflow-visible"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path className="so-draw" style={d(500)} pathLength="1" strokeWidth="4" d="M3 9 C 30 3, 55 12, 90 6 S 150 11, 197 4" />
      <path className="so-draw" style={d(700)} pathLength="1" strokeWidth="2" opacity="0.6" d="M22 12 C 70 9, 120 13, 172 9" />
    </svg>
  );
}

function HandArrow({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 90"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="so-draw" style={d(600)} pathLength="1" d="M6 10 C 30 6, 70 14, 100 48 C 108 58, 112 66, 114 74" />
      <path className="so-draw" style={d(1000)} pathLength="1" d="M97 64 L114 76 L124 56" />
    </svg>
  );
}

function Scribble({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="so-draw" style={d(800)} pathLength="1" d="M4 30 L18 6 L28 34 L44 4 L54 32 L70 8 L84 30" />
    </svg>
  );
}

function Stamp({ children }) {
  return (
    <div aria-hidden="true" className="so-pop relative -rotate-6 rtl:rotate-6" style={d(300)}>
      <svg
        viewBox="0 0 200 64"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path
          className="so-draw"
          style={d(350)}
          pathLength="1"
          d="M100 4 C 160 2, 198 14, 196 32 C 194 52, 150 62, 98 60 C 44 60, 4 50, 6 30 C 8 12, 50 6, 104 5"
        />
      </svg>
      <span className="relative block px-5 py-2.5 font-display text-sm font-extrabold tracking-[0.2em] text-primary rtl:tracking-normal">
        {children}
      </span>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */

export default function Hero() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const reducedMotion = usePrefersReducedMotion();
  const count = offers.length;

  // Works with { en, ar } objects or plain strings
  const t = (f) => (typeof f === "string" ? f : f?.[lang] ?? f?.en ?? "");
  const handStyle = isAr ? undefined : { fontFamily: HAND_FONT };

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  const autoplayOn = !isPaused && !reducedMotion && count > 1;

  useEffect(() => {
    if (!autoplayOn) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [autoplayOn, index, next]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      const goNext = isAr ? delta > 0 : delta < 0;
      if (goNext) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      if (isAr) prev();
      else next();
    } else if (e.key === "ArrowLeft") {
      if (isAr) next();
      else prev();
    }
  };

  // If an offer image 404s, fall back to a known-good image instead of a broken icon
  const handleImgError = (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = fallbackImage;
  };

  if (count === 0) return null;
  const offer = offers[index];
  const note = t(offer.note);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={isAr ? "عروض المطعم" : "Restaurant offers"}
      className="relative h-screen touch-pan-y overflow-hidden bg-ink pt-16 sm:h-[620px] md:h-screen md:max-h-screen md:min-h-[580px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <style>{STYLES}</style>

      {/* ── LAYER 1: food photo (only the photo, nothing designed into it) ── */}
      <div className="absolute inset-0">
        {offers.map((o, i) => {
          const active = i === index;
          return (
            <div
              key={o.id}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${active ? "opacity-100" : "opacity-0"
                }`}
            >
              {/* mobile: photo in the top part, fades into black.
                  md: full-bleed. lg: right-aligned so the food sits opposite the text. */}
              <div className="absolute inset-x-0 top-0 h-[60%] overflow-hidden md:inset-0 md:h-full lg:start-[16%]">
                <img
                  src={o.image}
                  alt={t(o.alt)}
                  width={1920}
                  height={1080}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  onError={handleImgError}
                  style={{ objectPosition: o.focus ?? "center" }}
                  className={`h-full w-full object-cover ${active ? "so-zoom" : ""}`}
                />
                {/* mobile-only fade into the dark background */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent md:hidden" />
              </div>
            </div>
          );
        })}

        {/* ── LAYER 2: cinematic overlay (md+). Text side is always dark, whatever the photo ── */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink from-[8%] via-ink/70 via-[42%] to-transparent to-[85%] md:block rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-ink to-transparent md:block" />
      </div>

      {/* ── LAYER 3: decorative graphics (independent of the photo) ── */}
      <div key={`decor-${offer.id}`} className="pointer-events-none absolute inset-x-0 bottom-0 top-16 overflow-hidden">
        <div className="relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* subtle background typography (md+) */}
          <span
            aria-hidden="true"
            className="absolute -bottom-[4%] start-2 hidden select-none whitespace-nowrap font-display font-extrabold uppercase leading-none text-transparent md:block"
            style={{ fontSize: "clamp(6rem, 17vw, 15rem)", WebkitTextStroke: "1px rgba(255,255,255,0.09)" }}
          >
            {t(offer.highlight)}
          </span>

          {/* lg+: stamp + handwritten note + arrow, floating between text and food */}
          <div className="absolute top-[14%] hidden flex-col items-start gap-2 lg:flex lg:start-[46%]">
            <Stamp>{t(offer.callout ?? DEFAULT_CALLOUT)}</Stamp>
            {note && (
              <p
                className="so-rise flex max-w-[15rem] items-center gap-3 text-2xl leading-tight text-cream-100 rtl:text-lg rtl:font-bold"
                style={{ ...handStyle, ...d(450) }}
              >
                <span aria-hidden="true" className="h-px w-8 shrink-0 bg-primary/70" />
                {note}
              </p>
            )}
            <HandArrow className="so-nudge ms-6 h-20 w-32 text-primary rtl:-scale-x-100" />
          </div>

          <Scribble className="absolute bottom-[12%] hidden w-16 text-primary/70 lg:block lg:start-[40%]" />
          <Sparkle className="so-pop absolute end-[5%] top-[18%] hidden h-5 w-5 text-primary lg:block" />
        </div>
      </div>

      {/* ── LAYERS 4–8: badge, discount, title, description, CTAs ── */}
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-14 sm:px-6 md:items-center md:pb-0 lg:px-8">
        <div
          key={offer.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${count}`}
          aria-live={autoplayOn ? "off" : "polite"}
          className="w-full max-w-xl text-center md:max-w-[34rem] md:text-start"
        >
          {/* 4 + 5: offer badge and discount */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span
              className="so-pop inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-primary rtl:tracking-normal"
              style={d(0)}
            >
              <Star className="h-3.5 w-3.5 fill-primary" aria-hidden="true" />
              {t(offer.badge)}
            </span>
            <span
              className="so-pop rounded-md bg-primary px-2.5 py-1 text-xs font-extrabold text-ink"
              style={d(80)}
            >
              {t(offer.discount)}
            </span>
          </div>

          {/* 6: typography */}
          <h1
            className="so-rise mt-4 font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl md:mt-5 lg:text-7xl"
            style={d(100)}
          >
            {t(offer.title)}
            <Sparkle className="so-pop ms-2 inline-block h-4 w-4 align-top text-primary lg:h-6 lg:w-6" style={d(450)} />
            <span className="block">
              <span className="relative inline-block text-primary">
                {t(offer.highlight)}
                <RoughUnderline />
              </span>
            </span>
          </h1>

          {/* 7: description */}
          <p
            className="so-rise mx-auto mt-4 max-w-md text-base text-cream-100/80 sm:text-lg md:mx-0 md:mt-6"
            style={d(200)}
          >
            {t(offer.description)}
          </p>

          {/* note: small line on mobile/tablet, floating annotation on lg+ */}
          {note && (
            <p
              className="so-rise mt-3 flex items-center justify-center gap-3 text-xl text-cream-100 rtl:text-base rtl:font-bold md:justify-start lg:hidden"
              style={{ ...handStyle, ...d(260) }}
            >
              <span aria-hidden="true" className="h-px w-8 bg-primary/70" />
              {note}
              <span aria-hidden="true" className="h-px w-8 bg-primary/70 md:hidden" />
            </p>
          )}

          {/* 8: CTAs */}
          <div
            className="so-rise mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:mt-8 md:justify-start"
            style={d(320)}
          >
            <Link to={ORDER_ROUTE} className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full">
                {isAr ? "اطلب الآن" : "Order Now"}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
            <Link to={offer.to ?? ORDER_ROUTE} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full !border-white/30 !text-white hover:!bg-white hover:!text-ink"
              >
                {isAr ? "استكشف العرض" : "Explore Offer"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── LAYER 9: navigation arrows ── */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={isAr ? "العرض السابق" : "Previous offer"}
            className="absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:block ltr:left-4 rtl:right-4"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={isAr ? "العرض التالي" : "Next offer"}
            className="absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:block ltr:right-4 rtl:left-4"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
          </button>
        </>
      )}

      {/* ── LAYER 10: pagination with progress ── */}
      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center">
          {offers.map((o, i) => (
            <button
              key={o.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${isAr ? "اذهب إلى العرض" : "Go to offer"} ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="flex h-6 w-10 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/25">
                {i < index && <span className="absolute inset-0 rounded-full bg-primary" />}
                {i === index &&
                  (autoplayOn ? (
                    <span
                      key={index}
                      className="absolute inset-y-0 rounded-full bg-primary ltr:left-0 rtl:right-0"
                      style={{ animation: `so-progress ${AUTOPLAY_MS}ms linear forwards` }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full bg-primary" />
                  ))}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}