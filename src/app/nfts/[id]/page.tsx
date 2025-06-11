
'use client';

import Image from 'next/image';
import { getMockNftById, getMockNftsByCollectionId } from '@/lib/mock-data';
import type { NFT, NFTOwner } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tag, Users, CalendarDays, Palette, ShoppingCart, History, Layers, Twitter, Link as LinkIcon, Share2, MessageCircle, CreditCard, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import NftCard from '@/components/nft-card';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef } from 'react';

// Inline SVG for Discord icon
const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Discord</title>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4404.8648-.6083 1.2495a18.2971 18.2971 0 00-5.4846 0 16.004 16.004 0 00-.6177-1.2495.077.077 0 00-.0785-.037A19.7151 19.7151 0 003.6796 4.3698a.077.077 0 00-.0379.0844A18.0032 18.0032 0 002.3251 9.6002a16.1165 16.1165 0 001.6193 5.3888s.4499.3807.7057.6092a14.4737 14.4737 0 002.4638 1.5756.077.077 0 00.0943-.0238A12.7115 12.7115 0 0010.0251 16.15s.3692-.2667.6689-.5338a14.1283 14.1283 0 002.4201-1.6537.077.077 0 00.0943.0238 14.9319 14.9319 0 002.4634-1.5752s.4499-.3807.7057-.6092A16.1165 16.1165 0 0021.6748 9.6002a18.0032 18.0032 0 00-1.318-5.146.077.077 0 00-.038-.0844zm-5.4744 6.6222a2.1586 2.1586 0 01-2.1664 2.1775 2.1586 2.1586 0 01-2.1664-2.1775 2.1586 2.1586 0 012.1664-2.1775 2.1586 2.1586 0 012.1664 2.1775zm-6.4062 0a2.1586 2.1586 0 01-2.1664 2.1775 2.1586 2.1586 0 01-2.1664-2.1775 2.1586 2.1586 0 012.1664-2.1775 2.1586 2.1586 0 012.1664 2.1775z" fill="currentColor"/>
  </svg>
);

interface NftDetailsPageProps {
  params: { id: string };
}

const MAIN_HEADER_HEIGHT_APPROX = 70; // Approximate height of the main sticky header in pixels

export default function NftDetailsPage({ params }: NftDetailsPageProps) {
  const { toast } = useToast();
  const [currentUrl, setCurrentUrl] = useState('');
  const [nft, setNft] = useState<NFT | undefined>(undefined);
  const [relatedNfts, setRelatedNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const nftDetailsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (nftDetailsSectionRef.current) {
        const { top } = nftDetailsSectionRef.current.getBoundingClientRect();
        if (top < MAIN_HEADER_HEIGHT_APPROX && !showStickyHeader) {
          setShowStickyHeader(true);
        } else if (top >= MAIN_HEADER_HEIGHT_APPROX && showStickyHeader) {
          setShowStickyHeader(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showStickyHeader]);

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
        .slice(0, 3) || [];
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
    return <div className="text-center py-12 text-lg font-medium text-destructive flex items-center justify-center gap-2"><Info className="w-6 h-6" />NFT not found.</div>;
  }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: message,
        variant: "default",
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    });
  };
  
  const copyLinkToClipboard = () => copyToClipboard(currentUrl, "The NFT page URL has been copied.");

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing NFT: ${nft.title}!`)}&url=${encodeURIComponent(currentUrl)}`;
  
  const discordShareMessage = `Check out this NFT: "${nft.title}" on ArtNFT! ${currentUrl}`;

  return (
    <div className="space-y-8 sm:space-y-10 relative">
      {/* Sticky Sub-Header */}
      {showStickyHeader && (
        <div className="fixed top-0 left-0 right-0 bg-card shadow-lg p-3 sm:p-4 z-40 animate-in slide-in-from-top-8 duration-300" style={{paddingTop: `${MAIN_HEADER_HEIGHT_APPROX + 10}px`}}>
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 sm:w-14 sm:h-14 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image src={nft.imageUrl} alt={nft.title} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold truncate text-card-foreground">{nft.title}</h2>
                <p className="text-sm text-primary font-medium">{nft.price} ETH</p>
              </div>
            </div>
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0 px-3 sm:px-4">
              <ShoppingCart className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Buy Now
            </Button>
          </div>
        </div>
      )}

      <Card ref={nftDetailsSectionRef} className="overflow-hidden shadow-xl rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
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
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(discordShareMessage, 'Discord share message copied!')} className="flex-1">
                    <DiscordIcon className="w-4 h-4 mr-2 text-[#5865F2]" /> Discord
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

    