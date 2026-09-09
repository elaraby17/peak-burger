// src/components/admin/ProductForm.jsx — استبدل بالكامل
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const emptyForm = {
  nameEn: "",
  nameAr: "",
  descriptionEn: "",
  descriptionAr: "",
  category: "", // category *slug*, matches the <select> options below
  price: "",
  popular: false,
  isNew: false,
  active: true,
};

export default function ProductForm({ initialProduct, categories, onSubmit, isSaving }) {
  const { lang } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!initialProduct) return;
    setForm({
      nameEn: initialProduct.name?.en || "",
      nameAr: initialProduct.name?.ar || "",
      descriptionEn: initialProduct.description?.en || "",
      descriptionAr: initialProduct.description?.ar || "",
      category: initialProduct.category || "",
      price: initialProduct.price ?? "",
      popular: Boolean(initialProduct.popular),
      isNew: Boolean(initialProduct.isNew),
      active: initialProduct.active !== false,
    });
    setPreview(initialProduct.image || "");
  }, [initialProduct]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const next = {};
    if (!form.nameEn.trim()) next.nameEn = lang === "ar" ? "مطلوب" : "Required";
    if (!form.nameAr.trim()) next.nameAr = lang === "ar" ? "مطلوب" : "Required";
    if (!form.category) next.category = lang === "ar" ? "مطلوب" : "Required";
    if (!form.price || Number(form.price) <= 0) next.price = lang === "ar" ? "سعر غير صحيح" : "Enter a valid price";
    if (!initialProduct && !imageFile) next.image = lang === "ar" ? "الصورة مطلوبة" : "Image is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const selectedCategory = categories.find((c) => c.id === form.category);
    onSubmit({
      categoryId: selectedCategory?.numericId,
      nameEn: form.nameEn,
      nameAr: form.nameAr,
      descriptionEn: form.descriptionEn,
      descriptionAr: form.descriptionAr,
      price: Number(form.price),
      popular: form.popular,
      isNew: form.isNew,
      active: form.active,
      imageFile, // null on edit if the image wasn't changed - backend keeps the old one
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={lang === "ar" ? "الاسم بالإنجليزي" : "Name (English)"} value={form.nameEn} onChange={update("nameEn")} error={errors.nameEn} />
          <Input label={lang === "ar" ? "الاسم بالعربي" : "Name (Arabic)"} value={form.nameAr} onChange={update("nameAr")} error={errors.nameAr} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label={lang === "ar" ? "القسم" : "Category"} value={form.category} onChange={update("category")}>
            <option value="">{lang === "ar" ? "اختر قسم" : "Select category"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === "ar" ? c.name.ar : c.name.en}
              </option>
            ))}
          </Select>
          <Input type="number" label={lang === "ar" ? "السعر الأساسي" : "Base price"} value={form.price} onChange={update("price")} error={errors.price} />
        </div>
        <Input label={lang === "ar" ? "الوصف بالإنجليزي" : "Description (English)"} value={form.descriptionEn} onChange={update("descriptionEn")} />
        <Input label={lang === "ar" ? "الوصف بالعربي" : "Description (Arabic)"} value={form.descriptionAr} onChange={update("descriptionAr")} />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
            {lang === "ar" ? "صورة المنتج" : "Product image"}
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onPickImage}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-secondary-600"
          />
          {errors.image && <p className="mt-1 text-xs font-medium text-secondary">{errors.image}</p>}
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" checked={form.popular} onChange={update("popular")} className="h-4 w-4 accent-secondary" />
            {lang === "ar" ? "منتج شائع" : "Popular"}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" checked={form.isNew} onChange={update("isNew")} className="h-4 w-4 accent-secondary" />
            {lang === "ar" ? "جديد" : "New"}
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input type="checkbox" checked={form.active} onChange={update("active")} className="h-4 w-4 accent-secondary" />
            {lang === "ar" ? "مفعّل" : "Active"}
          </label>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
          {lang === "ar" ? "حفظ المنتج" : "Save product"}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-ink-soft">{lang === "ar" ? "معاينة الصورة" : "Image preview"}</p>
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-cream-100">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-ink-soft">
              {lang === "ar" ? "لا توجد صورة" : "No image"}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}