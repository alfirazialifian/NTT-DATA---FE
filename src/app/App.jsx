import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import { useAuthStore } from "../features/auth/store/authStore";
import HomePage from "../features/dashboard/pages/HomePage";
import AddProductPage from "../features/products/pages/AddProductPage";
import EditProductPage from "../features/products/pages/EditProductPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import ProductListPage from "../features/products/pages/ProductListPage";
import ThemeSync from "../shared/ui/ThemeSync";
import ToastContainer from "../shared/ui/ToastContainer";
import AppLayout from "./layouts/AppLayout";
import NotFoundPage from "./pages/NotFoundPage";
import { Analytics } from "@vercel/analytics/react";

function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? <Outlet /> : <Navigate replace to="/login" />;
}

function PublicOnlyRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? <Navigate replace to="/" /> : <Outlet />;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route element={<LoginPage />} path="/login" />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<HomePage />} index />
            <Route element={<ProductListPage />} path="products" />
            <Route element={<AddProductPage />} path="products/new" />
            <Route element={<ProductDetailPage />} path="products/:productId" />
            <Route
              element={<EditProductPage />}
              path="products/:productId/edit"
            />
          </Route>
        </Route>

        <Route element={<NotFoundPage />} path="*" />
      </Routes>
      <Analytics />
      <ToastContainer />
    </>
  );
}
