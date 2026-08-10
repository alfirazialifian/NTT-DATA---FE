import { useTranslation } from "../../../shared/i18n/useTranslation";
import Skeleton from "../../../shared/ui/Skeleton";

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => index);

export default function ProductListSkeleton() {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("products.list.loadingLabel")}
      className="product-list-skeleton"
      role="status"
    >
      <div className="product-list-skeleton__heading" aria-hidden="true">
        <span>{t("products.table.columns.product")}</span>
        <span>{t("products.table.columns.category")}</span>
        <span>{t("products.table.columns.price")}</span>
        <span>{t("products.table.columns.stock")}</span>
        <span />
      </div>
      {SKELETON_ROWS.map((row) => (
        <div className="product-list-skeleton__row" key={row}>
          <div className="product-list-skeleton__product">
            <Skeleton className="product-list-skeleton__image" />
            <div>
              <Skeleton height={12} width="min(180px, 75%)" />
              <Skeleton height={8} width={90} />
            </div>
          </div>
          <Skeleton className="product-list-skeleton__badge" />
          <Skeleton height={20} width={72} />
          <Skeleton className="product-list-skeleton__badge" />
          <div className="product-list-skeleton__actions">
            <Skeleton height={30} width={30} />
            <Skeleton height={30} width={30} />
            <Skeleton height={30} width={30} />
          </div>
        </div>
      ))}
    </div>
  );
}
