import { useEffect, useState } from "react";
import { Check, EyeOff, Trash2, Star } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { reviewService } from "../../../services/reviewService";
import { getProductBySlugOrId } from "../../../data/products";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { formatDate } from "../../../utils/format";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminReviews() {
  const { t, lang } = useLanguage();
  const [reviews, setReviews] = useState(null);

  const load = () => reviewService.getAll().then(setReviews);

  useEffect(() => {
    document.title = "Reviews — Peak Burger Admin";
    load();
  }, []);

  if (!reviews) return <DashboardSkeleton />;

  const handleStatus = async (r, status) => {
    await reviewService.updateStatus(r.id, status);
    load();
  };

  const handleDelete = async (r) => {
    const confirmed = await confirmDialog({ title: lang === "ar" ? "حذف التقييم؟" : "Delete this review?", confirmText: lang === "ar" ? "حذف" : "Delete", cancelText: lang === "ar" ? "إلغاء" : "Cancel" });
    if (!confirmed) return;
    await reviewService.remove(r.id);
    load();
    toastSuccess(lang === "ar" ? "تم الحذف." : "Deleted.");
  };

  const columns = [
    { key: "customer", header: lang === "ar" ? "العميل" : "Customer", render: (r) => <span className="font-semibold text-ink">{r.customerName}</span> },
    { key: "product", header: lang === "ar" ? "المنتج" : "Product", render: (r) => t(getProductBySlugOrId(r.productId)?.name) || "-" },
    { key: "rating", header: lang === "ar" ? "التقييم" : "Rating", render: (r) => (
      <span className="flex items-center gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-primary" : "fill-transparent text-ink/15"}`} />)}
      </span>
    ) },
    { key: "comment", header: lang === "ar" ? "التعليق" : "Comment", render: (r) => <span className="line-clamp-1 max-w-xs text-ink-soft">{r.comment}</span> },
    { key: "date", header: lang === "ar" ? "التاريخ" : "Date", render: (r) => formatDate(r.date, { lang }) },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (r) => <StatusBadge status={r.status} label={r.status} /> },
    { key: "actions", header: "", render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => handleStatus(r, "approved")} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50" title="Approve"><Check className="h-4 w-4" /></button>
        <button onClick={() => handleStatus(r, "hidden")} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100" title="Hide"><EyeOff className="h-4 w-4" /></button>
        <button onClick={() => handleDelete(r)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "التقييمات" : "Reviews"}</h1>
      <DataTable columns={columns} rows={reviews} emptyTitle={lang === "ar" ? "مفيش تقييمات" : "No reviews"} />
    </div>
  );
}
