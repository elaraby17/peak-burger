import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import ProductForm from "../../../components/admin/ProductForm";
import Loading from "../../../components/ui/Loading";
import { toastSuccess } from "../../../utils/alerts";
import { toastError } from "../../../utils/alerts";




export default function ProductCreate() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.title = "Add product — Peak Burger Admin";

    categoryService
      .getAll()
      .then(setCategories)
      .catch(() => {
        setCategories([]);
      });
  }, []);

  if (!categories) {
    return <Loading className="min-h-[40vh]" />;
  }

  const handleSubmit = async (payload) => {
    setIsSaving(true);

    try {
      await productService.create(payload);

      toastSuccess(
        lang === "ar"
          ? "تم إضافة المنتج بنجاح!"
          : "Product created successfully!"
      );

      navigate("/admin/products");
    } catch (error) {
      const response = error?.response?.data;

      let message =
        lang === "ar"
          ? "حدث خطأ أثناء إضافة المنتج."
          : "Something went wrong while creating the product.";

      // Laravel validation errors - 422
      if (response?.errors) {
        const errors = Object.values(response.errors)
          .flat()
          .filter(Boolean);

        if (errors.length > 0) {
          message = errors.join("\n");
        }
      }
      // Laravel general message
      else if (response?.message) {
        message = response.message;
      }
      // Network / unknown error
      else if (error?.message) {
        message =
          lang === "ar"
            ? "تعذر الاتصال بالخادم."
            : "Unable to connect to the server.";
      }

      toastError(
        lang === "ar"
          ? "حدث خطأ أثناء إضافة المنتج."
          : "Something went wrong while creating the product."
      );

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-extrabold text-text">
        {lang === "ar" ? "إضافة منتج" : "Add product"}
      </h1>

      <div className="rounded-2xl border border-line bg-surface-50 p-6 shadow-card">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}