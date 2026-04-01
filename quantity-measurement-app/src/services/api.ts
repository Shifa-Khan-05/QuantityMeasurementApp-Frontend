import axios from "axios";
import { getBackendErrorMessage } from "../utils/errorHandler";
import { showError } from "../utils/toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle Expired Tokens & Errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = getBackendErrorMessage(error);
    
    // Check for 401 Unauthorized (Expired or Invalid Token)
    if (error.response?.status === 401) {
      // 1. Clear all local storage auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('loggedInName');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('authUserPayload');

      // 2. Dispatch event so components (like Navbar) can update UI immediately
      window.dispatchEvent(new Event('auth-expired'));

      // 3. Show toast error (replacing the manual alert)
      showError(errorMessage);

      // 4. Redirect to login/home page
      // Using a slight delay to allow the toast to be seen before redirect if using href
      // But better yet, many apps just clear state and let the Router handle it.
      // For now keeping the href as per user's previous code but using '/'
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      // Handle other errors globally with a toast
      showError(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;