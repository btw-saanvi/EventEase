import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL;

// A localhost URL can only ever work for the machine serving the page, so it is
// meaningless in a production build. This guard keeps a stray local .env value
// (e.g. VITE_API_URL=http://localhost:5000/api) from being baked into a deploy,
// where it would make every API call fail.
const isLocalhostUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(url || "");

// Explicit VITE_API_URL wins, except for localhost URLs in production.
// Otherwise production uses "/api" (proxied by Vercel) and dev uses localhost.
const resolvedEnvUrl = envApiUrl && !(import.meta.env.PROD && isLocalhostUrl(envApiUrl)) ? envApiUrl : "";

const API_URL = resolvedEnvUrl || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

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
