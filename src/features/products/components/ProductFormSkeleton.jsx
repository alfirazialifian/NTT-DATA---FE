import { useTranslation } from "../../../shared/i18n/useTranslation";
import Skeleton from "../../../shared/ui/Skeleton";

const SECTIONS = [4, 4, 1];

export default function ProductFormSkeleton() {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("products.form.loadingLabel")}
      className="page-stack page-stack--form product-form-skeleton"
      role="status"
    >
      <Skeleton height={16} width={155} />
      <div className="product-form-skeleton__header">
        <Skeleton height={9} width={140} />
        <Skeleton height={35} width="min(420px, 82vw)" />
        <Skeleton height={11} width="min(480px, 88vw)" />
      </div>
      {SECTIONS.map((fieldCount, sectionIndex) => (
        <section className="form-section" key={sectionIndex}>
          <div className="product-form-skeleton__section-title">
            <Skeleton height={30} width={30} />
            <div>
              <Skeleton height={13} width={130} />
              <Skeleton height={9} width={170} />
            </div>
          </div>
          <div className="product-form-skeleton__fields">
            {Array.from({ length: fieldCount }, (_, fieldIndex) => (
              <div key={fieldIndex}>
                <Skeleton height={9} width={85} />
                <Skeleton height={44} width="100%" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
