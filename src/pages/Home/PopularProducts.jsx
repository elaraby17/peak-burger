import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ProductCardPopular from "../../components/product/ProductCardPopular";
import { useInView } from "../../hooks/useInView";

const support = {
  en: "Handcrafted favorites, smashed fresh and made to disappear fast.",
  ar: "اختياراتنا المفضلة، بتتعمل طازة وبتختفي أسرع مما تتوقع.",
};

const DECK_CSS = `
@keyframes deck-in {
    from {
        opacity: 0;
        transform: translateY(14px) scale(0.985);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
`;

function SectionSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-x-16 lg:px-8">
      <div>
        <div className="h-4 w-40 animate-pulse rounded-full bg-[#222222]" />

        <div className="mt-4 h-8 w-3/4 animate-pulse rounded-full bg-[#222222]" />

        <div className="mt-3 h-8 w-1/2 animate-pulse rounded-full bg-[#222222]" />

        <div className="mt-5 h-4 w-2/3 animate-pulse rounded-full bg-[#181818]" />

        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1">
            <div className="h-4 w-16 animate-pulse rounded-full bg-[#181818]" />

            <div className="mt-2 h-1 w-full animate-pulse rounded-full bg-[#181818]" />
          </div>

          <div className="flex gap-2">
            <div className="h-11 w-11 animate-pulse rounded-full bg-[#181818]" />
            <div className="h-11 w-11 animate-pulse rounded-full bg-[#181818]" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[26rem] pb-28 sm:max-w-[30rem]">
        <div className="relative rounded-[1.75rem] border border-white/[0.08] bg-[#111111] p-1.5">
          <div className="aspect-[5/4] w-full animate-pulse rounded-t-[1.4rem] rounded-b-xl bg-[#181818]" />

          <div className="space-y-3 px-5 pb-4 pt-4">
            <div className="h-6 w-2/3 animate-pulse rounded-full bg-[#222222]" />

            <div className="h-4 w-full animate-pulse rounded-full bg-[#181818]" />

            <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#181818]" />

            <div className="flex items-end justify-between pt-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-[#222222]" />

              <div className="h-10 w-24 animate-pulse rounded-full bg-[#222222]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LEVEL_STYLE = {
  0: {
    transform: "translateY(0) scale(1)",
    opacity: 1,
    zIndex: 30,
  },

  1: {
    transform: "translateY(46px) scale(0.94)",
    opacity: 0.75,
    zIndex: 20,
  },

  2: {
    transform: "translateY(92px) scale(0.88)",
    opacity: 0.45,
    zIndex: 10,
  },
};

const SWIPE_THRESHOLD = 48;

export default function PopularProducts() {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";

  const { ref } = useInView(0.1);

  const [products, setProducts] = useState(null);
  const [index, setIndex] = useState(0);

  const touchX = useRef(null);

  /*
   * Load popular products
   */
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await productService.getPopular();

        console.log(
          "[PopularProducts] API result:",
          data
        );

        if (cancelled) {
          return;
        }

        if (!Array.isArray(data)) {
          console.error(
            "[PopularProducts] Expected array but received:",
            data
          );

          setProducts([]);

          return;
        }

        setProducts(data);
        setIndex(0);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "[PopularProducts] Failed to load:",
          error
        );

        setProducts([]);
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const n = products?.length ?? 0;

  /*
   * Keyboard navigation
   */
  useEffect(() => {
    if (!n) {
      return;
    }

    const isEditable = (element) =>
      element &&
      typeof element.closest === "function" &&
      element.closest(
        "input, textarea, select, [contenteditable='true']"
      );

    const onKeyDown = (event) => {
      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {
        return;
      }

      if (isEditable(event.target)) {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowRight") {
        setIndex(
          (current) =>
            (current + 1) % n
        );
      } else {
        setIndex(
          (current) =>
            (current - 1 + n) % n
        );
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [n]);

  /*
   * Next
   */
  const next = () => {
    if (!n) {
      return;
    }

    setIndex(
      (current) =>
        (current + 1) % n
    );
  };

  /*
   * Previous
   */
  const prev = () => {
    if (!n) {
      return;
    }

    setIndex(
      (current) =>
        (current - 1 + n) % n
    );
  };

  /*
   * Go to specific product
   */
  const goTo = (targetIndex) => {
    if (!n) {
      return;
    }

    setIndex(
      ((targetIndex % n) + n) % n
    );
  };

  /*
   * Touch start
   */
  const onTouchStart = (event) => {
    touchX.current =
      event.touches[0]?.clientX ?? null;
  };

  /*
   * Touch end
   */
  const onTouchEnd = (event) => {
    const start = touchX.current;

    touchX.current = null;

    if (start == null) {
      return;
    }

    const end =
      event.changedTouches[0]?.clientX;

    if (end == null) {
      return;
    }

    const dx = end - start;

    if (Math.abs(dx) < SWIPE_THRESHOLD) {
      return;
    }

    if (dx < 0) {
      next();
    } else {
      prev();
    }
  };

  /*
   * API returned an empty array.
   */
  if (products && products.length === 0) {
    return null;
  }

  const current = products?.[index];

  const bgLayers = Math.min(
    2,
    Math.max(0, n - 1)
  );

  const pad = (value) =>
    String(value).padStart(2, "0");

  /*
   * Render deck layer
   */
  const renderLayer = (level) => {
    if (!products || !n) {
      return null;
    }

    const productIndex =
      (index + level) % n;

    const product =
      products[productIndex];

    if (!product) {
      return null;
    }

    const style =
      LEVEL_STYLE[level];

    /*
     * Active card
     */
    if (level === 0) {
      return (
        <div
          key={`active-${product.id}`}
          style={style}
          className="relative inset-x-0 top-0 transition-[transform,opacity] duration-500 ease-out"
        >
          <div
            key={`in-${product.id}`}
            style={{
              animation:
                "deck-in 0.5s ease-out both",
            }}
          >
            <ProductCardPopular
              product={product}
              rank={
                productIndex + 1
              }
            />
          </div>
        </div>
      );
    }

    /*
     * Don't render extra layers
     */
    if (level > bgLayers) {
      return null;
    }

    const productName = isRtl
      ? product.name?.ar ??
      product.name?.en ??
      ""
      : product.name?.en ??
      product.name?.ar ??
      "";

    return (
      <div
        key={`background-${product.id}`}
        style={style}
        className="absolute inset-x-0 top-0 transition-[transform,opacity] duration-500 ease-out"
      >
        <button
          type="button"
          onClick={() =>
            goTo(productIndex)
          }
          aria-label={
            isRtl
              ? `عرض: ${productName}`
              : `View: ${productName}`
          }
          className="block w-full rounded-[1.75rem] border border-white/[0.07] bg-[#111111] p-1.5 text-start shadow-[0_14px_32px_-18px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B400]"
        >
          {product.image && (
            <img
              src={product.image}
              alt=""
              loading="lazy"
              draggable={false}
              className="aspect-[5/4] w-full rounded-t-[1.4rem] rounded-b-xl bg-[#181818] object-cover"
            />
          )}

          <p className="truncate px-3 pb-2 pt-3 font-display text-sm font-bold text-white">
            {productName}
          </p>
        </button>
      </div>
    );
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#050505] py-16 sm:py-24">
      <style>
        {DECK_CSS}
      </style>

      {/* Yellow glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 top-0 -z-10 h-96 w-96 rounded-full bg-[#F5B400]/[0.06] blur-3xl"
      />

      {/* Red glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -end-32 bottom-10 -z-10 h-80 w-80 rounded-full bg-[#D71920]/[0.04] blur-3xl"
      />

      {!products ? (
        <SectionSkeleton />
      ) : (
        <div
          ref={ref}
          className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-x-16 lg:px-8"
        >
          {/* LEFT CONTENT */}

          <div className="max-w-xl lg:col-start-1 lg:row-start-1">
            <p className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm rtl:tracking-normal">
              <span
                aria-hidden
                dir="ltr"
                className="font-display text-sm tabular-nums tracking-normal"
              >
                01
              </span>

              <span
                aria-hidden
                className="h-px w-8 bg-[#F5B400]/50"
              />

              <Flame
                className="h-4 w-4 fill-[#F5B400] text-[#F5B400]"
                aria-hidden
              />

              {isRtl
                ? "الأكثر مبيعًا"
                : "Best Sellers"}
            </p>

            <h2 className="mt-3 text-balance font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
              {isRtl
                ? "البرجر اللي الناس بترجع عشانه"
                : "The burgers everyone comes back for"}
            </h2>

            <span
              aria-hidden
              className="mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-[#F5B400] to-[#F5B400]/10 rtl:bg-gradient-to-l"
            />

            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#A1A1A1] sm:text-lg">
              {isRtl
                ? support.ar
                : support.en}
            </p>

            <Link
              to="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#D4D4D4] transition-colors duration-300 hover:text-[#F5B400]"
            >
              {isRtl
                ? "شوف المنيو كامل"
                : "View full menu"}

              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {/* PRODUCT DECK */}

          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative mx-auto w-full max-w-[26rem] pb-28 sm:max-w-[30rem] lg:col-start-2 lg:row-start-1 lg:row-span-2"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[#F5B400]/[0.05] blur-3xl"
            />

            <p
              className="sr-only"
              aria-live="polite"
            >
              {isRtl
                ? `السلايدر: ${current?.name?.ar ??
                current?.name?.en ??
                ""
                }`
                : `Slider active product: ${current?.name?.en ??
                current?.name?.ar ??
                ""
                }`}
            </p>

            {Array.from({
              length: 3,
            }).map(
              (_, level) =>
                renderLayer(level)
            )}
          </div>

          {/* CONTROLS */}

          <div className="mt-2 flex items-center gap-6 lg:col-start-1 lg:row-start-2">
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold tabular-nums tracking-widest text-[#D4D4D4]">
                <span dir="ltr">
                  {pad(index + 1)} /{" "}
                  {pad(n)}
                </span>
              </p>

              <div
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={n}
                aria-valuenow={
                  index + 1
                }
                aria-label={
                  isRtl
                    ? "تقدم السلايدر"
                    : "Slider progress"
                }
                className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"
              >
                <div
                  className="h-full rounded-full bg-[#F5B400] transition-[width] duration-500 ease-out"
                  style={{
                    width: `${((index + 1) /
                        n) *
                      100
                      }%`,
                  }}
                />
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label={
                  isRtl
                    ? "المنتج السابق"
                    : "Previous product"
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-[#111111] text-[#D4D4D4] transition-all duration-300 hover:border-[#F5B400] hover:bg-[#181818] hover:text-[#F5B400] hover:shadow-[0_0_20px_rgba(245,180,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label={
                  isRtl
                    ? "المنتج التالي"
                    : "Next product"
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-[#111111] text-[#D4D4D4] transition-all duration-300 hover:border-[#F5B400] hover:bg-[#181818] hover:text-[#F5B400] hover:shadow-[0_0_20px_rgba(245,180,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}