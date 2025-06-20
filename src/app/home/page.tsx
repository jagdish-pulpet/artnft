
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NftCard, type NftProps } from '@/components/nft/nft-card';
import { Navbar } from '@/components/common/navbar';
import { BottomNavbar } from '@/components/common/bottom-navbar';
import { ArrowRight, Sparkles, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { useEffect, useState } from 'react';
import { NftCardSkeleton } from '@/components/nft/nft-card-skeleton';
import { apiService, ApiError } from '@/lib/apiService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const categories = [
  { name: 'Art', icon: <Sparkles className="mr-2 h-4 w-4" />, slug: 'art' },
  { name: 'Collectibles', icon: <TrendingUp className="mr-2 h-4 w-4" />, slug: 'collectibles' },
  { name: 'Gaming', icon: <Zap className="mr-2 h-4 w-4" />, slug: 'gaming' },
  { name: 'Photography', icon: <Sparkles className="mr-2 h-4 w-4" />, slug: 'photography' },
  { name: 'Music', icon: <TrendingUp className="mr-2 h-4 w-4" />, slug: 'music' },
  { name: 'Domains', icon: <Zap className="mr-2 h-4 w-4" />, slug: 'domains' },
];

const recentlyAddedNftsData: NftProps[] = [ 
  { id: '9', imageUrl: 'https://placehold.co/600x600.png', title: 'Starlight Peak', collectionName: 'Mountain Views', creator: 'PeakSeeker', price: '0.9 ETH', dataAiHint: 'mountain landscape' },
  { id: '10', imageUrl: 'https://placehold.co/600x600.png', title: 'Quantum Entanglement', collectionName: 'Physics Art', creator: 'SciArtist', price: '3.3 ETH', dataAiHint: 'quantum physics' },
  { id: '11', imageUrl: 'https://placehold.co/600x600.png', title: 'Ancient Guardian', collectionName: 'Lost Civilizations', creator: 'HistoryBuff', price: '1.1 ETH', dataAiHint: 'ancient statue' },
  { id: '12', imageUrl: 'https://placehold.co/600x600.png', title: 'Neon Dreams', collectionName: 'Cyberpunk City', creator: 'Nightcrawler', price: '0.7 ETH', dataAiHint: 'cyberpunk alley' },
];


export default function HomePage() {
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingRecentlyAdded, setIsLoadingRecentlyAdded] = useState(true); 
  const [trendingNfts, setTrendingNfts] = useState<NftProps[]>([]);
  const [recentlyAddedNfts, setRecentlyAddedNfts] = useState<NftProps[]>(recentlyAddedNftsData);
  const [trendingError, setTrendingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingNfts = async () => {
      setIsLoadingTrending(true);
      setTrendingError(null);
      try {
        // Assuming backend is at /api/nfts/trending and apiService prepends the base URL
        const response = await apiService.get<NftProps[]>('/nfts/trending');
        setTrendingNfts(response); // Assuming backend directly returns array of NftProps
      } catch (error) {
        console.error("Failed to fetch trending NFTs:", error);
        const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load trending NFTs.';
        setTrendingError(errorMessage);
        setTrendingNfts([]); 
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrendingNfts();

    const timerRecentlyAdded = setTimeout(() => {
      setIsLoadingRecentlyAdded(false);
    }, 1000); // Shorter delay for mock data

    return () => {
      clearTimeout(timerRecentlyAdded);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 selection:bg-accent/30 selection:text-accent-foreground pb-16 md:pb-0">
        <section className="relative h-[400px] sm:h-[500px] md:h-[calc(100vh-4rem)] max-h-[700px] w-full group overflow-hidden">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Featured NFT Collection"
            layout="fill"
            objectFit="cover"
            priority
            className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
            data-ai-hint="futuristic abstract art"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-white shadow-xl tracking-tight">
              Discover Unique Digital Art
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-primary-foreground/90 max-w-2xl font-body">
              Explore a universe of extraordinary NFTs. Collect, trade, and own the future of digital creativity.
            </p>
            <Button size="lg" className="mt-8 font-semibold text-base py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group-hover:scale-105" asChild>
              <Link href="/collections">
                View All Collections <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center sm:text-left">
              Explore Categories
            </h2>
            <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant="outline"
                  asChild
                  className="flex-shrink-0 rounded-full h-12 px-6 text-base font-medium border-2 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm"
                >
                  <Link href={`/collections?category=${category.slug}`}>
                    {category.icon}
                    {category.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center sm:text-left flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-accent" />
              Trending Listings
            </h2>
            {trendingError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{trendingError}</AlertDescription>
              </Alert>
            )}
            {isLoadingTrending ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <NftCardSkeleton key={`trending-skeleton-${index}`} />
                ))}
              </div>
            ) : trendingNfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {trendingNfts.map((nft) => (
                  <NftCard key={nft.id} {...nft} />
                ))}
              </div>
            ) : (
                !trendingError && <p className="text-center text-muted-foreground col-span-full py-8">No trending NFTs found at the moment.</p>
            )}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300" asChild>
                <Link href="/collections?filter=trending">
                  Explore More Trends <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-12 sm:py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-headline font-bold text-primary mb-8 text-center sm:text-left flex items-center">
              <Zap className="mr-3 h-8 w-8 text-accent" />
              Recently Added
            </h2>
            {isLoadingRecentlyAdded ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <NftCardSkeleton key={`recent-skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {recentlyAddedNfts.map((nft) => (
                  <NftCard key={nft.id} {...nft} />
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors duration-300" asChild>
                 <Link href="/collections?filter=newest">
                    Discover Newest NFTs <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-12 bg-card border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <Logo className="h-10 w-auto mx-auto mb-4 text-primary" />
            <p>&copy; {new Date().getFullYear()} ArtNFT Marketplace. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </main>
      <BottomNavbar />
    </>
  );
}
