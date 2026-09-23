import { Link } from "react-router-dom";
import { Flame, Heart, Plus, Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import Price from "../ui/Price";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const FALLBACK_IMG =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23181818'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23F5B400' text-anchor='middle' dy='.3em'%3EPeak Burger%3C/text%3E%3C/svg%3E";

const MAX_RANK_SHOWN = 5;

export default function BestSellerCard({ product, rank, className }) {
    const { t, lang } = useLanguage();
    const { addItem } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();

    const isAr = lang === "ar";
    const favorite = isFavorite(product.id);
    const hasSizes = Boolean(product.sizes?.length);
    const displayPrice = hasSizes ? product.sizes[0].price : product.price;

    const hasOldPrice = !hasSizes && product.oldPrice && product.oldPrice > displayPrice;
    const discount = hasOldPrice ? Math.round((1 - displayPrice / product.oldPrice) * 100) : null;
    const showRank = Number.isFinite(rank) && rank <= MAX_RANK_SHOWN;

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, { size: hasSizes ? product.sizes[0] : undefined });
        toastSuccess(isAr ? "تمت الإضافة إلى السلة!" : "Added to cart!");
    };

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product.id);
    };

    return (
        <Link
            to={`/menu/${product.slug}`}
            className={cn(
"group relative flex h-full w-full rounded-[1.75rem] border border-white/[0.07] bg-[#111111]",
            "shadow-[0_14px_32px_-18px_rgba(0,0,0,0.85)] transition-[transform,box-shadow,background-color,border-color] duration-300",
            "hover:-translate-y-1.5 hover:border-white/[0.14] hover:bg-[#181818] hover:shadow-[0_22px_44px_-20px_rgba(0,0,0,0.95)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]",
                className
            )}
        >
            <div className="relative flex w-full flex-col overflow-hidden rounded-[1.75rem]">
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#181818]">
                    <img
                        src={product.image}
                        alt={t(product.name)}
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMG;
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-deep/40 via-transparent to-transparent" />

                    <div className="absolute start-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-primary py-1 pe-3 ps-1 text-[11px] font-extrabold uppercase tracking-wider text-text-dark rtl:tracking-normal">
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink-deep px-1.5 text-primary">
                            {showRank ? (
                                <span dir="ltr" className="font-display text-xs leading-none">
                                    #{rank}
                                </span>
                            ) : (
                                <Flame className="h-3.5 w-3.5" strokeWidth={2.5} />
                            )}
                        </span>
                        {isAr ? "الأكثر مبيعًا" : "Best Seller"}
                    </div>

                    <button
                        type="button"
                        onClick={handleFavorite}
                        aria-label={
                            isAr
                                ? favorite
                                    ? "إزالة من المفضلة"
                                    : "أضف للمفضلة"
                                : favorite
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                        }
                        aria-pressed={favorite}
                        className="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink-deep/70 text-text shadow-card ring-1 ring-white/10 backdrop-blur-md transition duration-200 hover:scale-110 active:scale-90"
                    >
                        <Heart
                            className={cn(
                                "h-5 w-5 transition-colors",
                                favorite ? "fill-secondary text-secondary" : "text-text-muted hover:text-secondary"
                            )}
                        />
                    </button>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <span aria-hidden className="mb-3 block h-1 w-8 rounded-full bg-primary" />

                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 font-display text-xl font-extrabold leading-snug text-white">
                            {t(product.name)}
                        </h3>
                        {product.rating ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-xs font-bold text-text">
                                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                {Number(product.rating).toFixed(1)}
                            </span>
                        ) : null}
                    </div>

                    <p className="mt-1.5 line-clamp-2 min-h-10 flex-1 text-sm leading-5 text-text-muted">
                        {t(product.description)}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
                        <div className="min-w-0">
                            <Price
                                value={displayPrice}
                                from={hasSizes}
                                className="text-2xl font-extrabold leading-none text-primary"
                            />
                            {hasOldPrice && (
                                <span className="mt-2 flex items-center gap-2">
                                    <Price
                                        value={product.oldPrice}
                                        className="text-xs font-semibold text-text-muted/60 line-through"
                                    />
                                    <span
                                        dir="ltr"
                                        className="rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-bold text-text-dark"
                                    >
                                        -{discount}%
                                    </span>
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            aria-label={isAr ? "أضف للسلة" : "Add to cart"}
                            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-extrabold text-text-dark shadow-md transition duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
                        >
                            <Plus className="h-4 w-4" strokeWidth={3} />
                            {isAr ? "أضف" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
