import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - ArtNFT',
  description: 'Log in to your ArtNFT account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/10 p-4">
      <LoginForm />
       <p className="mt-8 text-center text-sm text-foreground/70 font-body">
        New to ArtNFT?{' '}
        <a href="#" className="font-semibold text-primary hover:underline">
          Create an account
        </a>
      </p>
    </div>
  );
}
