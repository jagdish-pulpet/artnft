
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AppLayout from '@/components/AppLayout';
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Frown } from 'lucide-react';

// Define mock NFT data for each category
const categorySpecificNFTs: Record<string, { pageTitle: string; description: string; nfts: NFTCardProps[] }> = {
  'digital-art': {
    pageTitle: 'Digital Art',
    description: 'Explore the vibrant world of digital creations, from abstract masterpieces to intricate illustrations.',
    nfts: [
      { id: 'da1', imageUrl: 'https://placehold.co/400x400.png', title: 'Chromatic Aberration', price: '1.2 ETH', artistName: 'ArtBot', dataAiHint: 'abstract glitch' },
      { id: 'da2', imageUrl: 'https://placehold.co/400x400.png', title: 'Geometric Dreams', price: '0.8 ETH', artistName: 'ShapeShifter', dataAiHint: 'geometric pattern' },
      { id: 'da3', imageUrl: 'https://placehold.co/400x400.png', title: 'Cyberflora', price: '2.1 ETH', artistName: 'FutureArt', dataAiHint: 'cyberpunk nature' },
      { id: 'da4', imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Portal', price: '0.5 ETH', artistName: '8BitArtist', dataAiHint: 'pixel art' },
    ],
  },
  'photography': {
    pageTitle: 'Photography',
    description: 'Discover breathtaking moments captured through the lens, from stunning landscapes to poignant portraits.',
    nfts: [
      { id: 'ph1', imageUrl: 'https://placehold.co/400x400.png', title: 'Mountain Serenity', price: '2.0 ETH', artistName: 'LensQueen', dataAiHint: 'mountain landscape' },
      { id: 'ph2', imageUrl: 'https://placehold.co/400x400.png', title: 'Urban Echoes', price: '1.5 ETH', artistName: 'CityScaper', dataAiHint: 'city street' },
      { id: 'ph3', imageUrl: 'https://placehold.co/400x400.png', title: 'Wildlife Portrait', price: '1.8 ETH', artistName: 'NatureView', dataAiHint: 'animal photography' },
      { id: 'ph4', imageUrl: 'https://placehold.co/400x400.png', title: 'Coastal Dreams', price: '1.3 ETH', artistName: 'OceanSnaps', dataAiHint: 'beach sunset' },
    ],
  },
  'music': {
    pageTitle: 'Music NFTs',
    description: 'Own exclusive audio experiences, from chart-topping tracks to unreleased demos and soundscapes.',
    nfts: [
      { id: 'mu1', imageUrl: 'https://placehold.co/400x400.png', title: 'Synthwave Anthem', price: '0.7 ETH', artistName: 'BeatMaster', dataAiHint: 'music album cover' },
      { id: 'mu2', imageUrl: 'https://placehold.co/400x400.png', title: 'Acoustic Melodies', price: '0.4 ETH', artistName: 'SongBird', dataAiHint: 'guitar instrument' },
      { id: 'mu3', imageUrl: 'https://placehold.co/400x400.png', title: 'Lo-Fi Beats Pack', price: '1.0 ETH', artistName: 'ChillHopProducer', dataAiHint: 'headphones audio' },
      { id: 'mu4', imageUrl: 'https://placehold.co/400x400.png', title: 'Live Concert Access Token', price: '2.5 ETH', artistName: 'RockStar', dataAiHint: 'concert stage' },
    ],
  },
  'collectibles': {
    pageTitle: 'Digital Collectibles',
    description: 'Find rare and unique digital items, from iconic characters to limited edition virtual memorabilia.',
    nfts: [
      { id: 'co1', imageUrl: 'https://placehold.co/400x400.png', title: 'Retro Gaming Character', price: '1.1 ETH', artistName: 'CollectorVerse', dataAiHint: 'retro game' },
      { id: 'co2', imageUrl: 'https://placehold.co/400x400.png', title: 'Limited Edition Badge', price: '0.6 ETH', artistName: 'BadgeCreator', dataAiHint: 'collectible badge' },
      { id: 'co3', imageUrl: 'https://placehold.co/400x400.png', title: 'Virtual Pet Alien', price: '1.4 ETH', artistName: 'ToyMaster', dataAiHint: 'alien creature' },
      { id: 'co4', imageUrl: 'https://placehold.co/400x400.png', title: 'Animated Series Figure', price: '1.9 ETH', artistName: 'CartoonFan', dataAiHint: 'cartoon character' },
    ],
  },
  'virtual-worlds': {
    pageTitle: 'Virtual World Assets',
    description: 'Acquire land, wearables, and items for your favorite metaverses and virtual environments.',
    nfts: [
      { id: 'vw1', imageUrl: 'https://placehold.co/400x400.png', title: 'Metaverse Land Parcel', price: '3.5 ETH', artistName: 'WorldBuilder', dataAiHint: 'metaverse landscape' },
      { id: 'vw2', imageUrl: 'https://placehold.co/400x400.png', title: 'Cyberpunk Avatar Outfit', price: '0.9 ETH', artistName: 'DigitalTailor', dataAiHint: 'virtual avatar' },
      { id: 'vw3', imageUrl: 'https://placehold.co/400x400.png', title: 'Sci-Fi Vehicle Skin', price: '1.2 ETH', artistName: 'MechDesigner', dataAiHint: 'futuristic vehicle' },
      { id: 'vw4', imageUrl: 'https://placehold.co/400x400.png', title: 'Fantasy Realm Portal Key', price: '2.0 ETH', artistName: 'GateKeeper', dataAiHint: 'fantasy portal' },
    ],
  },
  'utility-tokens': {
    pageTitle: 'Utility Tokens',
    description: 'Explore NFTs that grant access, perks, or functionalities within various digital ecosystems.',
    nfts: [
      { id: 'ut1', imageUrl: 'https://placehold.co/400x400.png', title: 'DAO Governance Token', price: 'N/A (Vote)', artistName: 'CommunityDAO', dataAiHint: 'governance token' },
      { id: 'ut2', imageUrl: 'https://placehold.co/400x400.png', title: 'Exclusive Content Pass', price: '1.0 ETH', artistName: 'CreatorHub', dataAiHint: 'access pass' },
      { id: 'ut3', imageUrl: 'https://placehold.co/400x400.png', title: 'In-Game Item Mint Pass', price: '0.5 ETH', artistName: 'GameDevs', dataAiHint: 'gaming item' },
      { id: 'ut4', imageUrl: 'https://placehold.co/400x400.png', title: 'Membership Access Card', price: '2.2 ETH', artistName: 'ClubDAO', dataAiHint: 'membership card' },
    ],
  },
};

// Helper to format slug to title (e.g., "digital-art" -> "Digital Art")
function slugToTitle(slug: string): string {
    if (categorySpecificNFTs[slug]) {
        return categorySpecificNFTs[slug].pageTitle;
    }
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const category = categorySpecificNFTs[slug];
  const pageTitle = category ? category.pageTitle : slugToTitle(slug);
  const pageDescription = category ? category.description : 'Browse items in this category.';


  if (!category) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/home">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </Button>
          <Card className="text-center py-12 shadow-xl border-border">
            <CardContent className="flex flex-col items-center">
              <Frown className="mx-auto h-16 w-16 text-destructive mb-4" />
              <h1 className="text-3xl font-bold font-headline text-foreground">Category Not Found</h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                Oops! We couldn't find the category you were looking for.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/home">Explore Other Categories</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
            <Button variant="outline" asChild className="mb-4 text-sm">
                <Link href="/home#categories"> {/* Assuming you have an id="categories" on the home page section */}
                <ChevronLeft className="h-4 w-4 mr-2" /> All Categories
                </Link>
            </Button>
            <h1 className="text-4xl font-bold font-headline text-primary">{pageTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        {category.nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.nfts.map(nft => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 shadow-md border-dashed">
            <CardContent className="flex flex-col items-center">
              <Image src="https://placehold.co/150x150.png" alt="No NFTs" width={150} height={150} className="opacity-50 mb-4 rounded" data-ai-hint="empty box" />
              <h3 className="text-xl font-semibold text-foreground">No NFTs Yet</h3>
              <p className="text-muted-foreground mt-1">
                There are currently no NFTs listed in the "{pageTitle}" category. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

    