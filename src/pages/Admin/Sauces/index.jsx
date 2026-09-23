import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { sauceService } from "../../../services/sauceService";
import { productService } from "../../../services/productService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminSauces() {
  const { lang } = useLanguage();
  const [sauces, setSauces] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ nameEn: "", nameAr: "" });
  const [assignFor, setAssignFor] = useState(null); // sauce being assigned to products

  const load = () => {
    sauceService.getAllAdmin().then(setSauces);
    productService.getAllAdmin().then(setProducts);
  };

  useEffect(() => {
    document.title = "Sauces — Peak Burger Admin";
    load();
  }, []);

  if (!sauces) return <DashboardSkeleton />;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.nameEn.trim() || !form.nameAr.trim()) return;
    await sauceService.create({ nameEn: form.nameEn, nameAr: form.nameAr });
    setForm({ nameEn: "", nameAr: "" });
    setIsCreating(false);
    load();
    toastSuccess(lang === "ar" ? "تمت إضافة الصوص!" : "Sauce added!");
  };

  const handleDelete = async (s) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "حذف الصوص؟" : "Delete this sauce?",
      confirmText: lang === "ar" ? "حذف" : "Delete",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;
    await sauceService.remove(s.id);
    load();
  };

  const productsWithSauceOptions = products.filter((p) => Array.isArray(p.sauceOptions));

  const columns = [
    { key: "name", header: lang === "ar" ? "الاسم" : "Name", render: (s) => <span className="font-semibold text-text">{lang === "ar" ? s.nameAr : s.nameEn}</span> },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (s) => <StatusBadge status={s.active ? "active" : "inactive"} label={s.active ? (lang === "ar" ? "مفعّل" : "Active") : (lang === "ar" ? "متوقف" : "Inactive")} /> },
    { key: "assign", header: lang === "ar" ? "تخصيص للمنتجات" : "Assign to products", render: (s) => (
      <button onClick={() => setAssignFor(s)} className="text-xs font-semibold text-secondary hover:underline">
        {lang === "ar" ? "تعديل" : "Manage"}
      </button>
    ) },
    { key: "actions", header: "", render: (s) => (
      <button onClick={() => handleDelete(s)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary/15"><Trash2 className="h-4 w-4" /></button>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "الصوصات" : "Sauces"}</h1>
        <Button variant="primary" onClick={() => setIsCreating(true)}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة صوص" : "Add sauce"}</Button>
      </div>

      <DataTable columns={columns} rows={sauces} emptyTitle={lang === "ar" ? "مفيش صوصات" : "No sauces"} />

      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title={lang === "ar" ? "إضافة صوص" : "Add sauce"}>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label={lang === "ar" ? "الاسم بالإنجليزي" : "Name (English)"} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          <Input label={lang === "ar" ? "الاسم بالعربي" : "Name (Arabic)"} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
          <Button type="submit" variant="primary" className="w-full">{lang === "ar" ? "حفظ" : "Save"}</Button>
        </form>
      </Modal>

      <Modal isOpen={Boolean(assignFor)} onClose={() => setAssignFor(null)} title={assignFor ? (lang === "ar" ? `صوص ${assignFor.nameAr}` : assignFor.nameEn) : ""} size="lg">
        {assignFor && (
          <div className="max-h-96 space-y-1 overflow-y-auto">
            {productsWithSauceOptions.map((p) => {
              const checked = (p.sauceOptions || []).includes(assignFor.id);
              return (
                <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-surface-hover">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={async () => {
                      await sauceService.toggleForProduct(p.id, assignFor.id);
                      load();
                    }}
                    className="h-4 w-4 accent-secondary"
                  />
                  <span className="text-sm text-text">{lang === "ar" ? p.name.ar : p.name.en}</span>
                </label>
              );
            })}
            {productsWithSauceOptions.length === 0 && (
              <p className="py-6 text-center text-sm text-text-muted">{lang === "ar" ? "مفيش منتجات بتاخد صوص اختياري." : "No products currently offer a sauce choice."}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
