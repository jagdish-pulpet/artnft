
// react-native-app/src/store/authContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import * as SecureStorage from '../utils/storage'; // Using your storage utility
import apiClient, { ApiError } from '../api/apiService';
import type { User } from '../types/entities';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin?: boolean, originalMessage?: string) => Promise<void>;
  signup: (username: string, email: string, password_placeholder: string, walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
  });

  const loadUserFromStorage = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const storedToken = await SecureStorage.getAuthToken();
      if (storedToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        const response = await apiClient.get<{ data: User }>('/auth/me'); // Backend returns { data: User }
        const user = response.data.data;
        if (user) {
          setAuthState({
            token: storedToken,
            user,
            isAuthenticated: true,
            isLoading: false,
            isAdmin: user.roles?.includes('ADMIN') || user.roles?.includes('admin') || false,
          });
        } else {
          await SecureStorage.removeAuthToken();
          delete apiClient.defaults.headers.common['Authorization'];
          setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, isAdmin: false });
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null, isAdmin: false }));
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      await SecureStorage.removeAuthToken();
      delete apiClient.defaults.headers.common['Authorization'];
      setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin = false, originalMessage?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      let response;
      let loginPayload: any;

      if (isWalletLogin) {
        if (!passwordOrMessage || !originalMessage) throw new ApiError("Signature and original message are required for wallet login.", 400, {message: "Signature and original message are required for wallet login."});
        loginPayload = { walletAddress: emailOrWallet, signedMessage: passwordOrMessage, originalMessage };
        response = await apiClient.post<{ token: {token: string}, data: User }>('/auth/signin/wallet', loginPayload);
      } else {
        if (!passwordOrMessage) throw new ApiError("Password is required for email login.", 400, {message: "Password is required for email login."});
        loginPayload = { email: emailOrWallet, password: passwordOrMessage };
        response = await apiClient.post<{ token: {token: string}, data: User }>('/auth/signin', loginPayload);
      }
      
      const { token: apiTokenData, data: userData } = response.data;
      const apiToken = apiTokenData.token;

      await SecureStorage.storeAuthToken(apiToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
      setAuthState({
        token: apiToken,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        isAdmin: userData.roles?.includes('ADMIN') || userData.roles?.includes('admin') || false,
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null, isAdmin: false }));
      if (error instanceof ApiError) throw error; // Re-throw ApiError
      throw new ApiError(error.message || 'Login failed. Please check your credentials.', error.status || 500, error.data); // Throw generic as ApiError
    }
  };
  
  const signup = async (username: string, email: string, password_placeholder: string, walletAddress: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    // Backend expects a password field for the SignUpDto.
    try {
        const response = await apiClient.post<{ token: {token: string}, data: User }>('/auth/signup', { username, email, password: password_placeholder, walletAddress });
        const { token: apiTokenData, data: userData } = response.data;
        const apiToken = apiTokenData.token;

        await SecureStorage.storeAuthToken(apiToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
        setAuthState({ token: apiToken, user: userData, isAuthenticated: true, isLoading: false, isAdmin: userData.roles?.includes('ADMIN') || userData.roles?.includes('admin') || false });
    } catch (error: any) {
        console.error('Signup failed:', error);
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null, isAdmin: false }));
        if (error instanceof ApiError) throw error;
        throw new ApiError(error.message || 'Signup failed. Please try again.', error.status || 500, error.data);
    }
  };

  const logout = async () => {
    await SecureStorage.removeAuthToken();
    delete apiClient.defaults.headers.common['Authorization'];
    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, isAdmin: false });
  };

  const authContextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshAuthUser: loadUserFromStorage,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
