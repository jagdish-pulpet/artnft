'use client';

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { cn } from '@/lib/utils';

interface AdminAppLayoutProps {
  children: React.ReactNode;
}

export default function AdminAppLayout({ children }: AdminAppLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out from the admin panel.' });
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64 fixed inset-y-0 left-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 md:hidden z-40 bg-card">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin Navigation Menu</SheetTitle>
          </SheetHeader>
          <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-card border-b border-border shadow-sm md:px-6">
          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open sidebar menu"
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-foreground">ArtNFT Admin Panel</h1>
            </div>
             <div className="md:hidden">
                <ArtNFTLogo size="small" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
