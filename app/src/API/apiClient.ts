import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

// Create Axios instance for Admin API
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 100000,
});

// Add Request Interceptors for Auth Tokens
const addAuthInterceptor = (apiClient: any) => {
  apiClient.interceptors.request.use(
    (config: any) => {
      const token = cookies.get("user")?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  return apiClient;
};

// Apply Interceptors
addAuthInterceptor(apiClient);
