import { useEffect, useState } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toastSuccess } from "../../utils/alerts";

export default function Profile() {
  const { lang } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Profile — Peak Burger";
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
    await updateProfile(form);
    setIsSaving(false);
    toastSuccess(lang === "ar" ? "تم حفظ التعديلات!" : "Profile updated!");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الملف الشخصي" : "Profile"}</h1>

      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-2xl font-display font-bold text-secondary">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() ?? "P"
            )}
          </div>
          <label className="absolute -end-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-card">
            <Camera className="h-4 w-4" />
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
        <div>
          <p className="font-display font-bold text-ink">{user?.name}</p>
          <p className="text-sm text-ink-soft">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <Input
          label={lang === "ar" ? "الاسم بالكامل" : "Full name"}
          icon={User}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "رقم الموبايل" : "Phone"}
          type="tel"
          icon={Phone}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
          {lang === "ar" ? "حفظ التعديلات" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
