import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { toastSuccess } from "../../../utils/alerts";

const sections = [
  { key: "general", en: "General", ar: "عام" },
  { key: "restaurant", en: "Restaurant", ar: "المطعم" },
  { key: "orders", en: "Orders", ar: "الطلبات" },
  { key: "payments", en: "Payments", ar: "المدفوعات" },
  { key: "notifications", en: "Notifications", ar: "الإشعارات" },
  { key: "appearance", en: "Appearance", ar: "المظهر" },
  { key: "language", en: "Language", ar: "اللغة" },
];

export default function AdminSettings() {
  const { lang, toggleLang } = useLanguage();
  const [active, setActive] = useState("restaurant");
  const [restaurant, setRestaurant] = useState({
    name: "Peak Burger",
    phone: "+20 100 000 0000",
    email: "hello@peakburger.com",
    address: "Suez, Egypt",
    openingHours: "Daily, 12 PM – 2 AM",
    currency: "E.L",
    deliveryFee: 25,
  });

  useEffect(() => {
    document.title = "Settings — Peak Burger Admin";
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess(lang === "ar" ? "تم حفظ الإعدادات!" : "Settings saved!");
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الإعدادات" : "Settings"}</h1>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-start text-sm font-semibold ${
                active === s.key ? "bg-secondary text-white shadow-pop" : "bg-white text-ink-soft hover:bg-cream-100"
              }`}
            >
              {lang === "ar" ? s.ar : s.en}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          {active === "restaurant" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={lang === "ar" ? "اسم المطعم" : "Restaurant name"} value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} />
                <Input label={lang === "ar" ? "الهاتف" : "Phone"} value={restaurant.phone} onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })} />
              </div>
              <Input label={lang === "ar" ? "البريد الإلكتروني" : "Email"} value={restaurant.email} onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })} />
              <Input label={lang === "ar" ? "العنوان" : "Address"} value={restaurant.address} onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })} />
              <Input label={lang === "ar" ? "ساعات العمل" : "Opening hours"} value={restaurant.openingHours} onChange={(e) => setRestaurant({ ...restaurant, openingHours: e.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={lang === "ar" ? "العملة" : "Currency"} value={restaurant.currency} onChange={(e) => setRestaurant({ ...restaurant, currency: e.target.value })} />
                <Input type="number" label={lang === "ar" ? "رسوم التوصيل" : "Delivery fee"} value={restaurant.deliveryFee} onChange={(e) => setRestaurant({ ...restaurant, deliveryFee: e.target.value })} />
              </div>
              <Button type="submit" variant="primary">{lang === "ar" ? "حفظ" : "Save"}</Button>
            </form>
          )}

          {active === "language" && (
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{lang === "ar" ? "لغة لوحة التحكم" : "Dashboard language"}</p>
              <Button variant="outline" onClick={toggleLang}>{lang === "en" ? "العربية" : "English"}</Button>
            </div>
          )}

          {!["restaurant", "language"].includes(active) && (
            <p className="text-sm text-ink-soft">
              {lang === "ar" ? "قريبًا - هيتم ربط هذا القسم بالباك إند لاحقًا." : "Coming soon - this section will be wired up once the backend is ready."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
