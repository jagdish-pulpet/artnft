
// react-native-app/src/utils/storage.ts
// Utility functions for interacting with AsyncStorage (or secure storage)

import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'artnft_auth_token';
const USER_PREFERENCES_KEY = 'artnft_user_preferences'; // Example

export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log('Auth token stored successfully.');
  } catch (e) {
    console.error('Failed to store auth token.', e);
    // Optionally throw the error or handle it as per app's error strategy
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    console.log('Auth token retrieved:', token ? 'found' : 'not found');
    return token;
  } catch (e) {
    console.error('Failed to get auth token.', e);
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    console.log('Auth token removed successfully.');
  } catch (e) {
    console.error('Failed to remove auth token.', e);
  }
};

// Example for user preferences
export const storeUserPreferences = async (preferences: object): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(preferences);
        await AsyncStorage.setItem(USER_PREFERENCES_KEY, jsonValue);
    } catch (e) {
        console.error('Failed to store user preferences.', e);
    }
};

export const getUserPreferences = async <T = object>(): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch(e) {
        console.error('Failed to get user preferences.', e);
        return null;
    }
};

// Add functions for other stored data as needed
// Consider using a library like `react-native-keychain` for storing sensitive data securely.

    