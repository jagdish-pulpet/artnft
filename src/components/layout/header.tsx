
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
    // Basic skeleton to prevent layout shift during mount
    return (
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-headline font-bold">
            <Gem className="w-7 h-7 text-accent" />
            ArtNFT
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Placeholders for button group to match height and count */}
            <div className="h-9 w-9 sm:h-9 sm:w-[70px] bg-muted/50 rounded-md"></div>
            <div className="h-9 w-9 sm:h-9 sm:w-[85px] bg-muted/50 rounded-md"></div>
            <div className="h-9 w-9 sm:h-9 sm:w-[90px] bg-muted/50 rounded-md"></div>
            <div className="h-9 w-9 sm:h-9 sm:w-[85px] bg-muted/50 rounded-md"></div>
            <div className="h-9 w-9 sm:h-9 sm:w-[85px] bg-muted/50 rounded-md"></div>
            <div className="h-10 w-10 bg-muted/50 rounded-md"></div>
            <div className="h-10 w-10 bg-muted/50 rounded-md"></div>
            <div className="h-9 w-9 sm:h-9 sm:w-[130px] bg-muted/50 rounded-md"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-primary-foreground hover:text-accent-foreground transition-colors">
            <Gem className="w-7 h-7 text-accent" />
            ArtNFT
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/home">
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
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="h-9 w-9 sm:h-10 sm:w-10">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Link href="/search" className="hidden md:block ml-1">
              <Button variant="outline" size="icon" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-9 w-9 sm:h-10 sm:w-10">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary-foreground bg-primary hover:bg-primary/90 ml-1 hidden sm:flex h-9"
              onClick={() => setIsWalletModalOpen(true)}
            >
              <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
            </Button>
             <Button 
              variant="outline" 
              size="icon" 
              className="border-primary text-primary-foreground bg-primary hover:bg-primary/90 ml-1 sm:hidden h-9 w-9"
              onClick={() => setIsWalletModalOpen(true)}
              aria-label="Connect Wallet"
            >
              <Wallet className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      <WalletConnectModal isOpen={isWalletModalOpen} setIsOpen={setIsWalletModalOpen} />
    </>
  );
}
