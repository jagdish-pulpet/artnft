
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Globe, Github, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';

const signupFormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }).max(20, {
    message: 'Username must be at most 20 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, { // Password field for UI consistency, though backend might auto-generate
    message: 'Password must be at least 8 characters.',
  }),
  walletAddress: z.string().min(10, { // Basic check, real validation on backend
      message: 'Wallet address is required.'
  })
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '', // User will type this, though it's marked 'unused' in AuthContext
      walletAddress: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    setFormError(null);
    try {
      // The password from the form (data.password) will be passed to the backend.
      // AuthContext's signup function was initially designed to take a placeholder,
      // but here we use the actual user-entered password for the backend.
      await signup(data.username, data.email, data.password, data.walletAddress);
      // Signup successful, AuthContext handles toast and state update
      // Redirect is handled by page effect or here
      router.push('/home');
    } catch (error: any) {
      // AuthContext's signup function will throw an error on failure
      // Error toast is handled by AuthContext
      setFormError(error.data?.message || error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
         {formError && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {formError}
          </div>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="yourusername" {...field} disabled={isLoading}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
              </FormControl>
              <FormDescription>
                Must be at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} disabled={isLoading}/>
              </FormControl>
              <FormDescription>
                Your primary Ethereum wallet address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-semibold py-3 text-base" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full font-medium py-3" size="lg" onClick={() => console.log("Google signup clicked (Not Implemented)")} disabled={isLoading}>
          <Globe className="mr-2 h-5 w-5" /> Sign up with Google
        </Button>
        <Button variant="outline" className="w-full font-medium py-3" size="lg" onClick={() => console.log("GitHub signup clicked (Not Implemented)")} disabled={isLoading}>
          <Github className="mr-2 h-5 w-5" /> Sign up with GitHub
        </Button>
      </div>
      
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/signin" className={`font-medium text-accent hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
          Sign In
        </Link>
      </p>
    </Form>
  );
}
