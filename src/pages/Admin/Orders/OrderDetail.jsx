import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, CreditCard, User } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { orderService } from "../../../services/orderService";
import OrderTimeline from "../../../components/admin/OrderTimeline";
import StatusBadge from "../../../components/admin/StatusBadge";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Price from "../../../components/ui/Price";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import { formatDate } from "../../../utils/format";
import { ORDER_STATUSES, statusLabels } from "../../../utils/orderStatus";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [order, setOrder] = useState(undefined);
  const [nextStatus, setNextStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const load = () => orderService.getById(id).then((o) => { setOrder(o); setNextStatus(o?.status || ""); });

  useEffect(() => {
    document.title = `Order ${id} — Peak Burger Admin`;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (order === undefined) return <Loading className="min-h-[40vh]" />;
  if (order === null) {
    return (
      <EmptyState
        title={lang === "ar" ? "الطلب مش موجود" : "Order not found"}
        actionLabel={lang === "ar" ? "كل الطلبات" : "All orders"}
        actionTo="/admin/orders"
      />
    );
  }

  const handleStatusChange = async () => {
    if (nextStatus === order.status) return;
    const confirmed = await confirmDialog({
      title: lang === "ar"
        ? `متأكد إنك عايز تغيّر الطلب لـ ${t(statusLabels[nextStatus])}؟`
        : `Are you sure you want to change this order to ${t(statusLabels[nextStatus])}?`,
      confirmText: lang === "ar" ? "تأكيد" : "Confirm",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;
    setIsUpdating(true);
    await orderService.updateStatus(order.id, nextStatus);
    await load();
    setIsUpdating(false);
    toastSuccess(lang === "ar" ? "تم تحديث حالة الطلب بنجاح." : "Order status updated successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/orders" className="text-sm font-semibold text-ink-soft hover:text-secondary">
            {lang === "ar" ? "← كل الطلبات" : "← All orders"}
          </Link>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{order.id}</h1>
          <p className="text-sm text-ink-soft">{formatDate(order.date, { lang })}</p>
        </div>
        <StatusBadge status={order.status} label={t(statusLabels[order.status])} />
      </div>

      <OrderTimeline status={order.status} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-ink">{lang === "ar" ? "المنتجات" : "Items"}</h2>
          {order.items?.map((item) => (
            <div key={item.lineId} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card">
              <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <div className="flex-1">
                <p className="font-semibold text-ink">{t(item.name)}</p>
                <p className="text-xs text-ink-soft">
                  {item.size && `${t(item.size.label)} · `}
                  {item.sauce && `${item.sauce} · `}
                  {lang === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                </p>
              </div>
              <Price value={item.unitPrice * item.quantity} className="text-ink" />
            </div>
          ))}
        </div>

        <div className="h-fit space-y-5 rounded-2xl bg-white p-6 shadow-card">
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink">
              <User className="h-4 w-4 text-secondary" /> {lang === "ar" ? "بيانات العميل" : "Customer"}
            </h3>
            <p className="text-sm text-ink-soft">{order.customer?.fullName}</p>
            <p className="text-sm text-ink-soft">{order.customer?.phone}</p>
            <p className="text-sm text-ink-soft">{order.customer?.email}</p>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink">
              <MapPin className="h-4 w-4 text-secondary" /> {lang === "ar" ? "عنوان التوصيل" : "Delivery address"}
            </h3>
            <p className="text-sm text-ink-soft">
              {order.address?.governorate}, {order.address?.area}<br />
              {order.address?.address}
            </p>
          </div>
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-ink">
              <CreditCard className="h-4 w-4 text-secondary" /> {lang === "ar" ? "طريقة الدفع" : "Payment"}
            </h3>
            <p className="text-sm text-ink-soft">{order.payment}</p>
          </div>
          <div className="border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-soft"><span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span><Price value={order.subtotal} className="text-ink" /></div>
            <div className="mt-1 flex justify-between text-ink-soft"><span>{lang === "ar" ? "التوصيل" : "Delivery"}</span><Price value={order.deliveryFee} className="text-ink" /></div>
            <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-display font-bold text-ink"><span>{lang === "ar" ? "الإجمالي" : "Total"}</span><Price value={order.total} /></div>
          </div>

          <div className="border-t border-ink/10 pt-4">
            <p className="mb-2 text-sm font-bold text-ink">{lang === "ar" ? "تحديث الحالة" : "Update status"}</p>
            <Select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{t(statusLabels[s.id])}</option>
              ))}
            </Select>
            <Button className="mt-3 w-full" variant="primary" onClick={handleStatusChange} isLoading={isUpdating} disabled={nextStatus === order.status}>
              {lang === "ar" ? "تحديث الحالة" : "Update status"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
