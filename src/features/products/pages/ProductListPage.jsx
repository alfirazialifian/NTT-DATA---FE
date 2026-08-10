import {
  AlertCircle,
  PackageOpen,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTranslation } from "../../../shared/i18n/useTranslation";
import { formatNumber } from "../../../shared/lib/formatters";
import { useToastStore } from "../../../shared/stores/toastStore";
import ConfirmDialog from "../../../shared/ui/ConfirmDialog";
import EmptyState from "../../../shared/ui/EmptyState";
import PageHeader from "../../../shared/ui/PageHeader";
import Pagination from "../../../shared/ui/Pagination";
import ProductListSkeleton from "../components/ProductListSkeleton";
import ProductTable from "../components/ProductTable";
import { useDeleteProduct, useProducts } from "../queries/useProducts";

export default function ProductListPage() {
  const { localizeError, t } = useTranslation();
  const showToast = useToastStore((state) => state.showToast);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);
  const limit = 10;
  const debouncedSearch = useDebounce(searchValue);
  const query = debouncedSearch;
  const { products, total, isFetching, errorMessage, refetch } = useProducts({
    query,
    page,
    limit,
  });
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
    setPage(1);
  }

  function clearSearch() {
    setSearchValue("");
    setPage(1);
  }

  async function handleDelete() {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      showToast({
        title: t("products.delete.toastTitle"),
        message: t("products.delete.toastMessage", {
          title: productToDelete.title,
        }),
      });
      setProductToDelete(null);

      if (products.length === 1 && page > 1) setPage(page - 1);
    } catch (deleteError) {
      showToast({
        title: t("products.delete.errorTitle"),
        message: localizeError(deleteError.message),
        type: "error",
      });
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <Link
            className="button button--primary button--medium"
            to="/products/new"
          >
            <Plus aria-hidden="true" />
            {t("products.actions.add")}
          </Link>
        }
        description={t("products.list.description")}
        eyebrow={t("products.catalog")}
        title={t("products.title")}
      />

      <section className="data-card">
        <div className="data-card__toolbar">
          <div className="search-field">
            <Search aria-hidden="true" />
            <input
              aria-label={t("products.search.ariaLabel")}
              onChange={handleSearchChange}
              placeholder={t("products.search.placeholder")}
              type="search"
              value={searchValue}
            />
            {searchValue ? (
              <button
                aria-label={t("products.search.clear")}
                onClick={clearSearch}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <p className="data-card__count">
            {t(
              query
                ? "products.search.matchingCount"
                : "products.list.totalCount",
              { count: formatNumber(total) },
            )}
          </p>
        </div>

        {isFetching ? (
          <ProductListSkeleton />
        ) : errorMessage ? (
          <EmptyState
            action={
              <button
                className="button button--secondary button--medium"
                onClick={() => refetch()}
                type="button"
              >
                <RefreshCw aria-hidden="true" />
                {t("common.actions.tryAgain")}
              </button>
            }
            description={localizeError(errorMessage)}
            icon={AlertCircle}
            title={t("products.list.loadErrorTitle")}
          />
        ) : products.length === 0 ? (
          <EmptyState
            action={
              query ? (
                <button
                  className="button button--secondary button--medium"
                  onClick={clearSearch}
                  type="button"
                >
                  {t("products.search.clear")}
                </button>
              ) : (
                <Link
                  className="button button--primary button--medium"
                  to="/products/new"
                >
                  <Plus aria-hidden="true" />
                  {t("products.actions.addFirst")}
                </Link>
              )
            }
            description={
              query
                ? t("products.search.noMatchesDescription", { query })
                : t("products.list.emptyDescription")
            }
            icon={PackageOpen}
            title={
              query
                ? t("products.search.noMatchesTitle")
                : t("products.list.emptyTitle")
            }
          />
        ) : (
          <>
            <ProductTable onDelete={setProductToDelete} products={products} />
            <Pagination
              onPageChange={setPage}
              page={page}
              pageSize={limit}
              total={total}
            />
          </>
        )}
      </section>

      <ConfirmDialog
        confirmLabel={t("products.actions.delete")}
        description={t("products.delete.dialogDescription", {
          title: productToDelete?.title ?? "",
        })}
        isLoading={isDeleting}
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title={t("products.delete.dialogTitle")}
      />
    </div>
  );
}
