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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-ink">{lang === "ar" ? "سلة الطلبات" : "Your Cart"}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.lineId} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card">
              <img
                src={item.image}
                alt={t(item.name)}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FCEACB'/%3E%3C/svg%3E";
                }}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-ink">{t(item.name)}</p>
                    {item.size && <p className="text-xs text-ink-soft">{t(item.size.label)}</p>}
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    aria-label="Remove item"
                    className="text-ink-soft/60 hover:text-secondary"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector
                    size="sm"
                    value={item.quantity}
                    onIncrease={() => increaseQuantity(item.lineId)}
                    onDecrease={() => decreaseQuantity(item.lineId)}
                  />
                  <Price value={item.unitPrice * item.quantity} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={subtotal} className="text-ink" />
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>{lang === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
              {deliveryFee === 0 ? (
                <span className="font-bold text-secondary">{lang === "ar" ? "مجاني" : "Free"}</span>
              ) : (
                <Price value={deliveryFee} className="text-ink" />
              )}
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-ink-soft/70">
                {lang === "ar"
                  ? `اطلب بـ ${freeDeliveryThreshold} أو أكتر عشان توصيل مجاني`
                  : `Order ${freeDeliveryThreshold}+ for free delivery`}
              </p>
            )}
          </div>
          <div className="my-4 border-t border-ink/10" />
          <div className="flex justify-between font-display text-lg font-bold text-ink">
            <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
            <Price value={total} />
          </div>
          <Button onClick={() => navigate("/checkout")} variant="primary" size="lg" className="mt-6 w-full">
            {lang === "ar" ? "استكمال الطلب" : "Checkout"}
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </Button>
          <Link to="/menu" className="mt-3 block text-center text-sm font-semibold text-ink-soft hover:text-secondary">
            {lang === "ar" ? "متابعة التسوق" : "Continue shopping"}
          </Link>
        </div>
      </div>
    </div>
  );
}
