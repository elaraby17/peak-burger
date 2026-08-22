import { useEffect, useState } from "react";
import { Plus, Trash2, Power } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { couponService } from "../../../services/couponService";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { confirmDialog, toastSuccess } from "../../../utils/alerts";
import { DashboardSkeleton } from "../../../components/ui/Skeleton";

const emptyForm = { code: "", discountType: "percentage", value: "", minOrder: "", maxDiscount: "", usageLimit: "", startDate: "", endDate: "" };

export default function AdminCoupons() {
  const { lang } = useLanguage();
  const [coupons, setCoupons] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => couponService.getAll().then(setCoupons);

  useEffect(() => {
    document.title = "Coupons — Peak Burger Admin";
    load();
  }, []);

  if (!coupons) return <DashboardSkeleton />;

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await couponService.create({
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: Number(form.usageLimit) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setIsSaving(false);
    setForm(emptyForm);
    setIsCreating(false);
    load();
    toastSuccess(lang === "ar" ? "تم إضافة الكوبون!" : "Coupon created!");
  };

  const handleToggle = async (c) => {
    await couponService.update(c.id, { active: !c.active });
    load();
  };

  const handleDelete = async (c) => {
    const confirmed = await confirmDialog({ title: lang === "ar" ? "حذف الكوبون؟" : "Delete this coupon?", text: c.code, confirmText: lang === "ar" ? "حذف" : "Delete", cancelText: lang === "ar" ? "إلغاء" : "Cancel" });
    if (!confirmed) return;
    await couponService.remove(c.id);
    load();
  };

  const columns = [
    { key: "code", header: lang === "ar" ? "الكود" : "Code", render: (c) => <Badge tone="ink">{c.code}</Badge> },
    { key: "discount", header: lang === "ar" ? "الخصم" : "Discount", render: (c) => (c.discountType === "percentage" ? `${c.value}% OFF` : `${c.value} E.L OFF`) },
    { key: "minOrder", header: lang === "ar" ? "أقل طلب" : "Min. order", render: (c) => `${c.minOrder} E.L` },
    { key: "usage", header: lang === "ar" ? "الاستخدام" : "Usage", render: (c) => `${c.used}/${c.usageLimit}` },
    { key: "period", header: lang === "ar" ? "الفترة" : "Period", render: (c) => `${c.startDate} → ${c.endDate}` },
    { key: "status", header: lang === "ar" ? "الحالة" : "Status", render: (c) => <StatusBadge status={c.active ? "active" : "inactive"} label={c.active ? (lang === "ar" ? "مفعّل" : "Active") : (lang === "ar" ? "متوقف" : "Inactive")} /> },
    { key: "actions", header: "", render: (c) => (
      <div className="flex gap-1">
        <button onClick={() => handleToggle(c)} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-cream-100"><Power className="h-4 w-4" /></button>
        <button onClick={() => handleDelete(c)} className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:bg-secondary-50"><Trash2 className="h-4 w-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "الكوبونات" : "Coupons"}</h1>
        <Button variant="primary" onClick={() => setIsCreating(true)}><Plus className="h-4 w-4" />{lang === "ar" ? "إضافة كوبون" : "Add coupon"}</Button>
      </div>

      <DataTable columns={columns} rows={coupons} emptyTitle={lang === "ar" ? "مفيش كوبونات" : "No coupons"} />

      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title={lang === "ar" ? "إضافة كوبون" : "Add coupon"} size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label={lang === "ar" ? "الكود" : "Code"} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label={lang === "ar" ? "نوع الخصم" : "Discount type"} value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="percentage">{lang === "ar" ? "نسبة %" : "Percentage %"}</option>
              <option value="fixed">{lang === "ar" ? "مبلغ ثابت" : "Fixed amount"}</option>
            </Select>
            <Input type="number" label={lang === "ar" ? "القيمة" : "Value"} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="number" label={lang === "ar" ? "أقل قيمة طلب" : "Minimum order"} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            <Input type="number" label={lang === "ar" ? "أقصى خصم" : "Maximum discount"} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          </div>
          <Input type="number" label={lang === "ar" ? "الحد الأقصى للاستخدام" : "Usage limit"} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="date" label={lang === "ar" ? "تاريخ البداية" : "Start date"} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input type="date" label={lang === "ar" ? "تاريخ النهاية" : "End date"} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isSaving}>{lang === "ar" ? "حفظ" : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
