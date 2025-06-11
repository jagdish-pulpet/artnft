
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit3, Save, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const initialCategories = ['Digital Art', 'Collectible', 'Music', 'Photography', 'Virtual World', 'Utility'];
const initialStatuses = ['Listed', 'Hidden', 'Featured', 'Pending'];

// Mock NFT data for pre-filling the form
const mockNftToEdit = {
  title: 'Cosmic Dreamscape',
  artistName: 'Galactic Voyager',
  category: 'Digital Art',
  priceEth: '2.5',
  description: 'A mesmerizing journey through space, where nebulas swirl and stars ignite.',
  imageUrl: 'https://placehold.co/600x400.png',
  status: 'Featured',
};


export default function AdminEditNFTPage() {
  const router = useRouter();
  const params = useParams();
  const nftId = params.id as string; // Get NFT ID from URL
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Changed initial state to true
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Simulate fetching NFT data
    // setIsLoading(true); // No longer needed here if initialized to true
    setTimeout(() => {
      // In a real app, you'd fetch data using nftId
      // For this simulation, we'll use mockNftToEdit
      setTitle(mockNftToEdit.title);
      setArtistName(mockNftToEdit.artistName);
      setCategory(mockNftToEdit.category);
      setPriceEth(mockNftToEdit.priceEth);
      setDescription(mockNftToEdit.description);
      setImageUrl(mockNftToEdit.imageUrl);
      setStatus(mockNftToEdit.status);
      setIsDataLoaded(true);
      setIsLoading(false);
    }, 500); // Simulate network delay
  }, [nftId]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !artistName || !category || !priceEth || !status) {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill in all required fields (*)."
        });
        setIsLoading(false);
        return;
    }

    console.log('Simulating Update NFT:', { id: nftId, title, artistName, category, priceEth, description, imageUrl, status });
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'NFT Updated (Simulated)',
      description: `NFT "${title}" (ID: ${nftId}) has been successfully updated.`,
    });
    
    setIsLoading(false);
    router.push('/admin/nfts'); 
  };
  
  if (!isDataLoaded && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading NFT data...</p>
      </div>
    );
  }
  
  if (!isDataLoaded && !isLoading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-3">
        <p className="text-destructive">Failed to load NFT data (simulation).</p>
        <Button variant="outline" asChild>
            <Link href="/admin/nfts">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to NFT Management
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                  <Edit3 className="mr-3 h-7 w-7" /> Edit NFT: <span className="text-primary ml-2 truncate max-w-xs sm:max-w-sm md:max-w-md">{title || nftId}</span>
                </h1>
                <p className="text-muted-foreground">Modify the details for this NFT listing.</p>
            </div>
             <Button variant="outline" size="sm" asChild>
                <Link href="/admin/nfts">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to NFT Management
                </Link>
            </Button>
        </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>NFT Details</CardTitle>
          <CardDescription>Update the information for the NFT. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Cosmic Dreamscape" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="artistName">Artist Name*</Label>
                <Input id="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="e.g., Galactic Voyager" required disabled={isLoading}/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category*</Label>
                <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
                  <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {initialCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priceEth">Price (ETH)*</Label>
                <Input id="priceEth" type="number" step="0.01" value={priceEth} onChange={(e) => setPriceEth(e.target.value)} placeholder="e.g., 1.5" required disabled={isLoading}/>
              </div>
            </div>
            
            <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://placehold.co/400x400.png" disabled={isLoading}/>
                 <p className="text-xs text-muted-foreground mt-1">Enter a direct URL to the NFT image. For simulation, placeholder URLs are fine.</p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the NFT..." className="min-h-[100px]" disabled={isLoading}/>
            </div>
            
            <div>
                <Label htmlFor="status">Status*</Label>
                <Select value={status} onValueChange={setStatus} required disabled={isLoading}>
                  <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {initialStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <p className="text-xs text-muted-foreground pt-2">*Required fields</p>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
