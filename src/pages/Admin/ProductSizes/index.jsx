import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { sizeService } from "../../../services/sizeService";
import DataTable from "../../../components/admin/DataTable";
import Price from "../../../components/ui/Price";
import Badge from "../../../components/ui/Badge";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminProductSizes() {
  const { t, lang } = useLanguage();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    document.title = "Product Sizes — Peak Burger Admin";
    sizeService.getAll().then(setRows);
  }, []);

  if (!rows) return <DashboardSkeleton />;

  const columns = [
    { key: "product", header: lang === "ar" ? "المنتج" : "Product", render: (r) => <span className="font-semibold text-ink">{t(r.productName)}</span> },
    { key: "sizeKey", header: lang === "ar" ? "الحجم" : "Size" },
    { key: "label", header: lang === "ar" ? "التسمية" : "Label", render: (r) => (lang === "ar" ? r.labelAr : r.labelEn) },
    { key: "price", header: lang === "ar" ? "السعر" : "Price", render: (r) => <Price value={r.price} className="text-ink" /> },
    { key: "default", header: lang === "ar" ? "افتراضي" : "Default", render: (r) => (r.isDefault ? <Badge tone="primary">{lang === "ar" ? "افتراضي" : "Default"}</Badge> : "-") },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "أحجام المنتجات" : "Product Sizes"}</h1>
        <p className="text-sm text-ink-soft">
          {lang === "ar" ? "الأحجام متصلة مباشرة بكل منتج - عدّل السعر من صفحة تعديل المنتج نفسه." : "Sizes live on each product record - edit prices from that product's edit page."}
        </p>
      </div>
      <DataTable columns={columns} rows={rows} emptyTitle={lang === "ar" ? "مفيش أحجام" : "No sizes found"} />
    </div>
  );
}
