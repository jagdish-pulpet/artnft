
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Wallet, Loader2, Mail, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
     // Check if already logged in as user and redirect
    if (typeof window !== 'undefined' && localStorage.getItem('artnft_user_token')) {
      router.replace('/home');
    }
  }, [router]);

  const handleEmailSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Passwords do not match.',
      });
      return;
    }
    if (password.length < 8) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }
    if (!email) {
        toast({ variant: 'destructive', title: 'Sign Up Failed', description: 'Email is required.' });
        return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username: username || undefined }), // Send username if provided
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('isAdminAuthenticated'); // Clear any admin auth
        toast({
          title: 'Sign Up Successful',
          description: data.message || 'Welcome to ArtNFT! Please log in.',
        });
        router.push('/login'); 
      } else {
        let errorMessage = data.error || 'Could not create your account. Please try again.';
        if (data.error && typeof data.error === 'object' && data.error.message) {
            errorMessage = data.error.message;
        } else if (typeof data.error === 'string') {
            errorMessage = data.error;
        }
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Could not connect to the backend server. Please ensure it is running and accessible at ' + BACKEND_URL;
      }
      toast({
        variant: 'destructive',
        title: 'Signup Error',
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
        <ArtNFTLogo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center font-headline">Create Your Account</h1>
        
        <Button asChild variant="outline" className="w-full" disabled={isLoading}>
          <Link href="/connect-wallet">
            <Wallet className="mr-2 h-4 w-4" /> Sign Up with Wallet
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <Label htmlFor="username">Username (Optional)</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Your unique username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address*</Label>
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
            <Label htmlFor="password">Password*</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="•••••••• (min. 8 characters)" 
              required 
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm Password*</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="••••••••" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : (<><UserPlus className="mr-2 h-4 w-4" /> Sign Up with Email</>)}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">
            Terms and Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>.
        </p>
        
        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
