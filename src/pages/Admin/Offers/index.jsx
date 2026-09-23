import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { offerService } from "../../../services/offerService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Price from "../../../components/ui/Price";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const emptyForm = { titleEn: "", titleAr: "", descriptionEn: "", descriptionAr: "", oldPrice: "", offerPrice: "", startDate: "", endDate: "", active: true };

export default function AdminOffers() {
  const { t, lang } = useLanguage();
  const [offers, setOffers] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => offerService.getAll().then(setOffers);

  useEffect(() => {
    document.title = "Offers — Peak Burger Admin";
    load();
  }, []);

  useEffect(() => {
    if (!editing) return;
    setForm(editing.id ? {
      titleEn: editing.title.en, titleAr: editing.title.ar,
      descriptionEn: editing.description.en, descriptionAr: editing.description.ar,
      oldPrice: editing.oldPrice, offerPrice: editing.offerPrice,
      startDate: editing.startDate, endDate: editing.endDate, active: editing.active,
    } : emptyForm);
  }, [editing]);

  if (!offers) return <DashboardSkeleton />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      title: { en: form.titleEn, ar: form.titleAr },
      description: { en: form.descriptionEn, ar: form.descriptionAr },
      oldPrice: Number(form.oldPrice), offerPrice: Number(form.offerPrice),
      startDate: form.startDate, endDate: form.endDate, active: form.active,
      tag: editing.tag || { en: "Combo", ar: "كومبو" },
      badgeColor: editing.badgeColor || "secondary",
      image: editing.image || "/images/offers/placeholder.jpg",
      includedProductIds: editing.includedProductIds || [],
    };
    if (editing?.id) await offerService.update(editing.id, payload);
    else await offerService.create(payload);
    setIsSaving(false);
    setEditing(null);
    await load();
    toastSuccess(lang === "ar" ? "تم الحفظ!" : "Saved!");
  };

  const handleDelete = async (o) => {
    const confirmed = await confirmDialog({ title: lang === "ar" ? "حذف العرض؟" : "Delete this offer?", confirmText: lang === "ar" ? "حذف" : "Delete", cancelText: lang === "ar" ? "إلغاء" : "Cancel" });
    if (!confirmed) return;
    await offerService.remove(o.id);
    load();
  };

  const columns = [
    { key: "title", header: lang === "ar" ? "العرض" : "Offer", render: (o) => <span className="font-semibold text-text">{t(o.title)}</span> },
    { key: "price", header: lang === "ar" ? "السعر" : "Price", render: (o) => (
      <span className="flex items-center gap-2">
        <span className="text-xs text-text-muted/60 line-through"><Price value={o.oldPrice} /></span>
        <Price value={o.offerPrice} className="text-secondary" />
      </span>
    ) },
    { key: "period", header: lang === "ar" ? "الفترة" : "Period", render: (o) => `${o.startDate} → ${o.endDate}` },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (o) => <StatusBadge status={o.active ? "active" : "inactive"} label={o.active ? (lang === "ar" ? "مفعّل" : "Active") : (lang === "ar" ? "متوقف" : "Inactive")} /> },
    { key: "actions", header: "", render: (o) => (
      <div className="flex gap-1">
        <button onClick={() => setEditing(o)} className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-hover"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => handleDelete(o)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary/15"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "العروض" : "Offers"}</h1>
        <Button variant="primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة عرض" : "Add offer"}</Button>
      </div>

      <DataTable columns={columns} rows={offers} emptyTitle={lang === "ar" ? "مفيش عروض" : "No offers"} />

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? (lang === "ar" ? "تعديل العرض" : "Edit offer") : (lang === "ar" ? "إضافة عرض" : "Add offer")} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={lang === "ar" ? "الاسم بالإنجليزي" : "Name (English)"} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
            <Input label={lang === "ar" ? "الاسم بالعربي" : "Name (Arabic)"} value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} />
          </div>
          <Input label={lang === "ar" ? "الوصف بالإنجليزي" : "Description (English)"} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
          <Input label={lang === "ar" ? "الوصف بالعربي" : "Description (Arabic)"} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="number" label={lang === "ar" ? "السعر قبل العرض" : "Old price"} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
            <Input type="number" label={lang === "ar" ? "سعر العرض" : "Offer price"} value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="date" label={lang === "ar" ? "تاريخ البداية" : "Start date"} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input type="date" label={lang === "ar" ? "تاريخ النهاية" : "End date"} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-text">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-secondary" />
            {lang === "ar" ? "مفعّل" : "Active"}
          </label>
          <Button type="submit" variant="primary" className="w-full" isLoading={isSaving}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
