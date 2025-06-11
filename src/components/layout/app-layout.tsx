
import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import BottomNavigationBar from './BottomNavigationBar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Added pb-20 for mobile to prevent content overlap with bottom nav, md:pb-8 for larger screens */}
        {children}
      </main>
      <Footer />
      <BottomNavigationBar />
    </div>
  );
}
