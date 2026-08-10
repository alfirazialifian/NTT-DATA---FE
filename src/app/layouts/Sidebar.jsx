import { useQueryClient } from "@tanstack/react-query";
import { Boxes, Home, LogOut, Package, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { productKeys } from "../../features/products/queries/useProducts";
import { useTranslation } from "../../shared/i18n/useTranslation";
import { classNames } from "../../shared/lib/classNames";
import { getInitials } from "../../shared/lib/formatters";
import { useToastStore } from "../../shared/stores/toastStore";
import ConfirmDialog from "../../shared/ui/ConfirmDialog";
import OverflowTooltip from "../../shared/ui/OverflowTooltip";
import { useUiStore } from "../stores/uiStore";

const NAV_ITEMS = [
  { labelKey: "navigation.home", to: "/", icon: Home, end: true },
  { labelKey: "products.title", to: "/products", icon: Package },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  function handleLogout() {
    logout();
    queryClient.removeQueries({ queryKey: productKeys.all });
    closeSidebar();
    setIsLogoutDialogOpen(false);
    navigate("/login", { replace: true });
    showToast({
      title: t("auth.signOut.toastTitle"),
      message: t("auth.signOut.toastMessage"),
    });
  }

  return (
    <>
      <aside
        className={classNames("sidebar", isSidebarOpen && "sidebar--open")}
      >
        <div className="sidebar__header">
          <NavLink className="brand" onClick={closeSidebar} to="/">
            <span className="brand__mark">
              <Boxes aria-hidden="true" />
            </span>
            <span>
              {t("app.brand.catalog")}
              <span>{t("app.brand.admin")}</span>
            </span>
          </NavLink>
          <button
            aria-label={t("navigation.closeAria")}
            className="sidebar__close"
            onClick={closeSidebar}
            type="button"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar__workspace">
          <span className="sidebar__workspace-label">
            {t("navigation.workspace")}
          </span>
          <strong>{t("products.catalogName")}</strong>
        </div>

        <nav aria-label={t("navigation.mainAria")} className="sidebar__nav">
          <span className="sidebar__nav-label">{t("navigation.menu")}</span>
          {NAV_ITEMS.map(({ labelKey, to, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                classNames("sidebar__link", isActive && "sidebar__link--active")
              }
              end={end}
              key={to}
              onClick={closeSidebar}
              to={to}
            >
              <Icon aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__profile">
            <span className="avatar avatar--small">
              {user?.image ? (
                <img alt="" src={user.image} />
              ) : (
                getInitials(user?.firstName, user?.lastName)
              )}
            </span>
            <div>
              <OverflowTooltip as="strong" content={fullName}>
                {fullName}
              </OverflowTooltip>
              <OverflowTooltip as="span" content={user?.email ?? ""}>
                {user?.email}
              </OverflowTooltip>
            </div>
          </div>
          <button
            className="sidebar__link sidebar__logout"
            onClick={() => setIsLogoutDialogOpen(true)}
            type="button"
          >
            <LogOut aria-hidden="true" />
            <span>{t("auth.signOut.action")}</span>
          </button>
        </div>
      </aside>

      <ConfirmDialog
        confirmLabel={t("auth.signOut.action")}
        description={t("auth.signOut.dialogDescription")}
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title={t("auth.signOut.dialogTitle")}
      />
    </>
  );
}
