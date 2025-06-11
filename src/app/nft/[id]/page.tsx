
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft, Clock, Twitter, Instagram, Link as LinkIcon, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { useState, useEffect, type FormEvent, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/components/AppLayout'; // Assuming AppLayout is desired here

interface NFTData {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  price: number | null;
  status: string;
  creator_id: string;
  created_at: string;
  artist_name: string | null; // Denormalized or joined
  // Auction specific fields if applicable - assuming not for this fetch, but for display logic
  auction_end_time?: string | null; 
  current_highest_bid?: number | null;
  starting_bid?: number | null;
}

interface ProfileData {
    username: string | null;
    avatar_url: string | null;
}

interface Bid {
  id: string; // bid id
  bidder_username: string; // username from profiles
  amount: number;
  created_at: string;
}

// Mock data for bids, as bid table interaction is not defined yet
const MOCK_BIDS: Bid[] = [
    { id: 'b1', bidder_username: 'CollectorX', amount: 2.6, created_at: new Date(Date.now() - 10 * 60000).toISOString() },
    { id: 'b2', bidder_username: 'ArtFan', amount: 2.5, created_at: new Date(Date.now() - 60 * 60000).toISOString() },
];


const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return 'Auction Ended';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && parts.length < 3) parts.push(`${seconds}s`);
  return parts.length > 0 ? parts.join(' ') : 'Ending soon';
};

const LoadingSkeleton = () => (
  <AppLayout>
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <Skeleton className="h-8 w-48 mb-6 bg-muted" />
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-[55%] p-2">
            <Skeleton className="aspect-square w-full rounded-lg bg-muted" />
          </div>
          <div className="md:w-[45%] p-6 space-y-4">
            <Skeleton className="h-10 w-3/4 bg-muted" />
            <div className="flex items-center space-x-3 mt-3">
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24 bg-muted" />
                <Skeleton className="h-5 w-32 bg-muted" />
              </div>
            </div>
            <Skeleton className="h-20 w-full bg-muted" />
            <Skeleton className="h-12 w-1/2 bg-muted" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-12 flex-grow bg-muted" />
              <Skeleton className="h-12 w-24 bg-muted" />
            </div>
          </div>
        </div>
      </Card>
      <Skeleton className="h-8 w-56 mt-12 mb-6 bg-muted" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1,2,3].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-lg bg-muted" />)}
      </div>
    </div>
  </AppLayout>
);

const ErrorState = ({ message }: { message: string }) => (
  <AppLayout>
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-center">
       <Button variant="ghost" asChild className="mb-6">
          <Link href="/home">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Marketplace
          </Link>
        </Button>
      <Card className="py-12 border-destructive bg-destructive/10">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading NFT</h2>
        <p className="text-muted-foreground">{message}</p>
      </Card>
    </div>
  </AppLayout>
);


export default function NFTDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const nftId = params.id as string;

  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [artistProfile, setArtistProfile] = useState<ProfileData | null>(null);
  const [relatedNfts, setRelatedNfts] = useState<NFTCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const { toast } = useToast();

  const fetchNftDetails = useCallback(async () => {
    if (!nftId) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch main NFT data
      const { data: mainNft, error: nftError } = await supabase
        .from('nfts')
        .select('*') // Consider selecting specific columns
        .eq('id', nftId)
        .single();

      if (nftError) throw nftError;
      if (!mainNft) throw new Error("NFT not found.");
      setNftData(mainNft as NFTData);

      // Fetch artist (creator) profile
      if (mainNft.creator_id) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', mainNft.creator_id)
          .single();
        if (profileError && profileError.code !== 'PGRST116') console.error("Error fetching artist profile:", profileError);
        setArtistProfile(profile as ProfileData | null);
      }

      // Fetch related NFTs (e.g., by same category, excluding current one)
      const { data: related, error: relatedError } = await supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name')
        .eq('category', mainNft.category)
        .neq('id', nftId)
        .eq('status', 'listed')
        .limit(4);
      
      if (relatedError) console.error("Error fetching related NFTs:", relatedError);
      if (related) {
        const formattedRelated: NFTCardProps[] = related.map(r => ({
          id: r.id,
          imageUrl: r.image_url || 'https://placehold.co/400x400.png',
          title: r.title,
          price: r.price ? `${r.price} ETH` : 'N/A',
          artistName: r.artist_name || 'Unknown Artist',
          dataAiHint: 'nft image related'
        }));
        setRelatedNfts(formattedRelated);
      }

    } catch (err: any) {
      console.error("Error fetching NFT details:", err);
      setError(err.message || "Failed to load NFT details.");
    } finally {
      setIsLoading(false);
    }
  }, [nftId]);

  useEffect(() => {
    fetchNftDetails();
  }, [fetchNftDetails]);

  useEffect(() => {
    if (!nftData || nftData.status !== 'on_auction' || !nftData.auction_end_time) {
        setTimeLeft(''); // Clear or set to default if not an auction or no end time
        return;
    }
    const calculateTimeLeft = () => {
      const difference = +new Date(nftData.auction_end_time!) - +new Date();
      setTimeLeft(formatTimeLeft(difference));
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [nftData]);


  const handlePlaceBid = (e: FormEvent) => {
    e.preventDefault();
    const currentHighestBid = nftData?.current_highest_bid || nftData?.starting_bid || 0;
    if (!bidAmount || parseFloat(bidAmount) <= currentHighestBid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Bid',
        description: `Your bid must be higher than the current highest bid of ${currentHighestBid} ETH.`,
      });
      return;
    }
    // TODO: Implement actual bid placement logic with Supabase
    toast({
      title: 'Bid Placed (Simulated)!',
      description: `You successfully bid ${bidAmount} ETH for ${nftData?.title}.`,
    });
    setBidAmount('');
  };

  const handleBuyNow = () => {
    // TODO: Implement actual buy now logic
    toast({
      title: 'Purchase Initiated (Simulated)!',
      description: `Proceeding to buy ${nftData?.title} for ${nftData?.price} ETH.`,
    });
  };

  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    let message = `Check out this amazing NFT: ${nftData?.title} by ${artistProfile?.username || nftData?.artist_name}! ${shareUrl}`;
    let url = '';

    if (platform === 'twitter') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    else if (platform === 'instagram') { navigator.clipboard.writeText(shareUrl); toast({ title: 'Link Copied!', description: 'Share this NFT on Instagram.'}); return; }
    else if (platform === 'link') { navigator.clipboard.writeText(shareUrl); toast({ title: 'Link Copied!', description: 'NFT link copied to clipboard.' }); return; }
    if(url) window.open(url, '_blank');
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!nftData) return <ErrorState message="NFT data could not be loaded or NFT does not exist." />;

  const isAuction = nftData.status === 'on_auction';
  // Use placeholder for artist name if profile not loaded or artist_name not on nftData
  const displayArtistName = artistProfile?.username || nftData.artist_name || 'Unknown Artist';
  const artistAvatarUrl = artistProfile?.avatar_url || 'https://placehold.co/100x100.png';


  return (
    <AppLayout>
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/home">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Marketplace
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-[55%] p-2">
              <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-md">
                <Image
                  src={nftData.image_url}
                  alt={nftData.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  data-ai-hint="nft artwork"
                />
              </div>
            </div>
            <div className="md:w-[45%] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{nftData.title}</CardTitle>
                <div className="flex items-center space-x-3 mt-3">
                  <Link href={`/profile/${nftData.creator_id}`} passHref> {/* Adjust link as per your profile routing */}
                    <Image
                      src={artistAvatarUrl}
                      alt={displayArtistName}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      data-ai-hint="artist avatar"
                    />
                  </Link>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <Link href={`/profile/${nftData.creator_id}`} className="font-semibold text-primary hover:underline">
                      {displayArtistName}
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4 pt-0">
                <CardDescription className="text-base leading-relaxed">{nftData.description || "No description available."}</CardDescription>

                {isAuction && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30 shadow-inner">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Highest Bid</p>
                        <p className="text-xl font-bold text-accent">{nftData.current_highest_bid || nftData.starting_bid || 0} ETH</p>
                      </div>
                       <div>
                        <p className="text-muted-foreground flex items-center"><Clock className="h-4 w-4 mr-1.5"/>Auction Ends In</p>
                        <p className="text-xl font-bold text-accent">{timeLeft || 'Loading...'}</p>
                      </div>
                    </div>
                     <p className="text-sm text-muted-foreground">Starting Bid: <span className="font-medium text-foreground">{nftData.starting_bid || 0} ETH</span></p>
                    {nftData.price && <p className="text-sm text-muted-foreground">Buy Now Price: <span className="font-medium text-foreground">{nftData.price} ETH</span></p>}

                    <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
                      <div>
                        <Label htmlFor="bidAmount" className="text-xs">Place your bid (ETH)</Label>
                        <Input
                          id="bidAmount"
                          type="number"
                          step="0.01"
                          placeholder={`> ${nftData.current_highest_bid || nftData.starting_bid || 0}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Place Bid</Button>
                    </form>
                  </div>
                )}

                {!isAuction && nftData.price && (
                    <p className="text-3xl font-bold text-accent mb-6">{nftData.price} ETH</p>
                )}
                {!isAuction && !nftData.price && nftData.status !== 'sold' && (
                     <p className="text-xl font-semibold text-muted-foreground mb-6">Not currently for sale</p>
                )}
                 {nftData.status === 'sold' && (
                     <p className="text-xl font-semibold text-destructive mb-6">Sold</p>
                )}


                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {nftData.price && nftData.status === 'listed' && (
                    <Button size="lg" className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleBuyNow}>
                      Buy Now for {nftData.price} ETH
                    </Button>
                  )}
                  <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="flex-grow sm:flex-grow-0">
                      <Heart className="mr-2 h-5 w-5" /> Add to Favorites
                    </Button>
                  </div>
                </div>
                 <div className="flex items-center space-x-2 mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Share:</p>
                  <Button variant="outline" size="icon" aria-label="Share on Twitter" onClick={() => handleShare('twitter')}>
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Share on Instagram" onClick={() => handleShare('instagram')}>
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Copy Link" onClick={() => handleShare('link')}>
                    <LinkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>

              {isAuction && MOCK_BIDS.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <CardContent className="pt-0 pb-4">
                    <h3 className="text-lg font-semibold mb-3">Bid History ({MOCK_BIDS.length})</h3>
                    <ScrollArea className="h-[120px] w-full pr-3">
                      <ul className="space-y-3">
                        {MOCK_BIDS.map(bid => (
                          <li key={bid.id} className="flex justify-between items-center pb-2 border-b border-border last:border-b-0">
                            <div>
                              <p className="font-medium text-sm">{bid.bidder_username}</p>
                              <p className="text-xs text-muted-foreground">{new Date(bid.created_at).toLocaleString()}</p>
                            </div>
                            <p className="font-semibold text-sm text-primary">{bid.amount} ETH</p>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </>
              )}
            </div>
          </div>
        </Card>

        <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Related NFTs</h2>
            {relatedNfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {relatedNfts.map(relatedNft => (
                        <NFTCard key={relatedNft.id} {...relatedNft} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No related NFTs found.</p>
            )}
        </section>
      </div>
    </div>
    </AppLayout>
  );
}
    