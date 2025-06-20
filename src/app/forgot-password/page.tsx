
import Link from 'next/link';
import { ChevronLeft, KeyRound } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Toaster } from '@/components/ui/toaster';

export default function ForgotPasswordPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button variant="ghost" asChild className="text-foreground/80 hover:text-accent">
            <Link href="/signin" aria-label="Back to sign in">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center pt-8 sm:pt-10">
            <KeyRound className="h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
            <CardTitle className="text-3xl font-headline text-primary tracking-tight">Forgot Password?</CardTitle>
            <CardDescription className="px-4">
              No worries! Enter your email address below and we&apos;ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </>
  );
}
