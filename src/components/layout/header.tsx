
'use client';

import Link from 'next/link';
import { Gem, Home, Compass, PlusCircle, User, Sparkles, Search, Sun, Moon, Wallet, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import WalletConnectModal from '@/components/modals/wallet-connect-modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { mockNotifications } from '@/lib/mock-data'; // Assuming notifications are in mock-data
import type { NotificationItem } from '@/types';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasUnread(notifications.some(n => !n.read));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasUnread(false);
  };

  if (!mounted) {
    // Basic skeleton to prevent layout shift during mount
    return (
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
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
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-muted/50 rounded-md"></div> {/* Theme Toggle */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-muted/50 rounded-md"></div> {/* Search */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-muted/50 rounded-md"></div> {/* Notifications */}
            <div className="h-9 w-9 sm:h-9 sm:w-[130px] bg-muted/50 rounded-md"></div> {/* Wallet */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2 text-xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
            <Gem className="w-7 h-7 text-accent group-hover:text-accent/80 transition-colors" />
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="h-9 w-9 sm:h-10 sm:w-10 relative">
                  <Bell className="w-5 h-5" />
                  {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-full max-w-sm sm:max-w-md">
                <NotificationsPanel notifications={notifications} onMarkAllAsRead={markAllAsRead} />
              </SheetContent>
            </Sheet>

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
