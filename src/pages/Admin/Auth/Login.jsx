import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import logo from "../../../assets/logo/peak-burger-logo.jpeg";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { toastSuccess } from "../../../utils/alerts";

export default function AdminLogin() {
  const { lang } = useLanguage();
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [form, setForm] = useState({ email: "admin@peakburger.com", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form);
      toastSuccess(lang === "ar" ? "أهلاً بيك!" : "Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || (lang === "ar" ? "حصل خطأ" : "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface-50 p-8 shadow-card-hover">
        <div className="mb-6 text-center">
          <img src={logo} alt="Peak Burger" className="mx-auto mb-3 h-14 w-14 rounded-full object-cover" />
          <h1 className="font-display text-2xl font-extrabold text-text">
            {lang === "ar" ? "دخول لوحة التحكم" : "Admin login"}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {lang === "ar" ? "خاص بفريق بيك برجر فقط" : "Restricted to the Peak Burger team"}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            type="email"
            icon={Mail}
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label={lang === "ar" ? "كلمة المرور" : "Password"}
            type="password"
            icon={Lock}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="admin123"
          />
          {error && <p className="text-sm font-medium text-secondary">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {lang === "ar" ? "دخول" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-text-muted/70">
          {lang === "ar" ? "بيانات تجريبية: admin@peakburger.com / admin123" : "Demo credentials: admin@peakburger.com / admin123"}
        </p>
      </div>
    </div>
  );
}
