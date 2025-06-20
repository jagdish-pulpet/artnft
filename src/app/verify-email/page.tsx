
import Link from 'next/link';
import { ChevronLeft, MailCheck } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { VerifyEmailForm } from '@/components/auth/verify-email-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';

export default function VerifyEmailPage() {
  // In a real app, you might get the email from query params or state management
  const emailToVerify = "user@example.com"; 

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button variant="ghost" asChild className="text-foreground/80 hover:text-accent">
            <Link href="/signup" aria-label="Back to sign up">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Back
            </Link>
          </Button>
        </div>
        
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center pt-8 sm:pt-10">
            <MailCheck className="h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
            <CardTitle className="text-3xl font-headline text-primary tracking-tight">Verify Your Email</CardTitle>
            <CardDescription className="px-4">
              We&apos;ve sent a 6-digit code to{' '}
              <span className="font-medium text-foreground">{emailToVerify}</span>.
              Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <VerifyEmailForm emailToVerify={emailToVerify} />
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </>
  );
}
