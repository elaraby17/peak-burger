import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { toastSuccess } from "../../../utils/alerts";
import { cn } from "../../../utils/cn";
import logo from "../../../assets/logo/peak-burger-logo.jpeg";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maps an Axios error to user-facing messages based on the Laravel shape.
function extractServerErrors(err, lang) {
  const isAr = lang === "ar";
  const response = err?.response;

  if (!response) {
    return {
      fieldErrors: {},
      serverError: isAr ? "تعذر الاتصال بالخادم." : "Unable to connect to the server.",
    };
  }

  const data = response.data;
  const status = response.status;

  if (status === 422 && data?.errors) {
    return { fieldErrors: data.errors, serverError: "" };
  }

  if (status === 401) {
    return {
      fieldErrors: {},
      serverError: isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "Invalid email or password.",
    };
  }

  return {
    fieldErrors: {},
    serverError: isAr ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Please try again.",
  };
}

function firstFieldMessage(messages) {
  if (!messages) return "";
  return Array.isArray(messages) ? messages.filter(Boolean).join(", ") : String(messages);
}

export default function AdminLogin() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login — Peak Burger";
  }, []);

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) {
      errors.email = isAr ? "البريد الإلكتروني مطلوب." : "Email is required.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errors.email = isAr ? "صيغة البريد الإلكتروني غير صحيحة." : "Enter a valid email address.";
    }
    if (!form.password) {
      errors.password = isAr ? "كلمة المرور مطلوبة." : "Password is required.";
    }
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setFieldErrors({ email: "", password: "" });

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      toastSuccess(isAr ? "أهلاً بيك!" : "Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const parsed = extractServerErrors(err, lang);
      setFieldErrors({
        email: firstFieldMessage(parsed.fieldErrors?.email),
        password: firstFieldMessage(parsed.fieldErrors?.password),
      });
      setServerError(parsed.serverError);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordInputId = "admin-password";
  const passwordErrorId = "admin-password-error";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-deep px-4 py-10">
      {/* Ambient glows - subtle brand accents */}
      <div className="pointer-events-none absolute -top-32 -end-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -start-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-line bg-surface-50/80 p-8 shadow-card-hover backdrop-blur-sm sm:p-10">
          {/* Brand header */}
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 h-16 w-16">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
              <img
                src={logo}
                alt="Peak Burger"
                className="relative h-16 w-16 rounded-full border border-primary/40 object-cover"
              />
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
              Peak Burger
            </h1>
            <p className="mt-1.5 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {isAr ? "لوحة التحكم" : "Admin"}
            </p>
            <p className="mt-3 text-sm text-text-muted">
              {isAr ? "سجّل الدخول للوصول إلى اللوحة الإدارية" : "Sign in to access the admin dashboard"}
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="w-full">
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-text-muted">
                {isAr ? "البريد الإلكتروني" : "Email"}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted/70" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border border-line bg-surface-50 ps-10 pe-4 text-text placeholder:text-text-muted/70 transition-colors focus:border-primary",
                    fieldErrors.email && "border-secondary focus:border-secondary"
                  )}
                  placeholder={isAr ? "admin@peakburger.com" : "admin@peakburger.com"}
                />
              </div>
              {fieldErrors.email && (
                <p id="admin-email-error" role="alert" className="mt-1 text-xs font-medium text-secondary">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor={passwordInputId} className="block text-sm font-semibold text-text-muted">
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted/70" />
                <input
                  id={passwordInputId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  dir="ltr"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
                  className={cn(
                    "h-12 w-full rounded-xl border border-line bg-surface-50 ps-10 pe-12 text-text placeholder:text-text-muted/70 transition-colors focus:border-primary",
                    fieldErrors.password && "border-secondary focus:border-secondary"
                  )}
                  placeholder={isAr ? "••••••••" : "••••••••"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? (isAr ? "إخفاء كلمة المرور" : "Hide password") : (isAr ? "إظهار كلمة المرور" : "Show password")}
                  className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-100 hover:text-text"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id={passwordErrorId} role="alert" className="mt-1 text-xs font-medium text-secondary">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Server-level error (401 / network / 422 generic) */}
            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary"
              >
                <span className="pointer-events-none mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>{serverError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-display text-lg font-semibold tracking-wide text-text-dark shadow-pop transition-all duration-200 hover:bg-primary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {isLoading ? (isAr ? "جاري تسجيل الدخول..." : "Signing in...") : (isAr ? "تسجيل الدخول" : "Login")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-text-muted/70">
            {isAr ? "هذا القسم مخصّص لفريق بيك برجر فقط" : "Restricted to the Peak Burger team"}
          </p>
        </div>
      </div>
    </div>
  );
}