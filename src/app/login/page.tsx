
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // Keep separator for structure

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function LogInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Feature toggle state for admin access button
  const [showAdminAccess, setShowAdminAccess] = useState(true);
  const FT_LOGIN_ADMIN_ACCESS_KEY = 'artnft_ft_login_admin_access'; // Ensure this key is managed by your feature toggle admin page

  useEffect(() => {
    setIsMounted(true);
    // Load feature toggle state for admin access button
    const adminAccessEnabled = localStorage.getItem(FT_LOGIN_ADMIN_ACCESS_KEY) !== 'false';
    setShowAdminAccess(adminAccessEnabled);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token); // Store the token
        localStorage.removeItem('isAdminAuthenticated'); // Clear admin auth if any
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        router.push('/home');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: data.error || 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      // Check if it's a network error (Failed to fetch)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = `Could not connect to the backend server at ${BACKEND_URL}. Please ensure it is running and accessible.`;
      }
      toast({
        variant: 'destructive',
        title: 'Login Error',
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
        </div>
      </div>
    </div>
  );
}
