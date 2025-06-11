
'use client';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import ArtNFTLogo from '@/components/ArtNFTLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Search as SearchIcon, Palette, Camera, Music2, ToyBrick, Globe, Bitcoin,
  Package, PlusSquare, Newspaper, ArrowRight, Users, Award, Flame, UserPlus, UserCheck, Activity, Bell
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const latestActivityNFTs: NFTCardProps[] = [
  { id: '1', imageUrl: 'https://placehold.co/400x400.png', title: 'Abstract Flow', price: '1.5 ETH', artistName: 'VisionaryArtist', dataAiHint: 'abstract colorful' },
  { id: '2', imageUrl: 'https://placehold.co/400x400.png', title: 'Cyber Dreams', price: '2.2 ETH', artistName: 'DigitalSculptor', dataAiHint: 'cyberpunk neon' },
  { id: '3', imageUrl: 'https://placehold.co/400x400.png', title: 'Pixelated Serenity', price: '0.8 ETH', artistName: '8BitWonder', dataAiHint: 'pixel art' },
  { id: '4', imageUrl: 'https://placehold.co/400x400.png', title: 'Cosmic Explorer', price: '3.0 ETH', artistName: 'GalaxyPainter', dataAiHint: 'space galaxy' },
  { id: '5', imageUrl: 'https://placehold.co/400x400.png', title: 'Nature\'s Code', price: '1.2 ETH', artistName: 'EcoDigital', dataAiHint: 'nature technology' },
  { id: '6', imageUrl: 'https://placehold.co/400x400.png', title: 'Future Relic', price: '2.5 ETH', artistName: 'AncientAI', dataAiHint: 'futuristic artifact' },
];

const popularCollections: NFTCardProps[] = [
  latestActivityNFTs[1], latestActivityNFTs[3], latestActivityNFTs[0]
];

const nftsFromFollowedArtists: NFTCardProps[] = [
    { id: 'follow1', imageUrl: 'https://placehold.co/400x400.png', title: 'AI Dreams #1', price: '1.0 ETH', artistName: 'AI Alchemist', dataAiHint: 'robot art' },
    { id: 'follow2', imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Adventure', price: '0.6 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel game character' },
    { id: 'follow3', imageUrl: 'https://placehold.co/400x400.png', title: 'Retro Future Car', price: '1.8 ETH', artistName: 'SynthwaveSurfer', dataAiHint: 'retro car' },
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
];

const userName = "CreativeUser123";

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
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  profileUrl: string;
  dataAiHint?: string;
}

const initialArtistsSpotlight: ArtistSpotlightData[] = [
  { id: 'artist1', name: 'PixelPioneer', bio: 'Crafting digital worlds, one pixel at a time. Exploring the vast expanse of creativity in the digital realm.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/pixelpioneer', dataAiHint: 'artist avatar' },
  { id: 'artist2', name: 'AI Alchemist', bio: 'Fusing art and artificial intelligence to create new forms of expression.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/aialchemist', dataAiHint: 'robot artist' },
  { id: 'artist3', name: 'AbstractDreamer', bio: 'Exploring the subconscious through vibrant colors and surreal forms.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/abstractdreamer', dataAiHint: 'abstract portrait' },
  { id: 'artist4', name: 'SynthwaveSurfer', bio: 'Riding the retro-futuristic sound waves with neon-drenched visuals.', imageUrl: 'https://placehold.co/100x100.png', profileUrl: '/artist/synthwavesurfer', dataAiHint: 'retro musician' },
];


const SCROLL_THRESHOLD = 50;
const MIN_SCROLL_DELTA = 5;

export default function HomePage() {
  const { toast } = useToast();
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
  }, [lastScrollY]);


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

  return (
    <AppLayout>
      <div className="max-w-full md:max-w-7xl mx-auto">
        <header className={cn(
          "flex flex-col md:flex-row justify-between items-center mb-6 py-3 sticky top-0 bg-background z-20 px-4 md:px-0 border-b",
          "transition-transform duration-300 ease-in-out",
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        )}>
          <div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
            <ArtNFTLogo />
          </div>
          <div className="flex items-center w-full md:w-auto md:flex-grow md:justify-center px-0 md:px-4">
            <div className="flex items-center flex-grow max-w-xs sm:max-w-sm md:max-w-md">
              <Input
                type="search"
                placeholder="Search anything..."
                className="flex-grow"
              />
              <Button variant="default" size="icon" className="ml-2 shrink-0">
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/profile" className="hover:text-primary transition-colors">
              <div className="text-right">
                  <p className="text-xs text-muted-foreground">Hello,</p>
                  <p className="text-sm font-semibold text-foreground -mt-1">{userName}</p>
              </div>
            </Link>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                </Link>
            </Button>
          </div>
        </header>

        <div className="px-4 md:px-0 space-y-12">

            {/* Hero Section */}
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

            {/* Latest Activity */}
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

            {/* New From Artists You Follow Section */}
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

            {/* Artist Spotlight Section */}
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

            {/* Explore Categories Section */}
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

            {/* Popular Collections Section */}
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

            {/* Community Highlights Section */}
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
    
