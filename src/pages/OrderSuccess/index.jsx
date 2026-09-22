import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Package } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/orderService";
import Button from "../../components/ui/Button";
import Price from "../../components/ui/Price";
import Loading from "../../components/ui/Loading";
import EmptyState from "../../components/ui/EmptyState";

export default function OrderSuccess() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [order, setOrder] = useState(undefined);

  useEffect(() => {
    document.title = "Order confirmed — Peak Burger";
    orderService.getById(id).then(setOrder);
  }, [id]);

  if (order === undefined) return <Loading className="min-h-[60vh]" />;

  if (order === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <EmptyState
          title={lang === "ar" ? "الطلب مش موجود" : "Order not found"}
          actionLabel={lang === "ar" ? "الرئيسية" : "Go home"}
          actionTo="/"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 animate-popIn">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-text">
        {lang === "ar" ? "تم استلام طلبك بنجاح!" : "Your order has been placed successfully!"}
      </h1>
      <p className="mt-2 text-text-muted">
        {lang === "ar" ? "رقم طلبك هو" : "Your order number is"} <span className="font-display font-bold text-text">{order.id}</span>
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface-50 p-6 text-start shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-text-muted">
            <Package className="h-4 w-4" /> {order.items?.length ?? 0} {lang === "ar" ? "صنف" : "items"}
          </span>
          <Price value={order.total} className="text-text" />
        </div>
        <ul className="mt-3 space-y-1 text-sm text-text-muted">
          {order.items?.slice(0, 4).map((item) => (
            <li key={item.lineId} className="flex justify-between">
              <span>
                {item.quantity}× {t(item.name)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={`/account/orders/${order.id}`}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            {lang === "ar" ? "تتبع الطلب" : "Track Order"}
          </Button>
        </Link>
        <Link to="/menu">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            {lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
