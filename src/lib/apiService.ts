
// Basic API Service
// In a real app, this would be more robust, potentially using a library like Axios
// and having more sophisticated error handling and request/response interceptors.

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

interface ApiErrorData {
  message?: string;
  errors?: Record<string, unknown> | string; // Matches HttpException structure
}

export class ApiError extends Error {
  status: number;
  data?: ApiErrorData;

  constructor(message: string, status: number, data?: ApiErrorData) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {};

  if (!(body instanceof FormData)) {
    // Don't set Content-Type for FormData, browser does it with boundary
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else if (method === 'POST' || method === 'PUT') {
      config.body = JSON.stringify(body);
    }
  }


  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorData: ApiErrorData | null = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
      }
      console.error(`API Error (${response.status}): ${errorData?.message || response.statusText}`, errorData);
      throw new ApiError(errorData?.message || `Request failed with status ${response.status}`, response.status, errorData || undefined);
    }
    
    if (response.status === 204) {
      return null as T; 
    }

    // Check if response is JSON before trying to parse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json() as Promise<T>;
    } else {
        // Handle non-JSON responses, e.g. plain text for some simpler success messages
        // Or if backend sometimes returns non-JSON on success for certain endpoints (less common)
        // For now, assuming most data responses are JSON. If not, this needs adjustment.
        // If it's truly non-JSON and T is expected, this will likely fail or return unexpected result.
        // A more robust solution might check T or have different request functions for different content types.
        return response.text().then(text => text as any as T); // Attempt to cast, may not be ideal
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error; 
    }
    console.error('Network or unexpected error:', error);
    throw new ApiError( (error as Error).message || 'An unexpected network error occurred.', 0 , {message: (error as Error).message});
  }
}

export const apiService = {
  get: <T>(endpoint: string, token?: string | null) => request<T>(endpoint, 'GET', undefined, token),
  post: <T>(endpoint: string, body: unknown, token?: string | null) => request<T>(endpoint, 'POST', body, token),
  put: <T>(endpoint: string, body: unknown, token?: string | null) => request<T>(endpoint, 'PUT', body, token),
  del: <T>(endpoint: string, token?: string | null) => request<T>(endpoint, 'DELETE', undefined, token),
};
