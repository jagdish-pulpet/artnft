
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, PlusCircle, Trash2, Users, Palette, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface FeaturedItem {
  id: string;
  name: string;
  type: 'NFT' | 'Artist';
  imageUrl?: string; // For quick visual
  dataAiHint?: string;
}

const initialFeaturedNfts: FeaturedItem[] = [
  { id: 'nft_001', name: 'Cosmic Dreamscape', type: 'NFT', imageUrl: 'https://placehold.co/40x40.png', dataAiHint: 'abstract space' },
  { id: 'nft_004', name: 'AI Generated Landscape', type: 'NFT', imageUrl: 'https://placehold.co/40x40.png', dataAiHint: 'ai landscape' },
];

const initialSpotlightArtists: FeaturedItem[] = [
  { id: 'artist_pixelpioneer', name: 'PixelPioneer', type: 'Artist', imageUrl: 'https://placehold.co/40x40.png', dataAiHint: 'artist avatar' },
  { id: 'artist_aialchemist', name: 'AI Alchemist', type: 'Artist', imageUrl: 'https://placehold.co/40x40.png', dataAiHint: 'robot avatar' },
];


export default function AdminPromotionsPage() {
  const { toast } = useToast();
  const [featuredNfts, setFeaturedNfts] = useState<FeaturedItem[]>(initialFeaturedNfts);
  const [spotlightArtists, setSpotlightArtists] = useState<FeaturedItem[]>(initialSpotlightArtists);
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentPromotionType, setCurrentPromotionType] = useState<'NFT' | 'Artist' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const openAddDialog = (type: 'NFT' | 'Artist') => {
    setCurrentPromotionType(type);
    setNewItemName('');
    setNewItemImageUrl('https://placehold.co/40x40.png'); // Default placeholder
    setIsFormDialogOpen(true);
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !currentPromotionType) {
      toast({ variant: "destructive", title: "Name Required", description: "Please enter a name for the item." });
      return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    const newItem: FeaturedItem = {
      id: `${currentPromotionType.toLowerCase()}_${Date.now()}`,
      name: newItemName.trim(),
      type: currentPromotionType,
      imageUrl: newItemImageUrl.trim() || 'https://placehold.co/40x40.png',
      dataAiHint: currentPromotionType === 'NFT' ? 'featured nft' : 'featured artist',
    };

    if (currentPromotionType === 'NFT') {
      setFeaturedNfts(prev => [newItem, ...prev]);
    } else {
      setSpotlightArtists(prev => [newItem, ...prev]);
    }

    toast({ title: `${currentPromotionType} Added (Simulated)`, description: `"${newItem.name}" is now featured.` });
    setIsProcessing(false);
    setIsFormDialogOpen(false);
  };

  const handleRemoveItem = (itemId: string, type: 'NFT' | 'Artist') => {
    // Simulate API call with toast
    let itemName = '';
    if (type === 'NFT') {
      itemName = featuredNfts.find(item => item.id === itemId)?.name || 'Item';
      setFeaturedNfts(prev => prev.filter(item => item.id !== itemId));
    } else {
      itemName = spotlightArtists.find(item => item.id === itemId)?.name || 'Item';
      setSpotlightArtists(prev => prev.filter(item => item.id !== itemId));
    }
    toast({ title: `${type} Removed (Simulated)`, description: `"${itemName}" is no longer featured.` });
  };

  const renderPromotionList = (items: FeaturedItem[], type: 'NFT' | 'Artist') => (
    <div className="space-y-3">
      {items.length > 0 ? items.map(item => (
        <Card key={item.id} className="flex items-center p-3 shadow-sm">
          {item.imageUrl && 
            <Image 
                src={item.imageUrl} 
                alt={item.name} 
                width={40} 
                height={40} 
                className="rounded-sm mr-3 object-cover" 
                data-ai-hint={item.dataAiHint || "item image"}
            />
          }
          <div className="flex-grow">
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, type)} aria-label="Remove item">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </Card>
      )) : (
        <p className="text-sm text-muted-foreground text-center py-4">No ${type.toLowerCase()}s currently featured.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <Star className="mr-3 h-7 w-7" /> Promotions Management
        </h1>
        <p className="text-muted-foreground">Manage featured NFTs and spotlighted artists on the platform.</p>
      </div>

      <Tabs defaultValue="featured-nfts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured-nfts"><Palette className="mr-2 h-4 w-4"/>Featured NFTs</TabsTrigger>
          <TabsTrigger value="artist-spotlights"><Users className="mr-2 h-4 w-4"/>Artist Spotlights</TabsTrigger>
        </TabsList>
        <TabsContent value="featured-nfts">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Featured NFTs</CardTitle>
                <Button size="sm" onClick={() => openAddDialog('NFT')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Featured NFT
                </Button>
              </div>
              <CardDescription>NFTs highlighted on main discovery pages.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderPromotionList(featuredNfts, 'NFT')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="artist-spotlights">
          <Card className="shadow-sm">
            <CardHeader>
               <div className="flex justify-between items-center">
                <CardTitle>Current Artist Spotlights</CardTitle>
                <Button size="sm" onClick={() => openAddDialog('Artist')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Spotlight Artist
                </Button>
              </div>
              <CardDescription>Artists showcased to the community.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderPromotionList(spotlightArtists, 'Artist')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New {currentPromotionType}</DialogTitle>
            <DialogDescription>
              Enter details for the new {currentPromotionType?.toLowerCase()} to feature. (Simulated)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="item-name">{currentPromotionType} Name/Title*</Label>
              <Input 
                id="item-name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Enter ${currentPromotionType?.toLowerCase()} name or title`}
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="item-image-url">Image URL (Optional)</Label>
              <Input 
                id="item-image-url" 
                value={newItemImageUrl} 
                onChange={(e) => setNewItemImageUrl(e.target.value)}
                placeholder="https://placehold.co/40x40.png"
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-muted-foreground">For simulation, you can add any name. In a real app, you'd search/select existing items.</p>
          </div>
          <DialogFooter className="pt-4">
              <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleAddItem} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add to {currentPromotionType === 'NFT' ? 'Featured NFTs' : 'Artist Spotlights'}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
