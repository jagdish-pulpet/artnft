
'use client';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Search as SearchIcon, Palette, Camera, Music2, ToyBrick, Globe, Bitcoin,
  Package, PlusSquare, Newspaper, ArrowRight, Users, Award, Flame, UserPlus, UserCheck, Activity, Bell, AlertTriangle, Loader2
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
import { useRouter } from 'next/navigation'; // Added import


const LoadingNFTSkeleton = ({ count = 3 }: { count?: number}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {Array(count).fill(0).map((_,i) => (
      <Card key={`skel-nft-${i}`} className="shadow-lg">
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

const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <Card className="text-center py-12 border-destructive bg-destructive/10">
    <CardContent className="flex flex-col items-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-xl font-semibold text-destructive">Could not load NFTs</h3>
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
  { id: 'ch1', title: 'New Artist Spotlight: @PixelPainter', description: 'Discover stunning pixel art creations.', imageUrl: 'https://placehold.co/300x150.png', dataAiHint: 'pixel artist', href: '/artist/pixelpainter', icon: Users },
  { id: 'ch2', title: 'Upcoming Auction: "Genesis Block"', description: 'A rare collection from the early days of NFTs.', href: '/auction/genesis-block', icon: Award },
  { id: 'ch3', title: 'ArtNFT Platform Update v1.2', description: 'New features and improvements are here!', href: '/blog/update-v1-2', icon: Newspaper },
];

interface ArtistSpotlightData {
  id: string; // This would be the profile ID (user UUID)
  name: string; // username from profiles table
  bio: string;
  imageUrl: string; // avatar_url from profiles table
  profileUrl: string; // e.g., /profile/[id] or /artist/[username]
  dataAiHint?: string;
}

const initialArtistsSpotlight: ArtistSpotlightData[] = [ // This should also be fetched
  { id: 'artist1', name: 'PixelPioneer', bio: 'Crafting digital worlds, one pixel at a time. Exploring the vast expanse of creativity in the digital realm.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/pixelpioneer', dataAiHint: 'artist avatar' },
  { id: 'artist2', name: 'AI Alchemist', bio: 'Fusing art and artificial intelligence to create new forms of expression.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/aialchemist', dataAiHint: 'robot artist' },
  { id: 'artist3', name: 'AbstractDreamer', bio: 'Exploring the subconscious through vibrant colors and surreal forms.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/abstractdreamer', dataAiHint: 'abstract portrait' },
  { id: 'artist4', name: 'SynthwaveSurfer', bio: 'Riding the retro-futuristic sound waves with neon-drenched visuals.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/synthwavesurfer', dataAiHint: 'retro musician' },
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

  const [popularCollections, setPopularCollections] = useState<NFTCardProps[]>([]); // Placeholder, can fetch similarly
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [errorPopular, setErrorPopular] = useState<string | null>(null);
  
  const [nftsFromFollowedArtists, setNftsFromFollowedArtists] = useState<NFTCardProps[]>([]); // Placeholder

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
      setProfileUsername('Guest'); // Or handle guest state more explicitly
    }
  }, []);

  const fetchLatestNfts = useCallback(async () => {
    setIsLoadingLatest(true);
    setErrorLatest(null);
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name, status') // Ensure artist_name is selected
        .eq('status', 'listed')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      const formattedNfts: NFTCardProps[] = data.map(nft => ({
        id: nft.id,
        imageUrl: nft.image_url || 'https://placehold.co/400x400.png',
        title: nft.title,
        price: nft.price ? `${nft.price} ETH` : 'N/A',
        artistName: nft.artist_name || 'Unknown Artist',
        dataAiHint: 'nft image' // Generic hint for now
      }));
      setLatestActivityNFTs(formattedNfts);
    } catch (err: any) {
      console.error("Error fetching latest NFTs:", err);
      setErrorLatest(err.message || "Could not fetch latest NFTs.");
    } finally {
      setIsLoadingLatest(false);
    }
  }, []);

  const fetchPopularNfts = useCallback(async () => { // Placeholder for "Popular"
    setIsLoadingPopular(true);
    setErrorPopular(null);
    try {
      const { data, error } = await supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name, status')
        .eq('status', 'listed')
        .order('created_at', { ascending: true }) // Different order for variety
        .limit(3);

      if (error) throw error;
      const formattedNfts: NFTCardProps[] = data.map(nft => ({
        id: nft.id,
        imageUrl: nft.image_url || 'https://placehold.co/400x400.png',
        title: nft.title,
        price: nft.price ? `${nft.price} ETH` : 'N/A',
        artistName: nft.artist_name || 'Unknown Artist',
        dataAiHint: 'nft image'
      }));
      setPopularCollections(formattedNfts);
    } catch (err: any) {
      console.error("Error fetching popular NFTs:", err);
      setErrorPopular(err.message || "Could not fetch popular NFTs.");
    } finally {
      setIsLoadingPopular(false);
    }
  }, []);


  useEffect(() => {
    fetchUserAndProfile();
    fetchLatestNfts();
    fetchPopularNfts(); // Fetch "popular" (recent for now)
    
    // Simulate fetching NFTs from followed artists - replace with actual logic
    const mockFollowedNfts: NFTCardProps[] = [
        { id: 'follow1', imageUrl: 'https://placehold.co/400x400.png', title: 'AI Dreams #1', price: '1.0 ETH', artistName: 'AI Alchemist', dataAiHint: 'robot art' },
        { id: 'follow2', imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Adventure', price: '0.6 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel game character' },
    ];
    setNftsFromFollowedArtists(mockFollowedNfts);


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
  }, [fetchUserAndProfile, fetchLatestNfts, fetchPopularNfts, lastScrollY]); // Added lastScrollY

  const handleFollowToggle = (artistId: string, artistName: string) => {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Login Required", description: "Please log in to follow artists."});
      router.push('/login');
      return;
    }
    // Simulate follow/unfollow logic. In a real app, this would update backend.
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
          "flex flex-col md:flex-row justify-between items-center mb-6 py-3 sticky top-0 bg-background/90 backdrop-blur-md z-20 px-4 md:px-0 border-b",
          "transition-transform duration-300 ease-in-out",
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
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

        <div className="px-4 md:px-0 space-y-12">
            <section className="relative bg-muted/30 rounded-lg overflow-hidden p-8 md:p-12 text-center md:text-left shadow-lg">
                <div className="absolute inset-0 opacity-10 z-0">
                    <Image 
                        src="https://placehold.co/1200x400.png" 
                        alt="Abstract background" 
                        fill 
                        className="object-cover" 
                        data-ai-hint="abstract background"
                        priority
                    />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
                            Discover, Create & Trade Unique NFTs
                        </h1>
                        <p className="text-lg text-foreground/80 mb-8">
                            The premier marketplace for digital artists and collectors. Explore a universe of creativity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                                <Link href="/search">Explore Marketplace <ArrowRight className="ml-2 h-5 w-5"/></Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/create-nft">Create Your NFT <PlusSquare className="ml-2 h-5 w-5"/></Link>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <Image src="https://placehold.co/500x350.png" alt="Featured NFT" width={500} height={350} className="rounded-lg shadow-2xl" data-ai-hint="modern digital art"/>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center"><Activity className="mr-3 h-7 w-7 text-primary"/>Latest Activity</h2>
                {isLoadingLatest ? <LoadingNFTSkeleton count={6} />
                  : errorLatest ? <ErrorState message={errorLatest} onRetry={fetchLatestNfts} />
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
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center"><Users className="mr-3 h-7 w-7 text-primary"/>New From Artists You Follow</h2>
                {/* This section currently uses mock data - needs integration */}
                {followedArtists.size > 0 && nftsFromFollowedArtists.length > 0 ? (
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
            </section>

            <section id="artist-spotlights">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Artist Spotlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {initialArtistsSpotlight.map(artist => {
                  const isFollowing = followedArtists.has(artist.id);
                  return (
                    <Card key={artist.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col text-center items-center">
                      <Link href={artist.profileUrl} className="w-full pt-6 block">
                        <Image
                          src={artist.imageUrl}
                          alt={artist.name}
                          width={80}
                          height={80}
                          className="rounded-full mx-auto border-2 border-primary/50 object-cover hover:opacity-90 transition-opacity"
                          data-ai-hint={artist.dataAiHint || "artist portrait"}
                        />
                      </Link>
                      <CardHeader className="pb-2 pt-4 w-full">
                        <CardTitle className="text-lg">
                          <Link href={artist.profileUrl} className="hover:text-primary">{artist.name}</Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow w-full px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                      </CardContent>
                      <CardFooter className="w-full p-4 pt-2">
                        <Button 
                          variant={isFollowing ? "secondary" : "default"} 
                          size="sm" 
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
                {initialArtistsSpotlight.length === 0 && <p className="text-muted-foreground">Discover new artists soon!</p>}
              </div>
            </section>

            <section id="categories">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Explore Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {categories.map(category => (
                    <Link
                        href={category.href}
                        key={category.name}
                        className="group flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-lg transition-all duration-300 bg-card hover:bg-muted/50 aspect-[3/2] sm:aspect-square hover:border-primary"
                    >
                        <category.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
                        <span className="text-sm font-medium text-center text-foreground group-hover:text-primary">{category.name}</span>
                    </Link>
                    ))}
                </div>
            </section>

             <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                    <Package className="mr-3 h-7 w-7 text-primary"/>Popular Collections
                </h2>
                 {isLoadingPopular ? <LoadingNFTSkeleton count={3} />
                  : errorPopular ? <ErrorState message={errorPopular} onRetry={fetchPopularNfts} />
                  : popularCollections.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularCollections.map(nft => <NFTCard key={`popular-${nft.id}`} {...nft} />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No popular collections right now.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Community Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityHighlights.map(highlight => (
                    <Link key={highlight.id} href={highlight.href} className="block h-full group">
                        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer group-hover:border-primary">
                            {highlight.imageUrl && (
                            <div className="aspect-[2/1] relative w-full">
                                <Image
                                  src={highlight.imageUrl}
                                  alt={highlight.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                  data-ai-hint={highlight.dataAiHint || 'community image'}
                                />
                            </div>
                            )}
                            <CardHeader>
                            <CardTitle className="text-lg flex items-center group-hover:text-primary"><highlight.icon className="mr-2 h-5 w-5 text-primary group-hover:text-primary"/>{highlight.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">{highlight.description}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="link" className="p-0 h-auto text-primary group-hover:underline">Learn More <ArrowRight className="ml-1 h-4 w-4"/></Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
                 {communityHighlights.length === 0 && <p className="text-muted-foreground">No community highlights to show.</p>}
                </div>
            </section>
        </div>
      </div>
    </AppLayout>
  );
}
    
