// react-native-app/src/types/api.ts

// Generic response structure if your backend consistently wraps data
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: { // For paginated responses
    total: number;
    page: number;
    limit: number;
  };
  token?: { // For auth responses
    token: string;
    expiresIn?: string | number;
  };
}


// Specific response for image uploads
export interface ApiUploadData {
  url: string;
  originalName: string;
  size: number;
}
export type ApiUploadResponse = ApiResponse<ApiUploadData>;


// You can add more specific API response types here as needed.
// For example, for auth:
// import type { User } from './entities';
// export type AuthResponse = ApiResponse<User>;
