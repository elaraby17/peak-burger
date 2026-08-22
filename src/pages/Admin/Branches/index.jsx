import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { branchService } from "../../../services/branchService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const emptyForm = { nameEn: "", nameAr: "", phone: "", governorate: "", area: "", address: "", lat: "", lng: "" };

export default function AdminBranches() {
  const { lang } = useLanguage();
  const [branches, setBranches] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => branchService.getAll().then(setBranches);

  useEffect(() => {
    document.title = "Branches — Peak Burger Admin";
    load();
  }, []);

  useEffect(() => {
    if (!editing) return;
    setForm(editing.id ? { ...editing } : emptyForm);
  }, [editing]);

  if (!branches) return <DashboardSkeleton />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...form, lat: Number(form.lat) || null, lng: Number(form.lng) || null };
    if (editing?.id) await branchService.update(editing.id, payload);
    else await branchService.create(payload);
    setIsSaving(false);
    setEditing(null);
    await load();
    toastSuccess(lang === "ar" ? "تم الحفظ!" : "Saved!");
  };

  const handleToggle = async (b) => {
    await branchService.update(b.id, { active: !b.active });
    load();
  };

  const handleDelete = async (b) => {
    const confirmed = await confirmDialog({ title: lang === "ar" ? "حذف الفرع؟" : "Delete this branch?", text: b.nameEn, confirmText: lang === "ar" ? "حذف" : "Delete", cancelText: lang === "ar" ? "إلغاء" : "Cancel" });
    if (!confirmed) return;
    await branchService.remove(b.id);
    load();
  };

  const columns = [
    { key: "name", header: lang === "ar" ? "الاسم" : "Name", render: (b) => <span className="font-semibold text-ink">{lang === "ar" ? b.nameAr : b.nameEn}</span> },
    { key: "phone", header: lang === "ar" ? "الهاتف" : "Phone" },
    { key: "location", header: lang === "ar" ? "الموقع" : "Location", render: (b) => `${b.governorate}, ${b.area}` },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (b) => <StatusBadge status={b.active ? "active" : "inactive"} label={b.active ? (lang === "ar" ? "مفعّل" : "Active") : (lang === "ar" ? "متوقف" : "Inactive")} /> },
    { key: "actions", header: "", render: (b) => (
      <div className="flex gap-1">
        <button onClick={() => setEditing(b)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => handleToggle(b)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Power className="h-4 w-4" /></button>
        <button onClick={() => handleDelete(b)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الفروع" : "Branches"}</h1>
        <Button variant="primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة فرع" : "Add branch"}</Button>
      </div>

      <DataTable columns={columns} rows={branches} emptyTitle={lang === "ar" ? "مفيش فروع" : "No branches"} />

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? (lang === "ar" ? "تعديل الفرع" : "Edit branch") : (lang === "ar" ? "إضافة فرع" : "Add branch")} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={lang === "ar" ? "الاسم بالإنجليزي" : "Name (English)"} value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} required />
            <Input label={lang === "ar" ? "الاسم بالعربي" : "Name (Arabic)"} value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} required />
          </div>
          <Input label={lang === "ar" ? "رقم الهاتف" : "Phone"} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={lang === "ar" ? "المحافظة" : "Governorate"} value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} />
            <Input label={lang === "ar" ? "المنطقة" : "Area"} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <Input label={lang === "ar" ? "العنوان" : "Address"} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="number" label="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <Input type="number" label="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isSaving}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
