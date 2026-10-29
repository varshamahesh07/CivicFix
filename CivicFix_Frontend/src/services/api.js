import axios from 'axios';

// Base API configuration for future Flask backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for attaching auth token when backend is connected
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civicfix_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if network failed or server returned error
    const message = error.response?.data?.message || error.message || 'CivicFix server communication error';
    return Promise.reject(new Error(message));
  }
);

// Configuration flag: demo mode enabled by default until backend is deployed
export const IS_DEMO_MODE = import.meta.env.VITE_USE_MOCK_API !== 'false';

export default apiClient;
