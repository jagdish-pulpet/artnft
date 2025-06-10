
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Shield, Github } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator';

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleGuestNavigation = () => {
    router.push('/home');
  };

  const handleAdminAccess = () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    toast({
        title: 'Admin Access (Dev)',
        description: 'Proceeding to admin dashboard.',
    });
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-welcome-artistic p-4">
      <div className="bg-card shadow-xl rounded-lg p-8 md:p-12 w-full max-w-md text-center space-y-8">
        <ArtNFTLogo className="mx-auto" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline mb-2">
            Welcome to ArtNFT
          </h1>
          <p className="text-muted-foreground">
            Join a vibrant community of artists and collectors.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg" variant="default">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="w-full" size="lg" variant="secondary">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button onClick={handleGuestNavigation} className="w-full" size="lg" variant="outline">
            Continue as Guest
          </Button>
          
          <Separator />

          <Button onClick={handleAdminAccess} className="w-full" size="lg" variant="outline">
            <Shield className="mr-2 h-4 w-4" /> Continue to Admin Panel (Dev)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-4">
            <p>For development/testing:</p>
            <p><strong>User:</strong> testuser@artnft.com</p>
            <p><strong>Password:</strong> password123</p>
        </div>

        <div className="pt-2">
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary">
            <Link href="https://github.com/jagdish-pulpet/artnft" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}

