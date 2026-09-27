import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Flame, ShoppingBag, BadgePercent } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ErrorState from "../../components/ui/ErrorState";
import { cn } from "../../utils/cn";

/*
 * NAVBAR OFFSET — keep in sync with Offers.jsx and Navbar.jsx.
 * Assumes a fixed navbar 5rem / 80px tall (Tailwind's `20` step),
 * same assumption Menu.jsx makes with its hero's `-mt-20`.
 */
const NAVBAR_OFFSET_CLASS = "top-20";

/*
 * TEMPORARY DATA SOURCE — same bridge used on the Offers list page.
 * Swap `productService.getById` + `toOffer` for `offerService.getById`
 * once the real endpoint exists; nothing else here needs to change.
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
        ingredients: product.ingredients,
        discountPercent,
        originalPrice,
        discountedPrice,
        savings: originalPrice !== null && discountedPrice !== null ? originalPrice - discountedPrice : null,
    };
}

function DetailSkeleton() {
    return (
        <div className="mx-auto max-w-6xl animate-pulse px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="aspect-[4/3] rounded-2xl bg-white/[0.04]" />
                <div className="space-y-4">
                    <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
                    <div className="h-10 w-3/4 rounded-lg bg-white/[0.06]" />
                    <div className="h-4 w-full rounded bg-white/[0.04]" />
                    <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
                    <div className="h-12 w-40 rounded-full bg-white/[0.06]" />
                </div>
            </div>
        </div>
    );
}

export default function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, lang } = useLanguage();

    const [offer, setOffer] = useState(null);
    const [related, setRelated] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const load = () => {
        setIsLoading(true);
        setNotFound(false);
        setLoadError(false);

        Promise.all([productService.getById(id), productService.getAll()])
            .then(([product, all]) => {
                if (!product) {
                    setNotFound(true);
                    return;
                }
                setOffer(toOffer(product));
                setRelated(
                    all
                        .filter((p) => p.id !== product.id && p.category === product.category)
                        .slice(0, 3)
                        .map(toOffer)
                );
            })
            .catch((err) => {
                console.error("Failed to load offer", err);
                setLoadError(true);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        load();
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (offer) document.title = `${t(offer.title)} — Peak Burger`;
    }, [offer, t]);

    // Every branch below renders inside <main>, which MainLayout already
    // pads by the navbar's height — unlike Menu/Offers, this page has no
    // full-bleed hero to cancel that padding, so no -mt-20 here.
    if (isLoading) {
        return (
            <div className="bg-[#050505] text-white">
                <DetailSkeleton />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#050505] px-4 text-white">
                <ErrorState
                    title={lang === "ar" ? "معرفناش نجيب العرض" : "Couldn't load this offer"}
                    description={lang === "ar" ? "تأكد إن السيرفر شغال وحاول تاني." : "Make sure the API is running and try again."}
                    onRetry={load}
                />
            </div>
        );
    }

    if (notFound || !offer) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#050505] px-4 text-center text-white">
                <p className="font-display text-2xl font-extrabold uppercase tracking-tight">
                    {lang === "ar" ? "العرض مش موجود" : "Offer not found"}
                </p>
                <p className="max-w-sm text-sm text-[#A1A1A1]">
                    {lang === "ar"
                        ? "ممكن العرض يكون خلص أو الرابط غلط."
                        : "This offer may have ended, or the link is wrong."}
                </p>
                <Link
                    to="/offers"
                    className="mt-2 rounded-full bg-[#F5B400] px-6 py-3 font-display text-xs font-extrabold uppercase tracking-[0.15em] text-[#050505] transition-transform duration-200 hover:scale-[1.03]"
                >
                    {lang === "ar" ? "كل العروض" : "All Offers"}
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] text-white">
            {/* ---------- BREADCRUMB (sticky, docks under the fixed navbar) ---------- */}
            <div
                className={cn(
                    "sticky z-20 border-b border-white/[0.06] bg-[#0A0A0A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/80",
                    NAVBAR_OFFSET_CLASS
                )}
            >
                <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#6B6B6B] rtl:tracking-normal sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/offers")}
                        className="flex items-center gap-1 transition-colors duration-300 hover:text-[#F5B400] rtl:rotate-180"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                        {lang === "ar" ? "العروض" : "Offers"}
                    </button>
                    <span aria-hidden className="text-white/20">/</span>
                    <span className="truncate text-white/70 normal-case tracking-normal">{t(offer.title)}</span>
                </div>
            </div>

            {/* ---------- DETAIL ---------- */}
            <section className="relative overflow-hidden">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 end-[-10%] h-[420px] w-[420px] rounded-full bg-[#D71920]/[0.06] blur-[130px]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 start-[-14%] h-[380px] w-[380px] rounded-full bg-[#F5B400]/[0.04] blur-[130px]"
                />

                <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                        {/* image */}
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                            <img
                                src={offer.image}
                                alt={t(offer.title)}
                                className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
                            />
                            {typeof offer.discountPercent === "number" && (
                                <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#D71920] px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-black/30">
                                    <Flame className="h-4 w-4" aria-hidden />
                                    {lang === "ar" ? `خصم ${offer.discountPercent}٪` : `${offer.discountPercent}% Off`}
                                </span>
                            )}
                        </div>

                        {/* info */}
                        <div>
                            <p className="flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal">
                                <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
                                {lang === "ar" ? "عرض لفترة محدودة" : "Limited-Time Offer"}
                            </p>
                            <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
                                {t(offer.title)}
                            </h1>
                            {offer.description && (
                                <p className="mt-4 max-w-lg text-base leading-relaxed text-[#A1A1A1]">
                                    {t(offer.description)}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap items-end gap-4">
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        {offer.originalPrice !== null && (
                                            <span className="text-lg text-[#6B6B6B] line-through">
                                                {offer.originalPrice} {lang === "ar" ? "جنيه" : "EGP"}
                                            </span>
                                        )}
                                        <span className="font-display text-4xl font-extrabold text-white">
                                            {offer.discountedPrice} {lang === "ar" ? "جنيه" : "EGP"}
                                        </span>
                                    </div>
                                    {offer.savings ? (
                                        <p className="mt-1 text-sm font-semibold text-[#F5B400]">
                                            {lang === "ar" ? `بتوفر ${offer.savings} جنيه` : `You save ${offer.savings} EGP`}
                                        </p>
                                    ) : null}
                                </div>
                                {typeof offer.discountPercent === "number" && (
                                    <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[#F5B400]/25 bg-[#F5B400]/[0.08] px-3 py-1.5 text-xs font-bold text-[#F5B400]">
                                        <BadgePercent className="h-3.5 w-3.5" aria-hidden />
                                        {lang === "ar" ? `خصم ${offer.discountPercent}٪` : `${offer.discountPercent}% off`}
                                    </span>
                                )}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to={`/menu/${offer.id}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#F5B400] px-7 py-3.5 font-display text-xs font-extrabold uppercase tracking-[0.15em] text-[#050505] transition-transform duration-200 hover:scale-[1.03] active:scale-95 rtl:tracking-normal"
                                >
                                    <ShoppingBag className="h-4 w-4" aria-hidden />
                                    {lang === "ar" ? "اطلب دلوقتي" : "Order Now"}
                                </Link>
                                <Link
                                    to="/offers"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-7 py-3.5 font-display text-xs font-extrabold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:border-[#F5B400]/50 hover:text-[#F5B400] rtl:tracking-normal"
                                >
                                    {lang === "ar" ? "كل العروض" : "All Offers"}
                                </Link>
                            </div>

                            {offer.ingredients?.[lang]?.length > 0 && (
                                <div className="mt-8 border-t border-white/[0.06] pt-6">
                                    <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-[#F5B400] rtl:tracking-normal">
                                        {lang === "ar" ? "المكونات" : "Ingredients"}
                                    </p>
                                    <p className="mt-2 text-sm text-[#A1A1A1]">{offer.ingredients[lang].join(" · ")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- RELATED OFFERS ---------- */}
            {related.length > 0 && (
                <section className="border-t border-white/[0.06] bg-[#0A0A0A]">
                    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <p className="mb-6 flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal">
                            <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
                            {lang === "ar" ? "عروض تانية تعجبك" : "You Might Also Like"}
                        </p>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {related.map((r) => (
                                <Link
                                    key={r.id}
                                    to={`/offers/${r.id}`}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0D0D] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F5B400]/30 hover:shadow-[0_20px_45px_-25px_rgba(245,180,0,0.35)]"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={r.image}
                                            alt={t(r.title)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute start-3 top-3 rounded-full bg-[#D71920] px-2.5 py-1 font-display text-[10px] font-extrabold uppercase text-white">
                                            {lang === "ar" ? `-${r.discountPercent}٪` : `-${r.discountPercent}%`}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="line-clamp-1 font-display text-sm font-extrabold uppercase tracking-tight text-white">
                                            {t(r.title)}
                                        </h3>
                                        <p className="mt-1 font-display text-base font-extrabold text-[#F5B400]">
                                            {r.discountedPrice} {lang === "ar" ? "جنيه" : "EGP"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}