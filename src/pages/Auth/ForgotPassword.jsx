import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "../../components/forms/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Reset password — Peak Burger";
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Frontend-only simulation — a real Laravel API call happens here later.
    window.setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <AuthLayout
      title={lang === "ar" ? "استرجاع كلمة المرور" : "Forgot your password?"}
      subtitle={
        sent
          ? lang === "ar"
            ? "لو الإيميل ده متسجل عندنا، هتلاقي رابط إعادة التعيين فيه."
            : "If that email is registered, a reset link is on its way."
          : lang === "ar"
          ? "هنبعتلك رابط لإعادة تعيين كلمة المرور"
          : "We'll send a reset link to your email."
      }
      footer={
        <Link to="/login" className="font-bold text-secondary hover:underline">
          {lang === "ar" ? "الرجوع لتسجيل الدخول" : "Back to login"}
        </Link>
      }
    >
      {sent ? (
        <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/reset-password")}>
          {lang === "ar" ? "متابعة (تجربة)" : "Continue (demo)"}
        </Button>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            type="email"
            icon={Mail}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {lang === "ar" ? "إرسال الرابط" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
