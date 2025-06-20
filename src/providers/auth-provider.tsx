
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthContextType, AuthState, AuthUser } from '@/types/auth';
import { apiService, ApiError } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';

const initialAuthState: AuthState = {
  token: null,
  user: null,
  isAdmin: false,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const { toast } = useToast();

  const loadUser = useCallback(async (tokenToLoad: string) => {
    if (!tokenToLoad) {
      setAuthState({ ...initialAuthState, isLoading: false });
      return;
    }
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await apiService.get<{data: AuthUser}>('/auth/me', tokenToLoad);
      const user = response.data;
      if (user) {
        setAuthState({
          token: tokenToLoad,
          user,
          isAdmin: user.roles?.includes('ADMIN') || user.roles?.includes('admin') || false,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem('authToken');
        setAuthState({ ...initialAuthState, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load user from token:', error);
      localStorage.removeItem('authToken');
      setAuthState({ ...initialAuthState, isLoading: false });
    }
  }, []);

  const refreshAuthUser = useCallback(async () => {
    const currentToken = authState.token || localStorage.getItem('authToken');
    if (currentToken) {
      await loadUser(currentToken);
    } else {
      // No token, ensure logged out state
      setAuthState({ ...initialAuthState, isLoading: false });
    }
  }, [loadUser, authState.token]);


  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      loadUser(storedToken);
    } else {
      setAuthState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, [loadUser]);


  const login = async (emailOrWallet: string, passwordOrMessage?: string, isWalletLogin = false, originalMessage?: string) => {
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    try {
      let response;
      if (isWalletLogin) {
        if (!passwordOrMessage || !originalMessage) {
          throw new Error("Signed message and original message are required for wallet login.");
        }
        response = await apiService.post<{ token: {token: string}, data: AuthUser }>('/auth/signin/wallet', {
          walletAddress: emailOrWallet,
          signedMessage: passwordOrMessage,
          originalMessage: originalMessage,
        });
      } else {
        if (!passwordOrMessage) {
          throw new Error("Password is required for email login.");
        }
        response = await apiService.post<{ token: {token: string}, data: AuthUser }>('/auth/signin', {
          email: emailOrWallet,
          password: passwordOrMessage,
        });
      }

      if (response.token && response.data) {
        const { token } = response.token;
        const user = response.data;
        localStorage.setItem('authToken', token);
        setAuthState({
          token,
          user,
          isAdmin: user.roles?.includes('ADMIN') || user.roles?.includes('admin') || false,
          isLoading: false,
          isAuthenticated: true,
        });
        toast({ title: 'Login Successful', description: `Welcome back, ${user.username}!` });
      } else {
        throw new Error('Login failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Login failed. Please check your credentials.';
      toast({ title: 'Login Failed', description: errorMessage, variant: 'destructive' });
      setAuthState(prevState => ({ ...prevState, isLoading: false, isAuthenticated: false, user: null, token: null }));
      throw error;
    }
  };

  const signup = async (username: string, email: string, password_unused: string, walletAddress: string) => {
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    const placeholderPassword = "DefaultPassword123!";

    try {
      const response = await apiService.post<{ token: {token: string}, data: AuthUser }>('/auth/signup', {
        username,
        email,
        password: placeholderPassword,
        walletAddress,
      });

      if (response.token && response.data) {
        const { token } = response.token;
        const user = response.data;
        localStorage.setItem('authToken', token);
        setAuthState({
          token,
          user,
          isAdmin: user.roles?.includes('ADMIN') || user.roles?.includes('admin') || false,
          isLoading: false,
          isAuthenticated: true,
        });
        toast({ title: 'Signup Successful', description: `Welcome, ${user.username}!` });
      } else {
        throw new Error('Signup failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Signup failed. Please try again.';
      toast({ title: 'Signup Failed', description: errorMessage, variant: 'destructive' });
      setAuthState(prevState => ({ ...prevState, isLoading: false, isAuthenticated: false, user: null, token: null }));
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ ...initialAuthState, isLoading: false });
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };


  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, refreshAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
