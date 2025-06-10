
import type React from 'react';
import BottomNav from './BottomNav';
import DesktopFooter from './DesktopFooter';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string; 
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pb-16 md:pb-0"> 
        {children}
      </main>
      <BottomNav />
      <DesktopFooter />
    </div>
  );
}
