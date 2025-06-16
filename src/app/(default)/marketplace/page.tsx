'use client'; // For client-side interactions like Select

import NFTCard from '@/components/nft-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

const allNfts = [
  { id: '1', imageUrl: 'https://placehold.co/600x600.png', title: 'Cosmic Dream', artist: 'StarGazer', price: '1.5 ETH', aiHint: 'galaxy stars' },
  { id: '2', imageUrl: 'https://placehold.co/600x600.png', title: 'Abstract Flow', artist: 'FluidArtist', price: '0.8 ETH', aiHint: 'abstract colorful' },
  { id: '3', imageUrl: 'https://placehold.co/600x600.png', title: 'Cyber Cityscape', artist: 'NeonArchitect', price: '2.2 ETH', aiHint: 'cyberpunk city' },
  { id: '4', imageUrl: 'https://placehold.co/600x600.png', title: 'Nature\'s Whisper', artist: 'EcoSprite', price: '1.0 ETH', aiHint: 'forest nature' },
  { id: '5', imageUrl: 'https://placehold.co/600x600.png', title: 'Pixelated Portrait', artist: 'RetroVision', price: '0.5 ETH', aiHint: 'pixel art' },
  { id: '6', imageUrl: 'https://placehold.co/600x600.png', title: 'Surreal Sculpture', artist: 'DreamWeaver', price: '3.0 ETH', aiHint: 'surreal sculpture' },
  { id: '7', imageUrl: 'https://placehold.co/600x600.png', title: 'Minimalist Lines', artist: 'LineArtisan', price: '0.7 ETH', aiHint: 'minimalist line' },
  { id: '8', imageUrl: 'https://placehold.co/600x600.png', title: 'Vibrant Bloom', artist: 'FloraPainter', price: '1.2 ETH', aiHint: 'flower painting' },
  { id: '9', imageUrl: 'https://placehold.co/600x600.png', title: 'Future Funk', artist: 'SynthWave', price: '1.8 ETH', aiHint: 'retro wave' },
  { id: '10', imageUrl: 'https://placehold.co/600x600.png', title: 'Ancient Relic', artist: 'ExplorerX', price: '2.5 ETH', aiHint: 'ancient artifact' },
  { id: '11', imageUrl: 'https://placehold.co/600x600.png', title: 'Geometric Harmony', artist: 'ShapeShifter', price: '0.9 ETH', aiHint: 'geometric pattern' },
  { id: '12', imageUrl: 'https://placehold.co/600x600.png', title: 'Dreamy Landscape', artist: 'CloudPainter', price: '1.1 ETH', aiHint: 'dreamy landscape' },
];

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-10">
      <section className="bg-card p-6 rounded-xl shadow-lg">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">Explore the Marketplace</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-nft" className="block text-sm font-medium text-muted-foreground mb-1.5">Search by name or artist</label>
            <div className="relative">
              <Input type="search" id="search-nft" placeholder="e.g., 'Cosmic Dream' or 'StarGazer'" className="pl-10 h-11 text-base" />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-muted-foreground mb-1.5">Sort by</label>
            <Select defaultValue="relevance">
              <SelectTrigger id="sort-by" aria-label="Sort NFTs" className="h-11 text-base">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort Options</SelectLabel>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground">
                <ListFilter className="mr-2 h-4 w-4" /> Advanced Filters
            </Button>
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
                    <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
                    <List className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </section>

      <section>
        {allNfts.length > 0 ? (
          <div className={`grid gap-6 md:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 space-y-4'}`}>
            {allNfts.map(nft => (
              // For list view, you might want a different card component or styling
              // For now, NFTCard will adapt or be used as is.
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-headline text-xl text-muted-foreground">No NFTs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
        {/* Pagination could be added here */}
        {allNfts.length > 0 && (
            <div className="mt-12 flex justify-center">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground">Load More</Button>
            </div>
        )}
      </section>
    </div>
  );
}
