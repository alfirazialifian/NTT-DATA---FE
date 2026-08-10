import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";
import { useToastStore } from "../stores/toastStore";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
};

export default function ToastContainer() {
  const { t } = useTranslation();
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div aria-live="polite" className="toast-region">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] ?? CheckCircle2;

        return (
          <div
            className={`toast toast--${toast.type}`}
            key={toast.id}
            role="status"
          >
            <Icon className="toast__icon" aria-hidden="true" />
            <div className="toast__content">
              <strong>{toast.title}</strong>
              {toast.message ? <p>{toast.message}</p> : null}
            </div>
            <button
              aria-label={t("common.notifications.dismissAria")}
              className="toast__close"
              onClick={() => dismissToast(toast.id)}
              type="button"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
