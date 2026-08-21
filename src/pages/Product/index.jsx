import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ChevronLeft, PackageSearch } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getProductBySlugOrId, sauceLabels } from "../../data/products";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import QuantitySelector from "../../components/ui/QuantitySelector";
import EmptyState from "../../components/ui/EmptyState";
import { ProductDetailsSkeleton } from "../../components/ui/Skeleton";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

export default function ProductDetails() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isLoading, setIsLoading] = useState(true);
  const product = useMemo(() => getProductBySlugOrId(id), [id]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? null);
  const [selectedSauce, setSelectedSauce] = useState(product?.sauceOptions?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (product) document.title = `${t(product.name)} — Peak Burger`;
  }, [product, t, lang]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetailsSkeleton />
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

  const unitPrice = selectedSize ? selectedSize.price : product.price;
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addItem(product, { size: selectedSize, sauce: selectedSauce, quantity });
    toastSuccess(lang === "ar" ? "تمت الإضافة إلى السلة!" : "Added to cart!");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/menu" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-secondary">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        {lang === "ar" ? "الرجوع للمنيو" : "Back to menu"}
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative">
          <img
            src={product.image}
            alt={t(product.name)}
            className="aspect-square w-full rounded-3xl object-cover shadow-card"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23FCEACB'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='22' fill='%23B37F00' text-anchor='middle' dy='.3em'%3EPeak Burger%3C/text%3E%3C/svg%3E";
            }}
          />
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-pressed={favorite}
            className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur"
          >
            <Heart className={cn("h-5 w-5", favorite ? "fill-secondary text-secondary" : "text-ink-soft")} />
          </button>
          {product.isNew && (
            <Badge tone="secondary" className="absolute start-4 top-4">
              {lang === "ar" ? "جديد" : "New"}
            </Badge>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{t(product.name)}</h1>
          <p className="mt-3 text-ink-soft">{t(product.description)}</p>

          {product.ingredients?.[lang]?.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
                {lang === "ar" ? "المكونات" : "Ingredients"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients[lang].map((ing) => (
                  <span key={ing} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-soft">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
                {lang === "ar" ? "الحجم" : "Size"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                      selectedSize?.id === size.id
                        ? "border-secondary bg-secondary text-white"
                        : "border-ink/10 bg-white text-ink-soft"
                    )}
                  >
                    {t(size.label)} · <Price value={size.price} className="text-inherit" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sauceOptions && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
                {lang === "ar" ? "اختر الصوص" : "Choose your sauce"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sauceOptions.map((sauceId) => (
                  <button
                    key={sauceId}
                    onClick={() => setSelectedSauce(sauceId)}
                    className={cn(
                      "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                      selectedSauce === sauceId
                        ? "border-secondary bg-secondary text-white"
                        : "border-ink/10 bg-white text-ink-soft"
                    )}
                  >
                    {t(sauceLabels[sauceId])}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <QuantitySelector
              value={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Price value={unitPrice !== null ? unitPrice * quantity : null} className="text-2xl" />
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={unitPrice === null}
            variant="primary"
            size="lg"
            className="mt-6 w-full"
          >
            {lang === "ar" ? "أضف إلى السلة" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
