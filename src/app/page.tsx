import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const featuredNfts = mockNfts.slice(0, 4); // Display first 4 as featured

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-primary rounded-lg shadow-md">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary-foreground mb-4">Discover Unique Digital Art</h1>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Explore, collect, and create extraordinary NFTs. ArtNFT is your gateway to the future of digital ownership.
        </p>
        <Link href="/search" passHref legacyBehavior>
          <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Explore Marketplace
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center">Featured NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNfts.map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
        </div>
      </section>

      <section className="bg-card p-8 rounded-lg shadow-md text-center">
        <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
        <h2 className="text-3xl font-headline font-semibold mb-4">Personalized Recommendations</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Let our AI guide you to NFTs you&apos;ll love. Discover artworks tailored to your unique taste.
        </p>
        <Link href="/recommendations" passHref legacyBehavior>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get My Recommendations
          </Button>
        </Link>
      </section>
    </div>
  );
}
