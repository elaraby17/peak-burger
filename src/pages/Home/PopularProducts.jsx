import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";
import ProductCardPopular from "../../components/product/ProductCardPopular";

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="animate-pulse rounded-[1.75rem] bg-ink/5 lg:col-span-6 lg:row-span-1">
        <div className="aspect-[16/11] w-full rounded-t-[1.75rem] bg-ink/10 sm:aspect-[16/9] lg:aspect-[4/3]" />
        <div className="space-y-3 p-6">
          <div className="h-6 w-2/3 rounded-full bg-ink/10" />
          <div className="h-4 w-full rounded-full bg-ink/10" />
          <div className="h-9 w-1/3 rounded-full bg-ink/10" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:col-span-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-ink/5 p-3">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-ink/10 sm:h-24 sm:w-24" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded-full bg-ink/10" />
              <div className="h-3 w-3/4 rounded-full bg-ink/10" />
              <div className="h-4 w-1/4 rounded-full bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PopularProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    productService.getPopular().then(setProducts);
  }, []);

  const featured = products?.[0];
  const rest = products?.slice(1, 7) ?? [];

  return (
    <section className="relative overflow-hidden bg-cream-100/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-secondary">
              {lang === "ar" ? "الأكثر طلبًا" : "Fan Favorites"}
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {lang === "ar" ? "الأصناف الشعبية" : "Popular Products"}
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-cream sm:flex"
          >
            {lang === "ar" ? "شوف المنيو كامل" : "View full menu"}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {!products ? (
          <SectionSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {featured && (
              <div className="lg:col-span-4">
                <ProductCardPopular product={featured} variant="featured" />
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              {rest.map((p) => (
                <ProductCardPopular key={p.id} product={p} variant="default" />
              ))}
              </div>
              {featured && (
                <div className="lg:col-span-4">
                  <ProductCardPopular product={featured} variant="featured" />
                </div>
              )}
          </div>
        )}

        <Link
          to="/menu"
          className="mt-8 flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink sm:hidden"
        >
          {lang === "ar" ? "شوف المنيو كامل" : "View full menu"}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}