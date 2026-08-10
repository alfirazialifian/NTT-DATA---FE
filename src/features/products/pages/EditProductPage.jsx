import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import { useToastStore } from "../../../shared/stores/toastStore";
import EmptyState from "../../../shared/ui/EmptyState";
import PageHeader from "../../../shared/ui/PageHeader";
import ProductForm from "../components/ProductForm";
import ProductFormSkeleton from "../components/ProductFormSkeleton";
import { useProduct, useUpdateProduct } from "../queries/useProducts";

export default function EditProductPage() {
  const { localizeError, t } = useTranslation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(productId);
  const updateMutation = useUpdateProduct();
  const showToast = useToastStore((state) => state.showToast);

  async function handleSubmit(values) {
    const updatedProduct = await updateMutation.mutateAsync({
      id: productId,
      values,
    });
    showToast({
      title: t("products.edit.toastTitle"),
      message: t("products.edit.toastMessage", {
        title: updatedProduct.title,
      }),
    });
    navigate(`/products/${productId}`);
  }

  if (isLoading) return <ProductFormSkeleton />;

  if (error || !product) {
    return (
      <EmptyState
        action={
          <Link
            className="button button--secondary button--medium"
            to="/products"
          >
            <ArrowLeft aria-hidden="true" />
            {t("products.navigation.backToList")}
          </Link>
        }
        description={
          error
            ? localizeError(error)
            : t("products.errors.notFoundDescription")
        }
        icon={AlertCircle}
        title={t("products.edit.unavailableTitle")}
      />
    );
  }

  return (
    <div className="page-stack page-stack--form">
      <Link className="back-link" to={`/products/${productId}`}>
        <ArrowLeft aria-hidden="true" />
        {t("products.navigation.backToDetails")}
      </Link>
      <PageHeader
        description={t("products.edit.description")}
        eyebrow={t("products.breadcrumbs.edit", { id: product.id })}
        title={t("products.edit.title", { title: product.title })}
      />
      <ProductForm
        onSubmit={handleSubmit}
        product={product}
        submitLabel={t("products.actions.saveChanges")}
      />
    </div>
  );
}
