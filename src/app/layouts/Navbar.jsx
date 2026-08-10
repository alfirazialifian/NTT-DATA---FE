import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useTranslation } from "../../shared/i18n/useTranslation";
import { getInitials } from "../../shared/lib/formatters";
import OverflowTooltip from "../../shared/ui/OverflowTooltip";
import PreferenceControls from "../../shared/ui/PreferenceControls";
import { useUiStore } from "../stores/uiStore";

function getPageTitle(pathname, t) {
  if (pathname === "/") return t("navigation.pages.overview");
  if (pathname === "/products") return t("products.title");
  if (pathname === "/products/new") return t("products.actions.add");
  if (pathname.endsWith("/edit")) return t("products.actions.edit");
  if (/^\/products\/\d+$/.test(pathname)) return t("products.detail.title");
  return t("navigation.dashboard");
}

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const openSidebar = useUiStore((state) => state.openSidebar);
  const pageTitle = getPageTitle(pathname, t);
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <header className="navbar">
      <div className="navbar__title">
        <button
          aria-label={t("navigation.openAria")}
          className="navbar__menu"
          onClick={openSidebar}
          type="button"
        >
          <Menu aria-hidden="true" />
        </button>
        <div>
          <span>{t("navigation.dashboard")}</span>
          <OverflowTooltip as="strong" content={pageTitle}>
            {pageTitle}
          </OverflowTooltip>
        </div>
      </div>

      <div className="navbar__actions">
        <PreferenceControls />
        <span aria-hidden="true" className="navbar__divider" />
        <div className="navbar__profile">
          <div>
            <OverflowTooltip as="strong" content={fullName}>
              {fullName}
            </OverflowTooltip>
            <span>{t("roles.administrator")}</span>
          </div>
          <span className="avatar">
            {user?.image ? (
              <img
                alt={`${user.firstName} ${user.lastName}`}
                src={user.image}
              />
            ) : (
              getInitials(user?.firstName, user?.lastName)
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
