import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

const icons = ["beef", "flame", "cup-soda", "droplet", "cookie", "sparkles"];

export default function CategoryForm({ initialCategory, onSubmit, isSaving }) {
  const { lang } = useLanguage();
  const [form, setForm] = useState({
    slug: "",
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    icon: "flame",
    active: true,
  });

  useEffect(() => {
    if (!initialCategory) return;
    setForm({
      slug: initialCategory.id || "",
      nameEn: initialCategory.name?.en || "",
      nameAr: initialCategory.name?.ar || "",
      descriptionEn: initialCategory.description?.en || "",
      descriptionAr: initialCategory.description?.ar || "",
      icon: initialCategory.icon || "flame",
      active: initialCategory.active !== false,
    });
  }, [initialCategory]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      slug: form.slug || form.nameEn.toLowerCase().replace(/\s+/g, "-"),
      name: { en: form.nameEn, ar: form.nameAr },
      description: { en: form.descriptionEn, ar: form.descriptionAr },
      icon: form.icon,
      active: form.active,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={lang === "ar" ? "الاسم بالإنجليزي" : "Name (English)"} value={form.nameEn} onChange={update("nameEn")} required />
        <Input label={lang === "ar" ? "الاسم بالعربي" : "Name (Arabic)"} value={form.nameAr} onChange={update("nameAr")} required />
      </div>
      <Input label={lang === "ar" ? "الوصف بالإنجليزي" : "Description (English)"} value={form.descriptionEn} onChange={update("descriptionEn")} />
      <Input label={lang === "ar" ? "الوصف بالعربي" : "Description (Arabic)"} value={form.descriptionAr} onChange={update("descriptionAr")} />

      <div>
        <p className="mb-1.5 text-sm font-semibold text-text-muted">{lang === "ar" ? "الأيقونة" : "Icon"}</p>
        <div className="flex flex-wrap gap-2">
          {icons.map((icon) => (
            <button
              type="button"
              key={icon}
              onClick={() => setForm((f) => ({ ...f, icon }))}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold ${
                form.icon === icon ? "border-secondary bg-secondary text-white" : "border-line text-text-muted"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-text">
        <input type="checkbox" checked={form.active} onChange={update("active")} className="h-4 w-4 accent-secondary" />
        {lang === "ar" ? "مفعّل" : "Active"}
      </label>

      <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
        {lang === "ar" ? "حفظ القسم" : "Save category"}
      </Button>
    </form>
  );
}
