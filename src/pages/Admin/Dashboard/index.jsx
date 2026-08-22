import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Clock, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useLanguage } from "../../../context/LanguageContext";
import { useAdminAuth } from "../../../context/AdminAuthContext";
import { orderService } from "../../../services/orderService";
import { customerService } from "../../../services/customerService";
import StatCard from "../../../components/admin/StatCard";
import StatusBadge from "../../../components/admin/StatusBadge";
import { statusLabels } from "../../../utils/orderStatus";
import { formatDate } from "../../../utils/format";
import Price from "../../../components/ui/Price";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const RANGES = [
  { key: "today", labelEn: "Today", labelAr: "اليوم" },
  { key: "7d", labelEn: "7 Days", labelAr: "7 أيام" },
  { key: "30d", labelEn: "30 Days", labelAr: "30 يوم" },
  { key: "3m", labelEn: "3 Months", labelAr: "3 شهور" },
];

const DAYS_BY_RANGE = { today: 1, "7d": 7, "30d": 30, "3m": 90 };

function buildSeries(orders, days) {
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const dayOrders = orders.filter((o) => new Date(o.date).toDateString() === key);
    buckets.push({
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      orders: dayOrders.length,
    });
  }
  return buckets;
}

export default function AdminDashboard() {
  const { lang, t } = useLanguage();
  const { admin } = useAdminAuth();
  const [orders, setOrders] = useState(null);
  const [stats, setStats] = useState(null);
  const [customerCount, setCustomerCount] = useState(0);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    document.title = "Admin Dashboard — Peak Burger";
    orderService.getAllAdmin().then(setOrders);
    orderService.getDashboardStats().then(setStats);
    customerService.getAll().then((rows) => setCustomerCount(rows.length));
  }, []);

  if (!orders || !stats) return <DashboardSkeleton />;

  const series = buildSeries(orders, DAYS_BY_RANGE[range]);
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {lang === "ar" ? `أهلاً بيك، ${admin?.name?.split(" ")[0] ?? "Admin"} 👋` : `Welcome back, ${admin?.name?.split(" ")[0] ?? "Admin"} 👋`}
        </h1>
        <p className="text-sm text-ink-soft">
          {lang === "ar" ? "نظرة عامة على بيك برجر النهاردة" : "Peak Burger overview for today."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} tone="primary" trend="+12.5%" value={<Price value={stats.todaysRevenue} />} label={lang === "ar" ? "إيرادات اليوم" : "Today's Revenue"} />
        <StatCard icon={ShoppingBag} tone="secondary" trend="+8.2%" value={stats.todaysOrders} label={lang === "ar" ? "طلبات اليوم" : "Today's Orders"} />
        <StatCard icon={Clock} tone="ink" value={stats.pendingOrders} label={lang === "ar" ? "طلبات معلقة" : "Pending Orders"} />
        <StatCard icon={Users} tone="primary" value={customerCount} label={lang === "ar" ? "إجمالي العملاء" : "Total Customers"} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-ink">{lang === "ar" ? "التحليلات" : "Analytics"}</h2>
        <div className="flex gap-1 rounded-full bg-white p-1 shadow-card">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                range === r.key ? "bg-secondary text-white" : "text-ink-soft"
              }`}
            >
              {lang === "ar" ? r.labelAr : r.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="mb-3 text-sm font-bold text-ink">{lang === "ar" ? "الإيرادات" : "Revenue overview"}</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D71920" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D71920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A151215" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#D71920" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="mb-3 text-sm font-bold text-ink">{lang === "ar" ? "الطلبات" : "Orders overview"}</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A151215" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip />
              <Bar dataKey="orders" fill="#F5B400" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">{lang === "ar" ? "أحدث الطلبات" : "Recent Orders"}</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-secondary hover:underline">
            {lang === "ar" ? "عرض الكل" : "View all"}
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 text-start">{lang === "ar" ? "رقم الطلب" : "Order #"}</th>
                <th className="px-4 py-3 text-start">{lang === "ar" ? "العميل" : "Customer"}</th>
                <th className="px-4 py-3 text-start">{lang === "ar" ? "الأصناف" : "Items"}</th>
                <th className="px-4 py-3 text-start">{lang === "ar" ? "الإجمالي" : "Total"}</th>
                <th className="px-4 py-3 text-start">{lang === "ar" ? "الدفع" : "Payment"}</th>
                <th className="px-4 py-3 text-start">{lang === "ar" ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-cream-100/60">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${o.id}`} className="font-display font-bold text-ink hover:text-secondary">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">{o.customer?.fullName}</td>
                  <td className="px-4 py-3 text-ink-soft">{o.items?.length ?? 0} {lang === "ar" ? "صنف" : "items"}</td>
                  <td className="px-4 py-3"><Price value={o.total} className="text-ink" /></td>
                  <td className="px-4 py-3 text-ink-soft">{o.payment}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} label={t(statusLabels[o.status])} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
