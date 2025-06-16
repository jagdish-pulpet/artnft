import type { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-4 mb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
