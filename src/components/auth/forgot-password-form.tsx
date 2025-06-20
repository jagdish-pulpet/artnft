
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    console.log('Forgot password request for:', data.email);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, the backend would send an email.
    // We'll just show a success message here.
    toast({
      title: 'Password Reset Email Sent',
      description: `If an account exists for ${data.email}, you will receive an email with instructions to reset your password.`,
    });
    setIsLoading(false);
    setIsSubmitted(true); 
    // form.reset(); // Don't reset, user might want to see the email they entered
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-foreground">
          If an account exists for <span className="font-semibold">{form.getValues('email')}</span>, 
          you will receive an email with instructions to reset your password shortly. Please check your inbox (and spam folder).
        </p>
        <Button variant="outline" asChild className="w-full">
            <Link href="/signin">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-semibold py-3 text-base" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
       <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered your password?{' '}
        <Link href="/signin" className={`font-medium text-accent hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
          Sign In
        </Link>
      </p>
    </Form>
  );
}
