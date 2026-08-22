import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ProductForm from "../../../components/admin/ProductForm";
import Loading from "../../../components/ui/Loading";
import { toastSuccess } from "../../../utils/alerts";

export default function ProductCreate() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Add product — Peak Burger Admin";
    categoryService.getAll().then(setCategories);
  }, []);

  if (!categories) return <Loading className="min-h-[40vh]" />;

  const handleSubmit = async (payload) => {
    setIsSaving(true);
    await productService.create(payload);
    setIsSaving(false);
    toastSuccess(lang === "ar" ? "تم إضافة المنتج!" : "Product created!");
    navigate("/admin/products");
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "إضافة منتج" : "Add product"}</h1>
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <ProductForm categories={categories} onSubmit={handleSubmit} isSaving={isSaving} />
      </div>
    </div>
  );
}
