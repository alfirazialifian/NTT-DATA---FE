import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import { formatNumber } from "../lib/formatters";
import Button from "./Button";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <p>
        {t("pagination.summary", {
          from: formatNumber(from),
          to: formatNumber(to),
          total: formatNumber(total),
        })}
      </p>
      <div className="pagination__controls">
        <Button
          aria-label={t("pagination.previousAria")}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="small"
          variant="secondary"
        >
          <ChevronLeft aria-hidden="true" />
          <span>{t("pagination.previous")}</span>
        </Button>
        <span className="pagination__page">
          {formatNumber(page)} / {formatNumber(totalPages)}
        </span>
        <Button
          aria-label={t("pagination.nextAria")}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="small"
          variant="secondary"
        >
          <span>{t("pagination.next")}</span>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
