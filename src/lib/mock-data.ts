import type { NFT } from '@/types';

export const mockNfts: NFT[] = [
  {
    id: '1',
    title: 'Cosmic Dream',
    description: 'A vibrant exploration of nebulae and distant galaxies, rendered in a psychedelic style. This piece invites viewers to lose themselves in the infinite possibilities of the cosmos.',
    imageUrl: 'https://placehold.co/600x600.png',
    price: 1.5,
    artist: 'Stellar Scribe',
    artStyle: 'Abstract Psychedelic',
    creationDate: '2023-03-15',
    materialsUsed: 'Digital, Procreate',
    ownershipHistory: [
      { owner: 'Creator Wallet', date: '2023-03-15' },
      { owner: 'CollectorX', date: '2023-04-01', price: 1.2 },
    ],
    relatedCollectionIds: ['galaxy-explorers', 'abstract-visions'],
  },
  {
    id: '2',
    title: 'Cybernetic Bloom',
    description: 'A fusion of organic floral forms with futuristic cybernetic enhancements. This artwork explores the intersection of nature and technology.',
    imageUrl: 'https://placehold.co/600x700.png',
    price: 2.2,
    artist: 'TechFlora',
    artStyle: 'Cyberpunk Surrealism',
    creationDate: '2023-05-20',
    materialsUsed: '3D Render, AI Assistance',
    ownershipHistory: [
      { owner: 'Creator Wallet', date: '2023-05-20' },
    ],
    relatedCollectionIds: ['future-nature', 'cyber-dreams'],
  },
  {
    id: '3',
    title: 'Pixel Portrait #7',
    description: 'A minimalist pixel art portrait, part of an ongoing series exploring identity in the digital age. Each pixel is meticulously placed to convey emotion.',
    imageUrl: 'https://placehold.co/500x500.png',
    price: 0.8,
    artist: 'BitMapper',
    artStyle: 'Pixel Art',
    creationDate: '2023-01-10',
    materialsUsed: 'Aseprite',
    ownershipHistory: [
      { owner: 'Creator Wallet', date: '2023-01-10' },
      { owner: 'PixelFan', date: '2023-02-15', price: 0.5 },
      { owner: 'ArtCollector22', date: '2023-06-01', price: 0.7 },
    ],
    relatedCollectionIds: ['pixel-perfect', 'digital-identity'],
  },
  {
    id: '4',
    title: 'Ephemeral Light',
    description: 'An abstract representation of light and shadow, capturing fleeting moments of beauty. The piece plays with texture and subtle color shifts.',
    imageUrl: 'https://placehold.co/700x500.png',
    price: 3.0,
    artist: 'LumiPainter',
    artStyle: 'Abstract Expressionism',
    creationDate: '2023-07-01',
    materialsUsed: 'Digital Painting, Photoshop',
    ownershipHistory: [
      { owner: 'Creator Wallet', date: '2023-07-01' },
    ],
  },
    {
    id: '5',
    title: 'Geometric Harmony',
    description: 'A complex interplay of geometric shapes and patterns, creating a sense of balance and order. Inspired by sacred geometry.',
    imageUrl: 'https://placehold.co/600x600.png',
    price: 1.8,
    artist: 'ShapeShifter',
    artStyle: 'Geometric Abstraction',
    creationDate: '2023-08-12',
    materialsUsed: 'Illustrator, Vector Art',
    ownershipHistory: [
      { owner: 'Creator Wallet', date: '2023-08-12' },
    ],
  },
  {
    id: '6',
    title: 'Oceanic Whispers',
    description: 'An ethereal depiction of the deep sea, filled with bioluminescent creatures and mysterious currents. A dive into the unknown.',
    imageUrl: 'https://placehold.co/800x500.png',
    price: 2.5,
    artist: 'AquaDreamer',
    artStyle: 'Fantasy Surrealism',
    creationDate: '2023-09-05',
    materialsUsed: 'Digital Painting, Mixed Media',
  },
];

export const getMockNftById = (id: string): NFT | undefined => mockNfts.find(nft => nft.id === id);

export const getMockNftsByCollectionId = (collectionId: string): NFT[] => 
  mockNfts.filter(nft => nft.relatedCollectionIds?.includes(collectionId)).slice(0, 2); // Return 2 for brevity
