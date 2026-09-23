import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { orderStatusHistoryService } from "../../../services/orderStatusHistoryService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { statusLabels } from "../../../utils/orderStatus";
import { formatDate } from "../../../utils/format";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminOrderStatusHistory() {
  const { t, lang } = useLanguage();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    document.title = "Order Status History — Peak Burger Admin";
    orderStatusHistoryService.getAll().then(setHistory);
  }, []);

  if (!history) return <DashboardSkeleton />;

  const columns = [
    { key: "order", header: lang === "ar" ? "رقم الطلب" : "Order #", render: (h) => (
      <Link to={`/admin/orders/${h.orderId}`} className="font-display font-bold text-text hover:text-secondary">{h.orderId}</Link>
    ) },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (h) => <StatusBadge status={h.status} label={t(statusLabels[h.status]) || h.status} /> },
    { key: "changedBy", header: lang === "ar" ? "تم بواسطة" : "Changed by" },
    { key: "date", header: lang === "ar" ? "التاريخ" : "Date", render: (h) => formatDate(h.date, { lang }) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "سجل حالات الطلبات" : "Order Status History"}</h1>
      <DataTable columns={columns} rows={[...history].reverse()} emptyTitle={lang === "ar" ? "مفيش سجل" : "No history yet"} />
    </div>
  );
}
