import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/orderService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { OrderRowSkeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../utils/format";
import { statusLabels, statusTone } from "../../utils/orderStatus";

export default function Orders() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    document.title = "My Orders — Peak Burger";
    orderService.getAll().then(setOrders);
  }, []);

  if (!orders) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={lang === "ar" ? "لسه معملتش أي طلب" : "No orders yet"}
        description={lang === "ar" ? "أول طلب ليك هيظهر هنا." : "Your first order will show up here."}
        actionLabel={lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
        actionTo="/menu"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "طلباتي" : "My Orders"}</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/account/orders/${order.id}`}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card transition-shadow hover:shadow-card-hover sm:flex-nowrap"
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
            <ChevronRight className="h-4 w-4 text-text-muted rtl:rotate-180" />
          </Link>
        ))}
      </div>
    </div>
  );
}
