import { ArrowLeft, MapPinOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useTranslation } from "../../shared/i18n/useTranslation";
import EmptyState from "../../shared/ui/EmptyState";
import PreferenceControls from "../../shared/ui/PreferenceControls";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));

  return (
    <main className="standalone-page">
      <PreferenceControls floating />
      <EmptyState
        action={
          <Link
            className="button button--primary button--medium"
            to={isAuthenticated ? "/" : "/login"}
          >
            <ArrowLeft aria-hidden="true" />
            {t("common.navigation.goBack")}
          </Link>
        }
        description={t("errors.notFound.description")}
        icon={MapPinOff}
        title={t("errors.notFound.title")}
      />
    </main>
  );
}
