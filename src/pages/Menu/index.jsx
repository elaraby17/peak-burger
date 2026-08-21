import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { products as allProducts } from "../../data/products";
import { categories } from "../../data/categories";
import ProductCard from "../../components/product/ProductCard";
import CategoryCard from "../../components/menu/CategoryCard";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function Menu() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Menu — Peak Burger";
    const timeout = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    next.delete("q");
    setSearchParams(next);
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = allProducts;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name.en, p.name.ar, p.description.en, p.description.ar, p.category].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    } else if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [query, activeCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">{lang === "ar" ? "المنيو" : "Our Menu"}</h1>
          <p className="text-sm text-ink-soft">
            {lang === "ar" ? "اختار من أفضل الأصناف عندنا" : "Pick from our full lineup"}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute start-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-soft/50" />
          <input
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={lang === "ar" ? "دور على أكلة..." : "Search products..."}
            className="h-11 w-full rounded-full border-2 border-ink/10 bg-white ps-10 pe-4 text-sm text-ink outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Mobile category tabs */}
      <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 lg:hidden">
        <CategoryCard
          variant="tab"
          category={{ name: { en: "All", ar: "الكل" }, icon: "flame" }}
          active={activeCategory === "all" && !query}
          onClick={() => setCategory("all")}
        />
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            variant="tab"
            category={cat}
            active={activeCategory === cat.id && !query}
            onClick={() => setCategory(cat.id)}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1 rounded-2xl bg-white p-3 shadow-card">
            <CategoryCard
              variant="sidebar"
              category={{ name: { en: "All Items", ar: "كل الأصناف" }, icon: "flame" }}
              active={activeCategory === "all" && !query}
              onClick={() => setCategory("all")}
            />
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                variant="sidebar"
                category={cat}
                active={activeCategory === cat.id && !query}
                onClick={() => setCategory(cat.id)}
              />
            ))}
          </div>
        </aside>

        <div>
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title={lang === "ar" ? "مفيش نتايج لذيذة" : "No delicious results found."}
              actionLabel={lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
              onAction={() => {
                handleSearchChange("");
                setCategory("all");
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
