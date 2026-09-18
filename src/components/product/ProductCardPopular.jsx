import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { cn } from "../../utils/cn";

// Reads a field that may be a plain string or a { en, ar } localized object.
function loc(field, lang) {
    if (field == null) return "";
    if (typeof field === "object") return field[lang] ?? field.en ?? Object.values(field)[0] ?? "";
    return field;
}

function formatPrice(value, lang) {
    if (value == null) return "";
    return lang === "ar" ? `${value} ج.م` : `EGP ${value}`;
}

function Rating({ value }) {
    if (!value) return null;
    return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {value.toFixed(1)}
        </span>
    );
}

export default function ProductCard({ product, variant = "default" }) {
    const { lang } = useLanguage();
    const { addItem } = useCart();

    const name = loc(product?.name, lang);
    const description = loc(product?.description, lang);
    const isFeatured = variant === "featured";

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem?.(product);
    };

    if (isFeatured) {
        return (
            <Link
                to={`/product/${product.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_50px_-25px_rgba(20,15,10,0.45)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-24px_rgba(20,15,10,0.5)]"
            >
                <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[4/3]">
                    <img
                        src={product?.image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/40 to-transparent" />
                    <span className="absolute start-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white shadow-sm">
                        {product?.badge ?? (lang === "ar" ? "الأكثر طلبًا" : "Best Seller")}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-2xl font-extrabold leading-tight text-ink">{name}</h3>
                        <Rating value={product?.rating} />
                    </div>
                    {description && (
                        <p className="line-clamp-2 text-sm text-ink-soft">{description}</p>
                    )}

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-xl font-extrabold text-ink">
                                {formatPrice(product?.price, lang)}
                            </span>
                            {product?.oldPrice && (
                                <span className="text-sm font-semibold text-ink-soft/50 line-through">
                                    {formatPrice(product.oldPrice, lang)}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-transform active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            {lang === "ar" ? "أضف للسلة" : "Add to cart"}
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/product/${product.id}`}
            className="group flex items-center gap-4 rounded-2xl bg-white p-3 shadow-[0_10px_30px_-20px_rgba(20,15,10,0.4)] transition-shadow duration-300 hover:shadow-[0_16px_36px_-18px_rgba(20,15,10,0.45)]"
        >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                <img
                    src={product?.image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-display text-base font-bold text-ink">{name}</h3>
                    <Rating value={product?.rating} />
                </div>
                {description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{description}</p>
                )}
                <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-sm font-extrabold text-ink">
                            {formatPrice(product?.price, lang)}
                        </span>
                        {product?.oldPrice && (
                            <span className="text-xs font-semibold text-ink-soft/50 line-through">
                                {formatPrice(product.oldPrice, lang)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAdd}
                        aria-label={lang === "ar" ? "أضف للسلة" : "Add to cart"}
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-transform active:scale-90"
                        )}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}