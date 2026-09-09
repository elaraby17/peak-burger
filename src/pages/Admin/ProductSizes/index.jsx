// src/pages/Admin/ProductSizes/index.jsx — استبدل بالكامل
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { sizeService } from "../../../services/sizeService";
import { productService } from "../../../services/productService";
import DataTable from "../../../components/admin/DataTable";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Price from "../../../components/ui/Price";
import ErrorState from "../../../components/ui/ErrorState";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { ProductGridSkeleton } from "../../../components/ui/Skeleton";

const emptyForm = { productId: "", sizeKey: "", labelEn: "", labelAr: "", price: "" };

export default function AdminProductSizes() {
  const { t, lang } = useLanguage();
  const [sizes, setSizes] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // null closed, {} create, {...} edit
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setError(null);
    setSizes(null);
    sizeService
      .getAll()
      .then(setSizes)
      .catch((err) => {
        console.error("Failed to load product sizes", err);
        setError(lang === "ar" ? "حصل خطأ في تحميل الأحجام." : "Failed to load sizes.");
        setSizes([]);
      });
  };

  useEffect(() => {
    document.title = "Product Sizes — Peak Burger Admin";
    load();
    productService.getAllAdmin().then(setProducts).catch(() => setProducts([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editing) return;
    setForm(
      editing.id
        ? { productId: editing.productId, sizeKey: editing.sizeKey, labelEn: editing.label.en, labelAr: editing.label.ar, price: editing.price }
        : emptyForm
    );
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing?.id) await sizeService.update(editing.id, payload);
      else await sizeService.create(payload);
      setIsSaving(false);
      setEditing(null);
      load();
      toastSuccess(lang === "ar" ? "تم الحفظ!" : "Saved!");
    } catch (err) {
      setIsSaving(false);
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : lang === "ar" ? "حصل خطأ." : "Something went wrong.";
      toastSuccess(msg);
    }
  };

  const handleDelete = async (s) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "حذف الحجم؟" : "Delete this size?",
      text: `${t(s.productName)} — ${s.sizeKey}`,
      confirmText: lang === "ar" ? "حذف" : "Delete",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;
    await sizeService.remove(s.id);
    load();
    toastSuccess(lang === "ar" ? "تم الحذف." : "Deleted.");
  };

  const columns = [
    { key: "product", header: lang === "ar" ? "المنتج" : "Product", render: (r) => <span className="font-semibold text-ink">{t(r.productName) || `#${r.productId}`}</span> },
    { key: "sizeKey", header: lang === "ar" ? "المفتاح" : "Key", render: (r) => r.sizeKey },
    { key: "label", header: lang === "ar" ? "التسمية" : "Label", render: (r) => (lang === "ar" ? r.label.ar : r.label.en) },
    { key: "price", header: lang === "ar" ? "السعر" : "Price", render: (r) => <Price value={r.price} className="text-ink" /> },
    {
      key: "actions", header: "", render: (r) => (
        <div className="flex gap-1">
          <button onClick={() => setEditing(r)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(r)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "أحجام المنتجات" : "Product Sizes"}</h1>
        <Button variant="primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة حجم" : "Add size"}</Button>
      </div>

      {sizes === null ? (
        <ProductGridSkeleton count={6} />
      ) : error ? (
        <ErrorState title={error} onRetry={load} />
      ) : (
        <DataTable columns={columns} rows={sizes} emptyTitle={lang === "ar" ? "مفيش أحجام" : "No sizes found"} />
      )}

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? (lang === "ar" ? "تعديل الحجم" : "Edit size") : (lang === "ar" ? "إضافة حجم" : "Add size")} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label={lang === "ar" ? "المنتج" : "Product"} value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required>
            <option value="">{lang === "ar" ? "اختر منتج" : "Select product"}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{lang === "ar" ? p.name.ar : p.name.en}</option>
            ))}
          </Select>
          <Input label={lang === "ar" ? "مفتاح الحجم (single, double...)" : "Size key (single, double...)"} value={form.sizeKey} onChange={(e) => setForm({ ...form, sizeKey: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={lang === "ar" ? "التسمية بالإنجليزي" : "Label (English)"} value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} required />
            <Input label={lang === "ar" ? "التسمية بالعربي" : "Label (Arabic)"} value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} required />
          </div>
          <Input type="number" label={lang === "ar" ? "السعر" : "Price"} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <Button type="submit" variant="primary" className="w-full" isLoading={isSaving}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}