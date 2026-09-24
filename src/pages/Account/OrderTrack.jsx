import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Radar, Check, CircleDashed, ArrowLeft, RotateCcw, XCircle, ShoppingBag } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { orderService } from "../../services/orderService";
import { orderStatusHistoryService } from "../../services/orderStatusHistoryService";
import productService from "../../services/productService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";
import { ORDER_STATUSES, statusLabels, statusTone } from "../../utils/orderStatus";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23181818'/%3E%3C/svg%3E";

const TRACK_STEPS = ORDER_STATUSES.filter((s) => s.id !== "cancelled");

const stepDesc = {
  pending: { en: "We've received your order", ar: "وصلنا طلبك" },
  processing: { en: "Our kitchen is preparing your meal", ar: "المطبخ بيحضّر طلبك" },
  completed: { en: "Delivered to your door — enjoy!", ar: "وصل طلبك وهنياً" },
};

export default function OrderTrack() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const [order, setOrder] = useState(undefined);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.title = `Track Order ${id} — Peak Burger`;
    orderService.getById(id).then(setOrder);
    orderStatusHistoryService.getByOrderId(id).then(setHistory);
  }, [id]);

  if (order === undefined) return <Loading className="min-h-[40vh]" />;

  if (order === null) {
    return (
      <EmptyState
        title={lang === "ar" ? "الطلب مش موجود" : "Order not found"}
        description={lang === "ar" ? "الطلب اللي بتتتبعه مش موجود." : "We couldn't find the order you're tracking."}
        actionLabel={lang === "ar" ? "كل الطلبات" : "All orders"}
        actionTo="/account/orders"
      />
    );
  }

  const currentStep = order.status === "cancelled" ? -1 : TRACK_STEPS.findIndex((s) => s.id === order.status);
  const isCancelled = order.status === "cancelled";

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });

  const stepDate = (statusId) => {
    if (statusId === "pending") return order.date || undefined;
    const row = history.find((h) => h.status === statusId);
    return row?.date;
  };

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
          <p className="text-sm text-text-muted">
            {lang === "ar" ? "تم الطلب" : "Placed"} · {formatDateTime(order.date)}
          </p>
        </div>
        <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
      </div>

      <div className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
        {isCancelled ? (
          <div className="flex items-center gap-4 rounded-2xl border border-secondary/30 bg-secondary/10 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white">
              <XCircle className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-text">{lang === "ar" ? "تم إلغاء الطلب" : "Order cancelled"}</h2>
              <p className="text-sm text-text-muted">
                {lang === "ar" ? "اتصل بينا لو في أي استفسار." : "Contact us if you have any questions."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary shadow-pop">
                <Radar className="h-6 w-6 text-text-dark" />
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {lang === "ar" ? "الحالة الحالية" : "Current status"}
                </p>
                <p className="font-display text-lg font-bold text-text">{t(statusLabels[order.status])}</p>
              </div>
            </div>

            <ol className="space-y-0">
              {TRACK_STEPS.map((s, index) => {
                const reached = index <= currentStep;
                const isCurrent = index === currentStep;
                const isLast = index === TRACK_STEPS.length - 1;
                const ts = stepDate(s.id);
                return (
                  <li key={s.id} className={cn("relative flex gap-4", !isLast && "pb-8")}>
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                          isCurrent
                            ? "bg-primary text-text-dark shadow-pop ring-4 ring-primary/20"
                            : reached
                            ? "bg-primary/20 text-primary"
                            : "border border-white/20 bg-surface-100 text-white/30"
                        )}
                      >
                        {reached ? <Check className="h-4 w-4" strokeWidth={3} /> : <CircleDashed className="h-4 w-4" />}
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden
                          className={cn("mt-1.5 w-0.5 flex-1 rounded-full", index < currentStep ? "bg-primary" : "bg-white/10")}
                        />
                      )}
                    </div>
                    <div className={cn("min-w-0 flex-1", !isLast && "pb-2")}>
                      <p className={cn("text-sm font-bold", reached ? "text-text" : "text-text-muted/60")}>{t(s.name)}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{t(stepDesc[s.id])}</p>
                      {ts && <p className="mt-1 text-[11px] font-medium text-text-muted/70">{formatDateTime(ts)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-3">
          <h2 className="font-display text-lg font-bold text-text">{lang === "ar" ? "تفاصيل الطلب" : "Order details"}</h2>
          {order.items?.map((item) => (
            <div key={item.lineId} className="flex items-center gap-4 rounded-2xl border border-line bg-surface-50 p-4 shadow-card">
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
          <h3 className="font-display font-bold text-text">{lang === "ar" ? "ملخص الطلب" : "Order summary"}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={order.subtotal} className="text-text" />
            </div>
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "التوصيل" : "Delivery"}</span>
              <Price value={order.deliveryFee} className="text-text" />
            </div>
            <div className="flex justify-between pt-2 font-display font-bold text-text">
              <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
              <Price value={order.total} className="text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <Link to={`/account/orders/${order.id}`}>
              <Button variant="gold" size="md" className="w-full">
                {lang === "ar" ? "تفاصيل الطلب" : "View Order Details"}
              </Button>
            </Link>
            <Link to="/account/orders">
              <Button variant="outline" size="md" className="w-full">
                {lang === "ar" ? "كل الطلبات" : "Back to Orders"}
              </Button>
            </Link>
            {order.status === "completed" && (
              <Button variant="ghost" size="md" className="w-full" onClick={reorder}>
                <RotateCcw className="h-4 w-4" />
                {lang === "ar" ? "اطلب تاني" : "Order Again"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-50 p-5 text-sm text-text-muted shadow-card">
        <ShoppingBag className="h-5 w-5 shrink-0 text-primary" />
        <p>
          {lang === "ar"
            ? "لو عندك أي سؤال عن الطلب، تواصل معنا و هنساعدك."
            : "Questions about your order? Reach out and we'll help."}
        </p>
      </div>
    </div>
  );
}