
import { NextResponse } from 'next/server';
import type { NftProps } from '@/components/nft/nft-card'; // Assuming NftProps might be extended for detail view

// Simulate a database or API call delay
const stall = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface NftDetailProps extends NftProps {
  description: string;
  properties: Array<{ trait_type: string; value: string }>;
  ownerUsername: string;
  ownerEthAddress: string;
  creatorEthAddress: string;
  views: number;
  favorites: number;
  // Add other detail-specific fields if needed, e.g., history
}

const allNftsData: NftDetailProps[] = [
  { 
    id: 'nft-101', 
    imageUrl: 'https://placehold.co/600x800.png', 
    title: 'Galactic Voyager X', 
    collectionName: 'Space Explorers Prime', 
    creator: 'StarCaptainSupreme', 
    price: '2.5 ETH', 
    dataAiHint: 'space ship illustration',
    description: 'The Galactic Voyager X is a state-of-the-art exploration vessel, designed for deep space missions. This unique 1/1 edition features custom decals and enhanced warp capabilities.',
    properties: [
      { trait_type: 'Class', value: 'Explorer Vessel' },
      { trait_type: 'Edition', value: '1 of 1' },
      { trait_type: 'Engine', value: 'Warp Drive X' },
      { trait_type: 'Hull Color', value: 'Cosmic Blue' },
    ],
    ownerUsername: 'CollectorCosmo',
    ownerEthAddress: '0xabc...def',
    creatorEthAddress: '0x123...789',
    views: 12345,
    favorites: 678
  },
  { 
    id: 'nft-102', 
    imageUrl: 'https://placehold.co/600x800.png', 
    title: 'Mystic Forest Orb G', 
    collectionName: 'Enchanted Realms Deluxe', 
    creator: 'ForestDruidMaster', 
    price: '1.8 ETH', 
    dataAiHint: 'glowing magic orb',
    description: 'A powerful orb found deep within the Whispering Woods. It glows with an ethereal light and is said to possess ancient magical properties. This is a rare find from the Enchanted Realms Deluxe collection.',
    properties: [
      { trait_type: 'Type', value: 'Magic Artifact' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Aura', value: 'Ethereal Green' },
      { trait_type: 'Origin', value: 'Whispering Woods' },
    ],
    ownerUsername: 'MageCollector',
    ownerEthAddress: '0xghi...jkl',
    creatorEthAddress: '0x456...abc',
    views: 9876,
    favorites: 450
  },
   { 
    id: 'api-1', 
    imageUrl: 'https://placehold.co/600x800.png', 
    title: 'Cosmic Dream (Detailed)', 
    collectionName: 'Galaxy Explorers', 
    creator: 'APIGazer', 
    price: '1.7 ETH', 
    dataAiHint: 'abstract space art',
    description: 'A vivid depiction of a cosmic dream, where nebulas swirl and stars ignite. Part of the renowned Galaxy Explorers collection.',
    properties: [
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Palette', value: 'Deep Blues & Purples' },
      { trait_type: 'Subject', value: 'Nebula' },
    ],
    ownerUsername: 'ArtFanatic',
    ownerEthAddress: '0xdef...123',
    creatorEthAddress: '0x789...def',
    views: 15023,
    favorites: 812
  },
  // Add more detailed mock NFTs if needed
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const nftId = params.id;
  await stall(500); // Simulate network delay

  const nft = allNftsData.find(n => n.id === nftId);

  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
  }

  // Simulate slightly dynamic data based on ID for views/favorites if not explicitly set
  const dynamicNftData = {
    ...nft,
    views: nft.views || (parseInt(nftId.replace(/[^0-9]/g, '') || '0', 10) * 17) % 1000 + 1000,
    favorites: nft.favorites || (parseInt(nftId.replace(/[^0-9]/g, '') || '0', 10) * 7) % 500 + 50,
  };
  
  return NextResponse.json(dynamicNftData);
}
