
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Updated import
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password reset logic here
    alert('Password reset link sent (simulated)!');
    router.push('/login'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative">
       {/* Adjusted container for the back button */}
       <div className="absolute top-4 left-4 md:top-8 md:left-8"> 
        <Button variant="ghost" asChild>
          <Link href="/login">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Log In
          </Link>
        </Button>
      </div>
      <div className="bg-card shadow-xl rounded-lg p-8 w-full max-w-md space-y-6 mt-16 md:mt-0">
        <ArtNFTLogo className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center font-headline">Forgot Password?</h1>
        <p className="text-sm text-muted-foreground text-center">
          No worries, we'll send you reset instructions.
        </p>
        
        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          
          <Button type="submit" className="w-full">Send Reset Instructions</Button>
        </form>
      </div>
    </div>
  );
}

