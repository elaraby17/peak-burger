// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext";
// import { useAuth } from "../../context/AuthContext";
// import AuthLayout from "../../components/forms/AuthLayout";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import { toastSuccess } from "../../utils/alerts";

// export default function Login() {
//   const { lang } = useLanguage();
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/account";

//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     document.title = "Login — Peak Burger";
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);
//     try {
//       await login(form);
//       toastSuccess(lang === "ar" ? "أهلاً بيك تاني!" : "Welcome back!");
//       navigate(from, { replace: true });
//     } catch (err) {
//       setError(err.message || (lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong"));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthLayout
//       title={lang === "ar" ? "تسجيل الدخول" : "Welcome back"}
//       subtitle={lang === "ar" ? "سجّل دخولك عشان تكمل طلبك" : "Log in to order and track your favorites."}
//       footer={
//         <>
//           {lang === "ar" ? "معندكش حساب؟" : "Don't have an account?"}{" "}
//           <Link to="/register" className="font-bold text-secondary hover:underline">
//             {lang === "ar" ? "سجّل دلوقتي" : "Sign up"}
//           </Link>
//         </>
//       }
//     >
//       <form onSubmit={onSubmit} className="space-y-4">
//         <Input
//           label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
//           type="email"
//           icon={Mail}
//           required
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "كلمة المرور" : "Password"}
//           type="password"
//           icon={Lock}
//           required
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         {error && <p className="text-sm font-medium text-secondary">{error}</p>}
//         <div className="flex justify-end">
//           <Link to="/forgot-password" className="text-sm font-semibold text-text-muted hover:text-secondary">
//             {lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
//           </Link>
//         </div>
//         <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
//           {lang === "ar" ? "تسجيل الدخول" : "Log in"}
//         </Button>
//       </form>
//     </AuthLayout>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import FloatingInput from "../../components/ui/FloatingInput";
import { toastSuccess } from "../../utils/alerts";

import loginImage from "../../assets/images/products/WhatsApp Image 2026-09-23 at 7.46.43 PM.jpeg";

export default function Login() {
  const { lang } = useLanguage();
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = lang === "ar";

  useEffect(() => {
    document.title = "Login — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form);

      toastSuccess(
        isArabic ? "أهلاً بيك تاني!" : "Welcome back!"
      );

      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.message ||
          (isArabic
            ? "حصل خطأ، حاول تاني"
            : "Something went wrong")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink-deep px-4 py-6 font-display sm:px-6 lg:px-8">
      {/* =====================================================
          MAIN CARD
      ====================================================== */}
      <div
        dir="ltr"
        className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[1rem] border border-white/10 bg-white/5 lg:grid-cols-2"
      >
        {/* =====================================================
            IMAGE SIDE
        ====================================================== */}
        <section
          className={`relative hidden min-h-full overflow-hidden lg:block ${
            isArabic ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <img
            src={loginImage}
            alt="Mount Burger"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Image Content */}
          <div
            className={`absolute inset-x-0 bottom-0 p-10 xl:p-14 ${
              isArabic ? "text-right" : "text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            <div
              className={`mb-5 h-1 w-14 rounded-full bg-primary ${
                isArabic ? "ml-auto" : ""
              }`}
            />

            <h2 className="font-display text-4xl font-bold leading-tight text-gray-300 xl:text-3xl">
              YOUR CRAVING.
              <br />
              OUR CRAFT.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              {isArabic
                ? "سجّل دخولك وكمل طلبك واستمتع بأكلك المفضل."
                : "Sign in and get back to your favorite meals."}
            </p>
          </div>
        </section>

        {/* =====================================================
            LOGIN SIDE
            No card here — this is part of the main card
        ====================================================== */}
        <section
          className={`relative flex min-h-full items-center px-8 py-10 sm:px-12 lg:px-14 xl:px-20 ${
            isArabic ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="w-full max-w-xl">
            {/* =================================================
                HEADER
            ================================================== */}
            <div
              className={`mb-10 ${
                isArabic ? "text-right" : "text-left"
              }`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {/* Logo */}
              <div
                className={`mb-8 flex w-full items-center gap-3 ${
                  isArabic
                    ? "justify-end flex-row-reverse"
                    : "justify-start"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-text-dark">
                  <span className="font-display text-xl font-black">
                    M
                  </span>
                </div>

                <span className="font-display text-xl font-bold text-white">
                  {isArabic ? "ماونت" : "MOUNT"}{" "}
                  <span className="text-primary">
                    {isArabic ? "برجر" : "BURGER"}
                  </span>
                </span>
              </div>

              {/* Welcome */}
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {isArabic ? "أهلاً بيك" : "WELCOME BACK"}
              </p>

              {/* Heading */}
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                {isArabic ? "تسجيل الدخول" : "Log in"}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 max-w-sm text-sm leading-6 text-text-soft/60">
                {isArabic
                  ? "سجّل دخولك عشان تكمل طلبك وتتابع المفضلة عندك."
                  : "Log in to order and track your favorites."}
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================== */}
            <form onSubmit={onSubmit} className="space-y-7">
              {/* Email */}
              <FloatingInput
                label={isArabic ? "البريد الإلكتروني" : "Email"}
                type="email"
                icon={Mail}
                placeholder="example@email.com"
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                required
                value={form.email}
                dir={isArabic ? "rtl" : "ltr"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {/* Password */}
              <FloatingInput
                label={isArabic ? "كلمة المرور" : "Password"}
                type="password"
                icon={Lock}
                showPasswordToggle
                required
                value={form.password}
                dir={isArabic ? "rtl" : "ltr"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              {/* Error */}
              {error && (
                <div className="border-l-2 border-secondary bg-secondary/10 px-4 py-3">
                  <p
                    className={`text-sm font-medium text-secondary ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Forgot Password */}
              <div
                className={`flex ${
                  isArabic
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-text-soft/60 transition-colors hover:text-primary"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  {isArabic
                    ? "نسيت كلمة المرور؟"
                    : "Forgot password?"}
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="group w-full"
                isLoading={isLoading}
              >
                <span dir={isArabic ? "rtl" : "ltr"}>
                  {isArabic
                    ? "تسجيل الدخول"
                    : "Log in"}
                </span>

                <ArrowRight
                  size={18}
                  className={`transition-transform duration-300 ${
                    isArabic
                      ? "rotate-180 group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </Button>
            </form>

            {/* =================================================
                REGISTER
            ================================================== */}
            <div
              className="mt-8 text-center"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <p className="text-sm text-text-soft/60">
                {isArabic
                  ? "معندكش حساب؟"
                  : "Don't have an account?"}{" "}
                <Link
                  to="/register"
                  className="font-bold text-primary transition-colors hover:text-white"
                >
                  {isArabic
                    ? "سجّل دلوقتي"
                    : "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}