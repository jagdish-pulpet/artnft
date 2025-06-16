
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // This check runs on the client side
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAdminAuthenticated) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading Admin Panel...</p>
    </div>
  );
}
