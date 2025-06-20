
import { NextResponse } from 'next/server';

// Simulate a database or API call delay
const stall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CollectionProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  itemCount: number;
  volumeTraded?: string; // e.g., "150 ETH"
  floorPrice?: string; // e.g., "0.5 ETH"
  dataAiHint?: string;
}

const allCollectionsData: CollectionProps[] = [
  { 
    id: 'col-1', 
    name: 'Space Explorers Prime', 
    description: 'Embark on epic journeys across the cosmos with this premier collection of space-themed NFTs.',
    imageUrl: 'https://placehold.co/800x400.png', 
    creatorName: 'StarCaptainSupreme', 
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 55, 
    volumeTraded: '250 ETH',
    floorPrice: '1.2 ETH',
    dataAiHint: 'space galaxy'
  },
  { 
    id: 'col-2', 
    name: 'Enchanted Realms Deluxe', 
    description: 'Discover magical artifacts, mythical creatures, and enchanted lands from a realm beyond imagination.',
    imageUrl: 'https://placehold.co/800x400.png', 
    creatorName: 'ForestDruidMaster', 
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 78,
    volumeTraded: '180 ETH',
    floorPrice: '0.8 ETH',
    dataAiHint: 'fantasy forest'
  },
  { 
    id: 'col-3', 
    name: 'Future Tech Genesis', 
    description: 'A collection showcasing cutting-edge cybernetic enhancements, futuristic vehicles, and AI constructs.',
    imageUrl: 'https://placehold.co/800x400.png', 
    creatorName: 'RoboCrafter', 
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 120,
    volumeTraded: '400 ETH',
    floorPrice: '2.0 ETH',
    dataAiHint: 'cyberpunk city'
  },
  { 
    id: 'col-4', 
    name: 'Pixel Pioneers Remastered', 
    description: 'Nostalgic pixel art with a modern twist. Relive the golden age of gaming with these unique collectibles.',
    imageUrl: 'https://placehold.co/800x400.png', 
    creatorName: 'PixelArtistPro',
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 250,
    volumeTraded: '95 ETH',
    floorPrice: '0.1 ETH',
    dataAiHint: 'pixel art retro'
  },
];

export async function GET(request: Request) {
  // In a real API, you might handle query parameters for filtering, sorting, pagination
  await stall(700); // Simulate network delay
  return NextResponse.json(allCollectionsData);
}

// Placeholder for POST /api/collections (Create Collection)
// export async function POST(request: Request) {
//   // const body = await request.json();
//   // Logic to create a new collection
//   await stall(1000);
//   return NextResponse.json({ message: 'Collection created successfully (mock)' }, { status: 201 });
// }
