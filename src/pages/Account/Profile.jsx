import { useEffect, useState } from "react";
import { User, Mail, Phone, Camera, Package, Heart, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { orderService } from "../../services/orderService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const chipBase =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#181818] transition-shadow duration-300";

export default function Profile() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { user, updateProfile } = useAuth();
  const { favorites } = useFavorites();
  const [ordersCount, setOrdersCount] = useState(null);

  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Profile — Peak Burger";
    orderService
      .getAll()
      .then((orders) => setOrdersCount(orders.length))
      .catch(() => setOrdersCount(0));
  }, []);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatar: reader.result });
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(form);
      toastSuccess(isAr ? "تم حفظ التعديلات!" : "Profile updated!");
    } finally {
      setIsSaving(false);
    }
  };

  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false); // لو المستخدم اتغيّر أو رفع صورة جديدة، رجّع المحاولة تاني
  }, [user?.avatar]);

  const showAvatarImage = Boolean(user?.avatar) && !avatarError;


  const stats = [
    { label: { en: "Total Orders", ar: "إجمالي الطلبات" }, value: ordersCount, icon: Package },
    { label: { en: "Favorites", ar: "المفضلة" }, value: favorites.length, icon: Heart },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* نفس التوهج الذهبي المستخدم في Overview عشان الصفحتين يحسّوا إنهم من نفس النظام */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 12% -8%, rgba(245,180,0,0.06), transparent 42%)" }}
      />

      <div className="relative max-w-3xl space-y-8 sm:space-y-10">
        {/* Header */}
        <header className="animate-fadeIn">
          <p className="flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm rtl:tracking-normal">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F5B400]" />
            {isAr ? "حسابي" : "Your Account"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {isAr ? "الملف الشخصي" : "Profile"}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#A1A1A1]">
            {isAr ? "بياناتك الشخصية وصورتك زي ما تحب تظهر في حسابك." : "Manage your personal details and how you appear on your account."}
          </p>
        </header>

        {/* Avatar + identity card */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <label className="group relative shrink-0 cursor-pointer">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#F5B400]/50 ring-offset-4 ring-offset-[#111111] sm:h-28 sm:w-28">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#F5B400]/50 ring-offset-4 ring-offset-[#111111] sm:h-28 sm:w-28">
                  {showAvatarImage ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#181818] text-[#F5B400]">
                      <User className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.75} />
                    </div>
                  )}
                </div>
                {/* هوفر حقيقي: تعتيم + نص + أيقونة كاميرا فوق الصورة كلها */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white">
                    {isAr ? "تغيير" : "Change"}
                  </span>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </label>

            <div className="min-w-0 flex-1 text-center sm:text-start">
              <p className="truncate font-display text-xl font-extrabold text-white">{user?.name}</p>
              <p className="truncate text-sm text-[#A1A1A1]">{user?.email}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#181818] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#D4D4D4]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#F5B400]" />
                {isAr ? "حساب موثّق" : "Verified Account"}
              </span>
            </div>
          </div>

          {/* Real stats — same data source as Account Overview */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-6 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label.en}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-3.5"
              >
                <span className={cn(chipBase, "text-[#F5B400]")}>
                  <stat.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-extrabold tabular-nums text-white">
                    {stat.value ?? <span className="inline-block h-5 w-6 animate-pulse rounded bg-white/10 align-middle" />}
                  </p>
                  <p className="truncate text-xs text-[#A1A1A1]">{isAr ? stat.label.ar : stat.label.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Personal info form */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className={cn(chipBase, "text-[#F5B400]")}>
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold text-white">
                {isAr ? "البيانات الشخصية" : "Personal Information"}
              </h2>
              <p className="text-xs text-[#A1A1A1]">
                {isAr ? "دي بياناتك اللي بتستخدمها في الطلبات" : "Used across your orders and account"}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={isAr ? "الاسم بالكامل" : "Full name"}
                icon={User}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label={isAr ? "رقم الموبايل" : "Phone"}
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <Input
              label={isAr ? "البريد الإلكتروني" : "Email"}
              type="email"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-5">
              <Button type="submit" variant="gold" size="lg" isLoading={isSaving}>
                {isAr ? "حفظ التعديلات" : "Save changes"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}