
'use client';

import Image from 'next/image';
import { getMockNftById, getMockNftsByCollectionId } from '@/lib/mock-data';
import type { NFT, NFTOwner } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, Users, CalendarDays, Palette, ShoppingCart, History, Layers, Twitter, Link as LinkIcon, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import NftCard from '@/components/nft-card';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

interface NftDetailsPageProps {
  params: { id: string };
}

export default function NftDetailsPage({ params }: NftDetailsPageProps) {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');
  const [nft, setNft] = useState<NFT | undefined>(undefined);
  const [relatedNfts, setRelatedNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    const foundNft = getMockNftById(params.id);
    setNft(foundNft);

    if (foundNft) {
      const related = foundNft.relatedCollectionIds?.flatMap(collectionId => getMockNftsByCollectionId(collectionId))
        .filter(relatedNft => relatedNft && relatedNft.id !== foundNft.id)
        .slice(0, 3) || []; // Ensure we only take up to 3 related NFTs
      setRelatedNfts(related as NFT[]);
    }
    setIsLoading(false);
  }, [params.id]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading NFT details...</p>
      </div>
    );
  }

  if (!nft) {
    return <div className="text-center py-12 text-lg font-medium text-destructive">NFT not found.</div>;
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "The NFT page URL has been copied to your clipboard.",
        variant: "default",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    });
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing NFT: ${nft.title}!`)}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="space-y-8 sm:space-y-10">
      <Card className="overflow-hidden shadow-xl rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0"> {/* Changed to md:grid-cols-5 for better ratio */}
          <div className="md:col-span-3 relative aspect-square md:aspect-auto min-h-[350px] sm:min-h-[450px] md:min-h-full">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              fill
              className="object-contain bg-muted p-2 sm:p-4 rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              data-ai-hint={`${nft.artStyle?.split(' ')[0] ?? 'nft'} ${nft.artStyle?.split(' ').pop() ?? 'art'}`}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 50vw"
              priority
            />
          </div>
          <div className="md:col-span-2 p-6 sm:p-8 flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-bold mb-2 text-primary">{nft.title}</h1>
            <p className="text-md sm:text-lg text-muted-foreground mb-4">
              By <Link href={`/artist/${nft.artist.toLowerCase().replace(/\s+/g, '-')}`} className="text-accent hover:underline font-medium">{nft.artist}</Link>
            </p>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-foreground/80">
                <Palette className="w-5 h-5 text-accent flex-shrink-0" />
                <span><span className="font-medium text-foreground/90">Style:</span> {nft.artStyle}</span>
              </div>
              {nft.creationDate && (
                <div className="flex items-center gap-2 text-foreground/80">
                  <CalendarDays className="w-5 h-5 text-accent flex-shrink-0" />
                  <span><span className="font-medium text-foreground/90">Created:</span> {new Date(nft.creationDate).toLocaleDateString()}</span>
                </div>
              )}
              {nft.materialsUsed && (
                 <div className="flex items-center gap-2 text-foreground/80">
                  <Layers className="w-5 h-5 text-accent flex-shrink-0" />
                  <span><span className="font-medium text-foreground/90">Materials:</span> {nft.materialsUsed}</span>
                </div>
              )}
            </div>
            
            <Card className="bg-secondary/50 mb-6">
              <CardContent className="p-4">
                <CardDescription className="text-sm sm:text-base text-secondary-foreground leading-relaxed">{nft.description}</CardDescription>
              </CardContent>
            </Card>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{nft.price} ETH</p>
                {/* Placeholder for USD conversion or secondary market price */}
              </div>
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base sm:text-lg py-3">
                <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Buy Now
              </Button>
               <Button size="lg" variant="outline" className="w-full text-base sm:text-lg py-3">
                 Make Offer
              </Button>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold mb-2 text-muted-foreground flex items-center gap-2"><Share2 className="w-4 h-4" /> Share this NFT:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(twitterShareUrl, '_blank')} className="flex-1">
                    <Twitter className="w-4 h-4 mr-2 text-[#1DA1F2]" /> Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyLinkToClipboard} className="flex-1">
                    <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {nft.ownershipHistory && nft.ownershipHistory.length > 0 && (
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl sm:text-2xl text-primary">
              <History className="w-6 h-6 text-accent" /> Ownership History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {nft.ownershipHistory.map((entry: NFTOwner, index: number) => (
                <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-secondary/50 rounded-md text-sm hover:bg-secondary/70 transition-colors">
                  <div>
                    <p className="font-semibold text-secondary-foreground">{entry.owner}</p>
                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</p>
                  </div>
                  {entry.price && <p className="text-sm font-medium text-primary mt-1 sm:mt-0">{entry.price} ETH</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-xl sm:text-2xl text-primary">
            <MessageCircle className="w-6 h-6 text-accent" /> Community Discussion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p className="mb-2">Comments and social feed coming soon!</p>
            <p className="text-sm">Be the first to share your thoughts once this feature is live.</p>
            {/* Placeholder for future comment input and display */}
          </div>
        </CardContent>
      </Card>

      {relatedNfts.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-headline font-semibold mb-4 text-center sm:text-left text-primary">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedNfts.map((relatedNft) => (
              relatedNft ? <NftCard key={relatedNft.id} nft={relatedNft} /> : null
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
