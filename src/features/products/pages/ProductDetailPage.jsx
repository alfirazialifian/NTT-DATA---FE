import {
  AlertCircle,
  ArrowLeft,
  Box,
  PackageCheck,
  Pencil,
  Star,
  Tag,
  Trash2,
  Truck,
  Undo2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import {
  formatCategory,
  formatCurrency,
  formatNumber,
} from "../../../shared/lib/formatters";
import { useToastStore } from "../../../shared/stores/toastStore";
import Badge from "../../../shared/ui/Badge";
import ConfirmDialog from "../../../shared/ui/ConfirmDialog";
import EmptyState from "../../../shared/ui/EmptyState";
import OverflowTooltip from "../../../shared/ui/OverflowTooltip";
import PageHeader from "../../../shared/ui/PageHeader";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { useDeleteProduct, useProduct } from "../queries/useProducts";

export default function ProductDetailPage() {
  const { localizeError, t } = useTranslation();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(productId);
  const deleteMutation = useDeleteProduct();
  const showToast = useToastStore((state) => state.showToast);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(product.id);
      showToast({
        title: t("products.delete.toastTitle"),
        message: t("products.delete.toastMessage", { title: product.title }),
      });
      navigate("/products", { replace: true });
    } catch (deleteError) {
      showToast({
        title: t("products.delete.errorTitle"),
        message: localizeError(deleteError.message),
        type: "error",
      });
      setIsDeleteDialogOpen(false);
    }
  }

  if (isLoading) return <ProductDetailSkeleton />;

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
        title={t("products.detail.unavailableTitle")}
      />
    );
  }

  const thumbnailImages = [
    ...new Set((product.images ?? []).filter(Boolean)),
  ].slice(0, 3);
  const availableImages = [product.thumbnail, ...thumbnailImages].filter(
    Boolean,
  );
  const mainImage = availableImages.includes(selectedImage)
    ? selectedImage
    : (product.thumbnail ?? thumbnailImages[0]);
  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  const isInStock = product.stock > 0;
  const sku = product.sku || "—";
  const stockLabel = t("products.units.count", {
    count: formatNumber(product.stock),
  });
  const minimumOrderLabel = t("products.units.minimumOrder", {
    count: formatNumber(product.minimumOrderQuantity ?? 1),
  });
  const availabilityLabel =
    product.availabilityStatus ??
    (isInStock
      ? t("products.availability.inStock")
      : t("products.availability.outOfStock"));
  const shippingLabel =
    product.shippingInformation ?? t("products.shipping.standard");
  const returnPolicyLabel =
    product.returnPolicy ?? t("products.returnPolicy.contactSupport");
  const warrantyLabel =
    product.warrantyInformation ?? t("products.warranty.unavailable");

  return (
    <div className="page-stack">
      <Link className="back-link" to="/products">
        <ArrowLeft aria-hidden="true" />
        {t("products.navigation.backToList")}
      </Link>
      <PageHeader
        actions={
          <div className="page-header__button-group">
            <Link
              className="button button--secondary button--medium"
              to={`/products/${product.id}/edit`}
            >
              <Pencil aria-hidden="true" />
              {t("common.actions.edit")}
            </Link>
            <button
              className="button button--danger-ghost button--medium"
              onClick={() => setIsDeleteDialogOpen(true)}
              type="button"
            >
              <Trash2 aria-hidden="true" />
              {t("common.actions.delete")}
            </button>
          </div>
        }
        eyebrow={t("products.breadcrumbs.detail", { id: product.id })}
        title={product.title}
      />

      <div className="product-detail-grid">
        <section className="product-gallery">
          <div className="product-gallery__main">
            {mainImage ? (
              <img alt={product.title} key={mainImage} src={mainImage} />
            ) : (
              <Box aria-hidden="true" />
            )}
            {product.discountPercentage ? (
              <Badge tone="danger">
                -{product.discountPercentage.toFixed(1)}%
              </Badge>
            ) : null}
          </div>
          {thumbnailImages.length > 0 ? (
            <div className="product-gallery__thumbnails">
              {thumbnailImages.map((image, index) => (
                <button
                  aria-pressed={mainImage === image}
                  className={mainImage === image ? "is-active" : ""}
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                >
                  <img
                    alt={t("products.detail.galleryImageAlt", {
                      number: index + 1,
                      title: product.title,
                    })}
                    src={image}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="product-summary">
          <div className="product-summary__badges">
            <Badge>{formatCategory(product.category)}</Badge>
            <Badge tone={isInStock ? "success" : "danger"}>
              {isInStock
                ? t("products.stock.inStock")
                : t("products.stock.outOfStock")}
            </Badge>
          </div>
          <h2>{product.title}</h2>
          <p className="product-summary__brand">
            {t("products.detail.byBrand", {
              brand: product.brand || t("products.fallback.unbranded"),
            })}
          </p>
          <div className="product-summary__rating">
            <Star aria-hidden="true" fill="currentColor" />
            <strong>
              {product.rating?.toFixed(1) ?? t("products.rating.new")}
            </strong>
            {product.reviews?.length ? (
              <span>
                {t("products.reviews.count", {
                  count: formatNumber(product.reviews.length),
                })}
              </span>
            ) : null}
          </div>
          <div className="product-summary__price">
            <strong>{formatCurrency(discountedPrice)}</strong>
            {product.discountPercentage ? (
              <span>{formatCurrency(product.price)}</span>
            ) : null}
          </div>
          <p className="product-summary__description">{product.description}</p>

          <dl className="product-facts">
            <div>
              <dt>{t("products.fields.sku")}</dt>
              <OverflowTooltip as="dd" content={sku}>
                {sku}
              </OverflowTooltip>
            </div>
            <div>
              <dt>{t("products.detail.availableStock")}</dt>
              <OverflowTooltip as="dd" content={stockLabel}>
                {stockLabel}
              </OverflowTooltip>
            </div>
            <div>
              <dt>{t("products.detail.minimumOrder")}</dt>
              <OverflowTooltip as="dd" content={minimumOrderLabel}>
                {minimumOrderLabel}
              </OverflowTooltip>
            </div>
          </dl>
        </section>
      </div>

      <section className="detail-section">
        <div className="detail-section__header">
          <h2>{t("products.detail.information.title")}</h2>
          <p>{t("products.detail.information.description")}</p>
        </div>
        <div className="info-grid">
          <article>
            <span>
              <PackageCheck aria-hidden="true" />
            </span>
            <div>
              <small>{t("products.detail.information.availability")}</small>
              <OverflowTooltip as="strong" content={availabilityLabel}>
                {availabilityLabel}
              </OverflowTooltip>
            </div>
          </article>
          <article>
            <span>
              <Truck aria-hidden="true" />
            </span>
            <div>
              <small>{t("products.detail.information.shipping")}</small>
              <OverflowTooltip as="strong" content={shippingLabel}>
                {shippingLabel}
              </OverflowTooltip>
            </div>
          </article>
          <article>
            <span>
              <Undo2 aria-hidden="true" />
            </span>
            <div>
              <small>{t("products.detail.information.returnPolicy")}</small>
              <OverflowTooltip as="strong" content={returnPolicyLabel}>
                {returnPolicyLabel}
              </OverflowTooltip>
            </div>
          </article>
          <article>
            <span>
              <Tag aria-hidden="true" />
            </span>
            <div>
              <small>{t("products.detail.information.warranty")}</small>
              <OverflowTooltip as="strong" content={warrantyLabel}>
                {warrantyLabel}
              </OverflowTooltip>
            </div>
          </article>
        </div>
      </section>

      <ConfirmDialog
        confirmLabel={t("products.actions.delete")}
        description={t("products.delete.dialogDescription", {
          title: product.title,
        })}
        isLoading={deleteMutation.isPending}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t("products.delete.dialogTitle")}
      />
    </div>
  );
}
