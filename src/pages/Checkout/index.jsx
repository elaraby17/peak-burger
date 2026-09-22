import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Smartphone } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Price from "../../components/ui/Price";
import { confirmDialog, successDialog } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const governorates = ["Suez", "Cairo", "Giza", "Alexandria", "Ismailia", "Port Said"];

export default function Checkout() {
  const { t, lang } = useLanguage();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    governorate: governorates[0],
    area: "",
    address: "",
    building: "",
    apartment: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Checkout — Peak Burger";
    if (items.length === 0) navigate("/cart", { replace: true });
  }, [items.length, navigate]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = lang === "ar" ? "مطلوب" : "Required";
    if (!/^01[0-9]{9}$/.test(form.phone.trim())) next.phone = lang === "ar" ? "رقم غير صحيح" : "Enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = lang === "ar" ? "بريد غير صحيح" : "Enter a valid email";
    if (!form.area.trim()) next.area = lang === "ar" ? "مطلوب" : "Required";
    if (!form.address.trim()) next.address = lang === "ar" ? "مطلوب" : "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const confirmed = await confirmDialog({
      title: lang === "ar" ? "تأكيد الطلب؟" : "Confirm your order?",
      text: lang === "ar" ? `الإجمالي: ${total} جنيه` : `Total: E.L ${total}`,
      confirmText: lang === "ar" ? "تأكيد" : "Confirm",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const order = await orderService.create({
        items,
        subtotal,
        deliveryFee,
        total,
        customer: { fullName: form.fullName, phone: form.phone, email: form.email },
        address: {
          governorate: form.governorate,
          area: form.area,
          address: form.address,
          building: form.building,
          apartment: form.apartment,
          notes: form.notes,
        },
        payment: payment === "cod" ? "Cash on Delivery" : "Online Payment",
      });
      clearCart();
      await successDialog({
        title: lang === "ar" ? "تم تأكيد طلبك بنجاح!" : "Your order has been placed successfully!",
        text: lang === "ar" ? `رقم الطلب: ${order.id}` : `Order number: ${order.id}`,
      });
      navigate(`/order-success/${order.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-text">{lang === "ar" ? "استكمال الطلب" : "Checkout"}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-text">{lang === "ar" ? "بيانات العميل" : "Customer"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={lang === "ar" ? "الاسم بالكامل" : "Full name"}
                value={form.fullName}
                onChange={update("fullName")}
                error={errors.fullName}
              />
              <Input
                label={lang === "ar" ? "رقم الهاتف" : "Phone"}
                value={form.phone}
                onChange={update("phone")}
                placeholder="01xxxxxxxxx"
                error={errors.phone}
              />
              <Input
                label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
                type="email"
                value={form.email}
                onChange={update("email")}
                className="sm:col-span-2"
                error={errors.email}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-text">{lang === "ar" ? "بيانات التوصيل" : "Delivery"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label={lang === "ar" ? "المحافظة" : "Governorate"} value={form.governorate} onChange={update("governorate")}>
                {governorates.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
              <Input label={lang === "ar" ? "المنطقة" : "Area"} value={form.area} onChange={update("area")} error={errors.area} />
              <Input
                label={lang === "ar" ? "العنوان" : "Address"}
                value={form.address}
                onChange={update("address")}
                className="sm:col-span-2"
                error={errors.address}
              />
              <Input label={lang === "ar" ? "المبنى" : "Building"} value={form.building} onChange={update("building")} />
              <Input label={lang === "ar" ? "الشقة" : "Apartment"} value={form.apartment} onChange={update("apartment")} />
              <Input
                label={lang === "ar" ? "ملاحظات" : "Notes"}
                value={form.notes}
                onChange={update("notes")}
                className="sm:col-span-2"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
            <h2 className="mb-4 font-display text-lg font-bold text-text">{lang === "ar" ? "طريقة الدفع" : "Payment"}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPayment("cod")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-4 text-start",
                  payment === "cod" ? "border-secondary bg-secondary/5" : "border-line"
                )}
              >
                <Banknote className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-text">{lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}</span>
              </button>
              <button type="button" disabled className="flex cursor-not-allowed items-center gap-3 rounded-xl border-2 border-line p-4 text-start opacity-50">
                <Smartphone className="h-5 w-5 text-text-muted" />
                <span className="font-semibold text-text-muted">
                  {lang === "ar" ? "الدفع أونلاين — قريبًا" : "Online Payment — Coming Soon"}
                </span>
              </button>
            </div>
          </section>
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-text">{lang === "ar" ? "ملخص الطلب" : "Order Summary"}</h2>
          <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
            {items.map((item) => (
              <li key={item.lineId} className="flex justify-between text-text-muted">
                <span className="truncate pe-2">
                  {item.quantity}× {t(item.name)}
                </span>
                <Price value={item.unitPrice * item.quantity} className="text-text shrink-0" />
              </li>
            ))}
          </ul>
          <div className="border-t border-line pt-3 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <Price value={subtotal} className="text-text" />
            </div>
            <div className="mt-1 flex justify-between text-text-muted">
              <span>{lang === "ar" ? "التوصيل" : "Delivery"}</span>
              {deliveryFee === 0 ? <span className="font-bold text-secondary">{lang === "ar" ? "مجاني" : "Free"}</span> : <Price value={deliveryFee} className="text-text" />}
            </div>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-bold text-text">
            <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
            <Price value={total} />
          </div>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
            {lang === "ar" ? "تأكيد الطلب" : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
