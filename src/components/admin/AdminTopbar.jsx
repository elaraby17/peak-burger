import { Link } from "react-router-dom";
import { Menu as MenuIcon, Languages, LogOut, User } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { confirmDialog } from "../../utils/alerts";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ onMenuClick }) {
  const { lang, toggleLang } = useLanguage();
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "تسجيل الخروج؟" : "Log out?",
      confirmText: lang === "ar" ? "خروج" : "Log out",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (confirmed) {
      await logout();
      navigate("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink/5 bg-cream/90 px-4 backdrop-blur-md sm:px-6">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <div className="ms-auto flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-ink-soft hover:bg-white sm:flex"
        >
          <Languages className="h-4 w-4" />
          {lang === "en" ? "AR" : "EN"}
        </button>

        <Link
          to="/admin/profile"
          className="flex items-center gap-2 rounded-full py-1.5 pe-3 ps-1.5 hover:bg-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-secondary">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-semibold text-ink sm:block">{admin?.name}</span>
        </Link>

        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-secondary-50"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}
