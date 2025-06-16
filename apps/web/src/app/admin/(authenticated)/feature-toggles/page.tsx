
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal, Save, Eye, EyeOff, Github, Users, LogIn } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const FEATURE_TOGGLE_KEYS = {
  // User Welcome Screen
  userWelcomeEnableGuestLogin: 'artnft_ft_user_guest_login',
  userWelcomeEnableAdminAccess: 'artnft_ft_user_admin_access',
  userWelcomeEnableGitHubLink: 'artnft_ft_user_github_link',
  userWelcomeEnableUserCreds: 'artnft_ft_user_creds_display',
  // Admin Login Screen
  adminLoginEnableGoToUserApp: 'artnft_ft_admin_goto_user_app',
  adminLoginEnableAdminCreds: 'artnft_ft_admin_creds_display',
};

interface FeatureToggleState {
  userWelcomeEnableGuestLogin: boolean;
  userWelcomeEnableAdminAccess: boolean;
  userWelcomeEnableGitHubLink: boolean;
  userWelcomeEnableUserCreds: boolean;
  adminLoginEnableGoToUserApp: boolean;
  adminLoginEnableAdminCreds: boolean;
}

export default function AdminFeatureTogglesPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false); // For simulated save operations

  const [toggles, setToggles] = useState<FeatureToggleState>({
    userWelcomeEnableGuestLogin: true,
    userWelcomeEnableAdminAccess: true,
    userWelcomeEnableGitHubLink: true,
    userWelcomeEnableUserCreds: true,
    adminLoginEnableGoToUserApp: true,
    adminLoginEnableAdminCreds: true,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadedToggles: Partial<FeatureToggleState> = {};
    Object.entries(FEATURE_TOGGLE_KEYS).forEach(([stateKey, localStorageKey]) => {
      const storedValue = localStorage.getItem(localStorageKey);
      // Default to true if not found or invalid
      loadedToggles[stateKey as keyof FeatureToggleState] = storedValue === 'false' ? false : true;
    });
    setToggles(prev => ({ ...prev, ...loadedToggles }));
  }, []);

  const handleToggleChange = (key: keyof FeatureToggleState, value: boolean) => {
    setToggles(prev => {
      const newToggles = { ...prev, [key]: value };
      // Directly find the localStorage key from FEATURE_TOGGLE_KEYS using the state key
      const localStorageKey = FEATURE_TOGGLE_KEYS[key as keyof typeof FEATURE_TOGGLE_KEYS];
      if (localStorageKey) {
        localStorage.setItem(localStorageKey, String(value));
      }
      return newToggles;
    });
    toast({
      title: 'Setting Updated',
      description: `Feature toggle '${key.replace(/([A-Z])/g, ' $1').trim()}' set to ${value ? 'Enabled' : 'Disabled'}. Refresh relevant pages to see changes.`,
    });
  };
  
  const handleSaveAllSettings = async () => {
    setIsProcessing(true);
    // All changes are already saved to localStorage via handleToggleChange
    // This button is mostly for user feedback simulation
    await new Promise(resolve => setTimeout(resolve, 700));
    toast({
      title: 'All Settings Confirmed',
      description: 'Feature toggle configurations have been saved to local storage.',
    });
    setIsProcessing(false);
  };


  if (!isMounted) {
    // Prevent rendering Switch components until localStorage is loaded to avoid hydration issues
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <SlidersHorizontal className="h-10 w-10 animate-pulse text-primary" />
        <p className="ml-3 text-muted-foreground">Loading feature toggles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <SlidersHorizontal className="mr-3 h-7 w-7" /> Feature Toggles (Dev Tools)
        </h1>
        <p className="text-muted-foreground">
          Enable or disable development/convenience features on welcome and login screens.
          Changes are saved in your browser's local storage.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> User Welcome Screen Features</CardTitle>
          <CardDescription>Control elements visible on the `/welcome` page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-user-guest" className="cursor-pointer flex-grow text-sm">Enable 'Continue as Guest' button</Label>
            <Switch id="ft-user-guest" checked={toggles.userWelcomeEnableGuestLogin} onCheckedChange={(val) => handleToggleChange('userWelcomeEnableGuestLogin', val)} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-user-admin-access" className="cursor-pointer flex-grow text-sm">Enable 'Continue to Admin Panel (Dev)' button</Label>
            <Switch id="ft-user-admin-access" checked={toggles.userWelcomeEnableAdminAccess} onCheckedChange={(val) => handleToggleChange('userWelcomeEnableAdminAccess', val)} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-user-github" className="cursor-pointer flex-grow text-sm">Enable 'View on GitHub' link</Label>
            <Switch id="ft-user-github" checked={toggles.userWelcomeEnableGitHubLink} onCheckedChange={(val) => handleToggleChange('userWelcomeEnableGitHubLink', val)} />
          </div>
           <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-user-creds" className="cursor-pointer flex-grow text-sm">Enable 'Default User Credentials' display</Label>
            <Switch id="ft-user-creds" checked={toggles.userWelcomeEnableUserCreds} onCheckedChange={(val) => handleToggleChange('userWelcomeEnableUserCreds', val)} />
          </div>
        </CardContent>
      </Card>
      
      <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><LogIn className="mr-2 h-5 w-5 text-primary" /> Admin Login Screen Features</CardTitle>
          <CardDescription>Control elements visible on the `/admin/login` page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-admin-goto-user" className="cursor-pointer flex-grow text-sm">Enable 'Go to User App' link</Label>
            <Switch id="ft-admin-goto-user" checked={toggles.adminLoginEnableGoToUserApp} onCheckedChange={(val) => handleToggleChange('adminLoginEnableGoToUserApp', val)} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
            <Label htmlFor="ft-admin-creds" className="cursor-pointer flex-grow text-sm">Enable 'Default Admin Credentials' display</Label>
            <Switch id="ft-admin-creds" checked={toggles.adminLoginEnableAdminCreds} onCheckedChange={(val) => handleToggleChange('adminLoginEnableAdminCreds', val)} />
          </div>
        </CardContent>
      </Card>

      <CardFooter className="mt-8 border-t pt-6 flex justify-end">
          <Button onClick={handleSaveAllSettings} disabled={isProcessing}>
            <Save className="mr-2 h-4 w-4" /> 
            {isProcessing ? 'Confirming...' : 'Confirm All Settings (Saved Locally)'}
          </Button>
        </CardFooter>
    </div>
  );
}
    
