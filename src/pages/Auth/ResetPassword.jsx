import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "../../components/forms/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { successDialog } from "../../utils/alerts";

export default function ResetPassword() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Set new password — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError(lang === "ar" ? "لازم 6 حروف/أرقام على الأقل" : "Must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError(lang === "ar" ? "كلمتا المرور مش متطابقتين" : "Passwords don't match.");
      return;
    }
    setError("");
    setIsLoading(true);
    // Frontend-only simulation — POST to Laravel's reset endpoint later.
    window.setTimeout(async () => {
      setIsLoading(false);
      await successDialog({
        title: lang === "ar" ? "تم تغيير كلمة المرور!" : "Password updated!",
        text: lang === "ar" ? "سجّل دخولك بكلمة المرور الجديدة" : "Log in with your new password.",
      });
      navigate("/login");
    }, 600);
  };

  return (
    <AuthLayout
      title={lang === "ar" ? "كلمة مرور جديدة" : "Set a new password"}
      subtitle={lang === "ar" ? "اختار كلمة مرور قوية لحسابك" : "Choose a strong password for your account."}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label={lang === "ar" ? "كلمة المرور الجديدة" : "New password"}
          type="password"
          icon={Lock}
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}
          type="password"
          icon={Lock}
          required
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />
        {error && <p className="text-sm font-medium text-secondary">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          {lang === "ar" ? "حفظ كلمة المرور" : "Save password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
