import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";

export default function PopularProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    productService.getPopular().then(setProducts);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
            {lang === "ar" ? "الأكثر طلبًا" : "Fan Favorites"}
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {lang === "ar" ? "الأصناف الشعبية" : "Popular Products"}
          </h2>
        </div>
        <Link to="/menu" className="hidden items-center gap-1 text-sm font-bold text-secondary sm:flex">
          {lang === "ar" ? "شوف الكل" : "View all"}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      {!products ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
