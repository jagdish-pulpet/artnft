
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Palette, Grid, ExternalLink, Globe, Twitter, AlertCircle, Loader2, BadgeCheck } from 'lucide-react'; // Added Globe, Twitter, AlertCircle, Loader2, BadgeCheck
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NftCard, type NftProps } from '@/components/nft/nft-card';
import { NftCardSkeleton } from '@/components/nft/nft-card-skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiService, ApiError } from '@/lib/apiService'; 
import { Alert, AlertDescription } from '@/components/ui/alert';


interface CollectionDetailData {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoImageUrl?: string;
  coverImageUrl?: string;
  bannerImageUrl?: string; // Using this for the main header image
  creator: { // Expecting creator object from backend
    id: string;
    username: string;
    avatarUrl?: string;
  };
  itemCount: number;
  volumeTraded?: number; // Expecting number or null
  floorPrice?: number;  // Expecting number or null
  category?: string;
  isVerified?: boolean;
  externalLinks?: {
    website?: string;
    discord?: string;
    twitter?: string;
  };
  nfts: NftProps[]; 
  dataAiHint?: string; // For banner image
}

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [collectionData, setCollectionData] = useState<CollectionDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCollectionDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Backend API: GET /api/collections/:id_or_slug
          const data = await apiService.get<{ data: CollectionDetailData }>(`/collections/${id}`);
          const collection = data.data; // Assuming backend wraps in 'data' object
          
          // Enrich NFTs with collection name if missing
          const nftsWithCollection = collection.nfts.map(nft => ({
            ...nft,
            collectionName: collection.name 
          }));
          setCollectionData({...collection, nfts: nftsWithCollection});
        } catch (err: any) {
          const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load collection details.';
          setError(errorMessage);
          setCollectionData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCollectionDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (error || !collectionData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
          <Card className="max-w-lg w-full shadow-xl rounded-xl p-8 text-center">
            <CardHeader>
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl text-destructive">
                {error ? 'Error Loading Collection' : 'Collection Not Found'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive"><AlertDescription>{error || 'The collection you are looking for does not exist or could not be loaded.'}</AlertDescription></Alert>
              <Button className="mt-6" asChild>
                <Link href="/collections">Explore Other Collections</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-12 selection:bg-accent/30 selection:text-accent-foreground">
        <header className="relative">
          <div className="h-48 sm:h-64 md:h-72 w-full">
            <Image
              src={collectionData.bannerImageUrl || collectionData.coverImageUrl || 'https://placehold.co/1200x400.png'}
              alt={`${collectionData.name} cover image`}
              layout="fill"
              objectFit="cover"
              className="rounded-b-lg shadow-md"
              data-ai-hint={collectionData.dataAiHint || "collection banner abstract"}
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-lg"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 md:px-8 absolute bottom-0 left-0 right-0 transform translate-y-1/3 sm:translate-y-1/4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 border-4 border-background bg-card rounded-full shadow-xl">
                    <AvatarImage src={collectionData.logoImageUrl || `https://placehold.co/128x128.png?text=${collectionData.name.charAt(0)}`} alt={collectionData.name} data-ai-hint="collection logo symbol" />
                    <AvatarFallback>{collectionData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                         <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-card-foreground shadow-black [text-shadow:_0_1px_3px_var(--tw-shadow-color)] sm:text-primary">
                            {collectionData.name}
                        </h1>
                        {collectionData.isVerified && <BadgeCheck className="h-6 w-6 text-accent flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground sm:text-foreground/80">
                        Created by <Link href={`/profile/${collectionData.creator.id}`} className="font-medium text-accent hover:underline">{collectionData.creator.username}</Link>
                    </p>
                </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-20">
          <div className="mb-6">
                <Button variant="outline" asChild>
                <Link href="/collections">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Collections
                </Link>
                </Button>
            </div>

            <Card className="shadow-xl rounded-xl mb-8">
                <CardContent className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-2">
                        <p className="text-2xl font-bold text-primary">{collectionData.itemCount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Items</p>
                    </div>
                    <div className="p-2">
                        <p className="text-2xl font-bold text-primary">{collectionData.volumeTraded ? `${collectionData.volumeTraded} ETH` : 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Total Volume</p>
                    </div>
                    <div className="p-2">
                        <p className="text-2xl font-bold text-primary">{collectionData.floorPrice ? `${collectionData.floorPrice} ETH` : 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Floor Price</p>
                    </div>
                     <div className="p-2">
                        <p className="text-2xl font-bold text-primary"> 
                            {collectionData.nfts ? new Set(collectionData.nfts.map(nft => nft.creator)).size : 0} {/* Approximation */}
                        </p>
                        <p className="text-sm text-muted-foreground">Unique Owners</p>
                    </div>
                </CardContent>
            </Card>
            
            <Accordion type="single" collapsible defaultValue="description" className="w-full bg-card rounded-xl shadow-xl px-4 sm:px-6 mb-8">
                <AccordionItem value="description" className="border-border/50">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary py-4">
                        <Info className="mr-2 h-5 w-5" /> Description
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80 pt-1 pb-4 text-sm sm:text-base prose dark:prose-invert max-w-none">
                        <p>{collectionData.description || "No description provided for this collection."}</p>
                        {collectionData.category && <p className="mt-2">Category: <Badge variant="secondary">{collectionData.category}</Badge></p>}
                         {collectionData.externalLinks && (
                            <div className="mt-4 flex items-center space-x-3">
                                {collectionData.externalLinks.website && <Button variant="outline" size="sm" asChild><Link href={collectionData.externalLinks.website} target="_blank" rel="noopener noreferrer"><Globe className="mr-1.5 h-4 w-4" />Website</Link></Button>}
                                {collectionData.externalLinks.discord && <Button variant="outline" size="sm" asChild><Link href={collectionData.externalLinks.discord} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" />Discord</Link></Button>}
                                {collectionData.externalLinks.twitter && <Button variant="outline" size="sm" asChild><Link href={collectionData.externalLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="mr-1.5 h-4 w-4" />Twitter</Link></Button>}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

          <Separator className="my-8" />
          
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-6 flex items-center">
            <Grid className="mr-3 h-7 w-7" /> Items in Collection
          </h2>
          {collectionData.nfts && collectionData.nfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collectionData.nfts.map((nft) => (
                <NftCard key={nft.id} {...nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5}/>
              <p className="text-xl font-semibold text-foreground">No NFTs Found</p>
              <p className="text-muted-foreground">There are currently no NFTs listed in this collection.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
