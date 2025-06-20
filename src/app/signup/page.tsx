
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { SignupForm } from '@/components/auth/signup-form';
import { Button } from '@/components/ui/button';
// import { Toaster } from '@/components/ui/toaster'; // Toaster is in RootLayout
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/home'); // Redirect if already logged in
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
     return <div className="flex min-h-screen items-center justify-center"><ChevronLeft className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button variant="ghost" asChild className="text-foreground/80 hover:text-accent">
            <Link href="/" aria-label="Back to home">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center space-y-6 rounded-xl bg-card p-6 sm:p-10 shadow-2xl w-full max-w-md">
          <Logo className="h-12 w-auto text-primary" />
          <div className="text-center">
            <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">
              Create Account
            </h1>
            <p className="text-md text-foreground/80 font-body mt-1">
              Join ArtNFT to start your journey.
            </p>
          </div>
          <SignupForm />
        </div>
      </main>
      {/* <Toaster /> */}
    </>
  );
}
