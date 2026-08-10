import { useTranslation } from "../../../shared/i18n/useTranslation";
import Skeleton from "../../../shared/ui/Skeleton";

export default function ProductDetailSkeleton() {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("products.detail.loadingLabel")}
      className="page-stack product-detail-skeleton"
      role="status"
    >
      <Skeleton height={16} width={125} />
      <div className="product-detail-skeleton__header">
        <div>
          <Skeleton height={9} width={145} />
          <Skeleton height={35} width="min(360px, 80vw)" />
        </div>
        <div>
          <Skeleton height={42} width={88} />
          <Skeleton height={42} width={96} />
        </div>
      </div>
      <div className="product-detail-grid">
        <div>
          <Skeleton className="product-detail-skeleton__image" />
          <div className="product-detail-skeleton__thumbnails">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
        <div className="product-detail-skeleton__summary">
          <div className="product-detail-skeleton__badges">
            <Skeleton height={24} width={82} />
            <Skeleton height={24} width={66} />
          </div>
          <Skeleton height={34} width="86%" />
          <Skeleton height={11} width={130} />
          <Skeleton height={15} width={105} />
          <Skeleton height={31} width={145} />
          <div className="product-detail-skeleton__copy">
            <Skeleton height={10} width="100%" />
            <Skeleton height={10} width="96%" />
            <Skeleton height={10} width="82%" />
          </div>
          <div className="product-detail-skeleton__facts">
            <Skeleton height={42} />
            <Skeleton height={42} />
            <Skeleton height={42} />
          </div>
        </div>
      </div>
      <Skeleton className="product-detail-skeleton__information" />
    </div>
  );
}
