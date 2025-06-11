
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client'; // Import Supabase client

const FT_ADMIN_GOTO_USER_APP_KEY = 'artnft_ft_admin_goto_user_app';
const FT_ADMIN_CREDS_DISPLAY_KEY = 'artnft_ft_admin_creds_display';
const ADMIN_EMAIL_FOR_DISPLAY = 'admin@artnft.com'; 
const ADMIN_PASSWORD_FOR_DISPLAY = 'adminpass'; 

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
        if (localStorage.getItem('isAdminAuthenticated') === 'true') {
          // Check if there's also an active Supabase session for this admin
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user?.email === email) { // Or a more robust admin check
               router.replace('/admin/dashboard');
            } else {
              // Admin flag exists but no valid Supabase session, or wrong user
              localStorage.removeItem('isAdminAuthenticated');
            }
          });
          return; 
        }

        const goToUserAppEnabled = localStorage.getItem(FT_ADMIN_GOTO_USER_APP_KEY) !== 'false';
        setShowGoToUserApp(goToUserAppEnabled);

        const adminCredsEnabled = localStorage.getItem(FT_ADMIN_CREDS_DISPLAY_KEY) !== 'false';
        setShowAdminCreds(adminCredsEnabled);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // email removed from deps to avoid re-checking on email input change

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Step 1: Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      toast({ variant: 'destructive', title: 'Admin Login Failed', description: authError.message });
      setIsLoading(false);
      return;
    }

    // Step 2: Check if the successfully authenticated user is an admin (simulated check)
    // In a real application, this check should be more robust (e.g., check custom claims or an admins table).
    if (authData.user && authData.user.email === ADMIN_EMAIL_FOR_DISPLAY) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdminAuthenticated', 'true'); // This local flag controls admin UI access
      }
      toast({ title: 'Admin Login Successful', description: 'Welcome to the Admin Panel!' });
      router.push('/admin/dashboard');
    } else {
      // If Supabase auth succeeded but email doesn't match the simulated admin email,
      // sign them out to prevent access and show an error.
      await supabase.auth.signOut(); // Sign out non-admin user
      toast({ variant: 'destructive', title: 'Admin Login Failed', description: 'You do not have admin privileges.' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdminAuthenticated');
      }
    }
    
    setIsLoading(false);
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
                placeholder={ADMIN_EMAIL_FOR_DISPLAY}
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
