
'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav'; // Updated path
import DesktopFooter from './DesktopFooter'; // Updated path
import GlobalHeader from './GlobalHeader'; // Updated path
import ArtNFTLogo from './ArtNFTLogo'; // Updated path

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define paths where AppLayout should not render (e.g., auth pages)
  const noLayoutPaths = ['/login', '/signup', '/welcome', '/connect-wallet', '/forgot-password'];
  // Define paths for the admin section
  const adminPaths = /^\/admin(\/.*)?$/;


  if (!isMounted) {
    // You can return a loader here or null
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <ArtNFTLogo size="large" className="animate-pulse" />
        <p className="text-muted-foreground mt-2">Loading Layout...</p>
      </div>
    );
  }

  if (noLayoutPaths.includes(pathname) || adminPaths.test(pathname)) {
    return <>{children}</>; // Render children directly without the layout for these paths
  }
  
  const mainContentPadding = "pb-20 md:pb-0"; // Add padding-bottom for mobile due to BottomNav

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GlobalHeader />
      <main className={`flex-1 w-full ${mainContentPadding}`}>
        {children}
      </main>
      <DesktopFooter />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
