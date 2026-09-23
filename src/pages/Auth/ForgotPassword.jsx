// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Mail } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext";
// import AuthLayout from "../../components/forms/AuthLayout";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";

// export default function ForgotPassword() {
//   const { lang } = useLanguage();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     document.title = "Reset password — Peak Burger";
//   }, []);

//   const onSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     // Frontend-only simulation — a real Laravel API call happens here later.
//     window.setTimeout(() => {
//       setIsLoading(false);
//       setSent(true);
//     }, 600);
//   };

//   return (
//     <AuthLayout
//       title={lang === "ar" ? "استرجاع كلمة المرور" : "Forgot your password?"}
//       subtitle={
//         sent
//           ? lang === "ar"
//             ? "لو الإيميل ده متسجل عندنا، هتلاقي رابط إعادة التعيين فيه."
//             : "If that email is registered, a reset link is on its way."
//           : lang === "ar"
//           ? "هنبعتلك رابط لإعادة تعيين كلمة المرور"
//           : "We'll send a reset link to your email."
//       }
//       footer={
//         <Link to="/login" className="font-bold text-secondary hover:underline">
//           {lang === "ar" ? "الرجوع لتسجيل الدخول" : "Back to login"}
//         </Link>
//       }
//     >
//       {sent ? (
//         <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/reset-password")}>
//           {lang === "ar" ? "متابعة (تجربة)" : "Continue (demo)"}
//         </Button>
//       ) : (
//         <form onSubmit={onSubmit} className="space-y-4">
//           <Input
//             label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
//             type="email"
//             icon={Mail}
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
//             {lang === "ar" ? "إرسال الرابط" : "Send reset link"}
//           </Button>
//         </form>
//       )}
//     </AuthLayout>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import FloatingInput from "../../components/ui/FloatingInput";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = lang === "ar";

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
    <main className="min-h-screen bg-ink-deep px-4 py-8 font-display sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-8">
          
          {/* =================================================
              HEADER
          ================================================== */}
          <div
            className={`mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${
              isArabic ? "text-right" : "text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Logo */}
            <div
              className={`mb-6 flex w-full items-center gap-3 ${
                isArabic
                  ? "flex-row-reverse justify-end"
                  : "justify-start"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-text-dark">
                <span className="font-display text-xl font-black">
                  P
                </span>
              </div>

              <span
                className={`font-display text-xl font-bold text-white ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {isArabic ? "ماونت" : "MOUNT"}{" "}
                <span className="text-primary">
                  {isArabic ? "برجر" : "BURGER"}
                </span>
              </span>
            </div>

            {/* Small Heading */}
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {sent
                ? isArabic
                  ? "تم الإرسال"
                  : "LINK SENT"
                : isArabic
                ? "استرجاع الحساب"
                : "ACCOUNT RECOVERY"}
            </p>

            {/* Main Heading */}
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {isArabic
                ? "استرجاع كلمة المرور"
                : "Forgot your password?"}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 max-w-md text-sm leading-6 text-text-soft/60">
              {sent
                ? isArabic
                  ? "لو الإيميل ده متسجل عندنا، هتلاقي رابط إعادة التعيين فيه."
                  : "If that email is registered, a reset link is on its way."
                : isArabic
                ? "هنبعتلك رابط لإعادة تعيين كلمة المرور."
                : "We'll send a reset link to your email."}
            </p>
          </div>

          {/* =================================================
              FORM / SUCCESS CARD
          ================================================== */}
          <div className="rounded-2xl border border-white/10 bg-black/10 p-6 sm:p-8">
            {sent ? (
              <div
                className="text-center"
                dir={isArabic ? "rtl" : "ltr"}
              >
                {/* Success Icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="font-display text-2xl font-bold text-white">
                  {isArabic
                    ? "راجع إيميلك"
                    : "Check your email"}
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-soft/60">
                  {isArabic
                    ? "لو الإيميل متسجل عندنا، رابط إعادة تعيين كلمة المرور هيكون موجود هناك."
                    : "If the email is registered, you'll find a password reset link there."}
                </p>

                <Button
                  variant="gold"
                  size="lg"
                  className="group mt-7 w-full"
                  onClick={() => navigate("/reset-password")}
                >
                  <span>
                    {isArabic ? "متابعة" : "Continue"}
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
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="space-y-7"
              >
                {/* Email */}
                <FloatingInput
                  label={
                    isArabic
                      ? "البريد الإلكتروني"
                      : "Email"
                  }
                  type="email"
                  icon={Mail}
                  required
                  value={email}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) => setEmail(e.target.value)}
                />

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
                      ? "إرسال الرابط"
                      : "Send reset link"}
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
            )}
          </div>

          {/* =================================================
              BACK TO LOGIN
          ================================================== */}
          <div
            className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Link
              to="/login"
              className="text-sm font-bold text-primary transition-colors hover:text-white"
            >
              {isArabic
                ? "الرجوع لتسجيل الدخول"
                : "Back to login"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}