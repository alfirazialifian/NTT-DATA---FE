import {
  ArrowRight,
  Box,
  CircleCheck,
  PackagePlus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import PageHeader from "../../../shared/ui/PageHeader";

const FEATURES = [
  {
    icon: Search,
    titleKey: "home.features.search.title",
    descriptionKey: "home.features.search.description",
  },
  {
    icon: Box,
    titleKey: "home.features.manage.title",
    descriptionKey: "home.features.manage.description",
  },
  {
    icon: ShieldCheck,
    titleKey: "home.features.protected.title",
    descriptionKey: "home.features.protected.description",
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <div className="page-stack">
      <PageHeader
        description={t("home.header.description")}
        eyebrow={t("navigation.home")}
        title={t("home.header.welcome", {
          name: fullName || t("common.userFallback"),
        })}
      />

      <section className="welcome-card">
        <div className="welcome-card__content">
          <span className="welcome-card__label">
            <CircleCheck aria-hidden="true" />
            {t("home.status.signedIn")}
          </span>
          <h2>{t("home.welcome.title")}</h2>
          <p>{t("home.welcome.description")}</p>
          <div className="welcome-card__actions">
            <Link
              className="button button--primary button--medium"
              to="/products"
            >
              {t("products.actions.viewAll")}
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              className="button button--secondary button--medium"
              to="/products/new"
            >
              <PackagePlus aria-hidden="true" />
              {t("products.actions.add")}
            </Link>
          </div>
        </div>
        <div className="welcome-card__art" aria-hidden="true">
          <div className="welcome-card__box welcome-card__box--one" />
          <div className="welcome-card__box welcome-card__box--two" />
          <div className="welcome-card__box welcome-card__box--three" />
          <Box />
        </div>
      </section>

      <section
        className="feature-grid"
        aria-label={t("home.capabilities.ariaLabel")}
      >
        {FEATURES.map(({ icon: Icon, titleKey, descriptionKey }) => (
          <article className="feature-card" key={titleKey}>
            <span className="feature-card__icon">
              <Icon aria-hidden="true" />
            </span>
            <h3>{t(titleKey)}</h3>
            <p>{t(descriptionKey)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
