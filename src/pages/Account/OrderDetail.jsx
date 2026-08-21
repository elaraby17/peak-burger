import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, MapPin, CreditCard } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/orderService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";
import { ORDER_STATUSES, statusLabels, statusTone, statusStepIndex } from "../../utils/orderStatus";
import { cn } from "../../utils/cn";

export default function OrderDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    document.title = `Order ${id} — Peak Burger`;
    orderService.getById(id).then(setOrder);
  }, [id]);

  if (order === undefined) return <Loading className="min-h-[40vh]" />;

  if (order === null) {
    return (
      <EmptyState
        title={lang === "ar" ? "الطلب مش موجود" : "Order not found"}
        description={lang === "ar" ? "الطلب اللي بتدور عليه مش موجود." : "We couldn't find that order."}
        actionLabel={lang === "ar" ? "كل الطلبات" : "All orders"}
        actionTo="/account/orders"
      />
    );
  }

  const currentStep = statusStepIndex(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/account/orders" className="text-sm font-semibold text-ink-soft hover:text-secondary">
            {lang === "ar" ? "← كل الطلبات" : "← All orders"}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{order.id}</h1>
          <p className="text-sm text-ink-soft">{formatDate(order.date, { lang })}</p>
        </div>
        <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
      </div>

      {/* Visual order timeline */}
      {!isCancelled && (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
            {ORDER_STATUSES.map((status, index) => {
              const reached = index <= currentStep;
              const isLast = index === ORDER_STATUSES.length - 1;
              return (
                <li key={status} className="flex flex-1 flex-row items-start gap-3 sm:flex-col sm:items-center sm:text-center">
                  <div className="flex flex-col items-center sm:w-full">
                    <div className="flex items-center sm:w-full">
                      {reached ? (
                        <CheckCircle2 className="h-6 w-6 shrink-0 text-secondary" />
                      ) : (
                        <Circle className="h-6 w-6 shrink-0 text-ink/20" />
                      )}
                      {!isLast && (
                        <div
                          className={cn(
                            "hidden h-0.5 flex-1 sm:block",
                            index < currentStep ? "bg-secondary" : "bg-ink/10"
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <p className={cn("pb-4 text-xs font-semibold sm:pt-2", reached ? "text-ink" : "text-ink-soft/50")}>
                    {t(statusLabels[status])}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-ink">{lang === "ar" ? "المنتجات" : "Items"}</h2>
          {order.items?.map((item) => (
            <div key={item.lineId} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card">
              <div>
                <p className="font-semibold text-ink">{t(item.name)}</p>
                <p className="text-xs text-ink-soft">
                  {item.size && `${t(item.size.label)} · `}
                  {lang === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                </p>
              </div>
              <Price value={item.unitPrice * item.quantity} className="text-ink" />
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink">
              <MapPin className="h-4 w-4 text-secondary" /> {lang === "ar" ? "عنوان التوصيل" : "Delivery address"}
            </h3>
            <p className="text-sm text-ink-soft">
              {order.address?.governorate}, {order.address?.area}
              <br />
              {order.address?.address}
              {order.address?.building && `, ${lang === "ar" ? "مبنى" : "Bldg"} ${order.address.building}`}
              {order.address?.apartment && `, ${lang === "ar" ? "شقة" : "Apt"} ${order.address.apartment}`}
            </p>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink">
              <CreditCard className="h-4 w-4 text-secondary" /> {lang === "ar" ? "طريقة الدفع" : "Payment"}
            </h3>
            <p className="text-sm text-ink-soft">
              {order.payment === "Cash on Delivery" || order.payment === undefined
                ? lang === "ar"
                  ? "الدفع عند الاستلام"
                  : "Cash on Delivery"
                : lang === "ar"
                ? "الدفع أونلاين (قريبًا)"
                : "Online Payment (coming soon)"}
            </p>
          </div>
          <div className="border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={order.subtotal} className="text-ink" />
            </div>
            <div className="mt-1 flex justify-between text-ink-soft">
              <span>{lang === "ar" ? "التوصيل" : "Delivery"}</span>
              <Price value={order.deliveryFee} className="text-ink" />
            </div>
            <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-display font-bold text-ink">
              <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
              <Price value={order.total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
