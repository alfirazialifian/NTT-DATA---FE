import { apiRequest } from "../../../shared/api/apiClient";

const AUTH_LOGIN_ROUTE = "/auth/login";

export const authService = {
  login(credentials) {
    return apiRequest(AUTH_LOGIN_ROUTE, {
      method: "POST",
      body: {
        ...credentials,
        expiresInMins: 60,
      },
    });
  },
};
