
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings2Icon, Info, Palette, ToggleLeft, KeyRound, DatabaseZap, Save, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function AdminSiteSettingsPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock states for settings
  const [siteName, setSiteName] = useState('ArtNFT Marketplace');
  const [tagline, setTagline] = useState('Discover, Create, and Trade Digital Art & NFTs');
  const [primaryColor, setPrimaryColor] = useState('#7DF9FF'); // Electric Blue
  const [accentColor, setAccentColor] = useState('#FF69B4'); // Soft Pink
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('G********_DUMMY_KEY**********');
  const [coinmarketcapApiKey, setCoinmarketcapApiKey] = useState('C********-****-****-****-************');

  const handleSaveChanges = async (section: string) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Settings Saved (Simulated)',
      description: `${section} settings have been updated.`,
    });
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <Settings2Icon className="mr-3 h-7 w-7" /> Site Settings
        </h1>
        <p className="text-muted-foreground">Manage global platform configurations and settings.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary" /> Basic Information</CardTitle>
          <CardDescription>Manage the core identity of your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Your Platform Name" disabled={isProcessing} />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Your platform's catchy phrase" disabled={isProcessing} />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={() => handleSaveChanges('Basic Information')} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Basic Info
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Theme Customization (Simulated)</CardTitle>
          <CardDescription>Define the visual appearance of your platform. Changes here are for simulation only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="p-1 h-10 w-14" disabled={isProcessing} />
                <Input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#RRGGBB" disabled={isProcessing} />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input id="accentColor" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="p-1 h-10 w-14" disabled={isProcessing} />
                <Input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#RRGGBB" disabled={isProcessing} />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Note: Actual theme is managed via CSS variables in `globals.css`.</p>
        </CardContent>
         <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={() => handleSaveChanges('Theme Customization')} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Theme Settings
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><ToggleLeft className="mr-2 h-5 w-5 text-primary" /> Maintenance Mode</CardTitle>
          <CardDescription>Temporarily make the main marketplace inaccessible to users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2 p-3 border rounded-md">
            <Switch 
                id="maintenance-mode" 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode} 
                disabled={isProcessing}
            />
            <Label htmlFor="maintenance-mode" className="cursor-pointer flex-grow">
              Enable Maintenance Mode (Simulated)
            </Label>
          </div>
          {maintenanceMode && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">Platform is currently in (simulated) maintenance mode.</p>}
        </CardContent>
         <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={() => handleSaveChanges('Maintenance Mode')} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Maintenance Status
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" /> API Keys & Integrations (Simulated)</CardTitle>
          <CardDescription>Manage third-party service integrations. Keys are masked and non-functional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="googleApiKey">Google API Key (for Genkit)</Label>
            <Input id="googleApiKey" value={googleApiKey} onChange={(e)=> setGoogleApiKey(e.target.value)} placeholder="Enter Google API Key" disabled={isProcessing} type="password" readOnly />
          </div>
          <div>
            <Label htmlFor="coinmarketcapApiKey">CoinMarketCap API Key</Label>
            <Input id="coinmarketcapApiKey" value={coinmarketcapApiKey} onChange={(e)=> setCoinmarketcapApiKey(e.target.value)} placeholder="Enter CoinMarketCap API Key" disabled={isProcessing} type="password" readOnly />
          </div>
          {/* Add more API key fields as needed */}
        </CardContent>
         <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={() => handleSaveChanges('API Keys')} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update API Keys
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
