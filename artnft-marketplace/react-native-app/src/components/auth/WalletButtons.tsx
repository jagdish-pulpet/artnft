
// react-native-app/src/components/auth/WalletButtons.tsx
import React, { useState } from 'react';
import { View, Platform, Text, StyleSheet, Alert } from 'react-native';
import AppButton from '../common/Button';
import { useAuth } from '../../store/authContext';
import { ApiError } from '../../api/apiService';
import { theme } from '../../styles/theme';
import { CreditCard, Link as LinkIcon, AlertCircle as AlertCircleIcon } from 'lucide-react-native'; // Renamed AlertCircle to avoid conflict
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { ethers } from 'ethers'; // For message signing if WalletConnect doesn't do it in a compatible way directly

// For actual wallet integration, you'd use libraries like:
// import WalletConnectProvider from "@walletconnect/react-native-dapp"; // Example
// import { useWalletConnect } from "@walletconnect/react-native-dapp"; // Example
// or specific SDKs for MetaMask mobile, Coinbase Wallet SDK etc.

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}
declare global {
  interface Window { 
    ethereum?: EthereumProvider;
  }
}

interface WalletButtonsProps {
    onAuthSuccess?: () => void; 
    onAuthError?: (message: string) => void; 
}

const WalletButtons: React.FC<WalletButtonsProps> = ({ onAuthSuccess, onAuthError }) => {
  const { login, isLoading: isAuthLoading } = useAuth();
  const [isLoadingMetaMask, setIsLoadingMetaMask] = useState(false);
  const [isLoadingWalletConnect, setIsLoadingWalletConnect] = useState(false);
  const [isLoadingCoinbase, setIsLoadingCoinbase] = useState(false);
  
  const connector = useWalletConnect();

  const clearErrors = () => {
    if (onAuthError) onAuthError('');
  };

  const handleMetaMaskSignIn = async () => {
    setIsLoadingMetaMask(true);
    clearErrors();

    if (Platform.OS === 'web' && window.ethereum && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          const msg = "No accounts found. Ensure MetaMask is unlocked.";
          if (onAuthError) onAuthError(msg);
          setIsLoadingMetaMask(false);
          return;
        }
        const walletAddress = accounts[0];
        const timestamp = Date.now();
        const originalMessage = `Sign this message to authenticate with ArtNFT Marketplace. Origin: ${window.location.origin}. Timestamp: ${timestamp}`;
        
        // For MetaMask, using ethers to sign as it's more standard for web
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signedMessage = await signer.signMessage(originalMessage);
        
        if (!signedMessage) {
          const msg = "Failed to sign message. Please try again.";
          if (onAuthError) onAuthError(msg);
          setIsLoadingMetaMask(false);
          return;
        }
        await login(walletAddress, signedMessage, true, originalMessage);
        if (onAuthSuccess) onAuthSuccess();

      } catch (err: any) {
        let displayError = "An unexpected error occurred with MetaMask.";
        if (err.code === 4001) displayError = "MetaMask request rejected by user.";
        else if (err.message?.includes("User denied message signature")) displayError = "Signature request rejected by user.";
        else if (err instanceof ApiError) displayError = err.data?.message || err.message;
        else if (err.message) displayError = err.message;
        if (onAuthError) onAuthError(displayError);
      } finally {
        setIsLoadingMetaMask(false);
      }
    } else {
      const msg = Platform.OS === 'web' 
        ? "MetaMask is not available. Please install the MetaMask browser extension."
        : "For MetaMask on native mobile, consider their mobile SDK or use WalletConnect.";
      if (onAuthError) onAuthError(msg); else Alert.alert("MetaMask Not Available", msg);
      setIsLoadingMetaMask(false);
    }
  };

  const handleWalletConnectSignIn = async () => {
    setIsLoadingWalletConnect(true);
    clearErrors();
    try {
      if (!connector.connected) {
        await connector.connect();
      }
      if (!connector.connected || !connector.accounts[0]) {
        const msg = "Failed to connect with WalletConnect. Please try again.";
        if(onAuthError) onAuthError(msg); else Alert.alert("Connection Failed", msg);
        setIsLoadingWalletConnect(false);
        return;
      }

      const walletAddress = connector.accounts[0];
      const timestamp = Date.now();
      const originalMessage = `Sign this message to authenticate with ArtNFT Marketplace. Wallet: ${walletAddress}. Timestamp: ${timestamp}`;

      // Request signature using WalletConnect
      const signedMessage = await connector.signPersonalMessage([
        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(originalMessage)), // Message needs to be hex for some wallets
        walletAddress,
      ]);

      if (!signedMessage) {
        const msg = "Failed to sign message via WalletConnect. Please try again.";
        if(onAuthError) onAuthError(msg); else Alert.alert("Signature Failed", msg);
        setIsLoadingWalletConnect(false);
        return;
      }

      await login(walletAddress, signedMessage, true, originalMessage);
      if (onAuthSuccess) onAuthSuccess();

    } catch (err: any) {
      console.error("WalletConnect sign-in error:", err);
      let displayError = "An error occurred with WalletConnect.";
      if (err.message?.toLowerCase().includes("user closed modal") || err.message?.toLowerCase().includes("user rejected")) {
        displayError = "WalletConnect request cancelled by user.";
      } else if (err instanceof ApiError) {
        displayError = err.data?.message || err.message;
      } else if (err.message) {
        displayError = err.message;
      }
      if(onAuthError) onAuthError(displayError); else Alert.alert("WalletConnect Error", displayError);
    } finally {
      setIsLoadingWalletConnect(false);
    }
  };
  
  const handleWalletConnectDisconnect = async () => {
    if (connector.connected) {
      await connector.killSession();
    }
  }

  const handleCoinbaseWallet = async () => {
    setIsLoadingCoinbase(true);
    clearErrors();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const msg = "Coinbase Wallet: Coming Soon! Please use MetaMask or WalletConnect for now.";
    if (onAuthError) onAuthError(msg); else Alert.alert("Coming Soon", msg);
    setIsLoadingCoinbase(false);
  };
  
  const anySubmitting = isLoadingMetaMask || isLoadingWalletConnect || isLoadingCoinbase;
  const isLoading = anySubmitting || isAuthLoading;

  return (
    <View style={styles.container}>
      <AppButton 
          title="Sign In with MetaMask" 
          onPress={handleMetaMaskSignIn} 
          isLoading={isLoadingMetaMask}
          disabled={isLoading}
          style={styles.button}
          leftIcon={<CreditCard size={18} color={isLoadingMetaMask ? theme.colors.mutedForeground : theme.colors.primaryForeground} />}
      />
      {connector.connected ? (
        <AppButton 
            title={`Disconnect WC (${connector.accounts[0].substring(0,6)}...)`}
            onPress={handleWalletConnectDisconnect} 
            variant="outline"
            style={styles.button}
            leftIcon={<LinkIcon size={18} color={theme.colors.primary} />}
        />
      ) : (
        <AppButton 
            title="Connect with WalletConnect" 
            onPress={handleWalletConnectSignIn} 
            variant="outline" 
            isLoading={isLoadingWalletConnect}
            disabled={isLoading}
            style={styles.button}
            leftIcon={<LinkIcon size={18} color={isLoadingWalletConnect ? theme.colors.mutedForeground : theme.colors.primary} />}
        />
      )}
      <AppButton 
        title="Connect with Coinbase Wallet" 
        onPress={handleCoinbaseWallet} 
        variant="outline" 
        isLoading={isLoadingCoinbase}
        disabled={isLoading}
        style={styles.button}
        leftIcon={<CreditCard size={18} color={isLoadingCoinbase ? theme.colors.mutedForeground : theme.colors.primary} />} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    button: {
        marginBottom: theme.spacing.md,
    },
});

export default WalletButtons;
