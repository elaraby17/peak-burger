import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useFavorites } from "../../context/FavoritesContext";
import ProductCard from "../../components/product/ProductCard";
import EmptyState from "../../components/ui/EmptyState";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import productService from "../../services/productService";

export default function Favorites() {
  const { lang } = useLanguage();
  const { favorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Favorites — Peak Burger";
    // Favorites load synchronously from context, but a brief skeleton keeps
    // this page consistent with the rest of the app's async-ready UI.
    const timeout = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  const isAr = lang === "ar";
  const favoriteProducts = products.filter((p) =>
    favorites.some(
      (favorite) => Number(favorite.product_id) === Number(p.id)
    )
  );
  const count = favoriteProducts.length;

  return (
    <div className="relative overflow-hidden">
      {/* subtle yellow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 15% 0%, rgba(245,180,0,0.06), transparent 42%)" }}
      />

      <div className="relative space-y-10 sm:space-y-12">
        {/* Page header */}
        <header className="animate-fadeIn">
          <p className="flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm rtl:tracking-normal">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F5B400]" />
            {isAr ? "أصنافك المحفوظة" : "Saved for you"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {isAr ? "المفضلة" : "Favorites"}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#A1A1A1] sm:text-lg">
            {isAr
              ? "كل الأطباق اللي حبيتها محفوظة هنا، جاهزة لما تقرر تطلبها."
              : "Everything you've saved, ready whenever you're craving it."}
          </p>
        </header>

        {!ready ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={isAr ? "مفيش حاجة في المفضلة" : "No favorites yet"}
            description={isAr ? "دوس على القلب في أي صنف عشان تضيفه هنا." : "Tap the heart on any item to save it here."}
            actionLabel={isAr ? "تصفح المنيو" : "Explore Menu"}
            actionTo="/menu"
          />
        ) : (
          <section>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
                {isAr ? "الأصناف المحفوظة" : "Saved items"}
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-white/[0.08]" />
              <span className="shrink-0 text-sm font-bold text-[#F5B400]">
                {count} {isAr ? "صنف" : "items"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="menu" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}