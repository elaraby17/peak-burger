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
  category: "",
  price: "",
  image: "",
  popular: false,
  isNew: false,
  active: true,
};

export default function ProductForm({ initialProduct, categories, onSubmit, isSaving }) {
  const { lang } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
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
      image: initialProduct.image || "",
      popular: Boolean(initialProduct.popular),
      isNew: Boolean(initialProduct.isNew),
      active: initialProduct.active !== false,
    });
    setPreview(initialProduct.image || "");
  }, [initialProduct]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "image") setPreview(e.target.value);
  };

  const validate = () => {
    const next = {};
    if (!form.nameEn.trim()) next.nameEn = lang === "ar" ? "مطلوب" : "Required";
    if (!form.nameAr.trim()) next.nameAr = lang === "ar" ? "مطلوب" : "Required";
    if (!form.category) next.category = lang === "ar" ? "مطلوب" : "Required";
    if (!form.price || Number(form.price) <= 0) next.price = lang === "ar" ? "سعر غير صحيح" : "Enter a valid price";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: { en: form.nameEn, ar: form.nameAr },
      description: { en: form.descriptionEn, ar: form.descriptionAr },
      category: form.category,
      price: Number(form.price),
      image: form.image || "/images/products/placeholder.jpg",
      popular: form.popular,
      isNew: form.isNew,
      active: form.active,
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
        <Input label={lang === "ar" ? "رابط الصورة" : "Image URL"} value={form.image} onChange={update("image")} placeholder="/images/products/example.jpg" />

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
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23FCEACB'/%3E%3C/svg%3E";
              }}
            />
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
