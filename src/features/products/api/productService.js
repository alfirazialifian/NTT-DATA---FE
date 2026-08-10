import { apiRequest } from "../../../shared/api/apiClient";

const PRODUCT_ROUTES = {
  list: "/products",
  search: "/products/search",
  create: "/products/add",
  byId: (id) => `/products/${id}`,
};

const PRODUCT_FIELDS =
  "id,title,description,category,price,discountPercentage,rating,stock,brand,sku,thumbnail,images,availabilityStatus,shippingInformation,warrantyInformation,returnPolicy,minimumOrderQuantity,tags,weight,dimensions,reviews";

export const productService = {
  getAll({ query = "", limit = 10, skip = 0 } = {}, requestOptions = {}) {
    const params = new URLSearchParams({
      limit: String(limit),
      skip: String(skip),
      select: PRODUCT_FIELDS,
    });
    const endpoint = query.trim() ? PRODUCT_ROUTES.search : PRODUCT_ROUTES.list;

    if (query.trim()) params.set("q", query.trim());

    return apiRequest(`${endpoint}?${params.toString()}`, requestOptions);
  },

  getById(id, requestOptions = {}) {
    return apiRequest(PRODUCT_ROUTES.byId(id), requestOptions);
  },

  create(product) {
    return apiRequest(PRODUCT_ROUTES.create, {
      method: "POST",
      body: product,
    });
  },

  update(id, product) {
    return apiRequest(PRODUCT_ROUTES.byId(id), {
      method: "PUT",
      body: product,
    });
  },

  remove(id) {
    return apiRequest(PRODUCT_ROUTES.byId(id), {
      method: "DELETE",
    });
  },
};
