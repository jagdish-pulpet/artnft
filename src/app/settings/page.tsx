
'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  UserCircle, Bell, ShieldCheck, HelpCircle, LogOut, Palette, KeyRound, Wallet, Mail, Moon, Sun, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserEmail(user.email || null);
      }
    };
    fetchUser();

  }, []);

  useEffect(() => {
    if (!isMounted) return; 
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, isMounted]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdminAuthenticated'); 
    }

    setIsLoggingOut(false);

    if (error) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: error.message });
    } else {
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/welcome'); // Redirect to welcome page after logout
    }
  };

  const handleChangeEmail = () => {
    // TODO: Implement actual email change flow with Supabase
    // This might involve supabase.auth.updateUser({ email: newEmail })
    // and handling confirmation emails.
    toast({ title: 'Feature Coming Soon', description: 'Changing email will be implemented using Supabase user update methods.'});
  };
  const handleChangePassword = () => {
    // TODO: Implement actual password change flow with Supabase
    // This typically involves supabase.auth.updateUser({ password: newPassword })
    // or a password reset flow if the user is changing it because they forgot.
    // If current user is known, supabase.auth.updateUser is preferred.
    // If they don't know current password, redirect to forgot-password flow.
    toast({ title: 'Feature Coming Soon', description: 'Changing password will be implemented using Supabase user update methods.'});
  };
  const handleConnectWallet = () => router.push('/connect-wallet');


  if (!isMounted) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
          <Card className="shadow-xl border-border animate-pulse">
            <CardHeader className="border-b h-24 bg-muted/50"></CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-4 h-32 bg-muted/30 rounded-md"></div>
              <div className="space-y-4 h-48 bg-muted/30 rounded-md"></div>
              <div className="space-y-4 h-32 bg-muted/30 rounded-md"></div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <Card className="shadow-xl border-border">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold font-headline">Settings</CardTitle>
                <CardDescription>Manage your account, preferences, and app settings. {currentUserEmail && `Logged in as: ${currentUserEmail}`}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout} 
                className="rounded-full border-destructive/50 text-destructive hover:bg-destructive/10 focus-visible:ring-destructive" 
                aria-label="Log out"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loader2 className="h-6 w-6 animate-spin"/> : <LogOut className="h-6 w-6" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-foreground"><UserCircle className="mr-3 h-6 w-6 text-primary" />Account</h3>
              <Button variant="outline" className="w-full justify-start text-base py-6" onClick={handleChangeEmail}><Mail className="mr-2 h-5 w-5" />Change Email</Button>
              <Button variant="outline" className="w-full justify-start text-base py-6" onClick={handleChangePassword}><KeyRound className="mr-2 h-5 w-5" />Change Password</Button>
              <Button variant="outline" className="w-full justify-start text-base py-6" onClick={handleConnectWallet}><Wallet className="mr-2 h-5 w-5" />Connect Wallet (Simulated)</Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-foreground"><Bell className="mr-3 h-6 w-6 text-primary" />Notification Preferences</h3>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <Label htmlFor="new-listings-notifs" className="text-base cursor-pointer flex-grow">New Listings Alerts</Label>
                <Switch id="new-listings-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <Label htmlFor="price-drops-notifs" className="text-base cursor-pointer flex-grow">Price Drop Alerts</Label>
                <Switch id="price-drops-notifs" defaultChecked />
              </div>
               <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <Label htmlFor="transaction-updates-notifs" className="text-base cursor-pointer flex-grow">Transaction Updates</Label>
                <Switch id="transaction-updates-notifs" />
              </div>
               <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <Label htmlFor="auction-updates-notifs" className="text-base cursor-pointer flex-grow">Auction Updates</Label>
                <Switch id="auction-updates-notifs" defaultChecked/>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-foreground"><Palette className="mr-3 h-6 w-6 text-primary" />Appearance</h3>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <Label htmlFor="dark-mode-toggle" className="text-base cursor-pointer flex items-center flex-grow">
                  {isDarkMode ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />}
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-toggle"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  disabled={!isMounted}
                  aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                />
              </div>
               <Button variant="outline" className="w-full justify-start text-base py-6" disabled>Customize Theme (Coming Soon)</Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-foreground"><ShieldCheck className="mr-3 h-6 w-6 text-primary" />Privacy</h3>
              <Button variant="outline" className="w-full justify-start text-base py-6">Manage Profile Visibility</Button>
              <Button variant="outline" className="w-full justify-start text-base py-6">Data Sharing Preferences</Button>
              <Button variant="link" className="w-full justify-start text-primary px-0" asChild><Link href="/privacy">View Privacy Policy</Link></Button>
            </div>

            <Separator />

             <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center text-foreground"><HelpCircle className="mr-3 h-6 w-6 text-primary" />Help & Support</h3>
                <Button variant="outline" className="w-full justify-start text-base py-6">Frequently Asked Questions (FAQs)</Button>
                <Button variant="outline" className="w-full justify-start text-base py-6">Contact Support</Button>
                <Button variant="link" className="w-full justify-start text-primary px-0" asChild><Link href="/terms">View Terms of Service</Link></Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
