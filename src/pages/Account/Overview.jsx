import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, Heart, RotateCcw, ListOrdered, UserCog } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { orderService } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { getProductBySlugOrId } from "../../data/products";
import Price from "../../components/ui/Price";
import Badge from "../../components/ui/Badge";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { formatDate } from "../../utils/format";
import { statusLabels, statusTone } from "../../utils/orderStatus";
import { toastSuccess } from "../../utils/alerts";

export default function AccountOverview() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { addItem } = useCart();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    document.title = "My Account — Peak Burger";
    orderService.getAll().then(setOrders);
  }, []);

  if (!orders) return <DashboardSkeleton />;

  const pendingCount = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    { label: { en: "Total Orders", ar: "إجمالي الطلبات" }, value: orders.length, icon: Package },
    { label: { en: "Pending Orders", ar: "طلبات جارية" }, value: pendingCount, icon: Clock },
    { label: { en: "Completed", ar: "طلبات مكتملة" }, value: completedCount, icon: CheckCircle2 },
    { label: { en: "Favorites", ar: "المفضلة" }, value: favorites.length, icon: Heart },
  ];

  const recentOrders = orders.slice(0, 3);

  const reorder = (order) => {
    order.items?.forEach((item) => {
      const product = getProductBySlugOrId(item.productId);
      if (product) addItem(product, { size: item.size, sauce: item.sauce, quantity: item.quantity });
    });
    toastSuccess(lang === "ar" ? "تمت إضافة الطلب للسلة!" : "Order added to cart!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-text">
          {lang === "ar" ? `أهلاً، ${user?.name?.split(" ")[0] ?? ""}` : `Hi, ${user?.name?.split(" ")[0] ?? ""}`}
        </h1>
        <p className="text-sm text-text-muted">{lang === "ar" ? "نظرة عامة على حسابك" : "Here's your account at a glance."}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label.en} className="rounded-2xl border border-line bg-surface-50 p-5 shadow-card">
            <stat.icon className="h-5 w-5 text-secondary" />
            <p className="mt-3 font-display text-2xl font-extrabold text-text">{stat.value}</p>
            <p className="text-xs font-medium text-text-muted">{t(stat.label)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/menu" className="flex items-center gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card hover:shadow-card-hover">
          <RotateCcw className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-text">{lang === "ar" ? "اطلب تاني" : "Order Again"}</span>
        </Link>
        <Link to="/account/orders" className="flex items-center gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card hover:shadow-card-hover">
          <ListOrdered className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-text">{lang === "ar" ? "طلباتي" : "View Orders"}</span>
        </Link>
        <Link to="/account/profile" className="flex items-center gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card hover:shadow-card-hover">
          <UserCog className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-text">{lang === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}</span>
        </Link>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-text">{lang === "ar" ? "أحدث الطلبات" : "Recent Orders"}</h2>
          <Link to="/account/orders" className="text-sm font-semibold text-secondary hover:underline">
            {lang === "ar" ? "عرض الكل" : "View all"}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface-50 p-6 text-center text-sm text-text-muted shadow-card">
            {lang === "ar" ? "لسه معملتش أي طلب" : "You haven't placed any orders yet."}
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface-50 p-4 shadow-card">
                <div>
                  <Link to={`/account/orders/${order.id}`} className="font-display font-bold text-text hover:text-secondary">
                    {order.id}
                  </Link>
                  <p className="text-xs text-text-muted">{formatDate(order.date, { lang })}</p>
                </div>
                <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
                <Price value={order.total} className="text-text" />
                <button
                  onClick={() => reorder(order)}
                  className="text-sm font-semibold text-secondary hover:underline"
                >
                  {lang === "ar" ? "اطلب تاني" : "Order Again"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
