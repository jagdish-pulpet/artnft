
import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus } from 'lucide-react';

export default function HomePage() {
  const featuredNfts = mockNfts.slice(0, 4); 

  return (
    <div className="space-y-12 relative">
      <section className="text-center py-8 sm:py-12 bg-primary rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-4">Welcome to ArtNFT</h1>
        <p className="text-base sm:text-lg text-primary-foreground/80 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4">
          Explore featured collections and discover your next favorite digital artwork.
        </p>
        <Link href="/search">
          <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Explore Full Marketplace
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-center">Featured NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredNfts.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>

      <section className="bg-card p-6 sm:p-8 rounded-lg shadow-md text-center">
        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-3 sm:mb-4" />
        <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-3 sm:mb-4">Personalized Recommendations</h2>
        <p className="text-muted-foreground mb-6 max-w-lg sm:max-w-xl mx-auto px-4">
          Let our AI guide you to NFTs you&apos;ll love. Discover artworks tailored to your unique taste.
        </p>
        <Link href="/recommendations">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get My Recommendations
          </Button>
        </Link>
      </section>

      {/* Floating Action Button */}
      <Link href="/create" className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-30 block">
        <Button
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-xl bg-accent text-accent-foreground hover:bg-accent/80 focus:ring-2 focus:ring-accent focus:ring-offset-2 flex items-center justify-center transition-transform hover:scale-110"
          aria-label="Create NFT"
          title="Create NFT"
        >
          <Plus className="h-7 w-7 sm:h-8 sm:w-8" />
        </Button>
      </Link>
    </div>
  );
}
