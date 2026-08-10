import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productService } from "../api/productService";

export const productKeys = {
  all: ["products"],
  lists: () => ["products", "list"],
  list: ({ query, page, limit }) => [
    "products",
    "list",
    { query, page, limit },
  ],
  details: () => ["products", "detail"],
  detail: (id) => ["products", "detail", Number(id)],
};

function matchesQuery(product, query = "") {
  if (!query) return true;

  const normalizedQuery = query.toLowerCase();
  return [product.title, product.brand, product.category].some((value) =>
    value?.toLowerCase().includes(normalizedQuery),
  );
}

function updateListQueries(queryClient, updater) {
  queryClient
    .getQueriesData({ queryKey: productKeys.lists() })
    .forEach(([queryKey, currentData]) => {
      if (!currentData) return;
      queryClient.setQueryData(queryKey, updater(currentData, queryKey[2]));
    });
}

function getListQueryOptions({ query = "", page = 1, limit = 10 }) {
  const normalizedQuery = query.trim();

  return {
    queryKey: productKeys.list({ query: normalizedQuery, page, limit }),
    queryFn: ({ signal }) =>
      productService.getAll(
        {
          query: normalizedQuery,
          limit,
          skip: (page - 1) * limit,
        },
        { signal },
      ),
  };
}

export function useProducts({ query = "", page = 1, limit = 10 }) {
  const result = useQuery({
    ...getListQueryOptions({ query, page, limit }),
    placeholderData: keepPreviousData,
  });

  return {
    ...result,
    products: result.data?.products ?? [],
    total: result.data?.total ?? 0,
    errorMessage: result.error?.message ?? null,
  };
}

export function useProduct(productId) {
  const numericId = Number(productId);
  const result = useQuery({
    queryKey: productKeys.detail(numericId),
    queryFn: ({ signal }) => productService.getById(numericId, { signal }),
    enabled: Number.isInteger(numericId) && numericId > 0,
  });

  return {
    ...result,
    product: result.data ?? null,
    isLoading: result.isPending,
    error: result.error?.message ?? null,
  };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: async (createdProduct) => {
      queryClient.setQueryData(
        productKeys.detail(createdProduct.id),
        createdProduct,
      );

      const listQueries = queryClient.getQueriesData({
        queryKey: productKeys.lists(),
      });
      if (listQueries.length === 0) {
        try {
          await queryClient.ensureQueryData(
            getListQueryOptions({ query: "", page: 1, limit: 10 }),
          );
        } catch {
          // The create request succeeded; list hydration can retry on navigation.
        }
      }

      updateListQueries(queryClient, (currentData, parameters) => {
        if (!matchesQuery(createdProduct, parameters.query)) return currentData;

        const products =
          parameters.page === 1
            ? [
                createdProduct,
                ...currentData.products.filter(
                  (product) => product.id !== createdProduct.id,
                ),
              ].slice(0, parameters.limit)
            : currentData.products;

        return {
          ...currentData,
          products,
          total: currentData.total + 1,
        };
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }) => productService.update(id, values),
    onSuccess: (updatedProduct, { id }) => {
      const numericId = Number(id);
      queryClient.setQueryData(productKeys.detail(numericId), (current) => ({
        ...current,
        ...updatedProduct,
      }));

      updateListQueries(queryClient, (currentData) => ({
        ...currentData,
        products: currentData.products.map((product) =>
          product.id === numericId
            ? { ...product, ...updatedProduct }
            : product,
        ),
      }));
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.remove,
    onSuccess: (deletedProduct, id) => {
      const numericId = Number(id);

      queryClient.removeQueries({ queryKey: productKeys.detail(numericId) });
      updateListQueries(queryClient, (currentData, parameters) => {
        const matches = matchesQuery(deletedProduct ?? {}, parameters.query);

        return {
          ...currentData,
          products: currentData.products.filter(
            (product) => product.id !== numericId,
          ),
          total: matches
            ? Math.max(0, currentData.total - 1)
            : currentData.total,
        };
      });
    },
  });
}
