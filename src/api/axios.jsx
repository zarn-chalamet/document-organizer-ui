import axios from "axios";
import { toast } from "sonner";

const API_BASE = "http://localhost:8080/v1/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Attach JWT to every request
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("accessToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// On 401, log out user and redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      // Prevent redirect loop if already on login page
      const isLoginPage = window.location.pathname === "/login";
      
      if (!isLoginPage) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("email");
        toast.error("Your session has expired. Please sign in again.");
        
        // Delay so toast is visible before redirect
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      }
    }
    return Promise.reject(err);
  }
);

export default api;