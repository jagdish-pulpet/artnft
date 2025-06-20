
// react-native-app/src/store/authContext.tsx
// Placeholder for Auth Context (or equivalent state management setup for auth)
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage
// import apiClient from '../api/apiService'; // Your API client

// Define your User type based on your backend's /auth/me response
interface AuthUser {
  id: string;
  username: string;
  email?: string;
  roles: string[];
  avatarUrl?: string;
  // Add other fields like walletAddress, isEmailVerified, etc.
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin?: boolean, originalMessage?: string) => Promise<void>;
  signup: (username: string, email: string, password_unused: string, walletAddress: string) => Promise<void>;
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
      // const storedToken = await AsyncStorage.getItem('authToken');
      const storedToken = null; // Placeholder
      if (storedToken) {
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        // const response = await apiClient.get<{ data: AuthUser }>('/auth/me');
        // const user = response.data.data; // Adjust based on your API response structure
        // if (user) {
        //   setAuthState({
        //     token: storedToken,
        //     user,
        //     isAuthenticated: true,
        //     isLoading: false,
        //     isAdmin: user.roles?.includes('ADMIN') || user.roles?.includes('admin') || false,
        //   });
        // } else {
        //   throw new Error("User not found with token");
        // }
        // Placeholder for successful load
         setAuthState({ token: storedToken, user: {id: 'test', username: 'Test User', roles:['USER']}, isAuthenticated: true, isLoading: false, isAdmin: false });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null }));
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      // await AsyncStorage.removeItem('authToken');
      // delete apiClient.defaults.headers.common['Authorization'];
      setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin?: boolean, originalMessage?: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // let response;
      // if (isWalletLogin) {
      //   response = await apiClient.post('/auth/signin/wallet', { walletAddress: emailOrWallet, signedMessage: passwordOrMessage, originalMessage });
      // } else {
      //   response = await apiClient.post('/auth/signin', { email: emailOrWallet, password: passwordOrMessage });
      // }
      // const { token: apiToken, data: userData } = response.data; // Adjust based on your API
      // await AsyncStorage.setItem('authToken', apiToken.token);
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken.token}`;
      // setAuthState({
      //   token: apiToken.token,
      //   user: userData,
      //   isAuthenticated: true,
      //   isLoading: false,
      //   isAdmin: userData.roles?.includes('ADMIN') || userData.roles?.includes('admin') || false,
      // });
      // Placeholder
      console.log("RN Login:", { emailOrWallet, passwordOrMessage, isWalletLogin, originalMessage });
      await new Promise(r => setTimeout(r, 1000));
      setAuthState({ token: "mockToken", user: {id: 'test', username: 'Test User', roles:['USER']}, isAuthenticated: true, isLoading: false, isAdmin: false });

    } catch (error: any) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null }));
      throw error; // Re-throw to be caught by UI
    }
  };
  
  const signup = async (username: string, email: string, password_unused: string, walletAddress: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
        // const response = await apiClient.post('/auth/signup', { username, email, password: "PlaceholderPassword!123", walletAddress });
        // const { token: apiToken, data: userData } = response.data;
        // await AsyncStorage.setItem('authToken', apiToken.token);
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${apiToken.token}`;
        // setAuthState({ token: apiToken.token, user: userData, isAuthenticated: true, isLoading: false, isAdmin: userData.roles?.includes('ADMIN') || false });
        console.log("RN Signup:", { username, email, password_unused, walletAddress });
        await new Promise(r => setTimeout(r, 1000));
        setAuthState({ token: "mockToken", user: {id: 'test', username: username, roles:['USER']}, isAuthenticated: true, isLoading: false, isAdmin: false });

    } catch (error: any) {
        console.error('Signup failed:', error);
        setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null }));
        throw error;
    }
  };


  const logout = async () => {
    // await AsyncStorage.removeItem('authToken');
    // delete apiClient.defaults.headers.common['Authorization'];
    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, isAdmin: false });
  };

  const authContextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshAuthUser: loadUserFromStorage, // Alias for clarity
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

    