
import { NextResponse } from 'next/server';
import type { NftProps } from '@/components/nft/nft-card';

// Simulate a database or API call delay
const stall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const allNftsData: NftProps[] = [
  { id: 'nft-101', imageUrl: 'https://placehold.co/600x600.png', title: 'Galactic Voyager', collectionName: 'Space Explorers', creator: 'StarCaptain', price: '2.5 ETH', dataAiHint: 'space ship' },
  { id: 'nft-102', imageUrl: 'https://placehold.co/600x600.png', title: 'Mystic Forest Orb', collectionName: 'Enchanted Realms', creator: 'ForestDruid', price: '1.8 ETH', dataAiHint: 'magic orb' },
  { id: 'nft-103', imageUrl: 'https://placehold.co/600x600.png', title: 'Cybernetic Sentinel', collectionName: 'Future Tech', creator: 'RoboCrafter', price: '3.1 ETH', dataAiHint: 'robot warrior' },
  { id: 'nft-104', imageUrl: 'https://placehold.co/600x600.png', title: 'Ancient Desert Totem', collectionName: 'Lost Sands', creator: 'DesertNomad', price: '0.9 ETH', dataAiHint: 'desert artifact' },
  { id: 'nft-105', imageUrl: 'https://placehold.co/600x600.png', title: 'Deep Sea Anomaly', collectionName: 'Ocean Depths', creator: 'AquaExplorer', price: '1.5 ETH', dataAiHint: 'sea creature' },
  { id: 'nft-106', imageUrl: 'https://placehold.co/600x600.png', title: 'Pixel Hero #42', collectionName: 'Retro Adventures', creator: 'PixelArtist', price: '0.7 ETH', dataAiHint: 'pixel character' },
  { id: 'nft-107', imageUrl: 'https://placehold.co/600x600.png', title: 'Sunset Overdrive', collectionName: 'City Vibes', creator: 'UrbanPainter', price: '2.2 ETH', dataAiHint: 'city sunset' },
  { id: 'nft-108', imageUrl: 'https://placehold.co/600x600.png', title: 'Nature\'s Embrace', collectionName: 'Serene Landscapes', creator: 'PhotoRealist', price: '1.2 ETH', dataAiHint: 'nature landscape' },
  // Add more from existing trendingNftsAPIData if needed or new ones
  { id: 'api-1', imageUrl: 'https://placehold.co/600x600.png', title: 'Cosmic Dream (from API)', collectionName: 'Galaxy Explorers', creator: 'APIGazer', price: '1.7 ETH', dataAiHint: 'abstract space' },
  { id: 'api-2', imageUrl: 'https://placehold.co/600x600.png', title: 'Cybernetic Bloom (from API)', collectionName: 'Future Flora', creator: 'APIBotanist', price: '0.9 ETH', dataAiHint: 'flower tech' },
];

export async function GET(request: Request) {
  // In a real API, you'd handle query parameters for filtering, sorting, pagination
  // const { searchParams } = new URL(request.url);
  // const filter = searchParams.get('filter');
  // const category = searchParams.get('category');
  // const page = parseInt(searchParams.get('page') || '1');
  // const limit = parseInt(searchParams.get('limit') || '10');

  await stall(800); // Simulate network delay
  return NextResponse.json(allNftsData);
}

// Placeholder for POST /api/nfts (Create NFT)
// export async function POST(request: Request) {
//   // const body = await request.json();
//   // Logic to create a new NFT in the database
//   await stall(1000);
//   return NextResponse.json({ message: 'NFT created successfully (mock)' }, { status: 201 });
// }
