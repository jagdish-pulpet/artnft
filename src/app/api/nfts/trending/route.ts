
import { NextResponse } from 'next/server';
import type { NftProps } from '@/components/nft/nft-card';

// Simulate a database or API call delay
const stall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const trendingNftsAPIData: NftProps[] = [
  { id: 'api-1', imageUrl: 'https://placehold.co/600x600.png', title: 'Cosmic Dream (from API)', collectionName: 'Galaxy Explorers', creator: 'APIGazer', price: '1.7 ETH', dataAiHint: 'abstract space' },
  { id: 'api-2', imageUrl: 'https://placehold.co/600x600.png', title: 'Cybernetic Bloom (from API)', collectionName: 'Future Flora', creator: 'APIBotanist', price: '0.9 ETH', dataAiHint: 'flower tech' },
  { id: 'api-3', imageUrl: 'https://placehold.co/600x600.png', title: 'Ocean Whisper (from API)', collectionName: 'Deep Sea Wonders', creator: 'APIDiveArt', price: '2.3 ETH', dataAiHint: 'ocean wave' },
  { id: 'api-4', imageUrl: 'https://placehold.co/600x600.png', title: 'Retro Future (from API)', collectionName: 'Pixel Pioneers', creator: 'APIPioneer', price: '1.4 ETH', dataAiHint: 'retro computer' },
  { id: 'api-5', imageUrl: 'https://placehold.co/600x600.png', title: 'Silent Forest (from API)', collectionName: 'Nature Nymphs', creator: 'APINymph', price: '0.6 ETH', dataAiHint: 'forest trees' },
  { id: 'api-6', imageUrl: 'https://placehold.co/600x600.png', title: 'Urban Pulse (from API)', collectionName: 'City Scapes', creator: 'APIScaper', price: '3.1 ETH', dataAiHint: 'city skyline' },
  { id: 'api-7', imageUrl: 'https://placehold.co/600x600.png', title: 'Mythic Griffin (from API)', collectionName: 'Legendary Creatures', creator: 'APIMythWeaver', price: '2.8 ETH', dataAiHint: 'fantasy griffin' },
  { id: 'api-8', imageUrl: 'https://placehold.co/600x600.png', title: 'Digital Samurai (from API)', collectionName: 'Neo Kyoto', creator: 'APIBladeRunner', price: '1.9 ETH', dataAiHint: 'samurai warrior' },
];

export async function GET() {
  await stall(1200); // Simulate network delay for fetching trending NFTs
  return NextResponse.json(trendingNftsAPIData);
}
