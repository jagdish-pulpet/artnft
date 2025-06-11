
'use client';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Search as SearchIcon, Palette, Camera, Music2, ToyBrick, Globe, Bitcoin,
  Package, PlusSquare, Newspaper, ArrowRight, Users, Award, Flame, UserPlus, UserCheck, Activity, Bell, AlertTriangle, Loader2, ServerCrash
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';


const LoadingNFTSkeleton = ({ count = 3 }: { count?: number}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(count).fill(0).map((_,i) => (
      <Card key={`skel-nft-${i}`} className="shadow-lg animate-pulse">
        <Skeleton className="aspect-square w-full bg-muted" />
        <CardContent className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2 bg-muted" />
          <Skeleton className="h-4 w-1/2 mb-3 bg-muted" />
          <Skeleton className="h-6 w-1/3 bg-muted" />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Skeleton className="h-9 w-full bg-muted" />
        </CardFooter>
      </Card>
    ))}
  </div>
);

const LoadingArtistSkeleton = ({ count = 3 }: { count?: number}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array(count).fill(0).map((_,i) => (
      <Card key={`skel-artist-${i}`} className="shadow-md animate-pulse">
        <Skeleton className="h-24 w-full bg-muted rounded-t-lg" />
        <div className="relative p-4 flex flex-col items-center -mt-10">
            <Skeleton className="h-20 w-20 rounded-full border-4 border-card bg-muted" />
            <Skeleton className="h-5 w-3/4 mt-3 bg-muted" />
            <Skeleton className="h-3 w-1/2 mt-1.5 bg-muted" />
            <Skeleton className="h-8 w-full mt-4 bg-muted rounded-md" />
        </div>
      </Card>
    ))}
  </div>
);


const ErrorState = ({ message, onRetry, icon: Icon = ServerCrash }: { message: string, onRetry?: () => void, icon?: LucideIcon }) => (
  <Card className="text-center py-12 border-destructive bg-destructive/5">
    <CardContent className="flex flex-col items-center">
      <Icon className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold text-destructive">Could not load data</h3>
      <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
      {onRetry && <Button variant="destructive" className="mt-6" onClick={onRetry}>Try Again</Button>}
    </CardContent>
  </Card>
);


interface Category {
  name: string;
  icon: LucideIcon;
  href: string;
  dataAiHint?: string;
}

const categories: Category[] = [
  { name: 'Digital Art', icon: Palette, href: '/category/digital-art', dataAiHint: 'abstract art' },
  { name: 'Photography', icon: Camera, href: '/category/photography', dataAiHint: 'photo landscape' },
  { name: 'Music', icon: Music2, href: '/category/music', dataAiHint: 'music album' },
  { name: 'Collectibles', icon: ToyBrick, href: '/category/collectibles', dataAiHint: 'collectible item' },
  { name: 'Virtual Worlds', icon: Globe, href: '/category/virtual-worlds', dataAiHint: 'metaverse vr' },
  { name: 'Utility Tokens', icon: Bitcoin, href: '/category/utility-tokens', dataAiHint: 'crypto coin' },
];


interface CommunityHighlightItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  dataAiHint?: string;
  href: string;
  icon: LucideIcon;
}

const communityHighlights: CommunityHighlightItem[] = [
  { id: 'ch1', title: 'New Artist Spotlight: PixelPainter', description: 'Discover stunning pixel art creations from a rising star.', imageUrl: 'https://placehold.co/600x300.png?text=Pixel+Art+Showcase', dataAiHint: 'pixel artist showcase', href: '/artist/pixelpainter', icon: Users },
  { id: 'ch2', title: 'Upcoming Auction: "Genesis Block"', description: 'A rare collection from the early days of NFTs. Don\'t miss out!', imageUrl: 'https://placehold.co/600x300.png?text=Auction+Preview', dataAiHint: 'nft auction', href: '/auction/genesis-block', icon: Award },
  { id: 'ch3', title: 'ArtNFT Platform Update v1.2', description: 'New features, improved performance, and enhanced user experience are here!', imageUrl: 'https://placehold.co/600x300.png?text=Platform+Update', dataAiHint: 'tech update', href: '/blog/update-v1-2', icon: Newspaper },
];

interface ArtistSpotlightData {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  coverImageUrl: string;
  profileUrl: string;
  dataAiHintAvatar?: string;
  dataAiHintCover?: string;
}

const initialArtistsSpotlight: ArtistSpotlightData[] = [
  { id: 'artist1', name: 'PixelPainter', bio: 'Creating vibrant worlds one pixel at a time. Lover of retro and modern digital art.', imageUrl: 'https://placehold.co/100x100.png?text=PP', coverImageUrl: 'https://placehold.co/400x150.png?text=PixelArt+Cover', profileUrl: '/artist/pixelpainter', dataAiHintAvatar: 'pixel artist avatar', dataAiHintCover: 'pixel art banner' },
  { id: 'artist2', name: 'NFTCollectorPro', bio: 'Seasoned collector focusing on generative art and rare collectibles.', imageUrl: 'https://placehold.co/100x100.png?text=NP', coverImageUrl: 'https://placehold.co/400x150.png?text=Collector+Banner', profileUrl: '/artist/nftcollectorpro', dataAiHintAvatar: 'robot artist headshot', dataAiHintCover: 'ai generated art' },
  { id: 'artist3', name: 'DigitalExplorer', bio: 'Exploring the vast universe of digital art and NFTs. Always curious.', imageUrl: 'https://placehold.co/100x100.png?text=DE', coverImageUrl: 'https://placehold.co/400x150.png?text=Explorer+Banner', profileUrl: '/artist/digitalexplorer', dataAiHintAvatar: 'abstract portrait person', dataAiHintCover: 'colorful abstract paint' },
  { id: 'artist4', name: 'MetaverseMaven', bio: 'Virtual world enthusiast and digital asset trader.', imageUrl: 'https://placehold.co/100x100.png?text=MM', coverImageUrl: 'https://placehold.co/400x150.png?text=Metaverse+Cover', profileUrl: '/artist/metaversemaven', dataAiHintAvatar: 'retro musician shades', dataAiHintCover: 'neon city' },
];


const SCROLL_THRESHOLD = 50;
const MIN_SCROLL_DELTA = 5;

export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);

  const [latestActivityNFTs, setLatestActivityNFTs] = useState<NFTCardProps[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [errorLatest, setErrorLatest] = useState<string | null>(null);

  const [popularCollections, setPopularCollections] = useState<NFTCardProps[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  
  const [nftsFromFollowedArtists, setNftsFromFollowedArtists] = useState<NFTCardProps[]>([]);
  const [isLoadingFollowed, setIsLoadingFollowed] = useState(false); 
  const [errorFollowed, setErrorFollowed] = useState<string | null>(null);


  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const fetchUserAndProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    if (user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') console.error("Error fetching profile username:", error);
      setProfileUsername(profile?.username || user.email?.split('@')[0] || 'User');
    } else {
      setProfileUsername('Guest');
    }
  }, []);

  const fetchLatestNfts = useCallback(async () => {
    setIsLoadingLatest(true);
    setErrorLatest(null);
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name, status') 
        .in('status', ['listed', 'on_auction'])
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      const formattedNfts: NFTCardProps[] = data.map((nft: any) => ({
        id: nft.id,
        imageUrl: nft.image_url || 'https://placehold.co/400x400.png',
        title: nft.title,
        price: nft.price ? `${nft.price} ETH` : 'N/A', 
        artistName: nft.artist_name || 'Unknown Artist',
        dataAiHint: 'nft image'
      }));
      setLatestActivityNFTs(formattedNfts);
    } catch (err: any) {
      let detailedErrorMessage = "Error fetching latest NFTs: Unknown error.";
      if (err && err.message) {
        detailedErrorMessage = `Error fetching latest NFTs: ${err.message}`;
        if (err.details) detailedErrorMessage += ` Details: ${err.details}`;
        if (err.code) detailedErrorMessage += ` Code: ${err.code}`;
      } else if (err) {
        try {
          detailedErrorMessage = `Error fetching latest NFTs: ${JSON.stringify(err)}`;
        } catch (stringifyError) {
          detailedErrorMessage = "Error fetching latest NFTs: Non-serializable error object caught.";
        }
      }
      console.error(detailedErrorMessage, err); 
      setErrorLatest( (err && err.message) ? err.message : "Could not fetch latest NFTs.");
    } finally {
      setIsLoadingLatest(false);
    }
  }, []);

  const fetchPopularNfts = useCallback(async () => {
    setIsLoadingPopular(true);
    setErrorPopular(null);
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name, status')
        .in('status', ['listed', 'on_auction'])
        .order('created_at', { ascending: true }) 
        .limit(3);

      if (error) throw error;
      const formattedNfts: NFTCardProps[] = data.map((nft: any) => ({ 
        id: nft.id,
        imageUrl: nft.image_url || 'https://placehold.co/400x400.png',
        title: nft.title,
        price: nft.price ? `${nft.price} ETH` : 'N/A',
        artistName: nft.artist_name || 'Unknown Artist',
        dataAiHint: 'nft image'
      }));
      setPopularCollections(formattedNfts);
    } catch (err: any) {
      let detailedErrorMessage = "Error fetching popular NFTs: Unknown error.";
      if (err && err.message) {
        detailedErrorMessage = `Error fetching popular NFTs: ${err.message}`;
        if (err.details) detailedErrorMessage += ` Details: ${err.details}`;
        if (err.code) detailedErrorMessage += ` Code: ${err.code}`;
      } else if (err) {
        try {
          detailedErrorMessage = `Error fetching popular NFTs: ${JSON.stringify(err)}`;
        } catch (stringifyError) {
          detailedErrorMessage = "Error fetching popular NFTs: Non-serializable error object caught.";
        }
      }
      console.error(detailedErrorMessage, err);  
      setErrorPopular( (err && err.message) ? err.message : "Could not fetch popular NFTs.");
    } finally {
      setIsLoadingPopular(false);
    }
  }, []);


  useEffect(() => {
    fetchUserAndProfile();
    fetchLatestNfts();
    fetchPopularNfts();
    
    setIsLoadingFollowed(true);
    setTimeout(() => {
      const mockFollowedNfts: NFTCardProps[] = [
          { id: 'follow1', imageUrl: 'https://placehold.co/400x400.png?text=Followed1', title: 'AI Dreams #1', price: '1.0 ETH', artistName: 'PixelPainter', dataAiHint: 'robot art' },
          { id: 'follow2', imageUrl: 'https://placehold.co/400x400.png?text=Followed2', title: 'Pixel Adventure', price: '0.6 ETH', artistName: 'PixelPainter', dataAiHint: 'pixel game character' },
      ];
      setNftsFromFollowedArtists(mockFollowedNfts);
      setIsLoadingFollowed(false);
    }, 1200);


    const initialScrollY = window.scrollY;
    setLastScrollY(initialScrollY);
    if (initialScrollY > SCROLL_THRESHOLD) {
      setIsHeaderVisible(false);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= SCROLL_THRESHOLD) setIsHeaderVisible(true);
      else if (currentScrollY > lastScrollY && (currentScrollY - lastScrollY) > MIN_SCROLL_DELTA) setIsHeaderVisible(false); 
      else if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY) > MIN_SCROLL_DELTA) setIsHeaderVisible(true); 
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchUserAndProfile, fetchLatestNfts, fetchPopularNfts, lastScrollY]);

  const handleFollowToggle = (artistId: string, artistName: string) => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Login Required", description: "Please log in to follow artists."});
      router.push('/login');
      return;
    }
    setFollowedArtists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artistId)) {
        newSet.delete(artistId);
        toast({ title: "Unfollowed (Simulated)", description: `You are no longer following ${artistName}.` });
      } else {
        newSet.add(artistId);
        toast({ title: "Followed (Simulated)!", description: `You are now following ${artistName}.` });
      }
      return newSet;
    });
  };

  return (
    <AppLayout>
      <div className="max-w-full md:max-w-7xl mx-auto">
        <header className={cn(
          "flex flex-col md:flex-row justify-between items-center mb-6 py-3 sticky top-0 bg-background/90 backdrop-blur-md z-40 px-4 md:px-0 border-b",
          "transition-transform duration-300 ease-in-out",
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0' 
        )}>
          <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
            <ArtNFTLogo />
          </div>
          <div className="flex items-center w-full md:w-auto md:flex-grow md:justify-center px-0 md:px-4">
             <form onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${(e.target as HTMLFormElement).search.value}`); }} className="flex items-center flex-grow max-w-xs sm:max-w-sm md:max-w-md">
              <Input
                type="search"
                name="search"
                placeholder="Search anything..."
                className="flex-grow"
              />
              <Button type="submit" variant="default" size="icon" className="ml-2 shrink-0">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <Link href="/profile" className="hover:text-primary transition-colors">
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Hello,</p>
                    <p className="text-sm font-semibold text-foreground -mt-1 truncate max-w-[150px]">{profileUsername || 'User'}</p>
                </div>
              </Link>
            ) : (
              <Button variant="outline" size="sm" asChild><Link href="/login">Log In</Link></Button>
            )}
            <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                </Link>
            </Button>
          </div>
        </header>

        <div className="px-4 md:px-0 space-y-12 md:space-y-16">
            <section className="relative bg-card rounded-xl overflow-hidden p-8 md:p-12 shadow-2xl text-center md:text-left border">
                <div className="absolute inset-0 opacity-10 dark:opacity-5 z-0">
                    <Image 
                        src="https://placehold.co/1400x500.png?text=Abstract+Art+NFT+Background" 
                        alt="Abstract NFT background collage" 
                        fill 
                        className="object-cover" 
                        data-ai-hint="abstract digital art"
                        priority
                    />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-headline text-primary">
                            The Universe of Digital Art Awaits
                        </h1>
                        <p className="text-lg md:text-xl text-foreground/80">
                            Dive into ArtNFT, the premier marketplace for discovering, creating, and trading unique Non-Fungible Tokens. Your journey into the future of art starts here.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" asChild>
                                <Link href="/search">Explore Marketplace <ArrowRight className="ml-2 h-5 w-5"/></Link>
                            </Button>
                            <Button size="lg" variant="outline" className="shadow-sm" asChild>
                                <Link href="/create-nft">Create Your NFT <PlusSquare className="ml-2 h-5 w-5"/></Link>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center items-center">
                        <Image src="https://placehold.co/500x500.png?text=Featured+NFT" alt="Featured NFT Showcase" width={450} height={450} className="rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-300" data-ai-hint="modern digital sculpture"/>
                    </div>
                </div>
            </section>

            <section>
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center"><Activity className="mr-3 h-7 w-7 text-primary"/>Latest Activity</CardTitle>
                        <CardDescription>Freshly minted and recently listed NFTs.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {isLoadingLatest ? <LoadingNFTSkeleton count={6} />
                        : errorLatest ? <ErrorState message={errorLatest} onRetry={fetchLatestNfts} icon={AlertTriangle} />
                        : latestActivityNFTs.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {latestActivityNFTs.map(nft => <NFTCard key={nft.id} {...nft} />)}
                            </div>
                        ) : (
                            <Card className="text-center py-12 shadow-md border-dashed">
                                <CardContent className="flex flex-col items-center">
                                    <Flame className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground">Nothing Hot Right Now</h3>
                                    <p className="text-muted-foreground mt-1">Check back soon for exciting new NFTs!</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section>
                 <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center"><Users className="mr-3 h-7 w-7 text-primary"/>New From Artists You Follow</CardTitle>
                        <CardDescription>Latest creations from artists you're connected with.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {isLoadingFollowed ? <LoadingNFTSkeleton count={3} />
                        : errorFollowed ? <ErrorState message={errorFollowed} icon={AlertTriangle} />
                        : followedArtists.size > 0 && nftsFromFollowedArtists.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {nftsFromFollowedArtists.map(nft => (
                                    <NFTCard key={`followed-${nft.id}`} {...nft} />
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12 shadow-md border-dashed bg-muted/20">
                                <CardContent className="flex flex-col items-center">
                                    <UserPlus className="mx-auto h-16 w-16 text-primary opacity-70 mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground">Follow Artists to Personalize Your Feed</h3>
                                    <p className="text-muted-foreground mt-1 max-w-md">
                                        When you follow artists, their new creations will appear here. Start by discovering talented creators!
                                    </p>
                                    <Button className="mt-6" asChild>
                                        <Link href="#artist-spotlights">Discover Artists</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                 </Card>
            </section>

            <section id="artist-spotlights">
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold">Artist Spotlights</CardTitle>
                        <CardDescription>Meet the creators shaping the digital art landscape.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {initialArtistsSpotlight.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {initialArtistsSpotlight.map(artist => {
                            const isFollowing = followedArtists.has(artist.id);
                            return (
                                <Card key={artist.id} className="shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col text-center items-center overflow-hidden border">
                                <Link href={artist.profileUrl} className="w-full block group">
                                    <div className="h-28 w-full relative">
                                        <Image
                                            src={artist.coverImageUrl || 'https://placehold.co/400x150.png?text=Cover'}
                                            alt={`${artist.name}'s cover art`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={artist.dataAiHintCover || "artist banner"}
                                        />
                                    </div>
                                    <div className="relative -mt-12 mb-2">
                                        <Image
                                            src={artist.imageUrl}
                                            alt={artist.name}
                                            width={96}
                                            height={96}
                                            className="rounded-full mx-auto border-4 border-card shadow-md object-cover group-hover:ring-2 group-hover:ring-primary transition-all"
                                            data-ai-hint={artist.dataAiHintAvatar || "artist portrait"}
                                        />
                                    </div>
                                </Link>
                                <CardHeader className="pb-2 pt-0 w-full">
                                    <CardTitle className="text-xl">
                                    <Link href={artist.profileUrl} className="hover:text-primary transition-colors">{artist.name}</Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow w-full px-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3">{artist.bio}</p>
                                </CardContent>
                                <CardFooter className="w-full p-4 pt-3">
                                    <Button 
                                    variant={isFollowing ? "secondary" : "default"} 
                                    className="w-full"
                                    onClick={() => handleFollowToggle(artist.id, artist.name)}
                                    >
                                    {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                    {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                </CardFooter>
                                </Card>
                            );
                            })}
                        </div>
                        ) : (
                            <LoadingArtistSkeleton count={4} />
                        )}
                    </CardContent>
                </Card>
            </section>

            <section id="categories">
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold">Explore Categories</CardTitle>
                        <CardDescription>Find NFTs based on your interests.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {categories.map(category => (
                            <Link
                                href={category.href}
                                key={category.name}
                                className="group flex flex-col items-center justify-center p-4 sm:p-6 border rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-card hover:bg-muted/50 aspect-[4/3] sm:aspect-square hover:border-primary"
                            >
                                <category.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                                <span className="text-sm sm:text-base font-medium text-center text-foreground group-hover:text-primary">{category.name}</span>
                            </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

             <section>
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold flex items-center"><Package className="mr-3 h-7 w-7 text-primary"/>Popular Collections</CardTitle>
                        <CardDescription>Trending and highly sought-after NFT collections.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {isLoadingPopular ? <LoadingNFTSkeleton count={3} />
                        : errorPopular ? <ErrorState message={errorPopular} onRetry={fetchPopularNfts} icon={AlertTriangle} />
                        : popularCollections.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {popularCollections.map(nft => <NFTCard key={`popular-${nft.id}`} {...nft} />)}
                            </div>
                        ) : (
                             <Card className="text-center py-12 shadow-md border-dashed">
                                <CardContent className="flex flex-col items-center">
                                    <Flame className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground">No Popular Collections</h3>
                                    <p className="text-muted-foreground mt-1">Collections will appear here as they gain popularity.</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section>
                <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0 pb-4">
                        <CardTitle className="text-2xl md:text-3xl font-bold">Community Highlights</CardTitle>
                        <CardDescription>Latest news, achievements, and events from the ArtNFT community.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0">
                        {communityHighlights.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communityHighlights.map(highlight => (
                                <Link key={highlight.id} href={highlight.href} className="block h-full group">
                                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col cursor-pointer group-hover:border-primary border">
                                        {highlight.imageUrl && (
                                        <div className="aspect-video relative w-full overflow-hidden">
                                            <Image
                                            src={highlight.imageUrl}
                                            alt={highlight.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={highlight.dataAiHint || 'community image'}
                                            />
                                        </div>
                                        )}
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center group-hover:text-primary transition-colors">
                                                <highlight.icon className="mr-2.5 h-5 w-5 text-primary flex-shrink-0"/>
                                                {highlight.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-muted-foreground line-clamp-3">{highlight.description}</p>
                                        </CardContent>
                                        <CardFooter className="pt-2 pb-4">
                                            <span className="text-sm text-primary group-hover:underline font-medium">Learn More <ArrowRight className="inline-block ml-1 h-4 w-4"/></span>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                        ) : (
                             <Card className="text-center py-12 shadow-md border-dashed">
                                <CardContent className="flex flex-col items-center">
                                    <Newspaper className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground">No Community Highlights</h3>
                                    <p className="text-muted-foreground mt-1">Stay tuned for exciting news and updates!</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
      </div>
    </AppLayout>
  );
}
    