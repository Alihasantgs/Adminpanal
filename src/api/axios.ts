import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL||"https://supercli-dev-495981130172.europe-west1.run.app";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect automatically - let the app handle errors
    // Only clear token if it's a 401 and we're not already on login page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('access_token');
      // Don't redirect, let the app handle it
    }
    return Promise.reject(error);
  }
);

export default api;
