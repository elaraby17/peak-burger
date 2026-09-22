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

export default function ProductCard({ product }) {
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

  return (
    <Link
      to={`/menu/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-surface-hover hover:shadow-card-hover"
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

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-bold text-text line-clamp-1">{t(product.name)}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-text-muted">{t(product.description)}</p>
        <div className="mt-3 flex items-center justify-between">
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
