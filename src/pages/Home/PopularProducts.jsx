import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ProductCardPopular from "../../components/product/ProductCardPopular";

/* الرقم الأكبر = أبطأ. (7 ثواني لكل كارت) */
const SECONDS_PER_CARD = 7;
/* أقل عدد كروت في النسخة الواحدة عشان الشاشات العريضة ما يظهرش فيها فراغ */
const MIN_PER_COPY = 8;

/*
 * الحركة بـ CSS بحت (transform على الـ GPU):
 * - الوقف عند الهوفر فوري ويكمل من نفس النقطة بالظبط، من غير أي JS.
 * - بيوقف كمان لو الفوكس جاي من الكيبورد، ولو المستخدم ماسك الشاشة باللمس.
 * - "تقليل الحركة" في النظام => بيقف ويتحول لصف عادي يتسحب بالإصبع.
 */
const MARQUEE_CSS = `
.pp-track { animation: pp-scroll var(--pp-duration, 50s) linear infinite; will-change: transform; }
.pp-track[data-dir="rtl"] { animation-name: pp-scroll-rtl; }
@keyframes pp-scroll     { to { transform: translate3d(-50%, 0, 0); } }
@keyframes pp-scroll-rtl { to { transform: translate3d(50%, 0, 0); } }

@media (hover: hover) {
  .pp-viewport:hover .pp-track { animation-play-state: paused; }
}
.pp-viewport:has(:focus-visible) .pp-track,
.pp-viewport[data-touching="true"] .pp-track { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .pp-track { animation: none; }
  .pp-viewport { overflow-x: auto; }
  .pp-dup { display: none; }
}
`;

function SectionSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-[17rem] shrink-0 animate-pulse rounded-[1.75rem] bg-ink/5 p-1.5 sm:w-[19rem]"
        >
          <div className="aspect-[5/4] w-full rounded-t-[1.4rem] rounded-b-xl bg-ink/10" />
          <div className="space-y-3 px-3 pb-3 pt-4">
            <div className="h-1 w-8 rounded-full bg-ink/10" />
            <div className="h-5 w-2/3 rounded-full bg-ink/10" />
            <div className="h-4 w-full rounded-full bg-ink/10" />
            <div className="h-10 w-1/2 rounded-full bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* زر "شوف المنيو": نفس الشكل على الديسكتوب والموبايل، الفرق في الـ layout بس */
const menuBtnBase =
  "group/btn items-center justify-center gap-2 rounded-full bg-ink text-sm font-bold text-white shadow-card transition-colors duration-300 hover:bg-secondary";

export default function PopularProducts() {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";
  const [products, setProducts] = useState(null);
  const viewportRef = useRef(null);
  const touchTimer = useRef(null);

  useEffect(() => {
    productService
      .getPopular()
      .then(setProducts)
      .catch(() => setProducts([]));
    return () => clearTimeout(touchTimer.current);
  }, []);

  /* نكرر المنتجات لحد ما النسخة الواحدة تملا الشاشة */
  const items = useMemo(() => {
    if (!products?.length) return [];
    const out = [];
    while (out.length < MIN_PER_COPY) out.push(...products);
    return out;
  }, [products]);

  const setTouching = (value) => {
    if (viewportRef.current) viewportRef.current.dataset.touching = String(value);
  };
  const onTouchStart = () => {
    clearTimeout(touchTimer.current);
    setTouching(true);
  };
  const onTouchEnd = () => {
    clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouching(false), 1200);
  };

  if (products && products.length === 0) return null;

  const renderCopy = (dup) => (
    <ul
      aria-hidden={dup || undefined}
      /* inert بيمنع الـ Tab والقارئات من النسخة المكررة (بالـ ref عشان يشتغل مع أي نسخة React) */
      ref={dup ? (el) => el?.setAttribute("inert", "") : undefined}
      className={`flex shrink-0 gap-5 pe-5 ${dup ? "pp-dup" : ""}`}
    >
      {items.map((p, i) => (
        <li key={`${p.id}-${i}`} className="flex w-[17rem] shrink-0 sm:w-[19rem]">
          {/* الترتيب حسب مكان المنتج في القائمة الأصلية (مش في النسخة المكررة) */}
          <ProductCardPopular product={p} rank={(i % products.length) + 1} />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-cream via-cream-100 to-cream py-16 sm:py-24">
      <style>{MARQUEE_CSS}</style>

      {/* لمسات زخرفية هادئة: توهج ذهبي + توهج أحمر خفيف */}
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 top-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-32 bottom-10 -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-secondary rtl:tracking-normal">
              <Flame className="h-4 w-4 fill-gold text-gold" strokeWidth={2.25} />
              {isRtl ? "الأكثر مبيعًا" : "BEST SELLERS"}
              <span aria-hidden className="h-px w-10 bg-gold" />
            </p>
            <h2 className="mt-2 max-w-xl text-balance font-display text-4xl font-extrabold leading-[1.1] text-ink sm:text-5xl">
              {isRtl ? "البرجر اللي عملائنا بيرجعوا عشانه" : "The burgers everyone comes back for"}
            </h2>
            <span
              aria-hidden
              className="mt-4 block h-1.5 w-16 rounded-full bg-gradient-to-r from-gold to-secondary rtl:bg-gradient-to-l"
            />
          </div>

          <Link to="/menu" className={`hidden shrink-0 px-6 py-3 sm:flex ${menuBtnBase}`}>
            {isRtl ? "شوف المنيو كامل" : "View full menu"}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-ink">
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </span>
          </Link>
        </div>
      </div>

      {/* الشريط خارج الـ container عشان يمتد لحافة الشاشة ويتلاشى عندها. py-8 عشان ظل الكارت ورفعة الهوفر ما يتقصوش */}
      {!products ? (
        <SectionSkeleton />
      ) : (
        <div
          ref={viewportRef}
          dir={isRtl ? "rtl" : "ltr"}
          data-touching="false"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          className="pp-viewport overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          <div
            className="pp-track flex w-max"
            data-dir={isRtl ? "rtl" : "ltr"}
            style={{ "--pp-duration": `${items.length * SECONDS_PER_CARD}s` }}
          >
            {renderCopy(false)}
            {renderCopy(true)}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:hidden">
        <Link to="/menu" className={`mt-2 flex px-4 py-3.5 ${menuBtnBase}`}>
          {isRtl ? "شوف المنيو كامل" : "View full menu"}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-ink">
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
          </span>
        </Link>
      </div>
    </section>
  );
}