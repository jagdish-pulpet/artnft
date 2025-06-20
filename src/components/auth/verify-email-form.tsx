
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/otp-input';
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook

export function VerifyEmailForm({ emailToVerify }: { emailToVerify?: string }) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
    // Optionally, auto-submit when OTP is complete
    // handleSubmit(completedOtp); 
  };

  const handleSubmit = async (currentOtp?: string) => {
    const codeToVerify = currentOtp || otp;
    if (codeToVerify.length !== 6) {
      toast({
        title: "Incomplete Code",
        description: "Please enter all 6 digits of the verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    console.log('Verifying OTP:', codeToVerify, 'for email:', emailToVerify);
    // Placeholder for actual verification logic
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Example success/error
    const isSuccess = Math.random() > 0.3; // Simulate success/failure
    if (isSuccess) {
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
      // TODO: Redirect to dashboard or next step
      // router.push('/dashboard');
    } else {
      toast({
        title: "Verification Failed",
        description: "The code entered is incorrect or has expired. Please try again.",
        variant: "destructive",
      });
    }
    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    console.log('Resending code to:', emailToVerify);
    // Placeholder for resend code logic
    toast({
      title: "Code Resent",
      description: `A new verification code has been sent to ${emailToVerify || 'your email'}.`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <OtpInput onComplete={handleOtpComplete} />

      <Button 
        type="button" 
        onClick={() => handleSubmit()} 
        className="w-full font-semibold py-3 text-base" 
        size="lg"
        disabled={isVerifying || otp.length !== 6}
      >
        {isVerifying ? 'Verifying...' : 'Verify Email'}
      </Button>

      <div className="text-sm text-center text-muted-foreground space-y-2">
        <p>
          Didn&apos;t receive the code?{' '}
          <Button variant="link" onClick={handleResendCode} className="p-0 h-auto font-medium text-accent hover:underline" disabled={isVerifying}>
            Resend code
          </Button>
        </p>
        <p>
          Entered the wrong email?{' '}
          <Button variant="link" asChild className="p-0 h-auto font-medium text-accent hover:underline">
            <Link href="/signup">Change email</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
