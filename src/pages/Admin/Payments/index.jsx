import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { paymentService } from "../../../services/paymentService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import Select from "../../../components/ui/Select";
import Price from "../../../components/ui/Price";
import { formatDate } from "../../../utils/format";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const STATUSES = ["pending", "paid", "failed", "refunded"];

export default function AdminPayments() {
  const { lang } = useLanguage();
  const [payments, setPayments] = useState(null);

  const load = () => paymentService.getAll().then(setPayments);

  useEffect(() => {
    document.title = "Payments — Peak Burger Admin";
    load();
  }, []);

  if (!payments) return <DashboardSkeleton />;

  const handleStatusChange = async (p, status) => {
    await paymentService.updateStatus(p.id, status);
    load();
  };

  const columns = [
    { key: "id", header: lang === "ar" ? "رقم العملية" : "Transaction ID", render: (p) => <span className="font-display font-bold text-ink">{p.id}</span> },
    { key: "order", header: lang === "ar" ? "رقم الطلب" : "Order #", render: (p) => p.orderId },
    { key: "customer", header: lang === "ar" ? "العميل" : "Customer", render: (p) => p.customerName },
    { key: "method", header: lang === "ar" ? "طريقة الدفع" : "Method", render: (p) => p.method },
    { key: "provider", header: lang === "ar" ? "المزوّد" : "Provider", render: (p) => p.provider },
    { key: "amount", header: lang === "ar" ? "المبلغ" : "Amount", render: (p) => <Price value={p.amount} className="text-ink" /> },
    { key: "date", header: lang === "ar" ? "التاريخ" : "Date", render: (p) => formatDate(p.date, { lang }) },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (p) => (
      <div className="flex items-center gap-2">
        <StatusBadge status={p.status} label={p.status} />
        <Select value={p.status} onChange={(e) => handleStatusChange(p, e.target.value)} className="!h-8 !text-xs">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "المدفوعات" : "Payments"}</h1>
      <DataTable columns={columns} rows={payments} emptyTitle={lang === "ar" ? "مفيش مدفوعات" : "No payments"} />
    </div>
  );
}
