
// react-native-app/src/api/apiService.ts
import axios from 'axios';
// import { API_URL } from '@env'; // If using react-native-dotenv

// Replace with your actual backend URL, possibly from an environment variable
const BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example: Interceptor to add auth token
// apiClient.interceptors.request.use(async (config) => {
//   // const token = await getAuthToken(); // Implement secure token storage
//   // if (token) {
//   //   config.headers.Authorization = `Bearer ${token}`;
//   // }
//   return config;
// });

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default apiClient;

    