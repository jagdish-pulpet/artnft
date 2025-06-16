
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@artnft/ui'; // Updated import
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Frown, Palette, Camera, Music2, ToyBrick, Globe, Bitcoin, Sparkles as SparklesIcon, Grid as GridIcon } from 'lucide-react'; 

// IDs from schema.sql
const nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001';
const nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003';
const nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007';
const nft_id_022 = 'nft_00000000-0000-0000-0000-MOCK00000022';

const nft_id_004 = 'nft_00000000-0000-0000-0000-MOCK00000004';
const nft_id_015 = 'nft_00000000-0000-0000-0000-MOCK00000015';
const nft_id_020 = 'nft_00000000-0000-0000-0000-MOCK00000020';

const nft_id_009 = 'nft_00000000-0000-0000-0000-MOCK00000009';
const nft_id_010 = 'nft_00000000-0000-0000-0000-MOCK00000010';
const nft_id_021 = 'nft_00000000-0000-0000-0000-MOCK00000021';

const nft_id_006 = 'nft_00000000-0000-0000-0000-MOCK00000006';
const nft_id_025 = 'nft_00000000-0000-0000-0000-MOCK00000025';

const nft_id_017 = 'nft_00000000-0000-0000-0000-MOCK00000017';

const nft_id_016 = 'nft_00000000-0000-0000-0000-MOCK00000016';
const nft_id_024 = 'nft_00000000-0000-0000-0000-MOCK00000024';

const nft_id_014 = 'nft_00000000-0000-0000-0000-MOCK00000014';
const nft_id_023 = 'nft_00000000-0000-0000-0000-MOCK00000023';

const nft_id_002 = 'nft_00000000-0000-0000-0000-MOCK00000002';
const nft_id_011 = 'nft_00000000-0000-0000-0000-MOCK00000011';
const nft_id_013 = 'nft_00000000-0000-0000-0000-MOCK00000013';
const nft_id_019 = 'nft_00000000-0000-0000-0000-MOCK00000019';

// Define mock NFT data for each category based on schema.sql
const categorySpecificNFTs: Record<string, { pageTitle: string; description: string; nfts: NFTCardProps[] }> = {
  'digital-art': {
    pageTitle: 'Digital Art',
    description: 'Explore the vibrant world of digital creations, from abstract masterpieces to intricate illustrations.',
    nfts: [
      { id: nft_id_001, imageUrl: 'https://placehold.co/400x400.png', title: 'My First Abstract', price: '0.5 ETH', artistName: 'TestUser01', dataAiHint: 'abstract colorful' },
      { id: nft_id_003, imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver #1', price: '1.2 ETH', artistName: 'ArtIsLife', dataAiHint: 'surreal landscape' },
      { id: nft_id_007, imageUrl: 'https://placehold.co/400x400.png', title: 'Cybernetic Orb', price: '2.0 ETH', artistName: 'DigitalCreatorPro', dataAiHint: '3d orb' },
      { id: nft_id_022, imageUrl: 'https://placehold.co/400x400.png', title: 'Cyberpunk Alleyway 3D', price: '2.2 ETH', artistName: 'DigitalCreatorPro', dataAiHint: 'cyberpunk city' },
    ],
  },
  'photography': {
    pageTitle: 'Photography',
    description: 'Discover breathtaking moments captured through the lens, from stunning landscapes to poignant portraits.',
    nfts: [
      { id: nft_id_004, imageUrl: 'https://placehold.co/400x400.png', title: 'Ephemeral Light', price: '0.8 ETH', artistName: 'ArtIsLife', dataAiHint: 'abstract light photo' },
      { id: nft_id_015, imageUrl: 'https://placehold.co/400x400.png', title: 'Mountain Vista Photo', price: '0.9 ETH', artistName: 'ArtViewer22', dataAiHint: 'mountain photography' },
      { id: nft_id_020, imageUrl: 'https://placehold.co/400x400.png', title: 'Serene Lake Photograph', price: '0.7 ETH', artistName: 'ArtViewer22', dataAiHint: 'lake photo' },
    ],
  },
  'music': {
    pageTitle: 'Music NFTs',
    description: 'Own exclusive audio experiences, from chart-topping tracks to unreleased demos and soundscapes.',
    nfts: [
      { id: nft_id_009, imageUrl: 'https://placehold.co/400x400.png', title: 'Retro Wave Loop', price: '0.4 ETH', artistName: 'SynthMusician', dataAiHint: 'synthwave music' },
      { id: nft_id_010, imageUrl: 'https://placehold.co/400x400.png', title: '80s Nostalgia Beat', price: '0.6 ETH', artistName: 'SynthMusician', dataAiHint: '80s beat' },
      { id: nft_id_021, imageUrl: 'https://placehold.co/400x400.png', title: 'Chillhop Beat "Sunset"', price: '0.25 ETH', artistName: 'SynthMusician', dataAiHint: 'chillhop music' },
    ],
  },
  'collectibles': {
    pageTitle: 'Digital Collectibles',
    description: 'Find rare and unique digital items, from iconic characters to limited edition virtual memorabilia.',
    nfts: [
      { id: nft_id_006, imageUrl: 'https://placehold.co/400x400.png', title: 'Vintage Robot', price: '0.75 ETH', artistName: 'NFTCollectorGal', dataAiHint: 'retro robot' },
      { id: nft_id_025, imageUrl: 'https://placehold.co/400x400.png', title: 'Collectible Card #007', price: '0.35 ETH', artistName: 'NFTCollectorGal', dataAiHint: 'collectible card' },
    ],
  },
  'virtual-worlds': {
    pageTitle: 'Virtual World Assets',
    description: 'Acquire land, wearables, and items for your favorite metaverses and virtual environments.',
    nfts: [
      { id: nft_id_017, imageUrl: 'https://placehold.co/400x400.png', title: 'Lost Temple - Game Asset', price: '1.8 ETH', artistName: 'UXDesignerArt', dataAiHint: '3d game asset' },
    ],
  },
  'utility-tokens': {
    pageTitle: 'Utility Tokens',
    description: 'Explore NFTs that grant access, perks, or functionalities within various digital ecosystems.',
    nfts: [
      { id: nft_id_016, imageUrl: 'https://placehold.co/400x400.png', title: 'VR Gallery Access Key', price: '2.5 ETH', artistName: 'NFTInvestorX', dataAiHint: 'vr utility' },
      { id: nft_id_024, imageUrl: 'https://placehold.co/400x400.png', title: 'Utility Key - Beta Access', price: '1.1 ETH', artistName: 'NFTInvestorX', dataAiHint: 'utility key' },
    ],
  },
  'generative-art': {
    pageTitle: 'Generative Art',
    description: 'Art created using autonomous systems, often involving algorithms and code.',
    nfts: [
      { id: nft_id_014, imageUrl: 'https://placehold.co/400x400.png', title: 'Generative Swirls #7', price: '1.0 ETH', artistName: 'CryptoGallery', dataAiHint: 'generative art' },
      { id: nft_id_023, imageUrl: 'https://placehold.co/400x400.png', title: 'Generative Patterns Alpha', price: '0.9 ETH', artistName: 'CryptoGallery', dataAiHint: 'generative patterns' },
    ],
  },
  'pixel-art': {
    pageTitle: 'Pixel Art',
    description: 'Digital art created using raster graphics software, where images are edited on the pixel level.',
    nfts: [
      { id: nft_id_002, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Pal', price: '0.2 ETH', artistName: 'TestUser01', dataAiHint: 'pixel character' },
      { id: nft_id_011, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Knight #001', price: '0.3 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel knight' },
      { id: nft_id_013, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Dragonling', price: '0.7 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel dragon' },
      { id: nft_id_019, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Mage Character', price: '0.4 ETH', artistName: 'PixelPioneer', dataAiHint: 'pixel mage' },
    ],
  }
};

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
  const categoryData = categorySpecificNFTs[slug]; 
  const pageTitle = categoryData ? categoryData.pageTitle : slugToTitle(slug);
  const pageDescription = categoryData ? categoryData.description : 'Browse items in this category.';


  if (!categoryData) {
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
                Oops! We couldn't find the category "{slugToTitle(slug)}".
              </p>
              <Button className="mt-6" asChild>
                <Link href="/home#categories">Explore Other Categories</Link>
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
                <Link href="/home#categories">
                <ChevronLeft className="h-4 w-4 mr-2" /> All Categories
                </Link>
            </Button>
            <h1 className="text-4xl font-bold font-headline text-primary">{pageTitle}</h1>
            <p className="text-lg text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        {categoryData.nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.nfts.map(nft => (
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
