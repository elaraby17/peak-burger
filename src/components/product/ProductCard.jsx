import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import Price from "../ui/Price";
import Badge from "../ui/Badge";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23181818'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23F5B400' text-anchor='middle' dy='.3em'%3EPeak Burger%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product, variant, featured = false }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const favorite = isFavorite(product.id);
  const hasSizes = Boolean(product.sizes?.length);
  const displayPrice = hasSizes ? product.sizes[0].price : product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { size: hasSizes ? product.sizes[0] : undefined });
    toastSuccess(lang === "ar" ? "تمت الإضافة إلى السلة!" : "Added to cart!");
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  if (variant === "menu") {
    return (
      <Link
        to={`/menu/${product.slug}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111] shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F5B400]/40 hover:bg-[#181818] hover:shadow-[0_16px_32px_rgba(0,0,0,0.65)] focus-visible:outline-none",
          featured && "sm:rounded-3xl"
        )}
      >
        {/* صورة المنتج بأبعاد ثابتة لتوحيد الشكل */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181818]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 45%, rgba(245,180,0,0.07), transparent 60%)" }}
          />
          <img
            src={product.image}
            alt={t(product.name)}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMG;
            }}
            className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {product.isNew && (
            <Badge tone="secondary" className="absolute start-3 top-3">
              {lang === "ar" ? "جديد" : "New"}
            </Badge>
          )}
          <button
            onClick={handleFavorite}
            aria-label={favorite ? (lang === "ar" ? "إزالة من المفضلة" : "Remove from favorites") : (lang === "ar" ? "إضافة إلى المفضلة" : "Add to favorites")}
            aria-pressed={favorite}
            className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#050505]/70 text-white shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur transition-transform active:scale-90"
          >
            <Heart className={cn("h-[18px] w-[18px]", favorite ? "fill-[#D71920] text-[#D71920]" : "text-[#A1A1A1] group-hover:text-white")} />
          </button>
        </div>

        {/* محتوى الكارت الموزع بمرونة لتوحيد الارتفاع */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className={cn("font-display font-bold text-white line-clamp-1", featured ? "text-xl sm:text-2xl" : "text-base")}>
            {t(product.name)}
          </h3>

          {/* الوصف مع flex-1 لملء الفراغ ودفع السعر وزر الإضافة للأسفل */}
          <p className={cn("mt-1.5 flex-1 text-sm leading-relaxed text-[#A1A1A1]", featured ? "line-clamp-3 sm:text-base" : "line-clamp-2")}>
            {t(product.description)}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-white/[0.04]">
            <Price value={displayPrice} from={hasSizes} className={cn("text-[#F5B400]", featured ? "text-2xl" : "text-lg")} />
            <button
              onClick={handleQuickAdd}
              aria-label={lang === "ar" ? "إضافة إلى السلة" : "Add to cart"}
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-[#F5B400] text-[#050505] shadow-[0_10px_24px_rgba(245,180,0,0.28)] transition-transform active:scale-90 group-hover:scale-105",
                featured ? "h-12 w-12" : "h-10 w-10"
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated && favorite && (
          <span className="sr-only">
            <Sparkles /> guest favorite
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={`/menu/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
        <img
          src={product.image}
          alt={t(product.name)}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isNew && (
          <Badge tone="secondary" className="absolute start-3 top-3">
            {lang === "ar" ? "جديد" : "New"}
          </Badge>
        )}
        <button
          onClick={handleFavorite}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-deep/70 text-text shadow-card backdrop-blur transition-transform active:scale-90"
        >
          <Heart className={cn("h-4.5 w-4.5", favorite ? "fill-secondary text-secondary" : "text-text-muted")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold text-text line-clamp-1">{t(product.name)}</h3>
        <p className="mt-1 flex-1 line-clamp-2 text-sm text-text-muted">{t(product.description)}</p>

        <div className="mt-3 flex items-center justify-between pt-3 border-t border-line/40">
          <Price value={displayPrice} from={hasSizes} className="text-primary" />
          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-text-dark shadow-pop transition-transform active:scale-90 group-hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isAuthenticated && favorite && (
        <span className="sr-only">
          <Sparkles /> guest favorite
        </span>
      )}
    </Link>
  );
}