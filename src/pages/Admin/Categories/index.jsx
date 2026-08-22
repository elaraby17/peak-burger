import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Power, X } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { categoryService } from "../../../services/categoryService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import CategoryForm from "../../../components/admin/CategoryForm";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

export default function AdminCategories() {
  const { lang } = useLanguage();
  const [categories, setCategories] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = create, {...} = edit
  const [isSaving, setIsSaving] = useState(false);

  const load = () => categoryService.getAll().then(setCategories);

  useEffect(() => {
    document.title = "Categories — Peak Burger Admin";
    load();
  }, []);

  if (!categories) return <DashboardSkeleton />;

  const handleSubmit = async (payload) => {
    setIsSaving(true);
    if (editing?.id) await categoryService.update(editing.id, payload);
    else await categoryService.create(payload);
    setIsSaving(false);
    setEditing(null);
    await load();
    toastSuccess(lang === "ar" ? "تم الحفظ!" : "Saved!");
  };

  const handleDelete = async (c) => {
    const confirmed = await confirmDialog({
      title: lang === "ar" ? "حذف القسم؟" : "Delete this category?",
      text: lang === "ar" ? c.name.ar : c.name.en,
      confirmText: lang === "ar" ? "حذف" : "Delete",
      cancelText: lang === "ar" ? "إلغاء" : "Cancel",
    });
    if (!confirmed) return;
    await categoryService.remove(c.id);
    await load();
    toastSuccess(lang === "ar" ? "تم الحذف." : "Deleted.");
  };

  const handleToggle = async (c) => {
    await categoryService.toggleActive(c.id);
    await load();
  };

  const columns = [
    { key: "name", header: lang === "ar" ? "الاسم" : "Name", render: (c) => <span className="font-semibold text-ink">{lang === "ar" ? c.name.ar : c.name.en}</span> },
    { key: "slug", header: lang === "ar" ? "المعرف" : "Slug", render: (c) => c.id },
    { key: "icon", header: lang === "ar" ? "الأيقونة" : "Icon" },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (c) => <StatusBadge status={c.active === false ? "inactive" : "active"} label={c.active === false ? (lang === "ar" ? "متوقف" : "Inactive") : (lang === "ar" ? "مفعّل" : "Active")} /> },
    {
      key: "actions", header: "", render: (c) => (
        <div className="flex gap-1">
          <button onClick={() => setEditing(c)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => handleToggle(c)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Power className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(c)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الأقسام" : "Categories"}</h1>
        <Button variant="primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة قسم" : "Add category"}</Button>
      </div>

      <DataTable columns={columns} rows={categories} emptyTitle={lang === "ar" ? "مفيش أقسام" : "No categories"} />

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? (lang === "ar" ? "تعديل القسم" : "Edit category") : (lang === "ar" ? "إضافة قسم" : "Add category")} size="lg">
        {editing && <CategoryForm initialCategory={editing?.id ? editing : null} onSubmit={handleSubmit} isSaving={isSaving} />}
      </Modal>
    </div>
  );
}
