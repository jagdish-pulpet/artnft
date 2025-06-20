
// react-native-app/App.tsx
import 'react-native-gesture-handler'; // Recommended to be at the top
import 'react-native-get-random-values'; // Ensure crypto polyfill for WalletConnect and ethers
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/store/authContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingIndicator from './src/components/common/LoadingIndicator';
import { theme } from './src/styles/theme';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingIndicator fullScreen color={theme.colors.primary} />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

// IMPORTANT: Deep Linking Configuration for WalletConnect
// 1. Choose a unique URL scheme for your app (e.g., "artnftmarketplace").
//    This scheme MUST be configured in your app's native build files:
//    - For Expo managed workflow: in `app.json` under `expo.scheme`.
//    - For bare React Native: in `Info.plist` (iOS) and `AndroidManifest.xml` (Android).
// 2. Update the SCHEME constant below with your chosen scheme.
const SCHEME = "artnftmarketplace"; // REPLACE with your app's custom URL scheme

// The redirectUrl tells WalletConnect where to redirect after wallet interaction.
// For native builds, it will be `scheme://`.
// For Expo Go during development, deep linking might require specific configuration or may not work reliably for all wallets.
// Ensure this is correctly set up for standalone builds.
const REDIRECT_URL = Platform.OS === 'web' 
  ? typeof window !== 'undefined' ? window.location.origin : '' // For web builds (testing with `expo start --web`)
  : `${SCHEME}://`; // For native builds

export default function App() {
  return (
    <WalletConnectProvider
      redirectUrl={REDIRECT_URL}
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}
    >
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
      <Toast /> 
    </WalletConnectProvider>
  );
}
