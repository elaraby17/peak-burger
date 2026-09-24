import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ExternalLink, Radar } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/orderService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
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
          <div
            key={order.id}
            className="rounded-2xl border border-line bg-surface-50 p-4 shadow-card transition-colors hover:border-white/15 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Link to={`/account/orders/${order.id}`} className="min-w-0 transition-colors hover:text-primary">
                <p className="font-display text-lg font-bold text-text">{order.id}</p>
                <p className="mt-0.5 text-xs text-text-muted">{formatDate(order.date, { lang })}</p>
              </Link>
              <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line/60 pt-4">
              <div className="text-sm text-text-muted">
                {order.items?.length ?? 0} {lang === "ar" ? "صنف" : "items"}
                <Price value={order.total} className="mt-1 block text-lg text-text" />
              </div>
              <div className="flex gap-2">
                <Link to={`/account/orders/${order.id}/track`}>
                  <Button variant="outline" size="sm">
                    <Radar className="h-4 w-4" />
                    {lang === "ar" ? "التتبع" : "Track"}
                  </Button>
                </Link>
                <Link to={`/account/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                    {lang === "ar" ? "التفاصيل" : "Details"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}