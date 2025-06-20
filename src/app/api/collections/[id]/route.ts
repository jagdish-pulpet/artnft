
import { NextResponse } from 'next/server';
import type { CollectionProps } from '../route'; // Assuming CollectionProps is exported from the parent route
import type { NftProps } from '@/components/nft/nft-card';

// Simulate a database or API call delay
const stall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface CollectionDetailProps extends CollectionProps {
  nfts: NftProps[]; // NFTs belonging to this collection
  // Add other detail-specific fields for a collection if needed
}

// Sample NFTs - in a real app, these would be related to the collection
const sampleNftsForCollection: NftProps[] = [
  { id: 'nft-c1-1', imageUrl: 'https://placehold.co/300x300.png', title: 'Explorer Ship Alpha', collectionName: '', creator: 'StarCaptain', price: '2.1 ETH', dataAiHint: 'space ship item' },
  { id: 'nft-c1-2', imageUrl: 'https://placehold.co/300x300.png', title: 'Planetoid Map Fragment', collectionName: '', creator: 'StarCaptain', price: '0.5 ETH', dataAiHint: 'space map' },
  { id: 'nft-c1-3', imageUrl: 'https://placehold.co/300x300.png', title: 'Alien Flora Specimen', collectionName: '', creator: 'StarCaptain', dataAiHint: 'alien plant' }, // No price = not for sale
  { id: 'nft-c2-1', imageUrl: 'https://placehold.co/300x300.png', title: 'Druid Staff', collectionName: '', creator: 'ForestDruid', price: '1.9 ETH', dataAiHint: 'magic staff' },
  { id: 'nft-c2-2', imageUrl: 'https://placehold.co/300x300.png', title: 'Enchanted Seed', collectionName: '', creator: 'ForestDruid', price: '0.3 ETH', dataAiHint: 'magic seed' },
];


const allCollectionsDetailData: CollectionDetailProps[] = [
  { 
    id: 'col-1', 
    name: 'Space Explorers Prime', 
    description: 'Embark on epic journeys across the cosmos with this premier collection of space-themed NFTs. Explore unique starships, alien artifacts, and breathtaking planetary vistas. Each piece is a gateway to a new adventure.',
    imageUrl: 'https://placehold.co/1200x400.png', 
    creatorName: 'StarCaptainSupreme', 
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 55, 
    volumeTraded: '250 ETH',
    floorPrice: '1.2 ETH',
    dataAiHint: 'space galaxy cinematic',
    nfts: sampleNftsForCollection.slice(0,3).map(nft => ({...nft, collectionName: 'Space Explorers Prime'}))
  },
  { 
    id: 'col-2', 
    name: 'Enchanted Realms Deluxe', 
    description: 'Discover magical artifacts, mythical creatures, and enchanted lands from a realm beyond imagination. This deluxe collection offers rare glimpses into a world of wonder and peril. Perfect for collectors of fantasy art.',
    imageUrl: 'https://placehold.co/1200x400.png', 
    creatorName: 'ForestDruidMaster', 
    creatorAvatarUrl: 'https://placehold.co/64x64.png',
    itemCount: 78,
    volumeTraded: '180 ETH',
    floorPrice: '0.8 ETH',
    dataAiHint: 'fantasy forest magic',
    nfts: sampleNftsForCollection.slice(3,5).map(nft => ({...nft, collectionName: 'Enchanted Realms Deluxe'}))
  },
  // Add more detailed mock collections if needed
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const collectionId = params.id;
  await stall(600); // Simulate network delay

  const collection = allCollectionsDetailData.find(c => c.id === collectionId);

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }
  
  // Update NFT collection names for consistency if not already set
  const nftsWithCollectionName = collection.nfts.map(nft => ({
    ...nft,
    collectionName: collection.name,
  }));
  
  return NextResponse.json({ ...collection, nfts: nftsWithCollectionName });
}
