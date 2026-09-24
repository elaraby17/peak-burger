import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Heart,
  RotateCcw,
  ListOrdered,
  UserCog,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { orderService } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { productService } from "../../services/productService";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../utils/format";
import { statusLabels, statusTone } from "../../utils/orderStatus";
import { toastSuccess } from "../../utils/alerts";
import { cn } from "../../utils/cn";

const chipBase =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#181818] transition-shadow duration-300";

function OverviewSkeleton() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <div>
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="mt-3 h-9 w-56 rounded-full" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/[0.08] bg-[#111111] p-5 sm:p-6">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="mt-4 h-8 w-16 rounded-full" />
            <Skeleton className="mt-2 h-4 w-24 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.08] bg-[#111111] p-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-28 rounded-full" />
            <Skeleton className="mt-2 h-3.5 w-20 rounded-full" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-4">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="mt-2 h-3.5 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccountOverview() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { addItem } = useCart();
  const [orders, setOrders] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const load = () => {
    setOrders(null);
    setLoadError(false);
    orderService
      .getAll()
      .then(setOrders)
      .catch((err) => {
        console.error("Failed to load orders", err);
        setLoadError(true);
      });
  };

  useEffect(() => {
    document.title = "My Account — Peak Burger";
    load();
  }, []);

  const isAr = lang === "ar";
  const firstName = user?.name?.split(" ")[0] ?? "";

  const quickActions = [
    {
      to: "/menu",
      icon: RotateCcw,
      gold: true,
      label: { en: "Order Again", ar: "اطلب تاني" },
      support: { en: "Pick up where you left off", ar: "كمّل من غير ما توقف" },
    },
    {
      to: "/account/orders",
      icon: ListOrdered,
      gold: false,
      label: { en: "View Orders", ar: "طلباتي" },
      support: { en: "Follow your orders", ar: "تابع طلباتك" },
    },
    {
      to: "/account/profile",
      icon: UserCog,
      gold: false,
      label: { en: "Edit Profile", ar: "الملف الشخصي" },
      support: { en: "Update your details", ar: "حدّث بياناتك" },
    },
  ];

  const reorder = async (order) => {
    try {
      for (const item of order.items ?? []) {
        const product = await productService.getById(item.productId);
        if (product) {
          addItem(product, {
            size: item.size,
            sauce: item.sauce,
            quantity: item.quantity,
          });
        }
      }
      toastSuccess(lang === "ar" ? "تمت إضافة الطلب للسلة!" : "Order added to cart!");
    } catch (error) {
      console.error("Failed to reorder:", error);
    }
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center">
        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#D71920]/15">
          <AlertTriangle className="h-7 w-7 text-[#D71920]" />
        </div>
        <h3 className="font-display text-xl font-bold text-white">
          {isAr ? "تعذر تحميل الطلبات" : "Unable to load orders."}
        </h3>
        <p className="max-w-sm text-sm text-[#A1A1A1]">
          {isAr ? "تأكد إن السيرفر شغال وحاول تاني." : "Make sure the server is running and try again."}
        </p>
        <Button onClick={load} variant="gold" size="md" className="mt-2">
          {isAr ? "إعادة المحاولة" : "Try again"}
        </Button>
      </div>
    );
  }

  if (!orders) return <OverviewSkeleton />;

  const pendingCount = orders.filter((o) => !["delivered", "cancelled", "completed"].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === "completed" || o.status === "delivered").length;

  const stats = [
    { label: { en: "Total Orders", ar: "إجمالي الطلبات" }, value: orders.length, icon: Package, accent: "gold" },
    { label: { en: "Pending Orders", ar: "طلبات جارية" }, value: pendingCount, icon: Clock, accent: "gold" },
    { label: { en: "Completed", ar: "طلبات مكتملة" }, value: completedCount, icon: CheckCircle2, accent: "gold" },
    { label: { en: "Favorites", ar: "المفضلة" }, value: favorites.length, icon: Heart, accent: "gold" },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 12% -8%, rgba(245,180,0,0.06), transparent 42%)" }}
      />

      <div className="relative space-y-10 sm:space-y-12">
        <header className="animate-fadeIn">
          <p className="flex items-center gap-2.5 font-display text-xs font-bold uppercase tracking-[0.35em] text-[#F5B400] sm:text-sm rtl:tracking-normal">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F5B400]" />
            {isAr ? "أهلاً بيك تاني" : "Welcome back"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {isAr ? "أهلاً، " : "Hi, "}
            <span className="text-[#F5B400]">{firstName}</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#A1A1A1] sm:text-lg">
            {isAr ? "نظرة عامة على حسابك، كل حاجة في مكانها." : "Here's your account at a glance."}
          </p>
        </header>

        <section aria-label={isAr ? "إحصائيات الحساب" : "Account statistics"}>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label.en}
                className="group rounded-3xl border border-white/[0.08] bg-[#111111] p-5 transition-all duration-300 hover:-translate-y-[3px] hover:border-white/[0.14] hover:bg-[#222222] sm:p-6"
              >
                <span
                  className={cn(
                    chipBase,
                    stat.accent === "gold"
                      ? "text-[#F5B400] group-hover:shadow-[0_0_20px_rgba(245,180,0,0.25)]"
                      : "text-[#D71920] group-hover:shadow-[0_0_20px_rgba(215,25,32,0.25)]"
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-3xl font-extrabold tabular-nums text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm leading-snug text-[#A1A1A1]">{t(stat.label)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
              {isAr ? "إجراءات سريعة" : "Quick Actions"}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className={cn(
                  "group flex items-center gap-3.5 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-[3px]",
                  action.gold
                    ? "border-transparent bg-[#F5B400] shadow-[0_8px_24px_rgba(245,180,0,0.25)] hover:bg-[#FFC21A]"
                    : "border-white/[0.08] bg-[#111111] hover:border-white/[0.14] hover:bg-[#222222]"
                )}
              >
                <span
                  className={cn(
                    chipBase,
                    action.gold
                      ? "border-[#050505]/10 bg-[#050505] text-[#F5B400]"
                      : "text-[#F5B400] group-hover:shadow-[0_0_18px_rgba(245,180,0,0.22)]"
                  )}
                >
                  <action.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-display text-sm font-bold sm:text-base", action.gold ? "text-[#050505]" : "text-white")}>
                    {t(action.label)}
                  </span>
                  <span className={cn("mt-0.5 block text-xs leading-snug", action.gold ? "text-[#050505]/70" : "text-[#A1A1A1]")}>
                    {t(action.support)}
                  </span>
                </span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 rtl:rotate-180",
                    action.gold
                      ? "text-[#050505]/80 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                      : "text-[#A1A1A1] group-hover:translate-x-1 group-hover:text-[#F5B400] rtl:group-hover:-translate-x-1"
                  )}
                />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
              {isAr ? "أحدث الطلبات" : "Recent Orders"}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-white/[0.08]" />
            <Link
              to="/account/orders"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#D4D4D4] transition-colors duration-300 hover:text-[#F5B400]"
            >
              {isAr ? "عرض الكل" : "View all"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/[0.08] bg-[#111111] px-6 py-14 text-center">
              <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#181818]">
                <Package className="h-7 w-7 text-[#F5B400]" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                {isAr ? "لسه معملتش أي طلب" : "No orders yet"}
              </h3>
              <p className="max-w-sm text-sm text-[#A1A1A1]">
                {isAr ? "أول طلب ليك هيفتح الشهية، جرب المنيو." : "Your first order is one click away — check the menu."}
              </p>
              <Link
                to="/menu"
                className="mt-2 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Button variant="gold" size="md">
                  {isAr ? "تصفح المنيو" : "Explore Menu"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-4 transition-colors duration-200 hover:border-white/15 hover:bg-[#111111]"
                >
                  <div className="sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/account/orders/${order.id}`}
                          className="font-display text-lg font-bold text-white transition-colors hover:text-[#F5B400]"
                        >
                          {order.id}
                        </Link>
                        <p className="mt-0.5 text-xs text-[#A1A1A1]">{formatDate(order.date)}</p>
                      </div>
                      <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
                    </div>

                    <div className="mt-3 flex min-w-0 items-center justify-between gap-3 border-t border-white/[0.06] pt-3 sm:mt-0 sm:justify-end sm:gap-5 sm:border-0 sm:pt-0">
                      <Price value={order.total} className="text-lg text-[#F5B400]" />
                      <button
                        onClick={() => reorder(order)}
                        className="group/btn inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#D4D4D4] transition-colors hover:text-[#F5B400]"
                      >
                        <RotateCcw className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:-rotate-45" />
                        {isAr ? "اطلب تاني" : "Order Again"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}