
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Wallet, Loader2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // emailRedirectTo: `${window.location.origin}/auth/callback`, // Optional: for a specific callback page
      }
    });

    setIsLoading(false);

    if (error) {
      toast({ variant: 'destructive', title: 'Sign Up Failed', description: error.message });
    } else {
      if (data.session && data.user) {
        // User is signed up and logged in (e.g., email confirmation is off or auto-confirmed)
        toast({ title: 'Sign Up Successful!', description: 'Welcome! You are now logged in.' });
        if (data.user) {
            const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                username: data.user.email?.split('@')[0] || `user-${data.user.id.substring(0,6)}`,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
            if (profileError) {
                console.warn("Could not create initial profile during signup:", profileError.message);
            }
        }
        router.push('/home');
      } else if (data.user && !data.session) {
        // Email confirmation is likely required by Supabase project settings
        toast({
            title: 'Sign Up Successful! Please Confirm Your Email',
            description: 'A confirmation link has been sent to your email address. Please check your inbox (and spam folder) to activate your account before you can log in.',
            duration: 10000,
        });
        router.push('/login');
      } else {
        // Fallback, should ideally not happen if no error and no user/session
        toast({ variant: 'destructive', title: 'Sign Up Issue', description: 'An unexpected issue occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card shadow-xl rounded-lg p-8 w-full max-w-md space-y-6">
        <ArtNFTLogo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center font-headline">Create Your Account</h1>

        <Button asChild variant="outline" className="w-full" disabled={isLoading}>
          <Link href="/connect-wallet">
            <Wallet className="mr-2 h-4 w-4" /> Sign Up with Wallet (Simulated)
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-4">
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
              placeholder="•••••••• (min. 6 characters)"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm Password</Label>
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
            {isLoading ? <Loader2 className="animate-spin" /> : (<><Mail className="mr-2 h-4 w-4" /> Sign Up with Email</>)}
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
