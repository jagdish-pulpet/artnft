
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Corrected import path
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Feature Toggle Keys
const FT_ADMIN_GOTO_USER_APP_KEY = 'artnft_ft_admin_goto_user_app';
const FT_ADMIN_CREDS_DISPLAY_KEY = 'artnft_ft_admin_creds_display';
const ADMIN_EMAIL_FOR_DISPLAY = 'admin@artnft.com'; // Keep for display if toggle is on
const ADMIN_PASSWORD_FOR_DISPLAY = 'adminpass'; // Keep for display if toggle is on

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showGoToUserApp, setShowGoToUserApp] = useState(true);
  const [showAdminCreds, setShowAdminCreds] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
        // Check if already authenticated (frontend simulation) and redirect
        if (localStorage.getItem('isAdminAuthenticated') === 'true') {
        router.replace('/admin/dashboard');
        return; 
        }

        const goToUserAppEnabled = localStorage.getItem(FT_ADMIN_GOTO_USER_APP_KEY) !== 'false';
        setShowGoToUserApp(goToUserAppEnabled);

        const adminCredsEnabled = localStorage.getItem(FT_ADMIN_CREDS_DISPLAY_KEY) !== 'false';
        setShowAdminCreds(adminCredsEnabled);
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Attempting to fetch from BACKEND_URL:', BACKEND_URL); // Log the URL being used

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminToken', data.token); 
            localStorage.setItem('isAdminAuthenticated', 'true'); 
        }
        toast({
          title: 'Login Successful',
          description: 'Welcome to the Admin Panel!',
        });
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data.error || 'Invalid email or password.',
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Could not connect to the backend server. Please ensure it is running and accessible at the configured URL: ' + BACKEND_URL;
      }
      toast({
        variant: 'destructive',
        title: 'Admin Login Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <ArtNFTLogo className="mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold font-headline">Admin Panel Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@artnft.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isLoading ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center space-y-3">
          {showAdminCreds && ( 
            <p className="text-xs text-muted-foreground">Default credentials: {ADMIN_EMAIL_FOR_DISPLAY} / {ADMIN_PASSWORD_FOR_DISPLAY}</p>
          )}
          {showGoToUserApp && ( 
            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary">
              <Link href="/welcome">
                Go to User App <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
