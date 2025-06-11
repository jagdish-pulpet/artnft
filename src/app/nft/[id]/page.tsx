
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft, Clock, Twitter, Instagram, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation'; // Import useParams

const MOCK_NFT_DATA = {
  id: '1',
  name: 'Cosmic Dreamscape',
  imageUrl: 'https://placehold.co/800x800.png',
  dataAiHint: 'abstract space',
  artist: { name: 'Galactic Voyager', profilePicUrl: 'https://placehold.co/100x100.png', dataAiHint: 'artist portrait', profileUrl: '/artist/galactic-voyager' },
  description: 'A mesmerizing journey through a vibrant cosmic dreamscape, where stars dance and galaxies unfold in a symphony of color and light. This piece explores the infinite possibilities of the universe and the dreams that connect us to it.',
  isAuction: true,
  startingBid: '1.0 ETH',
  buyNowPrice: '5.0 ETH',
  highestBid: '2.6 ETH',
  auctionEndTime: new Date(Date.now() + 12 * 60 * 60 * 1000 + 30 * 60 * 1000 + 5 * 1000).toISOString(),
  bids: [
    { id: 'b1', user: 'CollectorX', amount: '2.6 ETH', time: '10 mins ago' },
    { id: 'b2', user: 'ArtFan', amount: '2.5 ETH', time: '1 hour ago' },
    { id: 'b3', user: 'NFTKing', amount: '2.0 ETH', time: '3 hours ago' },
  ],
};

const MOCK_RELATED_NFTS: NFTCardProps[] = [
    { id: 'r1', imageUrl: 'https://placehold.co/400x400.png', title: 'Galaxy Bloom', price: '1.8 ETH', artistName: 'StarPainter', dataAiHint: 'galaxy flower' },
    { id: 'r2', imageUrl: 'https://placehold.co/400x400.png', title: 'Nebula\'s Whisper', price: '2.5 ETH', artistName: 'CosmicArtist', dataAiHint: 'nebula space' },
    { id: 'r3', imageUrl: 'https://placehold.co/400x400.png', title: 'Astro Odyssey', price: '3.2 ETH', artistName: 'Galactic Voyager', dataAiHint: 'astronaut adventure' },
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


export default function NFTDetailsPage() { // Remove params from props
  const routeParams = useParams<{ id: string }>(); // Use the hook
  // const id = routeParams.id; // Access the id if needed for data fetching

  // For now, MOCK_NFT_DATA is static and doesn't use the 'id' from params.
  // If you were fetching data based on 'id', you would use `routeParams.id` here.
  const nft = MOCK_NFT_DATA;
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!nft.isAuction || !nft.auctionEndTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(nft.auctionEndTime) - +new Date();
      setTimeLeft(formatTimeLeft(difference));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nft.auctionEndTime, nft.isAuction]);

  const handlePlaceBid = (e: FormEvent) => {
    e.preventDefault();
    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(nft.highestBid.split(' ')[0])) {
      toast({
        variant: 'destructive',
        title: 'Invalid Bid',
        description: `Your bid must be higher than the current highest bid of ${nft.highestBid}.`,
      });
      return;
    }
    toast({
      title: 'Bid Placed!',
      description: `You successfully bid ${bidAmount} ETH for ${nft.name}.`,
    });
    setBidAmount('');
  };

  const handleBuyNow = () => {
    toast({
      title: 'Purchase Initiated!',
      description: `Proceeding to buy ${nft.name} for ${nft.buyNowPrice}.`,
    });
  };

  const handleShare = (platform: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    let message = `Check out this amazing NFT: ${nft.name} by ${nft.artist.name}! ${shareUrl}`;
    let url = '';

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    } else if (platform === 'instagram') {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link Copied!', description: 'Share this NFT on Instagram.'});
      return;
    } else if (platform === 'link') {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link Copied!', description: 'NFT link copied to clipboard.' });
      return;
    }
    if(url) window.open(url, '_blank');
  };


  return (
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
                  src={nft.imageUrl}
                  alt={nft.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  data-ai-hint={nft.dataAiHint}
                />
              </div>
            </div>
            <div className="md:w-[45%] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl md:text-4xl font-bold font-headline">{nft.name}</CardTitle>
                <div className="flex items-center space-x-3 mt-3">
                  <Link href={nft.artist.profileUrl || '#'} passHref>
                    <Image
                      src={nft.artist.profilePicUrl}
                      alt={nft.artist.name}
                      width={40}
                      height={40}
                      className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      data-ai-hint={nft.artist.dataAiHint}
                    />
                  </Link>
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <Link href={nft.artist.profileUrl || '#'} className="font-semibold text-primary hover:underline">
                      {nft.artist.name}
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4 pt-0">
                <CardDescription className="text-base leading-relaxed">{nft.description}</CardDescription>

                {nft.isAuction && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30 shadow-inner">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Highest Bid</p>
                        <p className="text-xl font-bold text-accent">{nft.highestBid}</p>
                      </div>
                       <div>
                        <p className="text-muted-foreground flex items-center"><Clock className="h-4 w-4 mr-1.5"/>Auction Ends In</p>
                        <p className="text-xl font-bold text-accent">{timeLeft || 'Loading...'}</p>
                      </div>
                    </div>
                     <p className="text-sm text-muted-foreground">Starting Bid: <span className="font-medium text-foreground">{nft.startingBid}</span></p>
                    {nft.buyNowPrice && <p className="text-sm text-muted-foreground">Buy Now Price: <span className="font-medium text-foreground">{nft.buyNowPrice}</span></p>}

                    <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
                      <div>
                        <Label htmlFor="bidAmount" className="text-xs">Place your bid (ETH)</Label>
                        <Input
                          id="bidAmount"
                          type="number"
                          step="0.01"
                          placeholder={`> ${nft.highestBid.split(' ')[0]}`}
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

                {!nft.isAuction && nft.buyNowPrice && (
                    <p className="text-3xl font-bold text-accent mb-6">{nft.buyNowPrice}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {nft.buyNowPrice && (
                    <Button size="lg" className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleBuyNow}>
                      Buy Now for {nft.buyNowPrice}
                    </Button>
                  )}
                   {!nft.buyNowPrice && !nft.isAuction && (
                    <Button size="lg" className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground" disabled>Not available for purchase</Button>
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

              {nft.isAuction && nft.bids && nft.bids.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <CardContent className="pt-0 pb-4">
                    <h3 className="text-lg font-semibold mb-3">Bid History ({nft.bids.length})</h3>
                    <ScrollArea className="h-[120px] w-full pr-3">
                      <ul className="space-y-3">
                        {nft.bids.map(bid => (
                          <li key={bid.id} className="flex justify-between items-center pb-2 border-b border-border last:border-b-0">
                            <div>
                              <p className="font-medium text-sm">{bid.user}</p>
                              <p className="text-xs text-muted-foreground">{bid.time}</p>
                            </div>
                            <p className="font-semibold text-sm text-primary">{bid.amount}</p>
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
            {MOCK_RELATED_NFTS.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {MOCK_RELATED_NFTS.map(relatedNft => (
                        <NFTCard key={relatedNft.id} {...relatedNft} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No related NFTs found.</p>
            )}
        </section>
      </div>
    </div>
  );
}

