
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAppLayout from '@/components/admin/AdminAppLayout';
import { Loader2 } from 'lucide-react';

export default function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      router.replace('/admin/login');
    }
    setIsAuthenticating(false);
  }, [router]);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This will be briefly shown if redirect hasn't completed
    return (
       <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return <AdminAppLayout>{children}</AdminAppLayout>;
}
