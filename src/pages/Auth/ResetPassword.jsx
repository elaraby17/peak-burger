// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Lock } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext";
// import AuthLayout from "../../components/forms/AuthLayout";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import { successDialog } from "../../utils/alerts";

// export default function ResetPassword() {
//   const { lang } = useLanguage();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ password: "", confirm: "" });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     document.title = "Set new password — Peak Burger";
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (form.password.length < 6) {
//       setError(lang === "ar" ? "لازم 6 حروف/أرقام على الأقل" : "Must be at least 6 characters.");
//       return;
//     }
//     if (form.password !== form.confirm) {
//       setError(lang === "ar" ? "كلمتا المرور مش متطابقتين" : "Passwords don't match.");
//       return;
//     }
//     setError("");
//     setIsLoading(true);
//     // Frontend-only simulation — POST to Laravel's reset endpoint later.
//     window.setTimeout(async () => {
//       setIsLoading(false);
//       await successDialog({
//         title: lang === "ar" ? "تم تغيير كلمة المرور!" : "Password updated!",
//         text: lang === "ar" ? "سجّل دخولك بكلمة المرور الجديدة" : "Log in with your new password.",
//       });
//       navigate("/login");
//     }, 600);
//   };

//   return (
//     <AuthLayout
//       title={lang === "ar" ? "كلمة مرور جديدة" : "Set a new password"}
//       subtitle={lang === "ar" ? "اختار كلمة مرور قوية لحسابك" : "Choose a strong password for your account."}
//     >
//       <form onSubmit={onSubmit} className="space-y-4">
//         <Input
//           label={lang === "ar" ? "كلمة المرور الجديدة" : "New password"}
//           type="password"
//           icon={Lock}
//           required
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}
//           type="password"
//           icon={Lock}
//           required
//           value={form.confirm}
//           onChange={(e) => setForm({ ...form, confirm: e.target.value })}
//         />
//         {error && <p className="text-sm font-medium text-secondary">{error}</p>}
//         <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
//           {lang === "ar" ? "حفظ كلمة المرور" : "Save password"}
//         </Button>
//       </form>
//     </AuthLayout>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import FloatingInput from "../../components/ui/FloatingInput";
import Button from "../../components/ui/Button";
import { successDialog } from "../../utils/alerts";

export default function ResetPassword() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = lang === "ar";

  useEffect(() => {
    document.title = "Set new password — Peak Burger";
  }, []);

  // =========================================================
  // SUBMIT
  // =========================================================
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.password) {
      setError(
        isArabic
          ? "اكتب كلمة المرور الجديدة"
          : "Please enter your new password."
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        isArabic
          ? "كلمة المرور لازم تكون 6 حروف أو أرقام على الأقل"
          : "Password must be at least 6 characters."
      );
      return;
    }

    if (!form.confirm) {
      setError(
        isArabic
          ? "أكد كلمة المرور"
          : "Please confirm your password."
      );
      return;
    }

    if (form.password !== form.confirm) {
      setError(
        isArabic
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match."
      );
      return;
    }

    setError("");
    setIsLoading(true);

    // Frontend-only simulation
    window.setTimeout(async () => {
      setIsLoading(false);

      await successDialog({
        title: isArabic
          ? "تم تغيير كلمة المرور!"
          : "Password updated!",
        text: isArabic
          ? "سجّل دخولك بكلمة المرور الجديدة"
          : "Log in with your new password.",
      });

      navigate("/login");
    }, 600);
  };

  return (
    <main className="min-h-screen bg-ink-deep px-4 py-6 font-display sm:px-6 lg:px-8">
      {/* =====================================================
          ONE MAIN CARD
      ====================================================== */}
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center">
        <section
          className="w-full overflow-hidden rounded-[1rem] border border-white/10 bg-white/5"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div
            className={`flex min-h-full w-full flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 xl:px-20 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {/* =================================================
                LOGO
            ================================================== */}
            <div
              className={`mb-10 flex items-center gap-3 ${
                isArabic
                  ? "flex-row-reverse justify-end"
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

            {/* =================================================
                HEADER
            ================================================== */}
            <div className="mb-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {isArabic ? "حسابك بأمان" : "SECURE YOUR ACCOUNT"}
              </p>

              <h1 className="font-display text-3xl font-bold text-white ">
                {isArabic
                  ? "كلمة مرور جديدة"
                  : "Set a new password"}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-text-soft/60">
                {isArabic
                  ? "اختار كلمة مرور قوية لحسابك."
                  : "Choose a strong password for your account."}
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================== */}
            <form
              onSubmit={onSubmit}
              className="w-full"
            >
              <div className="space-y-8">
                {/* New Password */}
                <FloatingInput
                  label={
                    isArabic
                      ? "كلمة المرور الجديدة"
                      : "New password"
                  }
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                  required
                  value={form.password}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      password: e.target.value,
                    });

                    if (error) {
                      setError("");
                    }
                  }}
                />

                {/* Confirm Password */}
                <FloatingInput
                  label={
                    isArabic
                      ? "تأكيد كلمة المرور"
                      : "Confirm password"
                  }
                  type="password"
                  icon={Lock}
                  showPasswordToggle
                  required
                  value={form.confirm}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      confirm: e.target.value,
                    });

                    if (error) {
                      setError("");
                    }
                  }}
                />
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}
              {error && (
                <div className="mt-6 border-l-2 border-secondary bg-secondary/10 px-4 py-3">
                  <p
                    className={`text-sm font-medium text-secondary ${
                      isArabic
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* =================================================
                  SUBMIT
              ================================================== */}
              <div className="mt-10">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="group w-full"
                  isLoading={isLoading}
                >
                  <span>
                    {isArabic
                      ? "حفظ كلمة المرور"
                      : "Save password"}
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
            </form>

            {/* =================================================
                BACK TO LOGIN
            ================================================== */}
            <div className="mt-8 text-center">
              <p className="text-sm text-text-soft/60">
                {isArabic
                  ? "افتكرت كلمة المرور؟"
                  : "Remember your password?"}{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-bold text-primary transition-colors hover:text-white"
                >
                  {isArabic
                    ? "سجّل دخولك"
                    : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}