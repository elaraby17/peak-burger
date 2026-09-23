import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { customerService } from "../../../services/customerService";
import DataTable from "../../../components/admin/DataTable";
import FilterBar from "../../../components/admin/FilterBar";
import Price from "../../../components/ui/Price";
import Badge from "../../../components/ui/Badge";
import ErrorState from "../../../components/ui/ErrorState";
import { formatDate } from "../../../utils/format";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminCustomers() {
  const { lang } = useLanguage();
  const [customers, setCustomers] = useState(null);
  const [search, setSearch] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = () => {
    setIsLoading(true);
    setLoadError(false);
    customerService
      .getAll()
      .then(setCustomers)
      .catch((err) => {
        console.error("Failed to load customers", err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    document.title = "Customers — Peak Burger Admin";
    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    if (!search.trim()) return customers;
    const q = search.trim().toLowerCase();
    return customers.filter((c) => `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q));
  }, [customers, search]);

  const handleDelete = async (customer) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "حذف العميل؟" : "Delete this customer?",
      text: customer.name,
      confirmText: lang === "ar" ? "حذف" : "Delete",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;

    try {
      await customerService.remove(customer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      toastSuccess(lang === "ar" ? "تم حذف العميل" : "Customer deleted");
    } catch (err) {
      console.error("Failed to delete customer", err);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  if (loadError) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "العملاء" : "Customers"}</h1>
        <ErrorState
          title={lang === "ar" ? "معرفناش نجيب العملاء" : "Couldn't load customers"}
          description={lang === "ar" ? "تأكد إن السيرفر شغال وحاول تاني." : "Make sure the API is running and try again."}
          onRetry={loadCustomers}
        />
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      header: lang === "ar" ? "الاسم" : "Name",
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-100 text-xs font-bold text-primary">
            {c.avatar && (
              <img
                src={
                  c.avatar.startsWith("http") ? c.avatar : `${import.meta.env.VITE_API_BASE_URL}${c.avatar}`
                }
                alt={c.name || "Avatar"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="font-semibold text-text">{c.name}</span>
        </div>
      ),
    },
    { key: "email", header: lang === "ar" ? "البريد" : "Email" },
    { key: "phone", header: lang === "ar" ? "الهاتف" : "Phone" },
    { key: "orders", header: lang === "ar" ? "الطلبات" : "Orders", render: (c) => c.ordersCount },
    {
      key: "spent",
      header: lang === "ar" ? "إجمالي الإنفاق" : "Total Spent",
      render: (c) => <Price value={c.totalSpent} className="text-text" />,
    },
    { key: "joined", header: lang === "ar" ? "تاريخ الانضمام" : "Joined", render: (c) => formatDate(c.joinedDate, { lang }) },
    {
      key: "status",
      header: lang === "ar" ? "الحالة" : "Status",
      render: (c) => (
        <Badge tone={c.status === "active" ? "primary" : "outline"}>
          {c.status === "active" ? (lang === "ar" ? "نشط" : "Active") : lang === "ar" ? "غير نشط" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (c) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/admin/customers/${c.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover"
            aria-label={lang === "ar" ? "عرض العميل" : "View customer"}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDelete(c)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-secondary/15 hover:text-secondary"
            aria-label={lang === "ar" ? "حذف العميل" : "Delete customer"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "العملاء" : "Customers"}</h1>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={lang === "ar" ? "دور باسم أو إيميل أو موبايل..." : "Search by name, email or phone..."}
      />
      <DataTable columns={columns} rows={filtered} emptyTitle={lang === "ar" ? "مفيش عملاء" : "No customers yet"} />
    </div>
  );
}