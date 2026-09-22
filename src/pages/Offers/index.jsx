import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Flame, Tag, Sparkles } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { cn } from "../../utils/cn";
import heroOffer from "../../assets/hero/classic-combo.jpg";

/*
 * NAVBAR OFFSET
 * ----------------------------------------------------------------
 * Menu.jsx pulls its hero up with `-mt-20`, i.e. it assumes a fixed,
 * transparent-over-hero navbar that is 5rem / 80px tall (Tailwind's
 * `20` spacing step). The sticky filter bar below re-uses that same
 * number as its `top` offset so it docks directly under the navbar
 * instead of sliding beneath it. If your navbar's real height is
 * different, update NAVBAR_H (both the class name and the constant
 * are just for clarity — only the Tailwind classes actually matter).
 * ----------------------------------------------------------------
 */
const NAVBAR_OFFSET_CLASS = "top-20"; // = navbar height, keep in sync with Navbar.jsx

const pad = (n) => String(n).padStart(2, "0");

/*
 * TEMPORARY DATA SOURCE
 * ----------------------------------------------------------------
 * There's no /api/offers yet, so this page borrows productService.getAll()
 * and fabricates a discount client-side, deterministically per product id
 * (not random) so the layout looks and feels real while the API is built.
 *
 * Swap this out later:
 *   1. Replace `toOffer` + the productService/categoryService calls below
 *      with an `offerService.getAll()` that returns real offer rows
 *      (discountPercent, discountedPrice, expiresAt, badge, category, ...).
 *   2. Nothing else on this page needs to change — OfferCard and the
 *      surrounding layout already expect that shape.
 * ----------------------------------------------------------------
 */
const DISCOUNT_STEPS = [15, 20, 25, 30];
function toOffer(product) {
    const discountPercent = DISCOUNT_STEPS[product.id % DISCOUNT_STEPS.length];
    const originalPrice = product.price;
    const discountedPrice =
        originalPrice !== null ? Math.round(originalPrice * (1 - discountPercent / 100)) : null;
    return {
        id: product.id,
        title: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        badge: null,
        discountPercent,
        originalPrice,
        discountedPrice,
        savings: originalPrice !== null && discountedPrice !== null ? originalPrice - discountedPrice : null,
    };
}

/* ---------- shared heading, identical to Menu.jsx ---------- */
function SectionHeading({ index, eyebrow, title, support }) {
    return (
        <div className="relative mb-8 sm:mb-10">
            {index && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute -top-8 start-1 select-none font-display text-[84px] font-extrabold leading-none text-white/[0.03] sm:-top-10 sm:text-[120px] lg:-top-12 lg:text-[150px]"
                >
                    {index}
                </span>
            )}
            <div className="relative flex items-end justify-between gap-6 border-b border-white/[0.06] pb-4 sm:pb-5">
                <div className="max-w-2xl">
                    <p className="flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal">
                        <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
                        {eyebrow}
                    </p>
                    {title && (
                        <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                            {title}
                        </h2>
                    )}
                    {support && <p className="mt-2 text-sm text-[#A1A1A1] sm:text-base">{support}</p>}
                </div>
                {index && (
                    <span aria-hidden className="hidden shrink-0 pb-1 font-display text-sm font-bold tracking-[0.25em] text-white/20 sm:block">
                        {index}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ---------- offer card ---------- */
function OfferCard({ offer, lang, t, featured }) {
    return (
        <Link
            to={`/offers/${offer.id}`}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0D0D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5B400]/30 hover:shadow-[0_20px_45px_-25px_rgba(245,180,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B400]/60",
                featured && "sm:col-span-2 sm:flex-row"
            )}
        >
            <div className={cn("relative aspect-[4/3] overflow-hidden", featured && "sm:aspect-auto sm:w-2/5")}>
                <img
                    src={offer.image}
                    alt={t(offer.title)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

                {typeof offer.discountPercent === "number" && (
                    <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#D71920] px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-white shadow-lg shadow-black/30">
                        <Flame className="h-3.5 w-3.5" aria-hidden />
                        {lang === "ar" ? `خصم ${offer.discountPercent}٪` : `${offer.discountPercent}% Off`}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                    {offer.badge && (
                        <p className="mb-2 flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-[#F5B400] rtl:tracking-normal">
                            <Tag className="h-3 w-3" aria-hidden />
                            {t(offer.badge)}
                        </p>
                    )}
                    <h3 className="font-display text-lg font-extrabold uppercase leading-snug tracking-tight text-white sm:text-xl">
                        {t(offer.title)}
                    </h3>
                    {offer.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-[#A1A1A1]">{t(offer.description)}</p>
                    )}
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            {offer.originalPrice !== null && (
                                <span className="text-sm text-[#6B6B6B] line-through">
                                    {offer.originalPrice} {lang === "ar" ? "جنيه" : "EGP"}
                                </span>
                            )}
                            <span className="font-display text-xl font-extrabold text-white sm:text-2xl">
                                {offer.discountedPrice} {lang === "ar" ? "جنيه" : "EGP"}
                            </span>
                        </div>
                        {offer.savings ? (
                            <p className="mt-0.5 text-xs font-semibold text-[#F5B400]">
                                {lang === "ar" ? `توفير ${offer.savings} جنيه` : `You save ${offer.savings} EGP`}
                            </p>
                        ) : null}
                    </div>
                    <span
                        aria-hidden
                        className="shrink-0 rounded-full bg-[#F5B400] px-5 py-2.5 font-display text-xs font-extrabold uppercase tracking-[0.15em] text-[#050505] transition-transform duration-200 group-hover:scale-[1.03] rtl:tracking-normal"
                    >
                        {lang === "ar" ? "التفاصيل" : "View Offer"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

/* ---------- page ---------- */
export default function Offers() {
    const { t, lang } = useLanguage();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("category") || "all";

    const [allOffers, setAllOffers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const loadOffers = () => {
        setIsLoading(true);
        setLoadError(false);
        productService
            .getAll()
            .then((products) => setAllOffers(products.map(toOffer)))
            .catch((err) => {
                console.error("Failed to load products for offers", err);
                setLoadError(true);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        document.title = "Offers — Peak Burger";
        loadOffers();
        categoryService
            .getAll()
            .then(setCategories)
            .catch((err) => console.error("Failed to load categories from API", err));
    }, []);

    const setCategory = (id) => {
        const next = new URLSearchParams(searchParams);
        if (id === "all") next.delete("category");
        else next.set("category", id);
        setSearchParams(next);
    };

    const filtered = useMemo(() => {
        if (activeCategory === "all") return allOffers;
        return allOffers.filter((o) => o.category === activeCategory);
    }, [activeCategory, allOffers]);

    const activeCategoryMeta = categories.find((c) => c.id === activeCategory) || null;
    const topDiscount = useMemo(
        () => allOffers.reduce((max, o) => Math.max(max, o.discountPercent ?? 0), 0),
        [allOffers]
    );

    return (
        <div className="bg-[#050505] text-white">
            {/* ---------- HERO ---------- */}
            {/* -mt-20 tucks this section behind the fixed/transparent navbar, matching Menu.jsx */}
            <section className="relative -mt-20 overflow-hidden border-b border-white/[0.06] bg-[#050505]">
                <div aria-hidden className="pointer-events-none absolute -top-40 end-[-12%] h-[420px] w-[420px] rounded-full bg-[#D71920]/[0.06] blur-[130px]" />
                <div aria-hidden className="pointer-events-none absolute -bottom-32 start-[-10%] h-[360px] w-[360px] rounded-full bg-[#F5B400]/[0.04] blur-[120px]" />

                <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 overflow-hidden sm:block lg:w-[46%]">
                    <img src={heroOffer} alt="" className="h-full w-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-[#050505]/25" />
                    <div className="absolute inset-0 [background-image:linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.55)_34%,rgba(5,5,5,0.05)_60%,rgba(5,5,5,0.9)_100%)]" />
                    <div className="absolute inset-0 [background-image:linear-gradient(180deg,rgba(5,5,5,0.7)_0%,rgba(5,5,5,0)_40%,rgba(5,5,5,0.8)_100%)]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
                    <div className="max-w-3xl text-center sm:text-start">
                        <p className="flex items-center justify-center gap-3 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal sm:justify-start">
                            <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
                            {lang === "ar" ? "عروضنا" : "Our Offers"}
                            <span aria-hidden className="hidden h-px w-8 bg-[#F5B400]/60 sm:block" />
                        </p>
                        <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                            {lang === "ar" ? "وفر أكتر، كل مرة" : "Save More, Every Time"}
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-base text-[#A1A1A1] sm:mx-0 sm:text-lg">
                            {lang === "ar"
                                ? "كومبوهات وخصومات لفترة محدودة، جددها بنشوفك تاني."
                                : "Limited-time combos and discounts, refreshed often."}
                        </p>

                        {topDiscount > 0 && (
                            <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[#F5B400]/25 bg-[#F5B400]/[0.08] px-4 py-2 text-xs font-bold text-[#F5B400] sm:mx-0">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                                {lang === "ar"
                                    ? `خصومات تصل لـ ${topDiscount}٪ على أصناف مختارة`
                                    : `Discounts up to ${topDiscount}% on selected items`}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ---------- CATEGORY NAV (sticky, docks under the navbar) ---------- */}
            <nav
                aria-label={lang === "ar" ? "تصنيفات العروض" : "Offer categories"}
                className={cn(
                    "sticky z-20 border-b border-white/[0.06] bg-[#0A0A0A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/80",
                    NAVBAR_OFFSET_CLASS
                )}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ul className="scrollbar-none -mx-4 flex items-end gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:gap-10">
                        {[{ id: "all", name: { en: "All", ar: "الكل" } }, ...categories].map((cat, i) => {
                            const active = activeCategory === cat.id;
                            return (
                                <li key={cat.id} className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "group relative flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 rtl:tracking-normal lg:text-[13px]",
                                            active ? "text-white" : "text-[#6B6B6B] hover:text-[#D4D4D4]"
                                        )}
                                    >
                                        <span aria-hidden className="font-display text-[10px] text-[#F5B400]/70">
                                            {pad(i + 1)}
                                        </span>
                                        {t(cat.name)}
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#F5B400] transition-transform duration-300 ease-out",
                                                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            )}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* ---------- CONTENT ---------- */}
            <div className="relative overflow-hidden">
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-44 start-[-14%] h-[480px] w-[480px] rounded-full bg-[#D71920]/[0.035] blur-[140px]"
                />
                <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                    {isLoading ? (
                        <ProductGridSkeleton count={6} />
                    ) : loadError ? (
                        <div className="flex justify-center py-10">
                            <ErrorState
                                title={lang === "ar" ? "معرفناش نجيب العروض" : "Couldn't load the offers"}
                                description={
                                    lang === "ar" ? "تأكد إن السيرفر شغال وحاول تاني." : "Make sure the API is running and try again."
                                }
                                onRetry={loadOffers}
                            />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex justify-center py-10">
                            <EmptyState
                                icon={Tag}
                                title={lang === "ar" ? "مفيش عروض دلوقتي" : "No offers right now"}
                                actionLabel={lang === "ar" ? "شوف المنيو" : "Browse Menu"}
                                onAction={() => setCategory("all")}
                            />
                        </div>
                    ) : (
                        <div>
                            <SectionHeading
                                index={activeCategoryMeta ? pad(categories.indexOf(activeCategoryMeta) + 1) : undefined}
                                eyebrow={lang === "ar" ? "العروض الحالية" : "Current Offers"}
                                title={activeCategoryMeta ? t(activeCategoryMeta.name) : lang === "ar" ? "كل العروض" : "All Offers"}
                                support={
                                    lang === "ar"
                                        ? `${filtered.length} ${filtered.length === 1 ? "عرض" : "عروض"} متاحة`
                                        : `${filtered.length} ${filtered.length === 1 ? "offer" : "offers"} available`
                                }
                            />
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-7">
                                {filtered.map((offer, i) => (
                                    <OfferCard key={offer.id} offer={offer} lang={lang} t={t} featured={i === 0} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}