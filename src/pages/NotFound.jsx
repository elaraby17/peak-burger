import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Button from "../components/ui/Button";

export default function NotFound() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = "Page not found — Peak Burger";
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">
        {lang === "ar" ? "الصفحة مش موجودة" : "Page not found"}
      </h1>
      <p className="mt-2 text-ink-soft">
        {lang === "ar" ? "يمكن الرابط غلط أو الصفحة اتشالت." : "The page you're looking for doesn't exist."}
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="lg">
          {lang === "ar" ? "الرجوع للرئيسية" : "Back to home"}
        </Button>
      </Link>
    </div>
  );
}
