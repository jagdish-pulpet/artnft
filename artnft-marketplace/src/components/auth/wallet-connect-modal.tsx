"use client";

import type { FC } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers"; // Using ethers v5 as per project setup

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const WalletConnectIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.75 15.25L12.25 12L9.75 8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.2501 12H12.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CoinbaseWalletIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 8H8V16H16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MetaMaskIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 5L17.2857 3L12.5 6L10 4L5 8L6 11L3 13L5 18L10 20L12.5 17L15 20L20 18L22 13L19 11L20 8L19 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 11L16.5 12.5L15 15L12.5 17L10 15L8.5 12.5L10 10L12.5 6L15 8L12.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface WalletConnectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const WalletConnectModal: FC<WalletConnectModalProps> = ({ isOpen, onOpenChange }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoadingMetaMask, setIsLoadingMetaMask] = useState(false);
  const [isLoadingWalletConnect, setIsLoadingWalletConnect] = useState(false);
  const [isLoadingCoinbase, setIsLoadingCoinbase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMetaMaskSignIn = async () => {
    setIsLoadingMetaMask(true);
    setError(null);
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError("MetaMask is not installed. Please install the MetaMask browser extension.");
      setIsLoadingMetaMask(false);
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setError("No accounts found. Please ensure MetaMask is unlocked and connected.");
        setIsLoadingMetaMask(false);
        return;
      }
      const walletAddress = accounts[0];
      const timestamp = Date.now();
      const originalMessage = `Sign this message to authenticate with ArtNFT Marketplace. Origin: ${window.location.origin}. Timestamp: ${timestamp}`;
      
      const provider = new ethers.providers.Web3Provider(window.ethereum as any); // Cast to any for ethers v5
      const signer = provider.getSigner();
      const signedMessage = await signer.signMessage(originalMessage);
      
      if (!signedMessage) {
        setError("Failed to sign message. Please try again.");
        setIsLoadingMetaMask(false);
        return;
      }

      await login(walletAddress, signedMessage, true, originalMessage);
      toast({ title: "MetaMask Sign-In Successful", description: "You are now signed in." });
      onOpenChange(false);
    } catch (err: any) {
      let displayError = "An unexpected error occurred during MetaMask sign-in.";
      if (err.code === 4001 || err.message?.toLowerCase().includes('user rejected')) displayError = "MetaMask request rejected by user.";
      else if (err.message?.includes("User denied message signature")) displayError = "Signature request rejected by user.";
      else if (err.data?.message) displayError = err.data.message;
      else if (err.message) displayError = err.message;
      setError(displayError);
    } finally {
      setIsLoadingMetaMask(false);
    }
  };

  const handleWalletConnectSignIn = async () => {
    setIsLoadingWalletConnect(true);
    setError(null);
    
    const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
    if (!infuraId) {
        const configErrorMsg = "WalletConnect configuration error: Infura ID (NEXT_PUBLIC_INFURA_ID) is missing. Please set this in your .env.local file.";
        setError(configErrorMsg);
        setIsLoadingWalletConnect(false);
        toast({
            title: "Configuration Error",
            description: "WalletConnect cannot be initialized. See console for details.",
            variant: "destructive",
        });
        console.error(configErrorMsg);
        return;
    }

    let wcProvider: WalletConnectProvider | null = null;
    try {
      wcProvider = new WalletConnectProvider({
        rpc: {
          1: `https://mainnet.infura.io/v3/${infuraId}`,
          5: `https://goerli.infura.io/v3/${infuraId}`, // Goerli testnet
          137: `https://polygon-mainnet.infura.io/v3/${infuraId}`, // Polygon
          // Add other chains as needed
        },
        // chainId: 1, // Optional: Prompt user or default to a specific chain
      });

      await wcProvider.enable(); 
      
      const ethersProvider = new ethers.providers.Web3Provider(wcProvider as any); // Cast to any for ethers v5
      const signer = ethersProvider.getSigner();
      const walletAddress = await signer.getAddress();

      if (!walletAddress) {
        setError("Could not retrieve wallet address from WalletConnect.");
        setIsLoadingWalletConnect(false);
        if (wcProvider.connected) await wcProvider.disconnect().catch(console.error);
        return;
      }

      const timestamp = Date.now();
      const originalMessage = `Sign this message to authenticate with ArtNFT Marketplace. Origin: ${window.location.origin}. Timestamp: ${timestamp}`;
      const signedMessage = await signer.signMessage(originalMessage);

      if (!signedMessage) {
        setError("Failed to sign message via WalletConnect. Please try again.");
        setIsLoadingWalletConnect(false);
        if (wcProvider.connected) await wcProvider.disconnect().catch(console.error);
        return;
      }
      
      await login(walletAddress, signedMessage, true, originalMessage);
      toast({ title: "WalletConnect Sign-In Successful", description: "You are now signed in." });
      onOpenChange(false);
      // Optionally disconnect, or manage session elsewhere
      // if (wcProvider.connected) await wcProvider.disconnect().catch(console.error);

    } catch (err: any) {
      console.error("WalletConnect error:", err);
      let displayError = "An unexpected error occurred with WalletConnect.";
      if (err.message?.toLowerCase().includes('user closed modal') || err.message?.toLowerCase().includes('user rejected')) {
        displayError = "WalletConnect request cancelled by user.";
      } else if (err.message) {
        displayError = err.message;
      }
      setError(displayError);
    } finally {
      setIsLoadingWalletConnect(false);
      // Ensure provider is disconnected if it's still connected and an error occurred or flow finished without login
      if (wcProvider && wcProvider.connected && error) { // Only disconnect on error here if login was not reached
          try {
              await wcProvider.disconnect();
          } catch (disconnectError) {
              console.error("Error disconnecting WalletConnect provider:", disconnectError);
          }
      }
    }
  };

  const handlePlaceholderWalletSignIn = async (walletName: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    toast({
      title: `${walletName}: Coming Soon`,
      description: `Connecting with ${walletName} is not yet implemented. Please use MetaMask or WalletConnect.`,
    });
    setIsLoading(false);
  };

  const walletProviders = [
    { 
      id: 'metamask', 
      name: 'MetaMask', 
      icon: MetaMaskIcon, 
      action: handleMetaMaskSignIn, 
      isLoading: isLoadingMetaMask,
      dataAiHint: 'MetaMask logo orange fox'
    },
    { 
      id: 'walletconnect', 
      name: 'WalletConnect', 
      icon: WalletConnectIcon, 
      action: handleWalletConnectSignIn, 
      isLoading: isLoadingWalletConnect,
      dataAiHint: 'WalletConnect logo blue rings'
    },
    { 
      id: 'coinbasewallet', 
      name: 'Coinbase Wallet', 
      icon: CoinbaseWalletIcon, 
      action: () => handlePlaceholderWalletSignIn('Coinbase Wallet', setIsLoadingCoinbase), 
      isLoading: isLoadingCoinbase,
      dataAiHint: 'Coinbase Wallet logo blue square'
    },
  ];

  const isAnyLoading = isLoadingMetaMask || isLoadingWalletConnect || isLoadingCoinbase;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isAnyLoading) onOpenChange(open); }}>
      <DialogContent className="sm:max-w-md bg-card rounded-xl shadow-2xl">
        <DialogHeader className="pt-4">
          <DialogTitle className="text-2xl font-bold text-center text-primary">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center text-foreground/80 px-2">
            Choose your preferred wallet to sign in or sign up. You may be asked to sign a message to verify ownership.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 py-4 px-2">
          {walletProviders.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              className={cn(
                "w-full justify-start text-left text-base sm:text-lg py-6 sm:py-7 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 focus-visible:ring-primary",
                provider.isLoading ? "opacity-70 cursor-not-allowed" : ""
              )}
              onClick={provider.action}
              disabled={isAnyLoading}
              data-ai-hint={provider.dataAiHint}
            >
              {provider.isLoading ? (
                <Loader2 className="mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              ) : (
                <provider.icon className="mr-3 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              )}
              {provider.isLoading ? `Connecting with ${provider.name}...` : provider.name}
            </Button>
          ))}
        </div>
        <DialogFooter className="pb-4 px-2 sm:px-0">
          <Button variant="ghost" onClick={() => { if (!isAnyLoading) onOpenChange(false); }} className="w-full sm:w-auto text-muted-foreground" disabled={isAnyLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

