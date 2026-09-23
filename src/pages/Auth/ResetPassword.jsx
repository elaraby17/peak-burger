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

import loginImage from "../../assets/images/products/WhatsApp Image 2026-09-23 at 7.46.43 PM.jpeg";

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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError(
        isArabic
          ? "لازم 6 حروف/أرقام على الأقل"
          : "Must be at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirm) {
      setError(
        isArabic
          ? "كلمتا المرور مش متطابقتين"
          : "Passwords don't match."
      );
      return;
    }

    setError("");
    setIsLoading(true);

    // Frontend-only simulation — POST to Laravel's reset endpoint later.
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
      <div
        dir="ltr"
        className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-7xl grid-cols-1 gap-5 lg:grid-cols-2"
      >
        {/* =====================================================
            IMAGE CARD
        ====================================================== */}
        <section
          className={`relative hidden overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 lg:block ${
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

            <h2 className="font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              GOOD FOOD.
              <br />
              GOOD MOOD.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              {isArabic
                ? "غيّر كلمة المرور وخلي حسابك دايمًا في أمان."
                : "Set a new password and keep your account secure."}
            </p>
          </div>
        </section>

        {/* =====================================================
            RESET PASSWORD CARD
        ====================================================== */}
        <section
          className={`relative flex items-center rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-10 shadow-2xl sm:px-10 lg:px-12 xl:px-16 ${
            isArabic ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div className="mx-auto w-full max-w-md">

            {/* =================================================
                HEADER
            ================================================== */}
            <div
              className={`mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${
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
                {isArabic ? "حسابك بأمان" : "SECURE YOUR ACCOUNT"}
              </p>

              {/* Main Heading */}
              <h1 className="font-display text-4xl font-bold text-white">
                {isArabic
                  ? "كلمة مرور جديدة"
                  : "Set a new password"}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 max-w-sm text-sm leading-6 text-text-soft/60">
                {isArabic
                  ? "اختار كلمة مرور قوية لحسابك."
                  : "Choose a strong password for your account."}
              </p>
            </div>

            {/* =================================================
                FORM CARD
            ================================================== */}
            <div className="rounded-2xl border border-white/10 bg-black/10 p-6 sm:p-8">
              <form
                onSubmit={onSubmit}
                className="space-y-7"
              >
                {/* New Password */}
                <FloatingInput
                  label={
                    isArabic
                      ? "كلمة المرور الجديدة"
                      : "New password"
                  }
                  type="password"
                  icon={Lock}
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

                {/* Confirm Password */}
                <FloatingInput
                  label={
                    isArabic
                      ? "تأكيد كلمة المرور"
                      : "Confirm password"
                  }
                  type="password"
                  icon={Lock}
                  required
                  value={form.confirm}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirm: e.target.value,
                    })
                  }
                />

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3">
                    <p
                      className={`text-sm font-medium text-secondary ${
                        isArabic
                          ? "text-right"
                          : "text-left"
                      }`}
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      {error}
                    </p>
                  </div>
                )}

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
              </form>
            </div>

            {/* =================================================
                BACK TO LOGIN
            ================================================== */}
            <div
              className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center"
              dir={isArabic ? "rtl" : "ltr"}
            >
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