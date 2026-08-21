import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/forms/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toastSuccess } from "../../utils/alerts";

export default function Register() {
  const { lang } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Create account — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await register(form);
      toastSuccess(lang === "ar" ? "تم إنشاء الحساب!" : "Account created!");
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || (lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={lang === "ar" ? "إنشاء حساب" : "Create your account"}
      subtitle={lang === "ar" ? "عشان تطلب أسرع في المرات الجاية" : "Order faster and track your history."}
      footer={
        <>
          {lang === "ar" ? "عندك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link to="/login" className="font-bold text-secondary hover:underline">
            {lang === "ar" ? "سجّل دخولك" : "Log in"}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label={lang === "ar" ? "الاسم بالكامل" : "Full name"}
          icon={User}
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
          type="email"
          icon={Mail}
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "رقم الموبايل" : "Phone"}
          type="tel"
          icon={Phone}
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label={lang === "ar" ? "كلمة المرور" : "Password"}
          type="password"
          icon={Lock}
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm font-medium text-secondary">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          {lang === "ar" ? "إنشاء الحساب" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
