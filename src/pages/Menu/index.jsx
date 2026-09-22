import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import ProductCard from "../../components/product/ProductCard";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { cn } from "../../utils/cn";
import heroBurger from "../../assets/hero/classic-combo.jpg";

const pad = (n) => String(n).padStart(2, "0");

function SectionHeading({ index, eyebrow, title, support }) {
  return (
    <div className="relative mb-8 sm:mb-10">
      {index && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 start-1 select-none font-display text-[84px] font-extrabold leading-none text-white/[0.03] sm:-top-10 sm:text-[120px] lg:-top-12 lg:text-[150px]"
        >
          {index}
        </span>
      )}
      <div className="relative flex items-end justify-between gap-6 border-b border-white/[0.06] pb-4 sm:pb-5">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal">
            <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
            {eyebrow}
          </p>
          {title && (
            <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
          )}
          {support && <p className="mt-2 text-sm text-[#A1A1A1] sm:text-base">{support}</p>}
        </div>
        {index && (
          <span aria-hidden className="hidden shrink-0 pb-1 font-display text-sm font-bold tracking-[0.25em] text-white/20 sm:block">
            {index}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Menu() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadProducts = () => {
    setIsLoading(true);
    setLoadError(false);
    productService
      .getAll()
      .then((data) => setAllProducts(data))
      .catch((err) => {
        console.error("Failed to load menu from API", err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    document.title = "Menu — Peak Burger";
    loadProducts();
    // Categories fail quietly — the "All" tab/sidebar entry still works, and
    // the search box doesn't depend on the category list, so a categories
    // hiccup shouldn't block the whole page like a products failure does.
    categoryService
      .getAll()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories from API", err));
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
        [p.name?.en, p.name?.ar, p.description?.en, p.description?.ar, p.category].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    } else if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    return list;
  }, [query, activeCategory, allProducts]);

  const searchMode = query.trim().length > 0;

  const sections = useMemo(() => {
    if (searchMode || activeCategory !== "all") return [];
    const byCat = new Map();
    allProducts.forEach((p) => {
      const key = p.category || "other";
      if (!byCat.has(key)) byCat.set(key, []);
      byCat.get(key).push(p);
    });
    const meta = new Map(categories.map((c) => [c.id, c]));
    const ordered = [];
    categories.forEach((c) => {
      if (byCat.has(c.id)) {
        ordered.push({ category: c, products: byCat.get(c.id) });
        byCat.delete(c.id);
      }
    });
    byCat.forEach((products, id) => {
      ordered.push({
        category: { id, name: { en: id.replace(/-/g, " "), ar: id.replace(/-/g, " ") }, description: null },
        products,
      });
    });
    return ordered.filter((s) => s.products.length > 0);
  }, [searchMode, activeCategory, allProducts, categories]);

  const activeCategoryMeta = categories.find((c) => c.id === activeCategory) || null;

  const renderGrid = (items, featureFirst) => (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-7">
      {items.map((p, i) => (
        <ProductCard key={p.id} product={p} variant="menu" featured={featureFirst && i === 0} />
      ))}
    </div>
  );

  return (
    <div className="bg-[#050505] text-white">
      {/* ---------- HERO ---------- */}
      <section className="relative -mt-20 overflow-hidden border-b border-white/[0.06] bg-[#050505]">
        <div aria-hidden className="pointer-events-none absolute -top-40 end-[-12%] h-[420px] w-[420px] rounded-full bg-[#F5B400]/[0.05] blur-[130px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 start-[-10%] h-[360px] w-[360px] rounded-full bg-[#D71920]/[0.04] blur-[120px]" />

        <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 hidden w-1/2 overflow-hidden sm:block lg:w-[46%]">
          <img src={heroBurger} alt="" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-[#050505]/25" />
          <div className="absolute inset-0 [background-image:linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.55)_34%,rgba(5,5,5,0.05)_60%,rgba(5,5,5,0.9)_100%)]" />
          <div className="absolute inset-0 [background-image:linear-gradient(180deg,rgba(5,5,5,0.7)_0%,rgba(5,5,5,0)_40%,rgba(5,5,5,0.8)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="max-w-3xl text-center sm:text-start">
            <p className="flex items-center justify-center gap-3 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] rtl:tracking-normal sm:justify-start">
              <span aria-hidden className="h-px w-8 bg-[#F5B400]/60" />
              {lang === "ar" ? "قائمتنا" : "Our Menu"}
              <span aria-hidden className="hidden h-px w-8 bg-[#F5B400]/60 sm:block" />
            </p>
            <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {lang === "ar" ? "اختار مزاجك" : "Pick Your Craving"}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-[#A1A1A1] sm:mx-0 sm:text-lg">
              {lang === "ar" ? "برجر طازة، سخن، ومتعمل مخصوص ليك." : "Fresh. Hot. Smashed to order."}
            </p>

            <div className="mt-8 sm:mt-10">
              <label htmlFor="menu-search" className="sr-only">
                {lang === "ar" ? "ابحث في المنيو" : "Search the menu"}
              </label>
              <div className="relative mx-auto max-w-xl sm:mx-0 sm:text-start">
                <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A1A1A1]" />
                <input
                  id="menu-search"
                  type="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "ابحث عن برجر، وجبات، مشروبات..."
                      : "Search burgers, meals, drinks..."
                  }
                  className="h-14 w-full rounded-full border border-white/[0.08] bg-[#111111] ps-12 pe-6 text-sm text-white placeholder:text-[#6B6B6B] outline-none transition-all duration-300 focus:border-[#F5B400]/70 focus:shadow-[0_0_0_4px_rgba(245,180,0,0.12)] [&::-webkit-search-cancel-button]:hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CATEGORY NAV ---------- */}
      <nav
        aria-label={lang === "ar" ? "تصنيفات المنيو" : "Menu categories"}
        className="border-b border-white/[0.06] bg-[#0A0A0A]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="scrollbar-none -mx-4 flex items-end gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:gap-10">
            {[{ id: "all", name: { en: "All", ar: "الكل" } }, ...categories].map((cat, i) => {
              const active = activeCategory === cat.id && !searchMode;
              return (
                <li key={cat.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 rtl:tracking-normal lg:text-[13px]",
                      active ? "text-white" : "text-[#6B6B6B] hover:text-[#D4D4D4]"
                    )}
                  >
                    <span aria-hidden className="font-display text-[10px] text-[#F5B400]/70">
                      {pad(i + 1)}
                    </span>
                    {t(cat.name)}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#F5B400] transition-transform duration-300 ease-out",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ---------- CONTENT ---------- */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-44 start-[-14%] h-[480px] w-[480px] rounded-full bg-[#F5B400]/[0.035] blur-[140px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : loadError ? (
            <div className="flex justify-center py-10">
              <ErrorState
                title={lang === "ar" ? "معرفناش نجيب المنيو" : "Couldn't load the menu"}
                description={
                  lang === "ar" ? "تأكد إن السيرفر شغال وحاول تاني." : "Make sure the API is running and try again."
                }
                onRetry={loadProducts}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex justify-center py-10">
              <EmptyState
                icon={UtensilsCrossed}
                title={lang === "ar" ? "مفيش نتايج لذيذة" : "No delicious results found."}
                actionLabel={lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
                onAction={() => {
                  handleSearchChange("");
                  setCategory("all");
                }}
              />
            </div>
          ) : searchMode ? (
            <div>
              <SectionHeading
                index={undefined}
                eyebrow={lang === "ar" ? "نتايج البحث" : "Search Results"}
                title={`“${query.trim()}”`}
                support={
                  lang === "ar"
                    ? `${filtered.length} ${filtered.length === 1 ? "صنف" : "أصناف"}`
                    : `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`
                }
              />
              {renderGrid(filtered, true)}
            </div>
          ) : activeCategory !== "all" ? (
            <div>
              <SectionHeading
                index={activeCategoryMeta ? pad(categories.indexOf(activeCategoryMeta) + 1) : undefined}
                eyebrow={lang === "ar" ? "القسم" : "Category"}
                title={
                  activeCategoryMeta
                    ? t(activeCategoryMeta.name)
                    : activeCategory.replace(/-/g, " ")
                }
                support={activeCategoryMeta?.description ? t(activeCategoryMeta.description) : undefined}
              />
              {renderGrid(filtered, true)}
            </div>
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {sections.map((s, i) => (
                <section key={s.category.id} className="relative">
                  <SectionHeading
                    index={pad(i + 1)}
                    eyebrow={lang === "ar" ? "مينيو" : "Menu"}
                    title={t(s.category.name)}
                    support={s.category.description ? t(s.category.description) : undefined}
                  />
                  {renderGrid(s.products, i === 0)}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}