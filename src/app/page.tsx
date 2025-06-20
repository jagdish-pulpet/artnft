
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Mail, Shield } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { Toaster } from "@/components/ui/toaster";
import { WalletConnectModal } from '@/components/auth/wallet-connect-modal';

export default function HomePage() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="flex flex-col items-center space-y-8 rounded-xl bg-card p-8 sm:p-12 shadow-2xl text-center max-w-md w-full">
          <Logo className="h-16 w-auto text-primary" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">
              ArtNFT
            </h1>
            <p className="text-lg text-foreground/80 font-body">
              Discover, Collect, and Trade Unique Digital Art.
            </p>
          </div>

          <div className="flex flex-col space-y-4 w-full sm:w-80 pt-4">
            <Button 
              size="lg" 
              className="font-semibold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              aria-label="Connect your wallet to get started"
              onClick={() => setIsWalletModalOpen(true)}
            >
              <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="font-semibold text-base py-6 rounded-lg border-accent text-accent hover:bg-accent hover:text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Sign up with your email address"
            >
              <Link href="/signup">
                <Mail className="mr-2 h-5 w-5" /> Sign Up with Email
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground font-body pt-4">
            Already have an account?{" "}
            <Link 
              href="/signin" 
              className="font-medium text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
              aria-label="Sign in to your existing account"
            >
              Sign In
            </Link>
          </p>

          <div className="pt-4 w-full sm:w-80">
            <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full font-medium text-muted-foreground hover:text-primary border-muted-foreground/30 hover:border-primary"
                aria-label="Go to Admin Panel"
            >
                <Link href="/admin/dashboard">
                     <Shield className="mr-2 h-4 w-4" /> Go to Admin Panel
                </Link>
            </Button>
          </div>
        </div>
      </main>
      <WalletConnectModal isOpen={isWalletModalOpen} onOpenChange={setIsWalletModalOpen} />
      <Toaster />
    </>
  );
}
