import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL;

// If VITE_API_URL is explicitly set, use it.
// Otherwise, in production use "/api" (which Vercel proxies), 
// and in development use localhost.
const API_URL = envApiUrl || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ee_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ee_token");
      localStorage.removeItem("ee_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
