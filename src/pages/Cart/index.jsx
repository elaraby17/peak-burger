import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import Price from "../../components/ui/Price";
import Button from "../../components/ui/Button";
import QuantitySelector from "../../components/ui/QuantitySelector";
import EmptyState from "../../components/ui/EmptyState";
import { confirmDialog } from "../../utils/alerts";

export default function Cart() {
  const { t, lang } = useLanguage();
  const { items, removeItem, increaseQuantity, decreaseQuantity, subtotal, deliveryFee, total, freeDeliveryThreshold } =
    useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cart — Peak Burger";
  }, []);

  const handleRemove = async (item) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "إزالة هذا الصنف؟" : "Remove this item?",
      text: t(item.name),
      confirmText: lang === "ar" ? "إزالة" : "Remove",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (confirmed) removeItem(item.lineId);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title={lang === "ar" ? "سلتك فاضية" : "Your cart is empty"}
          description={lang === "ar" ? "ضيف حاجة لذيذة من المنيو." : "Add something delicious from the menu."}
          actionLabel={lang === "ar" ? "تصفح المنيو" : "Explore Menu"}
          actionTo="/menu"
        />
      </div>
    );
  }

  const progress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-text">{lang === "ar" ? "سلة الطلبات" : "Your Cart"}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-3">
          {items.map((item) => (
            <div
              key={item.lineId}
              className="flex gap-4 rounded-2xl border border-line bg-surface-50 p-4 shadow-card transition-colors hover:border-white/15"
            >
              <img
                src={item.image}
                alt={t(item.name)}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23181818'/%3E%3C/svg%3E";
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold text-text">{t(item.name)}</p>
                    {item.size && <p className="text-xs text-text-muted">{t(item.size.label)}</p>}
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    aria-label="Remove item"
                    className="text-text-muted/60 transition-colors hover:text-secondary"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector
                    size="sm"
                    value={item.quantity}
                    onIncrease={() => increaseQuantity(item.lineId)}
                    onDecrease={() => decreaseQuantity(item.lineId)}
                  />
                  <Price value={item.unitPrice * item.quantity} className="text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-text">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={subtotal} className="text-text" />
            </div>
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
              {deliveryFee === 0 ? (
                <span className="font-bold text-primary">{lang === "ar" ? "مجاني" : "Free"}</span>
              ) : (
                <Price value={deliveryFee} className="text-text" />
              )}
            </div>
            {deliveryFee > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-text-muted/80">
                  {lang === "ar"
                    ? `اطلب بـ ${freeDeliveryThreshold} أو أكتر عشان توصيل مجاني`
                    : `Order ${freeDeliveryThreshold}+ for free delivery`}
                </p>
              </div>
            )}
          </div>
          <div className="my-4 border-t border-line" />
          <div className="flex justify-between font-display text-lg font-bold text-text">
            <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
            <Price value={total} className="text-primary" />
          </div>
          <Button onClick={() => navigate("/checkout")} variant="gold" size="lg" className="mt-6 w-full">
            {lang === "ar" ? "استكمال الطلب" : "Checkout"}
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </Button>
          <Link
            to="/menu"
            className="mt-3 block text-center text-sm font-semibold text-text-muted transition-colors hover:text-primary"
          >
            {lang === "ar" ? "متابعة التسوق" : "Continue shopping"}
          </Link>
        </div>
      </div>
    </div>
  );
}