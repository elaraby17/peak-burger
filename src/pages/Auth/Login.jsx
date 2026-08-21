import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/forms/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toastSuccess } from "../../utils/alerts";

export default function Login() {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Login — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form);
      toastSuccess(lang === "ar" ? "أهلاً بيك تاني!" : "Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || (lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={lang === "ar" ? "تسجيل الدخول" : "Welcome back"}
      subtitle={lang === "ar" ? "سجّل دخولك عشان تكمل طلبك" : "Log in to order and track your favorites."}
      footer={
        <>
          {lang === "ar" ? "معندكش حساب؟" : "Don't have an account?"}{" "}
          <Link to="/register" className="font-bold text-secondary hover:underline">
            {lang === "ar" ? "سجّل دلوقتي" : "Sign up"}
          </Link>
        </>
      }
    >
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
        />
        {error && <p className="text-sm font-medium text-secondary">{error}</p>}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-ink-soft hover:text-secondary">
            {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          {lang === "ar" ? "تسجيل الدخول" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
