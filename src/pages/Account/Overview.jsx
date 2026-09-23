import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, Heart, RotateCcw, ListOrdered, UserCog } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { orderService } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import productService from "../../services/productService";
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

  // const reorder = (order) => {
  //   order.items?.forEach((item) => {
  //     const product = getProductBySlugOrId(item.productId);
  //     if (product) addItem(product, { size: item.size, sauce: item.sauce, quantity: item.quantity });
  //   });
  //   toastSuccess(lang === "ar" ? "تمت إضافة الطلب للسلة!" : "Order added to cart!");
  // };
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

    toastSuccess(
      lang === "ar"
        ? "تمت إضافة الطلب للسلة!"
        : "Order added to cart!"
    );
  } catch (error) {
    console.error("Failed to reorder:", error);
  }
};
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {lang === "ar" ? `أهلاً، ${user?.name?.split(" ")[0] ?? ""}` : `Hi, ${user?.name?.split(" ")[0] ?? ""}`}
        </h1>
        <p className="text-sm text-ink-soft">{lang === "ar" ? "نظرة عامة على حسابك" : "Here's your account at a glance."}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label.en} className="rounded-2xl bg-white p-5 shadow-card">
            <stat.icon className="h-5 w-5 text-secondary" />
            <p className="mt-3 font-display text-2xl font-extrabold text-ink">{stat.value}</p>
            <p className="text-xs font-medium text-ink-soft">{t(stat.label)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/menu" className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card hover:shadow-card-hover">
          <RotateCcw className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-ink">{lang === "ar" ? "اطلب تاني" : "Order Again"}</span>
        </Link>
        <Link to="/account/orders" className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card hover:shadow-card-hover">
          <ListOrdered className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-ink">{lang === "ar" ? "طلباتي" : "View Orders"}</span>
        </Link>
        <Link to="/account/profile" className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card hover:shadow-card-hover">
          <UserCog className="h-5 w-5 text-secondary" />
          <span className="text-sm font-semibold text-ink">{lang === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}</span>
        </Link>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{lang === "ar" ? "أحدث الطلبات" : "Recent Orders"}</h2>
          <Link to="/account/orders" className="text-sm font-semibold text-secondary hover:underline">
            {lang === "ar" ? "عرض الكل" : "View all"}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-ink-soft shadow-card">
            {lang === "ar" ? "لسه معملتش أي طلب" : "You haven't placed any orders yet."}
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
                <div>
                  <Link to={`/account/orders/${order.id}`} className="font-display font-bold text-ink hover:text-secondary">
                    {order.id}
                  </Link>
                  <p className="text-xs text-ink-soft">{formatDate(order.date, { lang })}</p>
                </div>
                <Badge tone={statusTone[order.status]}>{t(statusLabels[order.status])}</Badge>
                <Price value={order.total} className="text-ink" />
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
