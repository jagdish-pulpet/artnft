
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Updated import
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Shield, Github, Loader2 } from 'lucide-react'; 
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Feature Toggle Keys from local storage
const FT_USER_GUEST_LOGIN_KEY = 'artnft_ft_user_guest_login';
const FT_USER_ADMIN_ACCESS_KEY = 'artnft_ft_user_admin_access';
const FT_USER_GITHUB_LINK_KEY = 'artnft_ft_user_github_link';
const FT_USER_CREDS_DISPLAY_KEY = 'artnft_ft_user_creds_display';

// Default credentials for display
const USER_EMAIL_FOR_DISPLAY = 'testuser@artnft.com';
const USER_PASSWORD_FOR_DISPLAY = 'adminpass';

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [showGuestLogin, setShowGuestLogin] = useState(true);
  const [showAdminAccessShortcut, setShowAdminAccessShortcut] = useState(true);
  const [showGitHubLink, setShowGitHubLink] = useState(true);
  const [showUserCredsDisplay, setShowUserCredsDisplay] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Only run after component has mounted

    if (typeof window !== 'undefined') {
      const userToken = localStorage.getItem('artnft_user_token');
      const adminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

      if (userToken) {
        router.replace('/home'); // User logged in
        return;
      }
      // Only check for admin redirect if not a regular user
      if (adminAuthenticated) { 
        router.replace('/admin/dashboard'); // Admin logged in
        return;
      }

      // Feature Toggles - only if not redirecting
      setShowGuestLogin(localStorage.getItem(FT_USER_GUEST_LOGIN_KEY) !== 'false');
      setShowAdminAccessShortcut(localStorage.getItem(FT_USER_ADMIN_ACCESS_KEY) !== 'false');
      setShowGitHubLink(localStorage.getItem(FT_USER_GITHUB_LINK_KEY) !== 'false');
      setShowUserCredsDisplay(localStorage.getItem(FT_USER_CREDS_DISPLAY_KEY) !== 'false');
    }
  }, [isMounted, router]);


  const handleGuestNavigation = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('artnft_user_token');
        localStorage.removeItem('artnft_user_details');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminAuthenticated');
    }
    toast({
        title: 'Continuing as Guest',
        description: 'Exploring the marketplace. Some features may be limited.',
    });
    router.push('/home');
  };

  const handleAdminAccess = () => {
     if (typeof window !== 'undefined') {
        localStorage.removeItem('artnft_user_token');
        localStorage.removeItem('artnft_user_details');
        // localStorage.setItem('isAdminAuthenticated', 'true'); // This line might be better handled by the admin login page itself
    }
    toast({
        title: 'Redirecting to Admin Panel',
        description: 'Please log in with admin credentials.',
    });
    router.push('/admin/login'); // Go to admin login, not directly to dashboard
  };
  
  if (!isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-welcome-artistic p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg" variant="default">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="w-full" size="lg" variant="secondary">
            <Link href="/signup">Sign Up</Link>
          </Button>
          {showGuestLogin && (
            <Button onClick={handleGuestNavigation} className="w-full" size="lg" variant="outline">
              Continue as Guest
            </Button>
          )}
        </div>
        
        {(showAdminAccessShortcut || showGitHubLink || showUserCredsDisplay) && (
          <>
            <Separator />
            <Card className="bg-muted/50 border-dashed text-left p-3">
              <CardContent className="p-0 text-xs space-y-1.5">
                <p className="font-medium text-muted-foreground mb-1.5 text-center">Developer Shortcuts:</p>
                {showAdminAccessShortcut && (
                  <Button onClick={handleAdminAccess} className="w-full justify-start h-auto py-1.5 px-2 text-xs" size="sm" variant="ghost">
                    <Shield className="mr-2 h-3.5 w-3.5" /> Go to Admin Panel
                  </Button>
                )}
                {showGitHubLink && (
                  <Button variant="link" asChild className="text-muted-foreground hover:text-primary h-auto p-0 text-xs justify-start">
                    <Link href="https://github.com/jagdish-pulpet/artnft" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-3.5 w-3.5" />
                      View Project on GitHub
                    </Link>
                  </Button>
                )}
                {showUserCredsDisplay && (
                  <div className="text-xs text-muted-foreground space-y-0.5 pt-1.5 mt-1.5 border-t">
                      <p><strong>Test User:</strong> {USER_EMAIL_FOR_DISPLAY}</p>
                      <p><strong>Password:</strong> {USER_PASSWORD_FOR_DISPLAY}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}

