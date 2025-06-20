
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Settings, AlertCircle, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/auth-provider';
import { apiService, ApiError } from '@/lib/apiService';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlatformSettingItem {
  key: string;
  value: string | number | boolean; // This is for local state
  type: 'string' | 'number' | 'boolean' | 'json'; 
  description?: string;
}

// This matches the backend's DTO structure for an individual setting when saving
interface BackendPlatformSettingSaveItem {
    key: string;
    value: string; // Backend expects string for saving, will parse based on type
    type: 'string' | 'number' | 'boolean' | 'json';
    description?: string;
}

// This matches the backend's response structure when fetching (key-value object)
interface BackendPlatformSettingsResponse {
    [key: string]: {
        value: string | number | boolean; // Backend controller might parse before sending
        type: 'string' | 'number' | 'boolean' | 'json';
        description?: string;
    } | string | number | boolean; // Simpler structure fallback
}


export default function PlatformSettingsPage() {
  const { toast } = useToast();
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<Record<string, string | number | boolean>>({});
  const [settingDefinitions, setSettingDefinitions] = useState<PlatformSettingItem[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }

    const fetchSettings = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in as admin.');
        setIsLoadingPage(false);
        return;
      }
      
      setIsLoadingPage(true);
      setError(null);
      try {
        const result = await apiService.get<{ data: BackendPlatformSettingsResponse; message?: string }>('/admin/settings', token);
        
        const fetchedSettingsData = result.data || {};
        const currentSettings: Record<string, string | number | boolean> = {};
        const definitions: PlatformSettingItem[] = [];
        
        // Define base structure. These descriptions will be used if not provided by backend.
        const predefinedDefinitionsBase: Omit<PlatformSettingItem, 'value'>[] = [
            { key: "siteName", type: "string", description: "The public name of the marketplace."},
            { key: "maintenanceMode", type: "boolean", description: "Enable to take the site offline for maintenance."},
            { key: "marketplaceFeePercent", type: "number", description: "Marketplace commission (e.g., 2.5 for 2.5%)."},
            { key: "maxFileSizeMb", type: "number", description: "Maximum file size for uploads (in MB)."},
            { key: "enableExperimentalFeatures", type: "boolean", description: "Toggle experimental features for testing."},
        ];
        
        // Process settings from backend, merging with predefined if necessary
        Object.keys(fetchedSettingsData).forEach(key => {
            const serverSetting = fetchedSettingsData[key];
            let value: string | number | boolean;
            let type: PlatformSettingItem['type'];
            let description: string | undefined;

            if (typeof serverSetting === 'object' && serverSetting !== null && 'value' in serverSetting && 'type' in serverSetting) {
                value = serverSetting.value;
                type = serverSetting.type as PlatformSettingItem['type'];
                description = serverSetting.description;
            } else {
                // Fallback for simpler key-value structure (if backend doesn't send full detail object)
                value = serverSetting as string | number | boolean;
                const predef = predefinedDefinitionsBase.find(d => d.key === key);
                type = predef?.type || (typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string');
                description = predef?.description;
            }
            
            currentSettings[key] = value;
            definitions.push({ key, value, type, description });
        });

        // Add any predefined settings not returned by backend (e.g., if db is empty)
        predefinedDefinitionsBase.forEach(pdef => {
            if (!definitions.find(d => d.key === pdef.key)) {
                const defaultValue = pdef.type === 'boolean' ? false : pdef.type === 'number' ? 0 : '';
                definitions.push({ ...pdef, value: defaultValue });
                currentSettings[pdef.key] = defaultValue;
            }
        });
        
        setSettings(currentSettings);
        setSettingDefinitions(definitions.sort((a,b) => a.key.localeCompare(b.key))); // Sort for consistent order

      } catch (err: any) {
        const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load platform settings.';
        setError(errorMessage);
        setSettings({});
        setSettingDefinitions([]);
      } finally {
        setIsLoadingPage(false);
      }
    };
    fetchSettings();
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router]);

  const handleInputChange = (key: string, value: string | number | boolean, type: PlatformSettingItem['type']) => {
    setSettings(prevSettings => {
      let processedValue = value;
      if (type === 'number') {
        if (value === '') {
            processedValue = ''; 
        } else {
            const numValue = parseFloat(value as string);
            processedValue = isNaN(numValue) ? (prevSettings[key] !== undefined ? prevSettings[key] as number : 0) : numValue;
        }
      }
      return {
        ...prevSettings,
        [key]: processedValue,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      toast({ title: "Error", description: "Authentication required.", variant: "destructive"});
      return;
    }
    if (Object.keys(settings).length === 0 && settingDefinitions.length === 0) {
        toast({ title: "No Settings", description: "There are no settings to save.", variant: "default"});
        return;
    }
    setIsSaving(true);
    setError(null);
    
    const settingsToSave: BackendPlatformSettingSaveItem[] = settingDefinitions.map(def => {
      let valueToSave = settings[def.key];
      // Ensure numbers are strings for backend if it expects all values as strings
      if (def.type === 'number' && typeof valueToSave === 'number') {
        valueToSave = String(valueToSave);
      } else if (def.type === 'boolean') {
        valueToSave = String(!!valueToSave); // Ensure booleans are "true" or "false"
      } else {
        valueToSave = String(valueToSave); // Default to string
      }
      
      return {
        key: def.key,
        value: valueToSave as string, 
        type: def.type,
        description: def.description
      };
    });

    try {
      await apiService.put<{ data: BackendPlatformSettingSaveItem[] }>('/admin/settings', { settings: settingsToSave }, token);
      toast({
        title: 'Settings Saved',
        description: 'Platform settings have been updated successfully.',
      });
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not save settings.';
      setError(errorMessage);
      toast({
        title: 'Save Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isAuthLoading) { // Only show full page loader during initial auth check
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center p-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="shadow-xl rounded-xl">
              <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Settings className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5}/>
                      <div>
                          <CardTitle className="text-2xl sm:text-3xl font-headline text-primary tracking-tight">
                          Platform Settings
                          </CardTitle>
                          <CardDescription className="mt-1 text-base">
                          Configure global settings for the ArtNFT Marketplace.
                          </CardDescription>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8 space-y-6">
                {error && (
                   <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {isLoadingPage ? (
                    Array.from({length: 4}).map((_, i) => (
                        <div key={`skel-setting-${i}`} className="space-y-2">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-10 w-full max-w-md" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))
                ) : settingDefinitions.length === 0 && !error ? (
                  <p className="text-muted-foreground text-center py-4">No settings defined or found. Please ensure backend provides settings or save initial settings.</p>
                ) : (
                    settingDefinitions.map((settingDef) => (
                    <div key={settingDef.key} className="grid gap-2">
                        <Label htmlFor={settingDef.key} className="text-base font-medium capitalize">
                            {settingDef.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        {settingDef.type === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                            <Switch
                            id={settingDef.key}
                            checked={settings[settingDef.key] as boolean | undefined ?? false}
                            onCheckedChange={(checked) => handleInputChange(settingDef.key, checked, settingDef.type)}
                            disabled={isSaving}
                            />
                            <Label htmlFor={settingDef.key} className="text-sm text-muted-foreground">
                            {settings[settingDef.key] ? "Enabled" : "Disabled"}
                            </Label>
                        </div>
                        ) : settingDef.type === 'number' ? (
                        <Input
                            id={settingDef.key}
                            type="number"
                            value={settings[settingDef.key] as number | string} 
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(settingDef.key, e.target.value, settingDef.type)}
                            className="max-w-sm"
                            disabled={isSaving}
                            step="any"
                        />
                        ) : ( 
                        <Input
                            id={settingDef.key}
                            type={settingDef.type === 'json' ? 'text' : 'text'} 
                            value={settings[settingDef.key] as string | undefined ?? ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(settingDef.key, e.target.value, settingDef.type)}
                            disabled={isSaving}
                        />
                        )}
                        {settingDef.description && <p className="text-xs text-muted-foreground">{settingDef.description}</p>}
                    </div>
                    ))
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSaving || isLoadingPage || settingDefinitions.length === 0}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </>
  );
}
