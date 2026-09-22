import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, Home, ShoppingCart, Check, PackageSearch } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import Price from "../ui/Price";
import Button from "../ui/Button";
import QuantitySelector from "../ui/QuantitySelector";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import ProductCard from "./ProductCard";
import { ProductDetailsSkeleton } from "../ui/Skeleton";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='800' viewBox='0 0 640 800'%3E%3Crect width='640' height='800' fill='%230A0A0A'/%3E%3Ccircle cx='320' cy='360' r='180' fill='%23181C10'/%3E%3Ctext x='50%25' y='360' font-family='sans-serif' font-size='40' fill='%23F5B400' font-weight='bold' letter-spacing='4' text-anchor='middle'%3EPEAK%3C/text%3E%3Ctext x='50%25' y='410' font-family='sans-serif' font-size='44' fill='%23050505' font-weight='bold' font-style='italic' letter-spacing='4' text-anchor='middle' style='paint-order:stroke;stroke:%23F5B400;stroke-width:2px'%3EBURGER%3C/text%3E%3Ctext x='50%25' y='470' font-family='sans-serif' font-size='16' fill='%23A1A1A1' text-anchor='middle'%3EPeak Burger%3C/text%3E%3C/svg%3E";

function SectionLabel({ children }) {
  const { lang } = useLanguage();
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-text-muted rtl:tracking-normal">
        {children}
      </h3>
    </div>
  );
}

export default function ProductDetails() {
  const { id: paramId } = useParams();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([productRows, categoryRows]) => {
        if (!cancelled) {
          setProducts(productRows);
          setCategories(categoryRows);
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const product = useMemo(() => {
    if (isLoading) return null;
    return (
      products.find((p) => p.slug === paramId) ??
      products.find((p) => p.id === Number(paramId)) ??
      null
    );
  }, [products, paramId, isLoading]);

  const category = useMemo(() => {
    if (!product) return null;
    return categories.find((c) => c.id === product.category) ?? null;
  }, [categories, product]);

  const extras = product?.addons ?? product?.extras;

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] ?? null);
    setSelectedExtras([]);
    setQuantity(1);
    document.title = `${t(product.name)} — Peak Burger`;
  }, [product, t, lang]);

  useEffect(() => {
    setFav(product ? isFavorite(product.id) : false);
  }, [product, isFavorite]);

  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const sameCat = others
      .filter((p) => p.category === product.category)
      .sort((a, b) => Number(b.popular) - Number(a.popular));
    const pool = sameCat.length >= 4 ? sameCat : [...sameCat, ...others.filter((p) => !sameCat.includes(p))];
    return pool.slice(0, 4);
  }, [product, products]);

  if (isLoading && !loadError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (loadError && !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title={lang === "ar" ? "تعذّر تحميل المنتج" : "Couldn't load this item"}
          description={
            lang === "ar"
              ? "حصلت مشكلة في جلب البيانات. جرّب كمان مرة."
              : "Something went wrong while fetching the product. Please try again."
          }
          retryLabel={lang === "ar" ? "إعادة المحاولة" : "Try again"}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title={lang === "ar" ? "الصنف غير موجود" : "Product not found"}
          description={lang === "ar" ? "الصنف اللي بتدور عليه مش متاح." : "We couldn't find the item you're looking for."}
          actionLabel={lang === "ar" ? "الرجوع للمنيو" : "Back to menu"}
          actionTo="/menu"
        />
      </div>
    );
  }

  const unitPrice = selectedSize ? selectedSize.price : product.price ?? 0;
  const extrasSum = (extras ?? []).reduce((sum, extra) => {
    return selectedExtras.includes(extra.id) ? sum + Number(extra.price ?? 0) : sum;
  }, 0);
  const total = unitPrice * quantity + extrasSum;

  const handleToggleExtra = (id) => {
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleToggleFavorite = async () => {
    if (!product) return;
    const added = await toggleFavorite(product.id).catch(() => null);
    if (added !== null) setFav(added);
  };

  const handleAddToCart = () => {
    addItem(product, { size: selectedSize, sauce: null, quantity });
    toastSuccess(lang === "ar" ? "تمت الإضافة إلى السلة!" : "Added to cart!");
  };

  return (
    <div className="relative overflow-x-clip bg-[#050505]">
      <div className="pointer-events-none absolute inset-0 bg-grain bg-[length:4px_4px] opacity-[0.05]" />

      <header className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #F5B400 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -start-32 top-16 h-72 w-72 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #D71920 0%, transparent 70%)" }} />

        <p className="relative text-[11px] font-extrabold uppercase tracking-[0.3em] text-primary rtl:tracking-normal">
          {lang === "ar" ? "قائمة البيك" : "Peak Burger Menu"}
        </p>

        <nav aria-label="Breadcrumb" className="relative mt-3 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
            <Home className="h-3.5 w-3.5" />
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50 rtl:rotate-180" />
          <Link to="/menu" className="transition-colors hover:text-primary">
            {lang === "ar" ? "المنيو" : "Menu"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50 rtl:rotate-180" />
          <span className="line-clamp-1 max-w-[16rem] text-text-soft">{t(product.name)}</span>
        </nav>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0A0A0A] sm:aspect-square lg:aspect-[4/5]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle, rgba(245,180,0,0.22) 0%, rgba(245,180,0,0.05) 55%, transparent 72%)" }}
              />
              <img
                src={product.image || FALLBACK_IMAGE}
                alt={t(product.name)}
                loading="eager"
                className="relative h-full w-full object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-[#050505]/30" />

              <div className="absolute start-5 top-5 z-10 flex flex-col items-start gap-2">
                {product.isNew && (
                  <span className="animate-popIn rounded-full bg-secondary px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-card">
                    {lang === "ar" ? "جديد" : "New"}
                  </span>
                )}
                {product.popular && (
                  <span className="animate-popIn rounded-full bg-primary px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#050505] shadow-pop">
                    {lang === "ar" ? "الأكثر طلباً" : "Best Seller"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleToggleFavorite}
                aria-pressed={fav}
                aria-label={fav ? (lang === "ar" ? "إزالة من المفضلة" : "Remove from favorites") : (lang === "ar" ? "أضف للمفضلة" : "Add to favorites")}
                className="absolute end-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-[#050505]/70 text-text-muted backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-90"
              >
                <Heart
                  key={String(fav)}
                  className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    fav ? "animate-badgeBounce fill-secondary text-secondary" : "text-text-muted"
                  )}
                />
              </button>
            </div>

            {category && (
              <Link
                to={`/menu?category=${category.id}`}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-soft transition-colors hover:border-primary/50 hover:text-primary"
              >
                {t(category.name)}
                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            )}
          </div>

          <div className="lg:py-2">
            <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-[#FFFFFF] sm:text-5xl">
              {t(product.name)}
            </h1>

            {t(product.description) && (
              <p className="mt-4 max-w-xl leading-relaxed text-text-muted">{t(product.description)}</p>
            )}

            {product.ingredients?.[lang]?.length > 0 && (
              <div className="mt-6">
                <SectionLabel>{lang === "ar" ? "المكونات" : "Ingredients"}</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients[lang].map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-white/[0.08] bg-[#111111] px-3 py-1.5 text-xs font-medium text-text-soft"
                    >
                      {t(ing)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-white/[0.07] pt-8">
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <SectionLabel>{lang === "ar" ? "اختر الحجم" : "Choose your size"}</SectionLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300",
                          selectedSize?.id === size.id
                            ? "border-primary bg-primary text-[#050505] shadow-pop"
                            : "border-white/[0.08] bg-[#111111] text-text-soft hover:border-primary/50 hover:text-text"
                        )}
                      >
                        {t(size.label)}
                        <span className={cn("ms-2 font-semibold tabular-nums", selectedSize?.id === size.id ? "text-[#050505]/70" : "text-primary")}>
                          <Price value={size.price} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {extras?.length > 0 && (
                <div className="mb-8">
                  <SectionLabel>{lang === "ar" ? "الإضافات" : "Add-ons"}</SectionLabel>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {extras.map((extra) => {
                      const active = selectedExtras.includes(extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          role="checkbox"
                          aria-checked={active}
                          onClick={() => handleToggleExtra(extra.id)}
                          className={cn(
                            "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-all duration-300",
                            active
                              ? "border-primary/60 bg-[#181818] text-text"
                              : "border-white/[0.07] bg-[#111111] text-text-soft hover:border-white/20"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200",
                                active ? "border-primary bg-primary text-[#050505]" : "border-white/20"
                              )}
                            >
                              {active && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <span className="text-sm font-semibold">{t(extra.name)}</span>
                          </span>
                          <Price value={extra.price} className={cn("text-sm", active ? "text-primary" : "text-text-muted")} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-5">
                <QuantitySelector
                  value={quantity}
                  onIncrease={() => setQuantity((q) => q + 1)}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                />
                <div className="text-end">
                  <Price value={total} className="text-3xl text-primary" />
                  {extrasSum > 0 && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {lang === "ar" ? `تشمل إضافات +${extrasSum}` : `includes add-ons +${extrasSum}`}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                variant="gold"
                size="lg"
                className="mt-4 h-[54px] w-full text-base"
              >
                <ShoppingCart className="h-5 w-5" />
                {lang === "ar" ? "أضف إلى السلة" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-white/[0.07] py-16 lg:py-20">
            <div className="mb-2 flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-text-muted rtl:tracking-normal">
                {lang === "ar" ? "قد يعجبك أيضاً" : "You may also like"}
              </p>
            </div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#FFFFFF] sm:text-3xl">
              {lang === "ar" ? "كمّل وجبتك" : "Complete Your Meal"}
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} variant="menu" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}