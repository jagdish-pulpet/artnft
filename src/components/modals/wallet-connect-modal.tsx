'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WalletCards, ShieldCheck, LucideImage as WalletIcon } from "lucide-react"; // Using WalletCards as a stand-in for MetaMask
import Image from "next/image";

interface WalletConnectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Placeholder for wallet icons if specific ones are not available or to avoid too many direct image links
// In a real app, you'd use actual logos.
const walletOptions = [
  { name: "MetaMask", icon: <WalletCards className="w-8 h-8 text-orange-500" />, description: "Connect using browser extension or mobile app." },
  { name: "Coinbase Wallet", icon: <Image src="https://placehold.co/40x40.png?text=CB" alt="Coinbase Wallet" width={32} height={32} data-ai-hint="coinbase logo"/>, description: "Connect using Coinbase Wallet app." },
  { name: "WalletConnect", icon: <Image src="https://placehold.co/40x40.png?text=WC" alt="WalletConnect" width={32} height={32} data-ai-hint="walletconnect logo"/>, description: "Scan QR code with your favorite wallet." },
  { name: "Generic Secure Wallet", icon: <ShieldCheck className="w-8 h-8 text-green-500" />, description: "Use another secure wallet option." },
];

export default function WalletConnectModal({ isOpen, setIsOpen }: WalletConnectModalProps) {
  const handleWalletSelect = (walletName: string) => {
    // Placeholder for actual wallet connection logic
    console.log(`Attempting to connect with ${walletName}`);
    // Potentially show a loading state or next step in connection
    // setIsOpen(false); // Close modal after selection, or handle further steps
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center text-primary-foreground">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose your preferred wallet provider to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full h-auto justify-start p-4 text-left border-border hover:bg-muted transition-colors"
              onClick={() => handleWalletSelect(wallet.name)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-secondary">
                  {wallet.icon}
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">{wallet.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-muted-foreground text-center">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
