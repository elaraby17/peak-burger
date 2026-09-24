import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, MapPin, CreditCard, Radar, RotateCcw, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import productService from "../../services/productService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Loading from "../../components/ui/Loading";
import { formatDate } from "../../utils/format";
import { ORDER_STATUSES, statusLabels, statusTone, statusStepIndex } from "../../utils/orderStatus";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23181818'/%3E%3C/svg%3E";

export default function OrderDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
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

  const currentStep = statusStepIndex[order.status];
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "completed";

  const reorder = async () => {
    try {
      for (const item of order.items ?? []) {
        const product = await productService.getById(item.productId);
        if (product) {
          addItem(product, { size: item.size, sauce: item.sauce, quantity: item.quantity });
        }
      }
      toastSuccess(lang === "ar" ? "تمت إضافة الطلب للسلة!" : "Order added to cart!");
    } catch (error) {
      console.error("Failed to reorder:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {lang === "ar" ? "كل الطلبات" : "All orders"}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-text">{order.id}</h1>
          <p className="text-sm text-text-muted">{formatDate(order.date, { lang })}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
          <Link to={`/account/orders/${order.id}/track`}>
            <Button variant="gold" size="sm">
              <Radar className="h-4 w-4" />
              {lang === "ar" ? "تتبع الطلب" : "Track Order"}
            </Button>
          </Link>
          {isDelivered && (
            <Button variant="outline" size="sm" onClick={reorder}>
              <RotateCcw className="h-4 w-4" />
              {lang === "ar" ? "اطلب تاني" : "Order Again"}
            </Button>
          )}
        </div>
      </div>

      {/* Visual order timeline */}
      {!isCancelled && (
        <div className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
          <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
            {ORDER_STATUSES.map((status, index) => {
              const reached = index <= currentStep;
              const isLast = index === ORDER_STATUSES.length - 1;
              return (
                <li
                  key={status.id}
                  className={cn(
                    "flex flex-1 flex-row items-start gap-3 sm:flex-col sm:items-center sm:text-center",
                    index === currentStep && "sm:scale-105"
                  )}
                >
                  <div className="flex flex-col items-center sm:w-full">
                    <div className="flex items-center sm:w-full">
                      {reached ? (
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            index === currentStep ? "bg-primary shadow-pop" : "bg-primary/20"
                          )}
                        >
                          <CheckCircle2 className={cn("h-5 w-5", index === currentStep ? "text-text-dark" : "text-primary")} />
                        </span>
                      ) : (
                        <Circle className="h-6 w-6 shrink-0 text-white/20" />
                      )}
                      {!isLast && (
                        <div className={cn("hidden h-0.5 flex-1 sm:block", index < currentStep ? "bg-primary" : "bg-white/10")} />
                      )}
                    </div>
                  </div>
                  <p className={cn("pb-4 text-xs font-semibold sm:pt-2", reached ? "text-text" : "text-text-muted/50")}>
                    {t(statusLabels[status.id])}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-3">
          <h2 className="font-display text-lg font-bold text-text">{lang === "ar" ? "المنتجات" : "Items"}</h2>
          {order.items?.map((item) => (
            <div
              key={item.lineId}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface-50 p-4 shadow-card"
            >
              <img
                src={item.image}
                alt={t(item.name)}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text">{t(item.name)}</p>
                <p className="text-xs text-text-muted">
                  {item.size && `${t(item.size.label)} · `}
                  {lang === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                </p>
              </div>
              <Price value={item.unitPrice * item.quantity} className="shrink-0 text-text" />
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-text">
              <MapPin className="h-4 w-4 text-primary" /> {lang === "ar" ? "عنوان التوصيل" : "Delivery address"}
            </h3>
            <p className="text-sm text-text-muted">
              {order.address?.governorate}, {order.address?.area}
              <br />
              {order.address?.address}
              {order.address?.building && `, ${lang === "ar" ? "مبنى" : "Bldg"} ${order.address.building}`}
              {order.address?.apartment && `, ${lang === "ar" ? "شقة" : "Apt"} ${order.address.apartment}`}
            </p>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-text">
              <CreditCard className="h-4 w-4 text-primary" /> {lang === "ar" ? "طريقة الدفع" : "Payment"}
            </h3>
            <p className="text-sm text-text-muted">
              {order.payment === "Cash on Delivery" || order.payment === undefined
                ? lang === "ar"
                  ? "الدفع عند الاستلام"
                  : "Cash on Delivery"
                : lang === "ar"
                ? "الدفع أونلاين (قريبًا)"
                : "Online Payment (coming soon)"}
            </p>
          </div>
          <div className="border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={order.subtotal} className="text-text" />
            </div>
            <div className="mt-1 flex justify-between text-text-muted">
              <span>{lang === "ar" ? "التوصيل" : "Delivery"}</span>
              <Price value={order.deliveryFee} className="text-text" />
            </div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 font-display font-bold text-text">
              <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
              <Price value={order.total} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}