import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ProductCardPopular from "../../components/product/ProductCardPopular";

/* سرعة الحركة: الرقم الأكبر = أبطأ (بالمللي ثانية لكل كارت) */
const SPEED = 5000;
/* أقل عدد سلايدات عشان الـ loop يشتغل من غير قفزات */
const MIN_SLIDES = 10;

function SectionSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-[85%] shrink-0 animate-pulse rounded-[1.75rem] bg-ink/5 sm:w-[46%] lg:w-[31%] xl:w-[24%]"
        >
          <div className="aspect-[4/3] w-full rounded-t-[1.75rem] bg-ink/10" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 rounded-full bg-ink/10" />
            <div className="h-4 w-full rounded-full bg-ink/10" />
            <div className="h-8 w-1/3 rounded-full bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PopularProducts() {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";
  const [products, setProducts] = useState(null);

  useEffect(() => {
    productService.getPopular().then(setProducts);
  }, []);

  /* لو المنتجات قليلة نكررها عشان اللوب يفضل مستمر */
  const slides = useMemo(() => {
    if (!products?.length) return [];
    const out = [];
    while (out.length < MIN_SLIDES) out.push(...products);
    return out;
  }, [products]);

  /* احترام إعداد "تقليل الحركة" في جهاز المستخدم */
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <section className="relative overflow-hidden bg-cream-100/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
              {isRtl ? "الأكثر طلبًا" : "Fan Favorites"}
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {isRtl ? "الأصناف الشعبية" : "Popular Products"}
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-cream sm:flex"
          >
            {isRtl ? "شوف المنيو كامل" : "View full menu"}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {!products ? (
          <SectionSkeleton />
        ) : (
          <div
            /* تلاشي ناعم على الجوانب بدل القص الحاد */
            className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          >
            <Swiper
              key={lang} /* يعيد بناء السلايدر لما اللغة تتغير (RTL/LTR) */
              dir={isRtl ? "rtl" : "ltr"}
              modules={[Autoplay, FreeMode]}
              loop
              freeMode
              grabCursor
              speed={SPEED}
              spaceBetween={20}
              slidesPerView={1.15}
              breakpoints={{
                640: { slidesPerView: 2.1 },
                1024: { slidesPerView: 3.1 },
                1280: { slidesPerView: 4 },
              }}
              autoplay={
                reduceMotion
                  ? false
                  : {
                    delay: 0, // من غير أي وقفة بين الحركات
                    disableOnInteraction: false, // يكمل بعد السحب باليد
                    pauseOnMouseEnter: false, // ما يوقفش لما الماوس يعدي عليه
                  }
              }
              className="!py-2 [&_.swiper-wrapper]:!ease-linear"
            >
              {slides.map((p, i) => (
                <SwiperSlide key={`${p.id}-${i}`} className="!h-auto">
                  <ProductCardPopular product={p} variant="featured" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <Link
          to="/menu"
          className="mt-8 flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink sm:hidden"
        >
          {isRtl ? "شوف المنيو كامل" : "View full menu"}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}