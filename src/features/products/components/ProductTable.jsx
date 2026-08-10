import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import {
  formatCategory,
  formatCurrency,
  formatNumber,
} from "../../../shared/lib/formatters";
import Badge from "../../../shared/ui/Badge";
import OverflowTooltip from "../../../shared/ui/OverflowTooltip";

function getStockBadge(product, t) {
  if (product.stock <= 0) {
    return { label: t("products.stock.outOfStock"), tone: "danger" };
  }
  if (product.stock < 10) {
    return {
      label: t("products.stock.remaining", {
        count: formatNumber(product.stock),
      }),
      tone: "warning",
    };
  }
  return {
    label: t("products.stock.inStockCount", {
      count: formatNumber(product.stock),
    }),
    tone: "success",
  };
}

export default function ProductTable({ products, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="table-scroll">
      <table className="product-table">
        <thead>
          <tr>
            <th scope="col">{t("products.table.columns.product")}</th>
            <th scope="col">{t("products.table.columns.category")}</th>
            <th scope="col">{t("products.table.columns.price")}</th>
            <th scope="col">{t("products.table.columns.stock")}</th>
            <th className="product-table__actions-heading" scope="col">
              <span className="sr-only">
                {t("products.table.columns.actions")}
              </span>
              <MoreHorizontal aria-hidden="true" />
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockBadge = getStockBadge(product, t);

            return (
              <tr key={product.id}>
                <td>
                  <Link className="product-cell" to={`/products/${product.id}`}>
                    <span className="product-cell__image">
                      {product.thumbnail ? (
                        <img alt="" loading="lazy" src={product.thumbnail} />
                      ) : (
                        <span>{product.title.charAt(0)}</span>
                      )}
                    </span>
                    <span>
                      <OverflowTooltip as="strong" content={product.title}>
                        {product.title}
                      </OverflowTooltip>
                      <small>
                        {product.brand || t("products.fallback.unbranded")} · #
                        {product.id}
                      </small>
                    </span>
                  </Link>
                </td>
                <td>
                  <Badge>{formatCategory(product.category)}</Badge>
                </td>
                <td className="product-table__price">
                  {formatCurrency(product.price)}
                </td>
                <td>
                  <Badge tone={stockBadge.tone}>{stockBadge.label}</Badge>
                </td>
                <td>
                  <div className="row-actions">
                    <Link
                      aria-label={t("products.actions.viewAria", {
                        title: product.title,
                      })}
                      className="icon-button"
                      to={`/products/${product.id}`}
                      title={t("products.actions.viewDetails")}
                    >
                      <Eye aria-hidden="true" />
                    </Link>
                    <Link
                      aria-label={t("products.actions.editAria", {
                        title: product.title,
                      })}
                      className="icon-button"
                      to={`/products/${product.id}/edit`}
                      title={t("products.actions.edit")}
                    >
                      <Pencil aria-hidden="true" />
                    </Link>
                    <button
                      aria-label={t("products.actions.deleteAria", {
                        title: product.title,
                      })}
                      className="icon-button icon-button--danger"
                      onClick={() => onDelete(product)}
                      title={t("products.actions.delete")}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
