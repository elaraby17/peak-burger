import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { orderService } from "../../../services/orderService";
import { branchService } from "../../../services/branchService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import FilterBar from "../../../components/admin/FilterBar";
import Pagination from "../../../components/admin/Pagination";
import Price from "../../../components/ui/Price";
import { statusLabels, ORDER_STATUSES } from "../../../utils/orderStatus";
import { formatDate } from "../../../utils/format";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const PAGE_SIZE = 8;

export default function AdminOrders() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState(null);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.title = "Orders — Peak Burger Admin";
    orderService.getAllAdmin().then(setOrders);
    branchService.getAll().then(setBranches);
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (payment !== "all" && o.payment !== payment) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${o.id} ${o.customer?.fullName} ${o.customer?.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, status, payment]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (!orders) return <DashboardSkeleton />;

  const branchName = (id) => branches.find((b) => b.id === id)?.nameEn || "-";

  const columns = [
    { key: "id", header: lang === "ar" ? "رقم الطلب" : "Order #", render: (o) => (
      <Link to={`/admin/orders/${o.id}`} className="font-display font-bold text-ink hover:text-secondary">{o.id}</Link>
    ) },
    { key: "customer", header: lang === "ar" ? "العميل" : "Customer", render: (o) => o.customer?.fullName },
    { key: "items", header: lang === "ar" ? "الأصناف" : "Items", render: (o) => `${o.items?.length ?? 0} ${lang === "ar" ? "صنف" : "items"}` },
    { key: "branch", header: lang === "ar" ? "الفرع" : "Branch", render: (o) => branchName(o.branchId) },
    { key: "total", header: lang === "ar" ? "الإجمالي" : "Total", render: (o) => <Price value={o.total} className="text-ink" /> },
    { key: "payment", header: lang === "ar" ? "الدفع" : "Payment" },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (o) => <StatusBadge status={o.status} label={t(statusLabels[o.status])} /> },
    { key: "date", header: lang === "ar" ? "التاريخ" : "Date", render: (o) => formatDate(o.date, { lang }) },
    { key: "actions", header: "", render: (o) => (
      <Link to={`/admin/orders/${o.id}`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100">
        <Eye className="h-4 w-4" />
      </Link>
    ) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الطلبات" : "Orders"}</h1>

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder={lang === "ar" ? "دور برقم الطلب أو العميل..." : "Search by order # or customer..."}
        filters={[
          {
            value: status,
            onChange: (v) => { setStatus(v); setPage(1); },
            options: [
              { value: "all", label: lang === "ar" ? "كل الحالات" : "All statuses" },
              ...ORDER_STATUSES.map((s) => ({ value: s, label: t(statusLabels[s]) })),
            ],
          },
          {
            value: payment,
            onChange: (v) => { setPayment(v); setPage(1); },
            options: [
              { value: "all", label: lang === "ar" ? "كل طرق الدفع" : "All payments" },
              { value: "Cash on Delivery", label: lang === "ar" ? "كاش" : "Cash on Delivery" },
              { value: "Online Payment", label: lang === "ar" ? "أونلاين" : "Online Payment" },
            ],
          },
        ]}
      />

      <DataTable columns={columns} rows={paged} emptyTitle={lang === "ar" ? "مفيش طلبات" : "No orders found"} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
