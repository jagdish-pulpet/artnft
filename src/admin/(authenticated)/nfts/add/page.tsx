
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PlusCircle, Save, Palette as PaletteIcon, Loader2 } from "lucide-react"; // Renamed Palette to PaletteIcon to avoid conflict
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const initialCategories = ['Digital Art', 'Collectible', 'Music', 'Photography', 'Virtual World', 'Utility'];
const initialStatuses = ['Listed', 'Hidden', 'Pending Review'];


export default function AdminAddNFTPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [category, setCategory] = useState('');
  const [priceEth, setPriceEth] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    console.log('Simulating Add New NFT:', { title, artistName, category, priceEth, description, imageUrl, status });
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'NFT Added (Simulated)',
      description: `NFT "${title}" has been successfully added to the platform.`,
    });
    
    setIsLoading(false);
    router.push('/admin/nfts'); 
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
                  <PlusCircle className="mr-3 h-7 w-7" /> Add New NFT Manually
                </h1>
                <p className="text-muted-foreground">Create a new NFT listing for the platform.</p>
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
          <CardDescription>Enter the information for the new NFT. Fields marked with * are required.</CardDescription>
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
                <Label htmlFor="status">Initial Status*</Label>
                <Select value={status} onValueChange={setStatus} required disabled={isLoading}>
                  <SelectTrigger id="status"><SelectValue placeholder="Select initial status" /></SelectTrigger>
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
              {isLoading ? 'Saving NFT...' : 'Save NFT'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    