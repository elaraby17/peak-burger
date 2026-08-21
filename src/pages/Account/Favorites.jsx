import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useFavorites } from "../../context/FavoritesContext";
import { products } from "../../data/products";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";

export default function Favorites() {
  const { lang } = useLanguage();
  const { favorites } = useFavorites();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Favorites — Peak Burger";
    // Favorites load synchronously from context, but a brief skeleton keeps
    // this page consistent with the rest of the app's async-ready UI.
    const timeout = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "المفضلة" : "Favorites"}</h1>

      {!ready ? (
        <ProductGridSkeleton count={4} />
      ) : favoriteProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={lang === "ar" ? "مفيش حاجة في المفضلة" : "No favorites yet"}
          description={lang === "ar" ? "دوس على القلب في أي صنف عشان تضيفه هنا." : "Tap the heart on any item to save it here."}
          actionLabel={lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
          actionTo="/menu"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
