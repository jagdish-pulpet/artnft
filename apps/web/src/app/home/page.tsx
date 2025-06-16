
'use client';
import { AppLayout } from '@artnft/ui';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { ArtNFTLogo } from '@artnft/ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Search as SearchIcon, Palette, Camera, Music2, ToyBrick, Globe, Bitcoin, Sparkles, Grid,
  Package, PlusSquare, Newspaper, ArrowRight, Users, Award, Flame, UserPlus, UserCheck, Activity, Bell,
  ArrowLeft, X as XIcon
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// User IDs from schema.sql
const user_001_id = 'usr_00000000-0000-0000-0000-000000000001';
const user_002_id = 'usr_00000000-0000-0000-0000-000000000002';
const user_005_id = 'usr_00000000-0000-0000-0000-000000000005';
const user_009_id = 'usr_00000000-0000-0000-0000-000000000009'; // SynthMusician
const user_010_id = 'usr_00000000-0000-0000-0000-000000000010';

// NFT IDs from schema.sql (ensure all used IDs are defined here)
const nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001';
const nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003';
const nft_id_004 = 'nft_00000000-0000-0000-0000-MOCK00000004';
const nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007';
const nft_id_008 = 'nft_00000000-0000-0000-0000-MOCK00000008';
const nft_id_009 = 'nft_00000000-0000-0000-0000-MOCK00000009';
const nft_id_012 = 'nft_00000000-0000-0000-0000-MOCK00000012';
const nft_id_019 = 'nft_00000000-0000-0000-0000-MOCK00000019';
const nft_id_020 = 'nft_00000000-0000-0000-0000-MOCK00000020';
const nft_id_021 = 'nft_00000000-0000-0000-0000-MOCK00000021';
const nft_id_022 = 'nft_00000000-0000-0000-0000-MOCK00000022';


const latestActivityNFTs: NFTCardProps[] = [
  { id: nft_id_021, imageUrl: 'https://placehold.co/400x400.png', title: 'Chillhop Beat "Sunset"', price: '0.25 ETH', artistName: 'SynthMusician', dataAiHint: 'music album' },
  { id: nft_id_020, imageUrl: 'https://placehold.co/400x400.png', title: 'Serene Lake Photograph', price: '0.7 ETH', artistName: 'ArtViewer22', dataAiHint: 'lake photo' },
  { id: nft_id_019, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Mage Character', price: '0.4 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel mage' },
  { id: nft_id_022, imageUrl: 'https://placehold.co/400x400.png', title: 'Cyberpunk Alleyway 3D', price: '2.2 ETH', artistName: 'DigitalCreatorPro', dataAiHint: 'cyberpunk city' },
  { id: nft_id_004, imageUrl: 'https://placehold.co/400x400.png', title: 'Ephemeral Light', price: '0.8 ETH', artistName: 'ArtIsLife', dataAiHint: 'abstract light' },
  { id: nft_id_009, imageUrl: 'https://placehold.co/400x400.png', title: 'Retro Wave Loop', price: '0.4 ETH', artistName: 'SynthMusician', dataAiHint: 'retro music' },
];

const popularCollections: NFTCardProps[] = [
  { id: 'col_00000000-0000-0000-0000-COLLECTION01', imageUrl: 'https://placehold.co/600x300.png', title: 'Abstract Dreams (TestUser01)', price: 'View Collection', artistName: 'TestUser01', dataAiHint: 'abstract collection' },
  { id: 'col_00000000-0000-0000-0000-COLLECTION03', imageUrl: 'https://placehold.co/600x300.png', title: 'Pixel Perfect Picks (PixelPioneer)', price: 'View Collection', artistName: 'PixelPioneer', dataAiHint: 'pixel art collection' },
  { id: 'col_00000000-0000-0000-0000-COLLECTION05', imageUrl: 'https://placehold.co/600x300.png', title: 'Cybernetic Visions (DigitalCreatorPro)', price: 'View Collection', artistName: 'DigitalCreatorPro', dataAiHint: 'cyberpunk collection' },
];

const nftsFromFollowedArtists: NFTCardProps[] = [
    { id: nft_id_003, imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver #1', price: '1.2 ETH', artistName: 'ArtIsLife', dataAiHint: 'surreal landscape' },
    { id: nft_id_012, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Forest Scene', price: '0.5 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel forest' },
    { id: nft_id_008, imageUrl: 'https://placehold.co/400x400.png', title: 'Mech Suit Alpha', price: '3.5 ETH', artistName: 'DigitalCreatorPro', dataAiHint: 'mech suit' },
];


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
  { name: 'Generative Art', icon: Sparkles, href: '/category/generative-art', dataAiHint: 'generative patterns' },
  { name: 'Pixel Art', icon: Grid, href: '/category/pixel-art', dataAiHint: '8bit character' },
];

const userName = "TestUser01"; // Placeholder for logged-in user

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
  { id: 'ch1', title: 'Artist Spotlight: PixelPioneer', description: 'Discover stunning pixel art creations by PixelPioneer.', imageUrl: 'https://placehold.co/300x150.png', dataAiHint: 'pixel artist', href: `/profile/${user_010_id}`, icon: Users },
  { id: 'ch2', title: 'Featured NFT: Cybernetic Orb', description: 'A mesmerizing 3D creation by DigitalCreatorPro. Explore the future!', imageUrl: 'https://placehold.co/300x150.png', dataAiHint: 'cyberpunk orb', href: `/nft/${nft_id_007}`, icon: Award },
  { id: 'ch3', title: 'ArtNFT Platform Update v1.3', description: 'New features including enhanced profiles and collections!', href: '#', icon: Newspaper },
];

interface ArtistSpotlightData {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  profileUrl: string;
  dataAiHint?: string;
}

const initialArtistsSpotlight: ArtistSpotlightData[] = [
  { id: user_002_id, name: 'ArtIsLife', bio: 'Creating digital dreams and exploring new artistic frontiers. Verified Artist.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: `/profile/${user_002_id}`, dataAiHint: 'artist avatar abstract' },
  { id: user_005_id, name: 'DigitalCreatorPro', bio: 'Professional digital artist specializing in 3D and motion graphics.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: `/profile/${user_005_id}`, dataAiHint: 'artist avatar 3d' },
  { id: user_010_id, name: 'PixelPioneer', bio: 'Mastering the art of pixels, one block at a time. Verified Artist.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: `/profile/${user_010_id}`, dataAiHint: 'artist avatar pixel' },
  { id: user_009_id, name: 'SynthMusician', bio: 'Creating unique soundscapes and music NFTs. Verified Artist.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: `/profile/${user_009_id}`, dataAiHint: 'artist avatar music' },
];


const SCROLL_THRESHOLD = 50;
const MIN_SCROLL_DELTA = 5;

export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set([user_002_id, user_010_id]));
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initialScrollY = window.scrollY;
    setLastScrollY(initialScrollY);
    if (initialScrollY > SCROLL_THRESHOLD) {
      setIsHeaderVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isMobileSearchActive) {
        setIsHeaderVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      if (currentScrollY <= SCROLL_THRESHOLD) {
        setIsHeaderVisible(true);
      } else {
        if (currentScrollY > lastScrollY && (currentScrollY - lastScrollY) > MIN_SCROLL_DELTA) {
          setIsHeaderVisible(false);
        } else if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY) > MIN_SCROLL_DELTA) {
          setIsHeaderVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileSearchActive]);

  useEffect(() => {
    if (isMobileSearchActive && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchActive]);

  const handleFollowToggle = (artistId: string, artistName: string) => {
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

  const handleSearchSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (isMobileSearchActive) {
        setIsMobileSearchActive(false);
      }
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchActive(prev => !prev);
    if (isMobileSearchActive) setSearchTerm('');
  };

  return (
    <AppLayout>
      <div className="max-w-full md:max-w-7xl mx-auto">
        {/* Mobile-only Header */}
        <header className={cn(
          "sticky top-0 bg-background z-20 border-b px-4 md:hidden", // Added md:hidden
          "transition-transform duration-300 ease-in-out",
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full',
          isMobileSearchActive ? 'h-16 py-0' : 'py-3' // Removed md:h-auto as it's mobile only
        )}>
          <div className={cn(
            "flex items-center w-full h-full",
            isMobileSearchActive ? "justify-between gap-2" : "justify-between"
          )}>

            {isMobileSearchActive && (
              <>
                <Button variant="ghost" size="icon" onClick={toggleMobileSearch} className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <form onSubmit={handleSearchSubmit} className="flex-grow relative">
                  <Input
                    ref={mobileSearchInputRef}
                    type="search"
                    placeholder="Search ArtNFT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pr-10"
                    autoFocus
                  />
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10"
                      aria-label="Clear search"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </form>
                <Button type="submit" onClick={() => handleSearchSubmit()} size="icon" className="shrink-0">
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </>
            )}

            {!isMobileSearchActive && (
              <>
                <div className="flex items-center">
                  <ArtNFTLogo />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMobileSearch}>
                    <SearchIcon className="h-5 w-5" />
                  </Button>
                  {/* Desktop user info and Bell icon are handled by GlobalHeader in AppLayout for md+ screens */}
                </div>
              </>
            )}
          </div>
        </header>

        <div className={cn("px-4 md:px-0 space-y-12", isMobileSearchActive ? "pt-4" : "pt-6 md:pt-0")}>

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
                {latestActivityNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {latestActivityNFTs.map(nft => (
                            <NFTCard key={nft.id} {...nft} />
                        ))}
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
                {followedArtists.size > 0 ? (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularCollections.map(nft => (
                        <NFTCard key={`trending-${nft.id}`} {...nft} title={`${nft.title}`} />
                    ))}
                     {popularCollections.length === 0 && <p className="text-muted-foreground">No popular collections right now.</p>}
                </div>
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
