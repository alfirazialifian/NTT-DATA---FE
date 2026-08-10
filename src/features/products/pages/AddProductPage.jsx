import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import { useToastStore } from "../../../shared/stores/toastStore";
import PageHeader from "../../../shared/ui/PageHeader";
import ProductForm from "../components/ProductForm";
import { useCreateProduct } from "../queries/useProducts";

export default function AddProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(values) {
    const createdProduct = await createProductMutation.mutateAsync(values);
    showToast({
      title: t("products.add.toastTitle"),
      message: t("products.add.toastMessage", {
        title: createdProduct.title,
      }),
    });
    navigate("/products");
  }

  return (
    <div className="page-stack page-stack--form">
      <Link className="back-link" to="/products">
        <ArrowLeft aria-hidden="true" />
        {t("products.navigation.backToList")}
      </Link>
      <PageHeader
        description={t("products.add.description")}
        eyebrow={t("products.breadcrumbs.new")}
        title={t("products.actions.add")}
      />
      <ProductForm
        onSubmit={handleSubmit}
        submitLabel={t("products.actions.create")}
      />
    </div>
  );
}
