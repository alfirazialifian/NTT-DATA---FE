import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import Button from "./Button";

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  isLoading = false,
  onConfirm,
  onClose,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-describedby="confirm-dialog-description"
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="dialog"
        role="alertdialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          aria-label={t("common.dialog.closeAria")}
          className="dialog__close"
          disabled={isLoading}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" />
        </button>
        <div className="dialog__icon">
          <AlertTriangle aria-hidden="true" />
        </div>
        <h2 id="confirm-dialog-title">{title}</h2>
        <p id="confirm-dialog-description">{description}</p>
        <div className="dialog__actions">
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            {t("common.actions.cancel")}
          </Button>
          <Button isLoading={isLoading} onClick={onConfirm} variant="danger">
            {confirmLabel ?? t("common.actions.confirm")}
          </Button>
        </div>
      </section>
    </div>
  );
}
