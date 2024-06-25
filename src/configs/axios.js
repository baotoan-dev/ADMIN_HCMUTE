import axios from "axios";
import { API_CONSTANT_V1 } from "constant/urlServer";

// Create instance
const instance = axios.create({
  baseURL: `${API_CONSTANT_V1}`,
  timeout: 10000,
  headers: {
      "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const url = config.url;
    if (url.includes("/v1/sign-in/admin") || url.includes("/v1/reset-access-token")) {
      return config;
    }

    // Set headers authorization
    const accessToken = window.sessionStorage.getItem("access-token") || "";
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  async (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;

    if (error.response && error.response.status === 403) {
      // Access token expired
      originalRequest._retry = true;

      // Get new access token
      const resetAccessTokenRes = await resetAccessToken();

      // Check is reset token success?
      if (resetAccessTokenRes.success) {
        // Success
        const accessToken = resetAccessTokenRes.data.accessToken;

        // Reset headers
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;

        // Reset sessionStorage
        window.sessionStorage.setItem("access-token", accessToken);

        return instance(originalRequest);
      } else {
        // Fail
        return resetAccessTokenRes;
      }
    }
    return Promise.reject(error);
  }
);

const resetAccessToken = async () => {
  const refreshToken = window.localStorage.getItem("refresh-token") || "";
  const data = {
    refreshToken,
  };
  return await instance.post("/v1/reset-access-token", data);
};

export default instance;
