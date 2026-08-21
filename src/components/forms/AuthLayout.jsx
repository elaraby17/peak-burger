import { Link } from "react-router-dom";
import logo from "../../assets/logo/peak-burger-logo.jpeg";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link to="/" className="mx-auto mb-6 flex items-center gap-2">
        <img src={logo} alt="Peak Burger" className="h-12 w-12 rounded-full object-cover" />
      </Link>
      <div className="rounded-3xl bg-white p-6 shadow-card animate-fadeIn sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {children}
      </div>
      {footer && <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>}
    </div>
  );
}
