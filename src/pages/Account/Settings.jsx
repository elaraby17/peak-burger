import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Lock, Globe, LogOut } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../utils/alerts";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-12 rounded-full transition-colors ${checked ? "bg-secondary" : "bg-ink/15"}`}
      >
        <span
          className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[1.6em] rtl:translate-x-[1.6em]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export default function Settings() {
  const { lang, toggleLang } = useLanguage();
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
      title: lang === "ar" ? "تسجيل الخروج؟" : "Are you sure you want to logout?",
      confirmText: lang === "ar" ? "خروج" : "Logout",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
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
      toastSuccess(lang === "ar" ? "تم تحديث كلمة المرور!" : "Password updated!");
    }, 500);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الإعدادات" : "Settings"}</h1>

      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-1 flex items-center gap-2 font-display font-bold text-ink">
          <Bell className="h-4.5 w-4.5 text-secondary" /> {lang === "ar" ? "الإشعارات" : "Notifications"}
        </h2>
        <div className="divide-y divide-ink/5">
          <Toggle
            checked={notifications.orderUpdates}
            onChange={(v) => setNotifications((n) => ({ ...n, orderUpdates: v }))}
            label={lang === "ar" ? "تحديثات الطلب" : "Order updates"}
          />
          <Toggle
            checked={notifications.promos}
            onChange={(v) => setNotifications((n) => ({ ...n, promos: v }))}
            label={lang === "ar" ? "العروض والخصومات" : "Promotions & offers"}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-1 flex items-center gap-2 font-display font-bold text-ink">
          <Globe className="h-4.5 w-4.5 text-secondary" /> {lang === "ar" ? "التفضيلات" : "Preferences"}
        </h2>
        <div className="flex items-center justify-between py-3">
          <span className="text-sm font-medium text-ink">{lang === "ar" ? "لغة الموقع" : "Language"}</span>
          <Button variant="outline" size="sm" onClick={toggleLang}>
            {lang === "en" ? "العربية" : "English"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
          <Lock className="h-4.5 w-4.5 text-secondary" /> {lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <Input
            type="password"
            placeholder={lang === "ar" ? "كلمة المرور الحالية" : "Current password"}
            value={pwForm.current}
            onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
          />
          <Input
            type="password"
            placeholder={lang === "ar" ? "كلمة المرور الجديدة" : "New password"}
            value={pwForm.next}
            onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
          />
          <Input
            type="password"
            placeholder={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm new password"}
            value={pwForm.confirm}
            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
          />
          <Button type="submit" variant="outline" size="md" isLoading={isSavingPw}>
            {lang === "ar" ? "تحديث كلمة المرور" : "Update password"}
          </Button>
        </form>
      </section>

      <Button variant="danger" size="lg" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4.5 w-4.5" />
        {lang === "ar" ? "تسجيل الخروج" : "Logout"}
      </Button>
    </div>
  );
}
