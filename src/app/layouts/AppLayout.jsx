import { Outlet } from "react-router-dom";
import { useTranslation } from "../../shared/i18n/useTranslation";
import { useUiStore } from "../stores/uiStore";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const { t } = useTranslation();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);

  return (
    <div className="app-shell">
      <Sidebar />
      {isSidebarOpen ? (
        <button
          aria-label={t("navigation.closeAria")}
          className="sidebar-overlay"
          onClick={closeSidebar}
          type="button"
        />
      ) : null}
      <div className="app-shell__body">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
