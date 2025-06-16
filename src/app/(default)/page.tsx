import NFTCard from '@/components/nft-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const featuredNfts = [
  { id: '1', imageUrl: 'https://placehold.co/600x600.png', title: 'Cosmic Dream', artist: 'StarGazer', price: '1.5 ETH', aiHint: 'galaxy stars' },
  { id: '2', imageUrl: 'https://placehold.co/600x600.png', title: 'Abstract Flow', artist: 'FluidArtist', price: '0.8 ETH', aiHint: 'abstract colorful' },
  { id: '3', imageUrl: 'https://placehold.co/600x600.png', title: 'Cyber Cityscape', artist: 'NeonArchitect', price: '2.2 ETH', aiHint: 'cyberpunk city' },
  { id: '4', imageUrl: 'https://placehold.co/600x600.png', title: 'Nature\'s Whisper', artist: 'EcoSprite', price: '1.0 ETH', aiHint: 'forest nature' },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center py-16 md:py-24 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Discover, Create, and Trade Unique <span className="text-accent">Digital Art</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            ArtNFT is your premier destination for one-of-a-kind digital collectibles. Explore a vibrant marketplace or unleash your creativity and mint your own NFTs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 px-8 py-3 w-full sm:w-auto">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 px-8 py-3 w-full sm:w-auto">
              <Link href="/create">Create Your NFT</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-semibold mb-10 text-center text-foreground">Featured NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredNfts.map(nft => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </div>
        <div className="text-center mt-12">
            <Button variant="link" asChild className="text-lg text-accent hover:text-accent/80 transition-colors">
                <Link href="/marketplace">
                    View All NFTs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
