// react-native-app/src/services/imageUploadService.ts
import apiClient, { ApiError } from '../api/apiService';
import type { ApiUploadResponse } from '../types/api';

/**
 * Uploads an image file to the backend.
 * @param imageUri The local URI of the image file (from expo-image-picker).
 * @param token The authentication token.
 * @returns The URL of the uploaded image, or undefined if upload fails.
 * @throws ApiError if the upload fails at the API level.
 */
export const uploadImageFile = async (
  imageUri: string,
  token: string | null
): Promise<string | undefined> => {
  if (!imageUri) {
    console.warn('uploadImageFile: No image URI provided.');
    return undefined;
  }
  if (!token) {
    console.error('uploadImageFile: Authentication token is required for image upload.');
    // Depending on app flow, you might throw or return undefined
    throw new ApiError('Authentication required to upload images.', 401);
  }

  const filename = imageUri.split('/').pop() || `image-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  let type = match ? `image/${match[1]}` : `image`;

  // Fix for common extensions like 'jpeg' which might not be standard MIME subtypes
  if (type === 'image/jpg') type = 'image/jpeg';


  const formData = new FormData();
  // The 'uri' needs to be the local file path for react-native
  // For web, it would be the File object itself.
  // The type cast to 'any' is a common workaround for FormData in RN with files.
  formData.append('imageFile', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  try {
    // The apiClient should handle the token automatically via interceptors if configured
    const response = await apiClient.post<ApiUploadResponse>(
      '/upload/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header is typically added by apiClient interceptor
        },
      }
    );
    if (response.data && response.data.data && response.data.data.url) {
      return response.data.data.url;
    } else {
      console.error('Upload response did not contain a URL:', response.data);
      throw new Error('Image uploaded, but no URL was returned.');
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    if (error instanceof ApiError) {
      throw error; // Re-throw ApiError to be caught by the calling form
    }
    throw new ApiError(
      'Failed to upload image due to an unexpected error.',
      (error as any).status || 500,
      { message: (error as Error).message }
    );
  }
};
