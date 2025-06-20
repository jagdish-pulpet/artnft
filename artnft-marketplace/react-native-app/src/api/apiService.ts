
// react-native-app/src/api/apiService.ts
import axios from 'axios';
import { API_URL } from '@env'; // Import from react-native-dotenv
import * as SecureStorage from '../utils/storage';

const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:3001/api', // Fallback if env var is not set
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStorage.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export class ApiError extends Error {
  status: number;
  data?: { message?: string; errors?: any };

  constructor(message: string, status: number, data?: { message?: string; errors?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Interceptor to handle API errors globally or reformat them
apiClient.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  (error) => {
    if (axios.isAxiosError(error)) {
      // Error from Axios (network error, timeout, HTTP error status)
      const status = error.response?.status || 500;
      const data = error.response?.data;
      let message = 'An API error occurred';

      if (data && data.message) {
        message = data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // You might want to log specific errors or handle specific statuses differently
      // e.g., if (status === 401) { /* handle unauthorized */ }

      return Promise.reject(new ApiError(message, status, data));
    } else {
      // Non-Axios error
      return Promise.reject(new ApiError(error.message || 'An unexpected error occurred', 500));
    }
  }
);


export default apiClient;
