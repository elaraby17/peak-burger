import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, Phone, Calendar } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { customerService } from "../../../services/customerService";
import StatusBadge from "../../../components/admin/StatusBadge";
import Price from "../../../components/ui/Price";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/format";
import { statusLabels } from "../../../utils/orderStatus";

export default function CustomerDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [customer, setCustomer] = useState(undefined);

  useEffect(() => {
    document.title = "Customer — Peak Burger Admin";
    customerService.getById(id).then(setCustomer);
  }, [id]);

  if (customer === undefined) return <Loading className="min-h-[40vh]" />;
  if (customer === null) {
    return <EmptyState title={lang === "ar" ? "العميل مش موجود" : "Customer not found"} actionLabel={lang === "ar" ? "كل العملاء" : "All customers"} actionTo="/admin/customers" />;
  }

  const totalSpent = customer.orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="text-sm font-semibold text-ink-soft hover:text-secondary">
        {lang === "ar" ? "← كل العملاء" : "← All customers"}
      </Link>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-secondary">
          {customer.avatar ? <img src={customer.avatar} className="h-16 w-16 rounded-full object-cover" alt="" /> : customer.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-xl font-extrabold text-ink">{customer.name}</h1>
          <p className="flex items-center gap-1 text-sm text-ink-soft"><Mail className="h-3.5 w-3.5" />{customer.email}</p>
          <p className="flex items-center gap-1 text-sm text-ink-soft"><Phone className="h-3.5 w-3.5" />{customer.phone}</p>
          <p className="flex items-center gap-1 text-sm text-ink-soft"><Calendar className="h-3.5 w-3.5" />{formatDate(customer.createdAt, { lang })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink">{customer.orders.length}</p>
          <p className="text-xs text-ink-soft">{lang === "ar" ? "إجمالي الطلبات" : "Total orders"}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink"><Price value={totalSpent} /></p>
          <p className="text-xs text-ink-soft">{lang === "ar" ? "إجمالي الإنفاق" : "Total spent"}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink">{lang === "ar" ? "الطلبات" : "Orders"}</h2>
        {customer.orders.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink-soft shadow-card">{lang === "ar" ? "لسه معملش أي طلب" : "No orders yet."}</p>
        ) : (
          <div className="space-y-3">
            {customer.orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
                <span className="font-display font-bold text-ink">{o.id}</span>
                <span className="text-sm text-ink-soft">{formatDate(o.date, { lang })}</span>
                <StatusBadge status={o.status} label={t(statusLabels[o.status])} />
                <Price value={o.total} className="text-ink" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
