import { Link } from "react-router-dom";
import { Flame, Heart, Plus, Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import Price from "../ui/Price";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const FALLBACK_IMG =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23FCEACB'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23B37F00' text-anchor='middle' dy='.3em'%3EPeak Burger%3C/text%3E%3C/svg%3E";

/* الترتيب (#1, #2 ...) بيظهر لحد المركز ده، وبعده بيظهر لهب بس */
const MAX_RANK_SHOWN = 5;

/**
 * كارت "الأكثر مبيعًا".
 *
 * عادي: كارت أبيض بإطار ذهبي متدرج، صورة كبيرة، وزر إضافة ذهبي واضح.
 * هوفر: الكارت اللي عليه الماوس بس (group على كل كارت لوحده) بيقلب أحمر (secondary)،
 * الصورة بتذوب في الأحمر من تحت، النصوص بتقلب أبيض، والذهبي بيفضل في الإطار
 * والشارة والنجمة والخط الزخرفي وزر الإضافة.
 *
 * props:
 * - product
 * - rank (اختياري): ترتيب المنتج في الأكثر مبيعًا، يبدأ من 1
 */
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
                /* الطبقة الخارجية = الإطار الذهبي المتدرج (1.5px). عند الهوفر بيبقى ذهبي كامل حوالين الكارت الأحمر */
                "group relative flex h-full w-full rounded-[1.75rem] bg-gradient-to-br from-gold via-gold/25 to-gold p-[1.5px]",
                "shadow-card transition-[transform,box-shadow] duration-300 hover:via-gold",
                "hover:-translate-y-1.5 hover:shadow-card-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                className
            )}
        >
            <div className="relative flex w-full flex-col overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-white transition-colors duration-300 group-hover:bg-secondary">
                {/* ---------- الصورة: العنصر الأساسي في الكارت ---------- */}
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-cream-100">
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

                    {/* تدرج غامق خفيف فوق عشان الشارة والقلب يبانوا على أي صورة */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-transparent" />
                    {/* عند الهوفر: الصورة بتذوب في الأحمر من تحت */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary via-secondary/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* شارة الأكثر مبيعًا: صغيرة داخل الصورة ومش بتغطي المنتج */}
                    <div className="absolute start-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-gold py-1 pe-3 ps-1 text-[11px] font-extrabold uppercase tracking-wider text-ink shadow-[0_4px_12px_rgba(20,15,10,0.3)] rtl:tracking-normal">
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-gold">
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
                        className="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-card ring-1 ring-white/60 backdrop-blur-md transition duration-200 hover:scale-110 hover:bg-white active:scale-90"
                    >
                        <Heart
                            className={cn(
                                "h-5 w-5 transition-colors",
                                favorite ? "fill-secondary text-secondary" : "text-ink-soft hover:text-secondary"
                            )}
                        />
                    </button>
                </div>

                {/* ---------- المحتوى ---------- */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    {/* خط ذهبي صغير: لمسة هوية بتفضل ظاهرة على الأحمر */}
                    <span aria-hidden className="mb-3 block h-1 w-8 rounded-full bg-gold" />

                    <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 font-display text-xl font-extrabold leading-snug text-ink transition-colors duration-300 group-hover:text-white">
                            {t(product.name)}
                        </h3>
                        {product.rating ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-xs font-bold text-ink transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white">
                                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                                {Number(product.rating).toFixed(1)}
                            </span>
                        ) : null}
                    </div>

                    <p className="mt-1.5 line-clamp-2 min-h-10 flex-1 text-sm leading-5 text-ink-soft transition-colors duration-300 group-hover:text-white/80">
                        {t(product.description)}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-gold/30 pt-4 transition-colors duration-300 group-hover:border-gold/60">
                        <div className="min-w-0">
                            <Price
                                value={displayPrice}
                                from={hasSizes}
                                className="text-2xl font-extrabold leading-none text-ink transition-colors duration-300 group-hover:text-white"
                            />
                            {hasOldPrice && (
                                <span className="mt-2 flex items-center gap-2">
                                    <Price
                                        value={product.oldPrice}
                                        className="text-xs font-semibold text-ink-soft/60 line-through transition-colors duration-300 group-hover:text-white/60"
                                    />
                                    <span
                                        dir="ltr"
                                        className="rounded-full bg-gold/25 px-1.5 py-0.5 text-[11px] font-bold text-ink transition-colors duration-300 group-hover:bg-gold group-hover:text-ink"
                                    >
                                        -{discount}%
                                    </span>
                                </span>
                            )}
                        </div>

                        {/* زر الطلب الأساسي: ذهبي في الوضعين، واضح حتى على الكارت الأحمر */}
                        <button
                            type="button"
                            onClick={handleQuickAdd}
                            aria-label={isAr ? "أضف للسلة" : "Add to cart"}
                            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-extrabold text-ink shadow-md transition duration-300 hover:scale-105 hover:brightness-95 active:scale-95"
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