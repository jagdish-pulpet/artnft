
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
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase/client';
import type { AuthError } from '@supabase/supabase-js';

export default function LogInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Clear admin flag if a regular user session exists
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isAdminAuthenticated');
        }
        router.replace('/home'); 
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        toast({ 
            variant: 'destructive', 
            title: 'Email Not Confirmed', 
            description: 'Please check your email inbox (and spam folder) for a confirmation link. Click the link to activate your account before logging in.',
            duration: 10000, // Longer duration for this important message
        });
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      }
    } else if (data.session && data.user) {
      // Supabase client handles session storage automatically.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAdminAuthenticated'); // Ensure admin flag is cleared
      }
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/home');
    } else {
      // This case might occur if there's no session but also no specific error (unlikely with signInWithPassword)
      // or if the user object isn't returned for some reason.
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password, or an unexpected issue occurred.' });
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
