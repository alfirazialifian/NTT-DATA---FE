import { DollarSign, Image as ImageIcon, Package, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import Button from "../../../shared/ui/Button";
import ConfirmDialog from "../../../shared/ui/ConfirmDialog";
import FormField from "../../../shared/ui/FormField";
import NumberInput from "../../../shared/ui/NumberInput";

const EMPTY_PRODUCT = {
  title: "",
  brand: "",
  category: "",
  sku: "",
  price: "",
  stock: "",
  discountPercentage: "",
  thumbnail: "",
  description: "",
};

function getInitialValues(product) {
  if (!product) return EMPTY_PRODUCT;

  return Object.fromEntries(
    Object.keys(EMPTY_PRODUCT).map((key) => [key, product[key] ?? ""]),
  );
}

function validate(values, t) {
  const errors = {};

  if (!values.title.trim())
    errors.title = t("products.form.errors.titleRequired");
  if (!values.brand.trim())
    errors.brand = t("products.form.errors.brandRequired");
  if (!values.category.trim())
    errors.category = t("products.form.errors.categoryRequired");
  if (!values.description.trim())
    errors.description = t("products.form.errors.descriptionRequired");
  if (values.price === "" || Number(values.price) <= 0) {
    errors.price = t("products.form.errors.pricePositive");
  }
  if (values.stock === "" || Number(values.stock) < 0) {
    errors.stock = t("products.form.errors.stockNonnegative");
  }
  if (
    values.discountPercentage !== "" &&
    (Number(values.discountPercentage) < 0 ||
      Number(values.discountPercentage) > 100)
  ) {
    errors.discountPercentage = t("products.form.errors.discountRange");
  }
  if (values.thumbnail && !/^https?:\/\//i.test(values.thumbnail)) {
    errors.thumbnail = t("products.form.errors.thumbnailInvalidUrl");
  }

  return errors;
}

export default function ProductForm({ product, onSubmit, submitLabel }) {
  const { localizeError, t } = useTranslation();
  const navigate = useNavigate();
  const [initialValues] = useState(() => getInitialValues(product));
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const isDirty = Object.keys(initialValues).some(
    (key) => String(values[key] ?? "") !== String(initialValues[key] ?? ""),
  );

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError(null);
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  function handleCancel() {
    if (isDirty) {
      setIsDiscardDialogOpen(true);
      return;
    }

    navigate("/products");
  }

  function handleDiscard() {
    setIsDiscardDialogOpen(false);
    navigate("/products");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...values,
      price: Number(values.price),
      stock: Number(values.stock),
      discountPercentage: Number(values.discountPercentage || 0),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(payload);
    } catch (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="product-form" noValidate onSubmit={handleSubmit}>
        {submitError ? (
          <div className="alert alert--error" role="alert">
            <strong>{t("products.form.saveErrorTitle")}</strong>
            <span>{localizeError(submitError)}</span>
          </div>
        ) : null}

        <section className="form-section">
          <div className="form-section__header">
            <span>
              <Package aria-hidden="true" />
            </span>
            <div>
              <h2>{t("products.form.sections.basic.title")}</h2>
              <p>{t("products.form.sections.basic.description")}</p>
            </div>
          </div>
          <div className="form-grid">
            <FormField
              className="form-grid__full"
              error={errors.title}
              label={t("products.fields.title")}
              name="title"
              required
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  className="input"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.title")}
                  type="text"
                  value={values.title}
                />
              )}
            </FormField>
            <FormField
              error={errors.brand}
              label={t("products.fields.brand")}
              name="brand"
              required
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  className="input"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.brand")}
                  type="text"
                  value={values.brand}
                />
              )}
            </FormField>
            <FormField
              error={errors.category}
              hint={t("products.form.hints.categorySlug")}
              label={t("products.fields.category")}
              name="category"
              required
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  className="input"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.category")}
                  type="text"
                  value={values.category}
                />
              )}
            </FormField>
            <FormField
              className="form-grid__full"
              error={errors.description}
              label={t("products.fields.description")}
              name="description"
              required
            >
              {(fieldProps) => (
                <textarea
                  {...fieldProps}
                  className="textarea"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.description")}
                  rows="5"
                  value={values.description}
                />
              )}
            </FormField>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__header">
            <span>
              <DollarSign aria-hidden="true" />
            </span>
            <div>
              <h2>{t("products.form.sections.pricing.title")}</h2>
              <p>{t("products.form.sections.pricing.description")}</p>
            </div>
          </div>
          <div className="form-grid form-grid--three">
            <FormField
              error={errors.price}
              label={t("products.fields.priceUsd")}
              name="price"
              required
            >
              {(fieldProps) => (
                <div className="input-prefix">
                  <span>$</span>
                  <NumberInput
                    {...fieldProps}
                    maxFractionDigits={2}
                    onValueChange={(value) => updateField("price", value)}
                    placeholder={t("products.form.placeholders.price")}
                    value={values.price}
                  />
                </div>
              )}
            </FormField>
            <FormField
              error={errors.stock}
              label={t("products.fields.stock")}
              name="stock"
              required
            >
              {(fieldProps) => (
                <NumberInput
                  {...fieldProps}
                  allowDecimal={false}
                  className="input"
                  onValueChange={(value) => updateField("stock", value)}
                  placeholder={t("products.form.placeholders.stock")}
                  value={values.stock}
                />
              )}
            </FormField>
            <FormField
              error={errors.discountPercentage}
              label={t("products.fields.discountPercent")}
              name="discountPercentage"
            >
              {(fieldProps) => (
                <div className="input-suffix">
                  <NumberInput
                    {...fieldProps}
                    maxFractionDigits={2}
                    onValueChange={(value) =>
                      updateField("discountPercentage", value)
                    }
                    placeholder={t("products.form.placeholders.discount")}
                    value={values.discountPercentage}
                  />
                  <span>%</span>
                </div>
              )}
            </FormField>
            <FormField
              error={errors.sku}
              label={t("products.fields.sku")}
              name="sku"
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  className="input"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.sku")}
                  type="text"
                  value={values.sku}
                />
              )}
            </FormField>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__header">
            <span>
              <ImageIcon aria-hidden="true" />
            </span>
            <div>
              <h2>{t("products.form.sections.media.title")}</h2>
              <p>{t("products.form.sections.media.description")}</p>
            </div>
          </div>
          <div className="media-field">
            <div className="media-field__preview">
              {values.thumbnail ? (
                <img
                  alt={t("products.form.thumbnail.previewAlt")}
                  src={values.thumbnail}
                />
              ) : (
                <ImageIcon aria-hidden="true" />
              )}
            </div>
            <FormField
              error={errors.thumbnail}
              hint={t("products.form.hints.simulatedPersistence")}
              label={t("products.fields.thumbnailUrl")}
              name="thumbnail"
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  className="input"
                  onChange={handleChange}
                  placeholder={t("products.form.placeholders.thumbnailUrl")}
                  type="url"
                  value={values.thumbnail}
                />
              )}
            </FormField>
          </div>
        </section>

        <div className="form-actions">
          <Button
            disabled={isSubmitting}
            onClick={handleCancel}
            variant="secondary"
          >
            {t("common.actions.cancel")}
          </Button>
          <Button isLoading={isSubmitting} type="submit">
            <Save aria-hidden="true" />
            {submitLabel}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        confirmLabel={t("products.form.discard.confirm")}
        description={t("products.form.discard.description")}
        isOpen={isDiscardDialogOpen}
        onClose={() => setIsDiscardDialogOpen(false)}
        onConfirm={handleDiscard}
        title={t("products.form.discard.title")}
      />
    </>
  );
}
