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
  ArrowLeft,
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

  const isArabic = lang === "ar";

  // =========================================================
  // FORM DATA
  // =========================================================
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    document.title = "Create account — Peak Burger";
  }, []);

  // =========================================================
  // UPDATE FORM
  // =========================================================
  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts editing
    if (error) {
      setError("");
    }
  };

  // =========================================================
  // STEP VALIDATION
  // =========================================================
  const validateStep = () => {
    setError("");

    // STEP 1
    if (currentStep === 1) {
      if (!form.firstName.trim()) {
        setError(
          isArabic
            ? "اكتب الاسم الأول"
            : "Please enter your first name."
        );
        return false;
      }

      if (!form.lastName.trim()) {
        setError(
          isArabic
            ? "اكتب الاسم الأخير"
            : "Please enter your last name."
        );
        return false;
      }

      if (!form.email.trim()) {
        setError(
          isArabic
            ? "اكتب البريد الإلكتروني"
            : "Please enter your email."
        );
        return false;
      }

      return true;
    }

    // STEP 2
    if (currentStep === 2) {
      if (!form.phone.trim()) {
        setError(
          isArabic
            ? "اكتب رقم الموبايل"
            : "Please enter your phone number."
        );
        return false;
      }

      return true;
    }

    // STEP 3
    if (currentStep === 3) {
      if (!form.password) {
        setError(
          isArabic
            ? "اكتب كلمة المرور"
            : "Please enter your password."
        );
        return false;
      }

      if (form.password.length < 6) {
        setError(
          isArabic
            ? "كلمة المرور لازم تكون 6 حروف أو أرقام على الأقل"
            : "Password must be at least 6 characters."
        );
        return false;
      }

      if (!form.password_confirmation) {
        setError(
          isArabic
            ? "أكد كلمة المرور"
            : "Please confirm your password."
        );
        return false;
      }

      if (form.password !== form.password_confirmation) {
        setError(
          isArabic
            ? "كلمتا المرور غير متطابقتين"
            : "Passwords do not match."
        );
        return false;
      }

      return true;
    }

    return true;
  };

  // =========================================================
  // NEXT STEP
  // =========================================================
  const handleNext = () => {
    const isValid = validateStep();

    if (!isValid) return;

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      setError("");
    }
  };

  // =========================================================
  // PREVIOUS STEP
  // =========================================================
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setError("");
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================
  const onSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateStep();

    if (!isValid) return;

    setIsLoading(true);
    setError("");

    try {
      // Backend still receives "name"
      // We combine first + last name here.
      const registerData = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
        avatar: form.avatar,
      };

      await register(registerData);

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

  // =========================================================
  // STEP DATA
  // =========================================================
 const completedFields = [
  form.firstName.trim(),
  form.lastName.trim(),
  form.email.trim(),
  form.phone.trim(),
  form.password,
  form.password_confirmation,
].filter(Boolean).length;

const progressPercentage = Math.round(
  (completedFields / 6) * 100
);

const progressTitle =
  currentStep === 1
    ? isArabic
      ? "بياناتك الشخصية"
      : "Personal details"
    : currentStep === 2
    ? isArabic
      ? "بيانات التواصل"
      : "Contact details"
    : isArabic
    ? "تأمين الحساب"
    : "Secure your account";

  return (
    <main className="min-h-screen bg-ink-deep px-4 py-6 font-display sm:px-6 lg:px-8">
      {/* =====================================================
          ONE MAIN CARD
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

       <h2 className="font-display text-2xl font-bold leading-tight text-gray-300 xl:text-3xl">
              YOUR CRAVING.
              <br />
              OUR CRAFT.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              {isArabic
                ? "أنشئ حسابك وخلّي طلباتك الجاية أسرع وأسهل."
                : "Create your account and make your next order faster and easier."}
            </p>
          </div>
        </section>

        {/* =====================================================
            REGISTER SIDE
        ====================================================== */}
        <section
          className={`flex min-h-full w-full items-center ${
            isArabic ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div
            className={`flex min-h-full w-full flex-col justify-center px-8 py-10 sm:px-12 lg:px-14 xl:px-20 ${
              isArabic ? "text-right" : "text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
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
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                {isArabic ? "انضم لينا" : "JOIN US"}
              </p>

              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                {isArabic
                  ? "إنشاء حساب"
                  : "Create account"}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-text-soft/60">
                {isArabic
                  ? "أنشئ حسابك عشان تطلب أسرع وتتابع طلباتك."
                  : "Create your account to order faster and track your history."}
              </p>
            </div>

          {/* =================================================
    PROGRESS BAR
================================================== */}
<div className="mb-10 w-full">
  <div
    className={`mb-3 flex items-center justify-between ${
      isArabic ? "flex-row-reverse" : ""
    }`}
  >
    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text-soft/50">
      {isArabic ? "نسبة الإنجاز" : "Your progress"}
    </span>

    <span className="font-display text-sm font-bold text-primary">
      {progressPercentage}%
    </span>
  </div>

  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
    <div
      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-out"
      style={{
        width: `${progressPercentage}%`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  </div>

  <div
    className={`mt-3 flex items-center justify-between ${
      isArabic ? "flex-row-reverse" : ""
    }`}
  >
    <span className="text-xs font-medium text-text-soft/50">
      {progressTitle}
    </span>

    <span className="text-xs text-text-soft/30">
      {isArabic
        ? `الخطوة ${currentStep} من ${totalSteps}`
        : `Step ${currentStep} of ${totalSteps}`}
    </span>
  </div>
</div>

            {/* =================================================
                FORM
            ================================================== */}
            <form onSubmit={onSubmit} className="w-full">
              {/* =================================================
                  STEP 1
              ================================================== */}
              {currentStep === 1 && (
                <div className="space-y-7">
                  <div>
                    <p className="mb-1 text-lg font-bold text-white">
                      {isArabic
                        ? "خلينا نتعرف عليك"
                        : "Let's get to know you"}
                    </p>

                    <p className="text-sm text-text-soft/50">
                      {isArabic
                        ? "اكتب بياناتك الأساسية."
                        : "Enter your basic information."}
                    </p>
                  </div>

                  {/* First + Last Name */}
                  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                    <FloatingInput
                      label={
                        isArabic
                          ? "الاسم الأول"
                          : "First name"
                      }
                      type="text"
                      icon={User}
                      required
                      value={form.firstName}
                      dir={isArabic ? "rtl" : "ltr"}
                      onChange={(e) =>
                        updateForm(
                          "firstName",
                          e.target.value
                        )
                      }
                    />

                    <FloatingInput
                      label={
                        isArabic
                          ? "الاسم الأخير"
                          : "Last name"
                      }
                      type="text"
                      icon={User}
                      required
                      value={form.lastName}
                      dir={isArabic ? "rtl" : "ltr"}
                      onChange={(e) =>
                        updateForm(
                          "lastName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Email */}
                  <FloatingInput
                    label={
                      isArabic
                        ? "البريد الإلكتروني"
                        : "Email"
                    }
                    type="email"
                    icon={Mail}
                    placeholder="example@email.com"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    required
                    value={form.email}
                    dir={isArabic ? "rtl" : "ltr"}
                    onChange={(e) =>
                      updateForm(
                        "email",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

              {/* =================================================
                  STEP 2
              ================================================== */}
              {currentStep === 2 && (
                <div className="space-y-7">
                  <div>
                    <p className="mb-1 text-lg font-bold text-white">
                      {isArabic
                        ? "بيانات التواصل"
                        : "Contact details"}
                    </p>

                    <p className="text-sm text-text-soft/50">
                      {isArabic
                        ? "ضيف رقم الموبايل وصورة البروفايل."
                        : "Add your phone number and profile image."}
                    </p>
                  </div>

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
                      updateForm(
                        "phone",
                        e.target.value
                      )
                    }
                  />

                  {/* Avatar */}
                  <div className="pt-2">
                    <label
                      htmlFor="avatar"
                      className={`mb-3 flex items-center gap-2 text-sm font-medium text-text-soft/60 ${
                        isArabic
                          ? "justify-end"
                          : "justify-start"
                      }`}
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
                        updateForm(
                          "avatar",
                          e.target.files?.[0] || null
                        )
                      }
                    />

                    <p className="mt-2 text-xs text-text-soft/35">
                      {isArabic
                        ? "اختياري — ممكن تضيف صورة بعدين."
                        : "Optional — you can add a profile image later."}
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  STEP 3
              ================================================== */}
              {currentStep === 3 && (
                <div className="space-y-7">
                  <div>
                    <p className="mb-1 text-lg font-bold text-white">
                      {isArabic
                        ? "أمّن حسابك"
                        : "Secure your account"}
                    </p>

                    <p className="text-sm text-text-soft/50">
                      {isArabic
                        ? "اختار كلمة مرور قوية لحسابك."
                        : "Choose a strong password for your account."}
                    </p>
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
                    showPasswordToggle
                    required
                    value={form.password}
                    dir={isArabic ? "rtl" : "ltr"}
                    onChange={(e) =>
                      updateForm(
                        "password",
                        e.target.value
                      )
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
                    showPasswordToggle
                    required
                    value={
                      form.password_confirmation
                    }
                    dir={isArabic ? "rtl" : "ltr"}
                    onChange={(e) =>
                      updateForm(
                        "password_confirmation",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

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
                  NAVIGATION BUTTONS
              ================================================== */}
              <div
                className={`mt-10 flex gap-3 ${
                  isArabic
                    ? "flex-row-reverse"
                    : ""
                }`}
              >
                {/* Previous */}
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft
                      size={18}
                      className={
                        isArabic
                          ? "rotate-180"
                          : ""
                      }
                    />

                    <span>
                      {isArabic
                        ? "السابق"
                        : "Previous"}
                    </span>
                  </Button>
                )}

                {/* Next / Submit */}
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    variant="gold"
                    size="lg"
                    onClick={handleNext}
                    className="group flex-1"
                  >
                    <span>
                      {isArabic
                        ? "التالي"
                        : "Next"}
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
                ) : (
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="group flex-1"
                    isLoading={isLoading}
                  >
                    <span>
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
                )}
              </div>
            </form>

            {/* =================================================
                LOGIN LINK
            ================================================== */}
            <div className="mt-8 text-center">
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