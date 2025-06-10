
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function LogInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [showAdminAccess, setShowAdminAccess] = useState(true); 
  const FT_LOGIN_ADMIN_ACCESS_KEY = 'artnft_ft_login_admin_access'; 

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const adminAccessStored = localStorage.getItem(FT_LOGIN_ADMIN_ACCESS_KEY);
      if (adminAccessStored !== null) {
        setShowAdminAccess(adminAccessStored === 'true');
      }
      // Check if already logged in as user and redirect
      if (localStorage.getItem('artnft_user_token')) {
        router.replace('/home');
      }
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const fetchUrl = `${BACKEND_URL}/api/auth/login`;
    
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data && data.token && data.user) {
            if (typeof window !== 'undefined') { 
                localStorage.setItem('artnft_user_token', data.token);
                localStorage.setItem('artnft_user_details', JSON.stringify(data.user));
                localStorage.removeItem('isAdminAuthenticated'); 
            }
            toast({
              title: 'Login Successful',
              description: 'Welcome back!',
            });
            router.push('/home');
        } else {
            console.error('Login: Backend responded OK, but token or user data is missing.', data);
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: 'Received an incomplete response from the server. Please try again.',
            });
            setIsLoading(false); 
        }
      } else {
        let errorMessage = data.error || 'Invalid email or password. Please try again.';
        if (response.status === 500 && data.error && typeof data.error === 'object' && data.error.message && data.error.message.includes('jwtSecret')) {
          errorMessage = 'Server configuration error. Please contact support.';
        } else if (data.error && typeof data.error === 'object' && data.error.message) {
          errorMessage = data.error.message;
        } else if (typeof data.error === 'string') {
          errorMessage = data.error;
        }
        console.error('Login: Backend responded with error', response.status, data);
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: errorMessage,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login page fetch error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Could not connect to the backend server. Ensure it is running and accessible at ' + BACKEND_URL;
      }
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: errorMessage,
      });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card shadow-xl rounded-lg p-8 w-full max-w-md space-y-6">
        <ArtNFTLogo className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center font-headline">Welcome Back</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
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
            {isLoading ? <Loader2 className="animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
            {isLoading ? 'Logging In...' : 'Log In with Email'}
          </Button>
        </form>
        
        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
        
        <Separator />
        
        <div className="text-center space-y-3">
          <Link href="/signup" className="text-sm text-primary hover:underline block">
            Don't have an account? Sign Up
          </Link>
           <Link href="/welcome" className="text-xs text-muted-foreground hover:text-primary hover:underline block">
                Back to Welcome Screen
            </Link>
          {showAdminAccess && ( 
            <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center justify-center">
                <Shield className="mr-1 h-3 w-3"/> Go to Admin Panel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
