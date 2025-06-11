'use client';

import Link from 'next/link';
import { Gem, Home, Compass, PlusCircle, User, Sparkles, Search, Sun, Moon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import WalletConnectModal from '@/components/modals/wallet-connect-modal';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-primary-foreground hover:text-accent-foreground transition-colors">
            <Gem className="w-7 h-7 text-accent" />
            ArtNFT
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
             {/* Placeholder for buttons to prevent layout shift */}
            <div className="w-8 h-8 sm:w-24"></div>
            <div className="w-8 h-8 sm:w-24"></div>
            <div className="w-8 h-8 sm:w-24"></div>
            <div className="w-8 h-8 sm:w-24"></div>
            <div className="w-8 h-8 sm:w-24"></div>
            <div className="w-10 h-10"></div>
            <div className="w-10 h-10"></div>
            <div className="w-10 h-10 sm:w-32"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-primary-foreground hover:text-accent-foreground transition-colors">
            <Gem className="w-7 h-7 text-accent" />
            ArtNFT
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Home className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Compass className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Explore</span>
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Sparkles className="w-4 h-4 mr-0 sm:mr-2 text-accent" /> <span className="hidden sm:inline">For You</span>
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <PlusCircle className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Create</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <User className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Profile</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link href="/search" className="ml-1">
              <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary-foreground bg-primary hover:bg-primary/90 ml-1 sm:ml-2 hidden sm:flex"
              onClick={() => setIsWalletModalOpen(true)}
            >
              <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
            </Button>
             <Button 
              variant="outline" 
              size="icon" 
              className="border-primary text-primary-foreground bg-primary hover:bg-primary/90 ml-1 sm:hidden"
              onClick={() => setIsWalletModalOpen(true)}
              aria-label="Connect Wallet"
            >
              <Wallet className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>
      <WalletConnectModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} />
    </>
  );
}
