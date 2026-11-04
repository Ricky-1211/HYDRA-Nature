import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage if available (in addition to cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hydra_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // When sending FormData, let the browser/axios set the multipart/form-data boundary automatically
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response interceptor for unified error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);
