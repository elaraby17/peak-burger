import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ProductForm from "../../../components/admin/ProductForm";
import Loading from "../../../components/ui/Loading";
import EmptyState from "../../../components/ui/EmptyState";
import { toastSuccess } from "../../../utils/alerts";

export default function ProductEdit() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [product, setProduct] = useState(undefined);
  const [categories, setCategories] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Edit product — Peak Burger Admin";
    productService.getByIdAdmin(id).then(setProduct);
    categoryService.getAll().then(setCategories);
  }, [id]);

  if (product === undefined || !categories) return <Loading className="min-h-[40vh]" />;
  if (product === null) {
    return <EmptyState title={lang === "ar" ? "المنتج مش موجود" : "Product not found"} actionLabel={lang === "ar" ? "كل المنتجات" : "All products"} actionTo="/admin/products" />;
  }

  const handleSubmit = async (payload) => {
    setIsSaving(true);
    await productService.update(product.id, payload);
    setIsSaving(false);
    toastSuccess(lang === "ar" ? "تم تحديث المنتج!" : "Product updated!");
    navigate("/admin/products");
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-text">{lang === "ar" ? "تعديل المنتج" : "Edit product"}</h1>
      <div className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
        <ProductForm initialProduct={product} categories={categories} onSubmit={handleSubmit} isSaving={isSaving} />
      </div>
    </div>
  );
}
