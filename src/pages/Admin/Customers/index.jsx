import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { customerService } from "../../../services/customerService";
import DataTable from "../../../components/admin/DataTable";
import FilterBar from "../../../components/admin/FilterBar";
import Price from "../../../components/ui/Price";
import { formatDate } from "../../../utils/format";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminCustomers() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Customers — Peak Burger Admin";
    customerService.getAll().then(setCustomers);
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    if (!search.trim()) return customers;
    const q = search.trim().toLowerCase();
    return customers.filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q));
  }, [customers, search]);

  if (!customers) return <DashboardSkeleton />;

  const columns = [
    { key: "name", header: lang === "ar" ? "الاسم" : "Name", render: (c) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-secondary">
          {c.avatar ? <img src={c.avatar} className="h-8 w-8 rounded-full object-cover" alt="" /> : c.name?.charAt(0)?.toUpperCase()}
        </div>
        <span className="font-semibold text-ink">{c.name}</span>
      </div>
    ) },
    { key: "email", header: lang === "ar" ? "البريد" : "Email" },
    { key: "phone", header: lang === "ar" ? "الهاتف" : "Phone" },
    { key: "orders", header: lang === "ar" ? "الطلبات" : "Orders", render: (c) => c.ordersCount },
    { key: "spent", header: lang === "ar" ? "إجمالي الإنفاق" : "Total Spent", render: (c) => <Price value={c.totalSpent} className="text-ink" /> },
    { key: "joined", header: lang === "ar" ? "تاريخ الانضمام" : "Joined", render: (c) => formatDate(c.joinedDate, { lang }) },
    { key: "actions", header: "", render: (c) => (
      <Link to={`/admin/customers/${c.id}`} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Eye className="h-4 w-4" /></Link>
    ) },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "العملاء" : "Customers"}</h1>
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder={lang === "ar" ? "دور باسم أو إيميل أو موبايل..." : "Search by name, email or phone..."} />
      <DataTable columns={columns} rows={filtered} emptyTitle={lang === "ar" ? "مفيش عملاء" : "No customers yet"} />
    </div>
  );
}
