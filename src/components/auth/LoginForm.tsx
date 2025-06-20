"use client";

import *a_s React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import *a_s z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Palette } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    console.log("Login data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Example: successful login
    toast({
      title: "Login Successful",
      description: `Welcome back, ${data.email}!`,
    });

    // Example: failed login
    // toast({
    //   variant: "destructive",
    //   title: "Login Failed",
    //   description: "Invalid email or password. Please try again.",
    // });
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 bg-primary text-primary-foreground rounded-full p-3 w-16 h-16 flex items-center justify-center shadow-md">
          <Palette size={32} />
        </div>
        <CardTitle className="text-3xl font-headline">ArtNFT Login</CardTitle>
        <CardDescription className="font-body">
          Access your account to explore exclusive digital art.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-base">
                    <Mail className="mr-2 h-5 w-5 text-primary/80" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      {...field} 
                      className="text-base py-3 px-4"
                      aria-label="Email Address"
                    />
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
                  <FormLabel className="flex items-center text-base">
                    <Lock className="mr-2 h-5 w-5 text-primary/80" />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="text-base py-3 px-4"
                      aria-label="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center pt-6">
            <Button 
              type="submit" 
              className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              disabled={isLoading}
              aria-label="Log in to your account"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
            <a href="#" className="mt-4 text-sm text-primary/90 hover:underline font-body">
              Forgot password?
            </a>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
