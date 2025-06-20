
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
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
import { Globe, Github, Eye, EyeOff, Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast'; // Toast is now handled by AuthContext
import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';


const signinFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, { 
    message: 'Password is required.',
  }),
});

type SigninFormValues = z.infer<typeof signinFormSchema>;

export function SigninForm() {
  // const { toast } = useToast(); // Toast is now handled by AuthContext
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);


  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: 'user@example.com', // Default for easier testing
      password: 'password123',   // Default for easier testing
    },
  });

  async function onSubmit(data: SigninFormValues) {
    setIsLoading(true);
    setFormError(null);
    try {
      await login(data.email, data.password);
      // Login successful, AuthContext handles toast and state update
      // Redirect is handled by page effect or here
       router.push('/home');
    } catch (error: any) {
      // AuthContext's login function will throw an error on failure
      // Error toast is handled by AuthContext
      // Set form-specific error message if needed
      setFormError(error.data?.message || error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {formError && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
            {formError}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
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
                <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-accent hover:underline"
                        aria-label="Forgot your password?"
                    >
                        Forgot password?
                    </Link>
                </div>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    {...field} 
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-semibold py-3 text-base" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or sign in with
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full font-medium py-3" size="lg" onClick={() => console.log('Google Sign In Clicked (Not Implemented)')} disabled={isLoading}>
          <Globe className="mr-2 h-5 w-5" /> Sign in with Google
        </Button>
        <Button variant="outline" className="w-full font-medium py-3" size="lg" onClick={() => console.log('GitHub Sign In Clicked (Not Implemented)')} disabled={isLoading}>
          <Github className="mr-2 h-5 w-5" /> Sign in with GitHub
        </Button>
      </div>
      
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className={`font-medium text-accent hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
          Sign Up
        </Link>
      </p>
    </Form>
  );
}
