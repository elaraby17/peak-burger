import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toastSuccess } from "../../utils/alerts";

export default function AdminProfile() {
  const { lang } = useLanguage();
  const { admin, updateProfile } = useAdminAuth();
  const [form, setForm] = useState({ name: admin?.name ?? "", email: admin?.email ?? "", phone: admin?.phone ?? "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Profile — Peak Burger Admin";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(form);
    setIsSaving(false);
    toastSuccess(lang === "ar" ? "تم حفظ التعديلات!" : "Profile updated!");
  };

  const onPasswordChange = (e) => {
    e.preventDefault();
    setPwForm({ current: "", next: "", confirm: "" });
    toastSuccess(lang === "ar" ? "تم تحديث كلمة المرور!" : "Password updated!");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الملف الشخصي" : "Profile"}</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <Input label={lang === "ar" ? "الاسم بالكامل" : "Full name"} icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label={lang === "ar" ? "البريد الإلكتروني" : "Email"} type="email" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label={lang === "ar" ? "رقم الموبايل" : "Phone"} type="tel" icon={Phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>{lang === "ar" ? "حفظ التعديلات" : "Save changes"}</Button>
      </form>

      <form onSubmit={onPasswordChange} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 font-display font-bold text-ink"><Lock className="h-4.5 w-4.5 text-secondary" /> {lang === "ar" ? "الأمان" : "Security"}</h2>
        <Input type="password" placeholder={lang === "ar" ? "كلمة المرور الحالية" : "Current password"} value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} />
        <Input type="password" placeholder={lang === "ar" ? "كلمة المرور الجديدة" : "New password"} value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} />
        <Button type="submit" variant="outline">{lang === "ar" ? "تحديث كلمة المرور" : "Update password"}</Button>
      </form>
    </div>
  );
}
