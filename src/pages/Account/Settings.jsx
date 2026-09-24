import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, Globe, LogOut } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const chipBase =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#181818] text-[#F5B400]";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-3.5">
      <span className="text-sm font-medium text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-12 shrink-0 rounded-full border transition-colors duration-200",
          checked ? "border-[#F5B400] bg-[#F5B400]" : "border-white/[0.12] bg-white/[0.06]"
        )}
      >
        <span
          className={cn(
            "absolute start-0.5 top-0.5 h-5 w-5 rounded-full bg-[#050505] shadow transition-transform duration-200",
            checked ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

export default function Settings() {
  const { lang, toggleLang } = useLanguage();
  const isAr = lang === "ar";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({ orderUpdates: true, promos: false });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [isSavingPw, setIsSavingPw] = useState(false);

  useEffect(() => {
    document.title = "Settings — Peak Burger";
  }, []);

  const handleLogout = async () => {
    const confirmed = await confirmDialog({
      title: isAr ? "تسجيل الخروج؟" : "Are you sure you want to logout?",
      confirmText: isAr ? "خروج" : "Logout",
      cancelText: isAr ? "إلغاء" : "Cancel",
    });
    if (confirmed) {
      await logout();
      navigate("/");
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setIsSavingPw(true);
    // Frontend-only simulation — no real password change backend yet.
    window.setTimeout(() => {
      setIsSavingPw(false);
      setPwForm({ current: "", next: "", confirm: "" });
      toastSuccess(isAr ? "تم تحديث كلمة المرور!" : "Password updated!");
    }, 500);
  };

  return (
    <div className="relative overflow-hidden">
      {/* نفس التوهج الذهبي الموجود في باقي صفحات الحساب */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 12% -8%, rgba(245,180,0,0.06), transparent 42%)" }}
      />

      <div className="relative max-w-2xl space-y-8 sm:space-y-10">
        {/* Header */}
        <header className="animate-fadeIn">
          <p className="flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm rtl:tracking-normal">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F5B400]" />
            {isAr ? "حسابي" : "Your Account"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {isAr ? "الإعدادات" : "Settings"}
          </h1>
        </header>

        {/* Notifications */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
          <div className="mb-2 flex items-center gap-3">
            <span className={chipBase}>
              <Bell className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg font-extrabold text-white">
              {isAr ? "الإشعارات" : "Notifications"}
            </h2>
          </div>
          <div className="divide-y divide-white/[0.06]">
            <Toggle
              checked={notifications.orderUpdates}
              onChange={(v) => setNotifications((n) => ({ ...n, orderUpdates: v }))}
              label={isAr ? "تحديثات الطلب" : "Order updates"}
            />
            <Toggle
              checked={notifications.promos}
              onChange={(v) => setNotifications((n) => ({ ...n, promos: v }))}
              label={isAr ? "العروض والخصومات" : "Promotions & offers"}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className={chipBase}>
              <Globe className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg font-extrabold text-white">
              {isAr ? "التفضيلات" : "Preferences"}
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#A1A1A1]">
              {isAr ? "لغة الموقع" : "Language"}
            </span>
            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-white/[0.08] bg-[#181818] px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:border-[#F5B400]/40 hover:text-[#F5B400]"
            >
              {lang === "en" ? "العربية" : "English"}
            </button>
          </div>
        </section>

        {/* Change password */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className={chipBase}>
              <Lock className="h-5 w-5" />
            </span>
            <h2 className="font-display text-lg font-extrabold text-white">
              {isAr ? "تغيير كلمة المرور" : "Change Password"}
            </h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-3.5">
            <Input
              type="password"
              placeholder={isAr ? "كلمة المرور الحالية" : "Current password"}
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
            />
            <Input
              type="password"
              placeholder={isAr ? "كلمة المرور الجديدة" : "New password"}
              value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
            />
            <Input
              type="password"
              placeholder={isAr ? "تأكيد كلمة المرور" : "Confirm new password"}
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
            />
            <button
              type="submit"
              disabled={isSavingPw}
              className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[#181818] py-3 text-sm font-bold text-white transition-colors duration-200 hover:border-[#F5B400]/40 hover:text-[#F5B400] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
            >
              {isSavingPw
                ? (isAr ? "جارٍ التحديث..." : "Updating...")
                : (isAr ? "تحديث كلمة المرور" : "Update password")}
            </button>
          </form>
        </section>

        {/* Logout */}
        <Button variant="danger" size="lg" className="w-full" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          {isAr ? "تسجيل الخروج" : "Logout"}
        </Button>
      </div>
    </div>
  );
}