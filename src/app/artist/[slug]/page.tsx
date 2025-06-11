
'use client';

import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, UserCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Mock data - replace with actual data fetching later
interface ArtistProfile {
  slug: string;
  name: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  dataAiHintAvatar?: string;
  dataAiHintCover?: string;
  nfts: Array<{ id: string; title: string; imageUrl: string; price: string; dataAiHint: string; }>;
}

const MOCK_ARTISTS: Record<string, ArtistProfile> = {
  pixelpainter: {
    slug: 'pixelpainter',
    name: 'PixelPainter',
    bio: 'Crafting digital wonders, one pixel at a time. Specializing in retro-inspired and modern pixel art that tells a story.',
    avatarUrl: 'https://placehold.co/150x150.png?text=PP',
    coverImageUrl: 'https://placehold.co/1200x300.png?text=Pixel+Art+Banner',
    dataAiHintAvatar: 'pixel artist avatar',
    dataAiHintCover: 'pixel art banner',
    nfts: [
      { id: 'pp_nft1', title: 'Pixelated Dream', imageUrl: 'https://placehold.co/300x300.png', price: '0.5 ETH', dataAiHint: 'pixel landscape' },
      { id: 'pp_nft2', title: '8-Bit Hero', imageUrl: 'https://placehold.co/300x300.png', price: '0.8 ETH', dataAiHint: 'pixel character' },
    ],
  },
  aialchemist: {
    slug: 'aialchemist',
    name: 'AI Alchemist',
    bio: 'Fusing art and artificial intelligence to create new forms of expression. Exploring the depths of neural networks and generative art.',
    avatarUrl: 'https://placehold.co/150x150.png?text=AI',
    coverImageUrl: 'https://placehold.co/1200x300.png?text=AI+Art+Banner',
    dataAiHintAvatar: 'ai artist avatar',
    dataAiHintCover: 'ai art banner',
    nfts: [
      { id: 'ai_nft1', title: 'Neural Nebula', imageUrl: 'https://placehold.co/300x300.png', price: '1.2 ETH', dataAiHint: 'abstract ai art' },
      { id: 'ai_nft2', title: 'Generated Harmony', imageUrl: 'https://placehold.co/300x300.png', price: '1.5 ETH', dataAiHint: 'generative pattern' },
    ],
  },
   // Add more mock artists as needed
  pixelpioneer: { // Adding the one from home page mock
    slug: 'pixelpioneer',
    name: 'PixelPioneer',
    bio: 'Crafting digital worlds, one pixel at a time. Exploring the vast expanse of creativity in the digital realm.',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHintAvatar: 'artist avatar',
    nfts: [
      { id: 'ppioneer_nft1', title: 'Pixel Kingdom', imageUrl: 'https://placehold.co/300x300.png', price: '0.7 ETH', dataAiHint: 'pixel world' },
    ],
  },
  abstractdreamer: {
    slug: 'abstractdreamer',
    name: 'AbstractDreamer',
    bio: 'Exploring the subconscious through vibrant colors and surreal forms.',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHintAvatar: 'abstract portrait',
    nfts: [
      { id: 'ad_nft1', title: 'Dream Weave', imageUrl: 'https://placehold.co/300x300.png', price: '0.9 ETH', dataAiHint: 'abstract painting' },
    ],
  },
  synthwavesurfer: {
    slug: 'synthwavesurfer',
    name: 'SynthwaveSurfer',
    bio: 'Riding the retro-futuristic sound waves with neon-drenched visuals.',
    avatarUrl: 'https://placehold.co/150x150.png',
    dataAiHintAvatar: 'retro musician',
    nfts: [
      { id: 'ss_nft1', title: 'Neon Drive', imageUrl: 'https://placehold.co/300x300.png', price: '1.1 ETH', dataAiHint: 'synthwave car' },
    ],
  },
};


export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug.toLowerCase() : '';
  const [artist, setArtist] = useState<ArtistProfile | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (slug) {
      // Simulate API call
      setTimeout(() => {
        const foundArtist = MOCK_ARTISTS[slug];
        setArtist(foundArtist || null); // null if not found
      }, 300);
    }
  }, [slug]);

  if (artist === undefined) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-5xl mx-auto text-center">
          <UserCircle className="mx-auto h-16 w-16 text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading artist profile...</p>
        </div>
      </AppLayout>
    );
  }

  if (artist === null) {
    return (
      <AppLayout>
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Button variant="ghost" asChild className="mb-6" onClick={() => router.back()}>
            <Link href="#"><ChevronLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
          <Card className="text-center py-12 shadow-xl border-destructive">
            <CardContent className="flex flex-col items-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <h1 className="text-3xl font-bold font-headline text-destructive">Artist Not Found</h1>
              <p className="text-muted-foreground mt-2 max-w-md">
                Sorry, we couldn't find a profile for an artist with the slug "{slug}".
              </p>
              <Button className="mt-6" asChild>
                <Link href="/home">Explore Other Artists</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {artist.coverImageUrl && (
          <div className="h-48 md:h-64 bg-muted relative">
            <Image
              src={artist.coverImageUrl}
              alt={`${artist.name}'s cover image`}
              fill
              className="object-cover"
              data-ai-hint={artist.dataAiHintCover || "artist banner"}
              priority
            />
          </div>
        )}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-24 relative z-10 mb-8">
            <Image
              src={artist.avatarUrl}
              alt={artist.name}
              width={150}
              height={150}
              className="rounded-full border-4 border-background shadow-lg object-cover"
              data-ai-hint={artist.dataAiHintAvatar || "artist avatar"}
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{artist.name}</h1>
              <p className="text-muted-foreground mt-1">@{artist.slug}</p>
            </div>
            <div className="md:ml-auto mt-4 md:mt-0">
                <Button>Follow (Simulated)</Button>
            </div>
          </div>
          
          <Card className="mb-8 shadow-lg">
            <CardHeader>
                <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/80 leading-relaxed">{artist.bio}</p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mb-6 text-foreground">NFTs by {artist.name}</h2>
          {artist.nfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artist.nfts.map(nft => (
                <Card key={nft.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Link href={`/nft/${nft.id}`} className="block group">
                    <div className="aspect-square relative">
                      <Image src={nft.imageUrl} alt={nft.title} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={nft.dataAiHint}/>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold truncate group-hover:text-primary">{nft.title}</h3>
                      <p className="text-md font-bold text-accent mt-1">{nft.price}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">This artist hasn't listed any NFTs yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
