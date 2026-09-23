// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Mail, Lock, User, Phone, Image as ImageIcon } from "lucide-react";
// import { useLanguage } from "../../context/LanguageContext";
// import { useAuth } from "../../context/AuthContext";
// import AuthLayout from "../../components/forms/AuthLayout";
// import Input from "../../components/ui/Input";
// import Button from "../../components/ui/Button";
// import { toastSuccess, toastError } from "../../utils/alerts";

// export default function Register() {
//   const { lang } = useLanguage();
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     password_confirmation: "",
//     avatar: null,
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     document.title = "Create account — Peak Burger";
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // التحقق البسيط من تطابق كلمة المرور محلياً قبل الإرسال
//     if (form.password !== form.password_confirmation) {
//       setError(lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await register(form);
//       toastSuccess(lang === "ar" ? "تم إنشاء الحساب!" : "Account created!");
//       navigate("/account", { replace: true });
//     } catch (err) {
//       // التعامل مع أخطاء الـ Validation القادمة من الـ Backend
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         (lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong");
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthLayout
//       title={lang === "ar" ? "إنشاء حساب" : "Create your account"}
//       subtitle={lang === "ar" ? "عشان تطلب أسرع في المرات الجاية" : "Order faster and track your history."}
//       footer={
//         <>
//           {lang === "ar" ? "عندك حساب بالفعل؟" : "Already have an account?"}{" "}
//           <Link to="/login" className="font-bold text-secondary hover:underline">
//             {lang === "ar" ? "سجّل دخولك" : "Log in"}
//           </Link>
//         </>
//       }
//     >
//       <form onSubmit={onSubmit} className="space-y-4">
//         <Input
//           label={lang === "ar" ? "الاسم بالكامل" : "Full name"}
//           icon={User}
//           required
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
//           type="email"
//           icon={Mail}
//           required
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "رقم الموبايل" : "Phone"}
//           type="tel"
//           icon={Phone}
//           required
//           value={form.phone}
//           onChange={(e) => setForm({ ...form, phone: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "صورة البروفايل" : "Profile image"}
//           type="file"
//           icon={ImageIcon}
//           accept="image/*"
//           onChange={(e) => setForm({ ...form, avatar: e.target.files[0] })}
//         />
//         <Input
//           label={lang === "ar" ? "كلمة المرور" : "Password"}
//           type="password"
//           icon={Lock}
//           required
//           minLength={6}
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <Input
//           label={lang === "ar" ? "تاكيد كلمة المرور" : "Confirm password"}
//           type="password"
//           icon={Lock}
//           required
//           minLength={6}
//           value={form.password_confirmation}
//           onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
//         />
//         {error && <p className="text-sm font-medium text-secondary">{error}</p>}
//         <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
//           {lang === "ar" ? "إنشاء الحساب" : "Create account"}
//         </Button>
//       </form>
//     </AuthLayout>
//   );
// }


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import FloatingInput from "../../components/ui/FloatingInput";
import { toastSuccess } from "../../utils/alerts";

import loginImage from "../../assets/images/products/WhatsApp Image 2026-09-23 at 7.46.43 PM.jpeg";

export default function Register() {
  const { lang } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = lang === "ar";

  useEffect(() => {
    document.title = "Create account — Peak Burger";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // التحقق من تطابق كلمة المرور
    if (form.password !== form.password_confirmation) {
      setError(
        isArabic
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match"
      );
      return;
    }

    setIsLoading(true);

    try {
      await register(form);

      toastSuccess(
        isArabic
          ? "تم إنشاء الحساب!"
          : "Account created!"
      );

      navigate("/account", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        (isArabic
          ? "حصل خطأ، حاول تاني"
          : "Something went wrong");

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                ? "أنشئ حسابك وخلّي طلباتك الجاية أسرع وأسهل."
                : "Create your account and make your next order faster and easier."}
            </p>
          </div>
        </section>

        {/* =====================================================
            REGISTER CARD
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
              className={`mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${
                isArabic ? "text-right" : "text-left"
              }`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {/* Logo */}
              <div
                className={`mb-5 flex w-full items-center gap-3 ${
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

              {/* Welcome */}
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {isArabic ? "أهلاً بيك" : "JOIN US"}
              </p>

              {/* Main Heading */}
              <h1 className="font-display text-4xl font-bold text-white">
                {isArabic
                  ? "إنشاء حساب"
                  : "Create account"}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 max-w-sm text-sm leading-6 text-text-soft/60">
                {isArabic
                  ? "أنشئ حسابك عشان تطلب أسرع وتتابع طلباتك."
                  : "Create your account to order faster and track your history."}
              </p>
            </div>

            {/* =================================================
                FORM CARD
            ================================================== */}
            <div className="rounded-2xl border border-white/10 bg-black/10 p-6 sm:p-8">
              <form
                onSubmit={onSubmit}
                className="space-y-6"
              >
                {/* Name */}
                <FloatingInput
                  label={
                    isArabic
                      ? "الاسم بالكامل"
                      : "Full name"
                  }
                  icon={User}
                  required
                  value={form.name}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

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
                  value={form.email}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />

                {/* Phone */}
                <FloatingInput
                  label={
                    isArabic
                      ? "رقم الموبايل"
                      : "Phone"
                  }
                  type="tel"
                  icon={Phone}
                  required
                  value={form.phone}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />

                {/* =================================================
                    AVATAR
                ================================================== */}
                <div className="relative">
                  <label
                    htmlFor="avatar"
                    className={`mb-2 flex items-center gap-2 text-sm font-medium text-text-soft/60 ${
                      isArabic
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <ImageIcon size={16} />

                    <span>
                      {isArabic
                        ? "صورة البروفايل"
                        : "Profile image"}
                    </span>
                  </label>

                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="block w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-text-soft/60 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-text-dark hover:border-primary/40"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        avatar: e.target.files[0],
                      })
                    }
                  />
                </div>

                {/* Password */}
                <FloatingInput
                  label={
                    isArabic
                      ? "كلمة المرور"
                      : "Password"
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
                  value={form.password_confirmation}
                  dir={isArabic ? "rtl" : "ltr"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password_confirmation:
                        e.target.value,
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
                      ? "إنشاء الحساب"
                      : "Create account"}
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
                LOGIN
            ================================================== */}
            <div
              className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-center"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <p className="text-sm text-text-soft/60">
                {isArabic
                  ? "عندك حساب بالفعل؟"
                  : "Already have an account?"}{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary transition-colors hover:text-white"
                >
                  {isArabic
                    ? "سجّل دخولك"
                    : "Log in"}
                </Link>
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}