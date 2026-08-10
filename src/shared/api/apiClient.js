import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://dummyjson.com";

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status ?? 0;
    const details = error.response?.data ?? error;
    const message =
      error.response?.data?.message ??
      (status === 0
        ? "Unable to connect to the server. Check your internet connection."
        : "The request could not be completed.");

    return Promise.reject(new ApiError(message, status, details));
  },
);

export async function apiRequest(path, options = {}) {
  const { body, token, headers, ...requestConfig } = options;
  const response = await apiClient.request({
    url: path,
    data: body,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...requestConfig,
  });

  return response.data;
}
