
'use client';

import { useState, useMemo } from 'react';
import NftCard from '@/components/nft-card';
import { mockNfts } from '@/lib/mock-data';
import type { NFT } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, XCircle } from 'lucide-react';

const artStyles = Array.from(new Set(mockNfts.map(nft => nft.artStyle)));
const artists = Array.from(new Set(mockNfts.map(nft => nft.artist)));

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtStyle, setSelectedArtStyle] = useState<string | undefined>(undefined);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5]); // Max price from mock data roughly

  const filteredNfts = useMemo(() => {
    return mockNfts.filter(nft => {
      const matchesSearchTerm = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                nft.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                nft.artStyle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArtStyle = selectedArtStyle ? nft.artStyle === selectedArtStyle : true;
      const matchesArtist = selectedArtist ? nft.artist === selectedArtist : true;
      const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];
      return matchesSearchTerm && matchesArtStyle && matchesArtist && matchesPrice;
    });
  }, [searchTerm, selectedArtStyle, selectedArtist, priceRange]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArtStyle(undefined);
    setSelectedArtist(undefined);
    setPriceRange([0, 5]);
  };

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold mb-6 text-center">Explore NFTs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Search by Keyword</label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search by title, artist, style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="artStyle" className="block text-sm font-medium text-muted-foreground mb-1">Art Style</label>
            <Select value={selectedArtStyle} onValueChange={setSelectedArtStyle}>
              <SelectTrigger id="artStyle">
                <SelectValue placeholder="All Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                {artStyles.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-muted-foreground mb-1">Artist</label>
            <Select value={selectedArtist} onValueChange={setSelectedArtist}>
              <SelectTrigger id="artist">
                <SelectValue placeholder="All Artists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Artists</SelectItem>
                {artists.map(artist => (
                  <SelectItem key={artist} value={artist}>{artist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="priceRange" className="block text-sm font-medium text-muted-foreground mb-1">
              Price Range: {priceRange[0]} ETH - {priceRange[1]} ETH
            </label>
            <Slider
              id="priceRange"
              min={0}
              max={5}
              step={0.1}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(newRange) => {
                if (Array.isArray(newRange) && newRange.length === 2) {
                     setPriceRange([newRange[0], newRange[1]]);
                }
              }}
              className="mt-2"
            />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={resetFilters} variant="outline" className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
              <XCircle className="mr-2 h-4 w-4" /> Reset Filters
            </Button>
          </div>
        </div>
      </section>

      <section>
        {filteredNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No NFTs found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}
