import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import DataTable from "../../../components/admin/DataTable";
import FilterBar from "../../../components/admin/FilterBar";
import Pagination from "../../../components/admin/Pagination";
import StatusBadge from "../../../components/admin/StatusBadge";
import Price from "../../../components/ui/Price";
import Button from "../../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const PAGE_SIZE = 8;

export default function AdminProducts() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const load = () => productService.getAllAdmin().then(setProducts);

  useEffect(() => {
    document.title = "Products — Peak Burger Admin";
    load();
    categoryService.getAll().then(setCategories);
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (statusFilter === "active" && p.active === false) return false;
      if (statusFilter === "inactive" && p.active !== false) return false;
      if (statusFilter === "popular" && !p.popular) return false;
      if (statusFilter === "new" && !p.isNew) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!`${p.name.en} ${p.name.ar}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, search, category, statusFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (!products) return <DashboardSkeleton />;

  const handleDelete = async (p) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "حذف المنتج؟" : "Delete this product?",
      text: lang === "ar" ? p.name.ar : p.name.en,
      confirmText: lang === "ar" ? "حذف" : "Delete",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;
    await productService.remove(p.id);
    await load();
    toastSuccess(lang === "ar" ? "تم حذف المنتج." : "Product deleted.");
  };

  const handleToggle = async (p) => {
    await productService.toggleActive(p);
    await load();
  };

  const columns = [
    { key: "image", header: "", render: (p) => <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /> },
    { key: "name", header: lang === "ar" ? "المنتج" : "Product", render: (p) => <span className="font-semibold text-text">{lang === "ar" ? p.name.ar : p.name.en}</span> },
    { key: "category", header: lang === "ar" ? "القسم" : "Category", render: (p) => categories.find((c) => c.id === p.category)?.[lang === "ar" ? "name" : "name"]?.[lang] || p.category },
    { key: "price", header: lang === "ar" ? "السعر" : "Price", render: (p) => <Price value={p.price} className="text-text" /> },
    { key: "popular", header: lang === "ar" ? "شائع" : "Popular", render: (p) => (p.popular ? "✓" : "-") },
    { key: "isNew", header: lang === "ar" ? "جديد" : "New", render: (p) => (p.isNew ? "✓" : "-") },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (p) => <StatusBadge status={p.active === false ? "inactive" : "active"} label={p.active === false ? (lang === "ar" ? "متوقف" : "Inactive") : (lang === "ar" ? "مفعّل" : "Active")} /> },
    {
      key: "actions",
      header: "",
      render: (p) => (
        <div className="flex gap-1">
          <Link to={`/admin/products/${p.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover"><Pencil className="h-4 w-4" /></Link>
          <button onClick={() => handleToggle(p)} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover"><Power className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(p)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary/15"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "المنتجات" : "Products"}</h1>
        <Link to="/admin/products/create">
          <Button variant="primary"><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة منتج" : "Add product"}</Button>
        </Link>
      </div>

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder={lang === "ar" ? "دور على منتج..." : "Search products..."}
        filters={[
          {
            value: category,
            onChange: (v) => { setCategory(v); setPage(1); },
            options: [{ value: "all", label: lang === "ar" ? "كل الأقسام" : "All categories" }, ...categories.map((c) => ({ value: c.id, label: lang === "ar" ? c.name.ar : c.name.en }))],
          },
          {
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
            options: [
              { value: "all", label: lang === "ar" ? "الكل" : "All" },
              { value: "active", label: lang === "ar" ? "مفعّل" : "Active" },
              { value: "inactive", label: lang === "ar" ? "متوقف" : "Inactive" },
              { value: "popular", label: lang === "ar" ? "شائع" : "Popular" },
              { value: "new", label: lang === "ar" ? "جديد" : "New" },
            ],
          },
        ]}
      />

      <DataTable columns={columns} rows={paged} emptyTitle={lang === "ar" ? "مفيش منتجات" : "No products found"} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
