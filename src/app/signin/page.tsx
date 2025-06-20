
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SigninForm } from '@/components/auth/signin-form';
// import { Toaster } from '@/components/ui/toaster'; // Toaster is in RootLayout
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SigninPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/home'); // Redirect if already logged in
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading || (!isLoading && isAuthenticated)) {
    // Show loading indicator or redirect immediately
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
        
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center pt-8 sm:pt-10">
            <Logo className="h-12 w-auto text-primary mb-2" />
            <CardTitle className="text-3xl font-headline text-primary tracking-tight">Welcome Back!</CardTitle>
            <CardDescription>Sign in to continue to ArtNFT.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 sm:p-8">
            <SigninForm />
          </CardContent>
        </Card>
      </main>
      {/* <Toaster /> */}
    </>
  );
}
