import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, Wallet } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { customerService } from "../../../services/customerService";
import Price from "../../../components/ui/Price";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";
import { formatDate } from "../../../utils/format";
import { statusLabels, statusTone } from "../../../utils/orderStatus";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [customer, setCustomer] = useState(undefined);

  useEffect(() => {
    document.title = "Customer — Peak Burger Admin";
    customerService.getById(id).then(setCustomer);
  }, [id]);

  if (customer === undefined) return <DashboardSkeleton />;

  if (customer === null) {
    return (
      <div className="space-y-4">
        <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-secondary">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {lang === "ar" ? "الرجوع للعملاء" : "Back to customers"}
        </Link>
        <EmptyState
          title={lang === "ar" ? "العميل مش موجود" : "Customer not found"}
          description={lang === "ar" ? "العميل اللي بتدور عليه مش موجود." : "We couldn't find that customer."}
          actionLabel={lang === "ar" ? "كل العملاء" : "All customers"}
          actionTo="/admin/customers"
        />
      </div>
    );
  }

  const stats = [
    { label: lang === "ar" ? "عدد الطلبات" : "Orders", value: customer.ordersCount, icon: ShoppingBag },
    { label: lang === "ar" ? "إجمالي الإنفاق" : "Total Spent", value: null, icon: Wallet, isPrice: true },
    { label: lang === "ar" ? "تاريخ الانضمام" : "Joined", value: formatDate(customer.joinedDate, { lang }), icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-secondary">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {lang === "ar" ? "الرجوع للعملاء" : "Back to customers"}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-surface-100 text-xl font-display font-bold text-primary">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
            ) : (
              customer.name?.charAt(0)?.toUpperCase() ?? "?"
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-text">{customer.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <Badge tone={customer.status === "active" ? "primary" : "outline"}>
          {customer.status === "active" ? (lang === "ar" ? "نشط" : "Active") : lang === "ar" ? "غير نشط" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-surface-50 p-5 shadow-card">
            <stat.icon className="h-5 w-5 text-secondary" />
            {stat.isPrice ? (
              <Price value={customer.totalSpent} className="mt-3 block text-2xl text-text" />
            ) : (
              <p className="mt-3 font-display text-2xl font-extrabold text-text">{stat.value}</p>
            )}
            <p className="text-xs font-medium text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-text">{lang === "ar" ? "طلبات العميل" : "Order History"}</h2>

        {!customer.orders || customer.orders.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface-50 p-6 text-center text-sm text-text-muted shadow-card">
            {lang === "ar" ? "العميل ده لسه معملش أي طلب" : "This customer hasn't placed any orders yet."}
          </p>
        ) : (
          <div className="space-y-3">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card sm:flex-nowrap"
              >
                <div className="min-w-[100px]">
                  <p className="font-display font-bold text-text">{order.id}</p>
                  <p className="text-xs text-text-muted">{formatDate(order.date, { lang })}</p>
                </div>
                <div className="flex-1 text-sm text-text-muted">
                  {order.items?.length ?? 0} {lang === "ar" ? "صنف" : "items"}
                </div>
                <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
                <Price value={order.total} className="text-text" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}