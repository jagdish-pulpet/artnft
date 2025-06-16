
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AppLayout } from '@artnft/ui'; // Updated import
import NFTCard, { type NFTCardProps } from '@/components/NFTCard';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Filter, X, LayoutGrid, List, Frown, Loader2, Trash2, History, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';

interface EnhancedNFTCardProps extends NFTCardProps {
  priceEth: number;
  category: 'digital-art' | 'photography' | 'music' | 'collectible' | 'virtual-world' | 'utility' | 'generative-art' | 'pixel-art' | 'other';
  status: 'buy-now' | 'on-auction' | 'listed' | 'sold' | 'hidden' | 'draft' | 'pending_moderation';
  dateAdded: string; 
}

const nft_id_001 = 'nft_00000000-0000-0000-0000-MOCK00000001';
const nft_id_002 = 'nft_00000000-0000-0000-0000-MOCK00000002';
const nft_id_003 = 'nft_00000000-0000-0000-0000-MOCK00000003';
const nft_id_004 = 'nft_00000000-0000-0000-0000-MOCK00000004';
const nft_id_005 = 'nft_00000000-0000-0000-0000-MOCK00000005';
const nft_id_006 = 'nft_00000000-0000-0000-0000-MOCK00000006';
const nft_id_007 = 'nft_00000000-0000-0000-0000-MOCK00000007';
const nft_id_008 = 'nft_00000000-0000-0000-0000-MOCK00000008';
const nft_id_009 = 'nft_00000000-0000-0000-0000-MOCK00000009';
const nft_id_010 = 'nft_00000000-0000-0000-0000-MOCK00000010';
const nft_id_011 = 'nft_00000000-0000-0000-0000-MOCK00000011';
const nft_id_012 = 'nft_00000000-0000-0000-0000-MOCK00000012';
const nft_id_013 = 'nft_00000000-0000-0000-0000-MOCK00000013';
const nft_id_014 = 'nft_00000000-0000-0000-0000-MOCK00000014';
const nft_id_015 = 'nft_00000000-0000-0000-0000-MOCK00000015';
const nft_id_016 = 'nft_00000000-0000-0000-0000-MOCK00000016';
const nft_id_017 = 'nft_00000000-0000-0000-0000-MOCK00000017';
const nft_id_018 = 'nft_00000000-0000-0000-0000-MOCK00000018';
const nft_id_019 = 'nft_00000000-0000-0000-0000-MOCK00000019';
const nft_id_020 = 'nft_00000000-0000-0000-0000-MOCK00000020';
const nft_id_021 = 'nft_00000000-0000-0000-0000-MOCK00000021';
const nft_id_022 = 'nft_00000000-0000-0000-0000-MOCK00000022';
const nft_id_023 = 'nft_00000000-0000-0000-0000-MOCK00000023';
const nft_id_024 = 'nft_00000000-0000-0000-0000-MOCK00000024';
const nft_id_025 = 'nft_00000000-0000-0000-0000-MOCK00000025';

const MOCK_ALL_NFTS_FOR_SIMULATION: EnhancedNFTCardProps[] = [
  { id: nft_id_001, imageUrl: 'https://placehold.co/400x400.png', title: 'My First Abstract', price: '0.5 ETH', priceEth: 0.5, artistName: 'TestUser01', dataAiHint: 'abstract colorful', category: 'digital-art', status: 'listed', dateAdded: '2024-07-15T10:00:00Z' },
  { id: nft_id_002, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Pal', price: '0.2 ETH', priceEth: 0.2, artistName: 'TestUser01', dataAiHint: 'pixel character', category: 'pixel-art', status: 'on_auction', dateAdded: '2024-07-16T12:30:00Z' },
  { id: nft_id_003, imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver #1', price: '1.2 ETH', priceEth: 1.2, artistName: 'ArtIsLife', dataAiHint: 'surreal landscape', category: 'digital-art', status: 'listed', dateAdded: '2024-07-12T08:00:00Z' },
  { id: nft_id_004, imageUrl: 'https://placehold.co/400x400.png', title: 'Ephemeral Light', price: '0.8 ETH', priceEth: 0.8, artistName: 'ArtIsLife', dataAiHint: 'abstract light', category: 'photography', status: 'listed', dateAdded: '2024-07-13T14:00:00Z' },
  { id: nft_id_005, imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver #2', price: '1.5 ETH', priceEth: 1.5, artistName: 'ArtIsLife', dataAiHint: 'dreamlike vista', category: 'digital-art', status: 'sold', dateAdded: '2024-07-14T18:00:00Z' },
  { id: nft_id_006, imageUrl: 'https://placehold.co/400x400.png', title: 'Vintage Robot', price: '0.75 ETH', priceEth: 0.75, artistName: 'NFTCollectorGal', dataAiHint: 'retro robot', category: 'collectible', status: 'listed', dateAdded: '2024-07-17T11:00:00Z' },
  { id: nft_id_007, imageUrl: 'https://placehold.co/400x400.png', title: 'Cybernetic Orb', price: '2.0 ETH', priceEth: 2.0, artistName: 'DigitalCreatorPro', dataAiHint: '3d orb', category: 'digital-art', status: 'listed', dateAdded: '2024-07-10T20:00:00Z' },
  { id: nft_id_008, imageUrl: 'https://placehold.co/400x400.png', title: 'Mech Suit Alpha', price: '3.5 ETH', priceEth: 3.5, artistName: 'DigitalCreatorPro', dataAiHint: 'mech suit concept', category: 'digital-art', status: 'on_auction', dateAdded: '2024-07-11T09:00:00Z' },
  { id: nft_id_009, imageUrl: 'https://placehold.co/400x400.png', title: 'Retro Wave Loop', price: '0.4 ETH', priceEth: 0.4, artistName: 'SynthMusician', dataAiHint: 'synthwave music', category: 'music', status: 'listed', dateAdded: '2024-07-07T10:00:00Z' },
  { id: nft_id_010, imageUrl: 'https://placehold.co/400x400.png', title: '80s Nostalgia Beat', price: '0.6 ETH', priceEth: 0.6, artistName: 'SynthMusician', dataAiHint: '80s beat', category: 'music', status: 'listed', dateAdded: '2024-07-08T15:00:00Z' },
  { id: nft_id_011, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Knight #001', price: '0.3 ETH', priceEth: 0.3, artistName: 'PixelPioneer', dataAiHint: 'pixel knight', category: 'pixel-art', status: 'sold', dateAdded: '2024-07-02T19:00:00Z' },
  { id: nft_id_012, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Forest Scene', price: '0.5 ETH', priceEth: 0.5, artistName: 'PixelPioneer', dataAiHint: 'pixel forest', category: 'pixel-art', status: 'listed', dateAdded: '2024-07-04T22:00:00Z' },
  { id: nft_id_013, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Dragonling', price: '0.7 ETH', priceEth: 0.7, artistName: 'PixelPioneer', dataAiHint: 'pixel dragon', category: 'pixel-art', status: 'on_auction', dateAdded: '2024-07-05T10:00:00Z' },
  { id: nft_id_014, imageUrl: 'https://placehold.co/400x400.png', title: 'Generative Swirls #7', price: '1.0 ETH', priceEth: 1.0, artistName: 'CryptoGallery', dataAiHint: 'generative art', category: 'generative-art', status: 'listed', dateAdded: '2024-06-27T13:00:00Z' },
  { id: nft_id_015, imageUrl: 'https://placehold.co/400x400.png', title: 'Mountain Vista Photo', price: '0.9 ETH', priceEth: 0.9, artistName: 'ArtViewer22', dataAiHint: 'mountain photography', category: 'photography', status: 'listed', dateAdded: '2024-06-30T10:00:00Z' },
  { id: nft_id_016, imageUrl: 'https://placehold.co/400x400.png', title: 'VR Gallery Access Key', price: '2.5 ETH', priceEth: 2.5, artistName: 'NFTInvestorX', dataAiHint: 'vr utility', category: 'utility', status: 'listed', dateAdded: '2024-06-22T11:00:00Z' },
  { id: nft_id_017, imageUrl: 'https://placehold.co/400x400.png', title: 'Lost Temple - Game Asset', price: '1.8 ETH', priceEth: 1.8, artistName: 'UXDesignerArt', dataAiHint: '3d game asset', category: 'virtual-world', status: 'listed', dateAdded: '2024-06-24T17:00:00Z' },
  { id: nft_id_018, imageUrl: 'https://placehold.co/400x400.png', title: 'Cosmic Abstract #42', price: '0.65 ETH', priceEth: 0.65, artistName: 'ArtIsLife', dataAiHint: 'cosmic abstract', category: 'digital-art', status: 'hidden', dateAdded: '2024-07-17T09:00:00Z' },
  { id: nft_id_019, imageUrl: 'https://placehold.co/400x400.png', title: 'Pixel Mage Character', price: '0.4 ETH', priceEth: 0.4, artistName: 'PixelPioneer', dataAiHint: 'pixel mage', category: 'pixel-art', status: 'listed', dateAdded: '2024-07-19T12:00:00Z' },
  { id: nft_id_020, imageUrl: 'https://placehold.co/400x400.png', title: 'Serene Lake Photograph', price: '0.7 ETH', priceEth: 0.7, artistName: 'ArtViewer22', dataAiHint: 'lake photography', category: 'photography', status: 'on_auction', dateAdded: '2024-07-20T10:00:00Z' },
  { id: nft_id_021, imageUrl: 'https://placehold.co/400x400.png', title: 'Chillhop Beat "Sunset"', price: '0.25 ETH', priceEth: 0.25, artistName: 'SynthMusician', dataAiHint: 'chillhop music', category: 'music', status: 'listed', dateAdded: '2024-07-21T15:00:00Z' },
  { id: nft_id_022, imageUrl: 'https://placehold.co/400x400.png', title: 'Cyberpunk Alleyway 3D', price: '2.2 ETH', priceEth: 2.2, artistName: 'DigitalCreatorPro', dataAiHint: 'cyberpunk 3d', category: 'digital-art', status: 'listed', dateAdded: '2024-07-18T18:00:00Z' },
  { id: nft_id_023, imageUrl: 'https://placehold.co/400x400.png', title: 'Generative Patterns Alpha', price: '0.9 ETH', priceEth: 0.9, artistName: 'CryptoGallery', dataAiHint: 'generative patterns', category: 'generative-art', status: 'draft', dateAdded: '2024-07-06T10:00:00Z' },
  { id: nft_id_024, imageUrl: 'https://placehold.co/400x400.png', title: 'Utility Key - Beta Access', price: '1.1 ETH', priceEth: 1.1, artistName: 'NFTInvestorX', dataAiHint: 'utility key', category: 'utility', status: 'pending_moderation', dateAdded: '2024-07-03T11:00:00Z' },
  { id: nft_id_025, imageUrl: 'https://placehold.co/400x400.png', title: 'Collectible Card #007', price: '0.35 ETH', priceEth: 0.35, artistName: 'NFTCollectorGal', dataAiHint: 'collectible card', category: 'collectible', status: 'listed', dateAdded: '2024-07-01T17:00:00Z' },
];


const MAX_RECENT_SEARCHES = 5;
const INITIAL_ITEMS_TO_DISPLAY = 12;
const ITEMS_PER_LOAD_MORE = 8;

type SortOption = 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'date-desc' | 'date-asc';


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTermFromUrl, setSearchTermFromUrl] = useState('');
  const [sourceNfts, setSourceNfts] = useState<EnhancedNFTCardProps[]>([]);
  const [displayedCount, setDisplayedCount] = useState<number>(INITIAL_ITEMS_TO_DISPLAY);

  const [isLoadingResults, setIsLoadingResults] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all-prices');
  const [selectedStatus, setSelectedStatus] = useState('all-status');
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption>('date-desc');

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const addRecentSearch = useCallback((term: string) => {
    if (!term) return;
    setRecentSearches(prev => {
      const newSearches = [term, ...prev.filter(s => s.toLowerCase() !== term.toLowerCase())];
      const limitedSearches = newSearches.slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem('artnft_recent_searches', JSON.stringify(limitedSearches));
      return limitedSearches;
    });
  }, []);

  useEffect(() => {
    const storedRecentSearches = localStorage.getItem('artnft_recent_searches');
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  const fetchAndSimulate = useCallback(async (query: string, category: string, priceRange: string, statusFilterValue: string, sort: SortOption) => {
    setIsLoadingResults(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));

      let simulatedResults = [...MOCK_ALL_NFTS_FOR_SIMULATION];

      if (query) {
        simulatedResults = simulatedResults.filter(nft =>
          nft.title.toLowerCase().includes(query.toLowerCase()) ||
          (nft.artistName && nft.artistName.toLowerCase().includes(query.toLowerCase()))
        );
      }

      if (category !== 'all-categories') {
        simulatedResults = simulatedResults.filter(nft => nft.category === category);
      }

      if (priceRange !== 'all-prices') {
        simulatedResults = simulatedResults.filter(nft => {
          if (priceRange === '0-0.5') return nft.priceEth <= 0.5;
          if (priceRange === '0.5-2') return nft.priceEth > 0.5 && nft.priceEth <= 2;
          if (priceRange === '2+') return nft.priceEth > 2;
          return true;
        });
      }

      const statusMap: Record<string, EnhancedNFTCardProps['status'][]> = {
        'buy-now': ['listed'], 
        'on-auction': ['on_auction'],
        'all-status': ['listed', 'on_auction', 'sold', 'hidden', 'draft', 'pending_moderation'] 
      };
      if (statusFilterValue !== 'all-status' && statusMap[statusFilterValue]) {
         simulatedResults = simulatedResults.filter(nft => statusMap[statusFilterValue].includes(nft.status));
      }


      switch (sort) {
        case 'price-asc': simulatedResults.sort((a, b) => a.priceEth - b.priceEth); break;
        case 'price-desc': simulatedResults.sort((a, b) => b.priceEth - a.priceEth); break;
        case 'title-asc': simulatedResults.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'title-desc': simulatedResults.sort((a, b) => b.title.localeCompare(a.title)); break;
        case 'date-desc': simulatedResults.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()); break;
        case 'date-asc': simulatedResults.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()); break;
      }

      setSourceNfts(simulatedResults);
      setDisplayedCount(INITIAL_ITEMS_TO_DISPLAY);

      if (query) {
        addRecentSearch(query);
      }

    } catch (err) {
      console.error("Simulated fetch error:", err);
      setError("Could not load search results. Displaying mock data as fallback.");
      setSourceNfts(MOCK_ALL_NFTS_FOR_SIMULATION); 
    } finally {
      setIsLoadingResults(false);
    }
  }, [addRecentSearch]);


  const qFromUrl = searchParams.get('q') || '';

  useEffect(() => {
    setSearchTermFromUrl(qFromUrl);
    fetchAndSimulate(qFromUrl, selectedCategory, selectedPriceRange, selectedStatus, selectedSortOption);
  }, [qFromUrl, selectedCategory, selectedPriceRange, selectedStatus, selectedSortOption, fetchAndSimulate]);


  useEffect(() => {
    let count = 0;
    if (selectedCategory !== 'all-categories') count++;
    if (selectedPriceRange !== 'all-prices') count++;
    if (selectedStatus !== 'all-status') count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, selectedPriceRange, selectedStatus]);

  const processedNFTs = useMemo(() => sourceNfts, [sourceNfts]);

  const handleClearFilters = () => {
    setSelectedCategory('all-categories');
    setSelectedPriceRange('all-prices');
    setSelectedStatus('all-status');
    setSelectedSortOption('date-desc');
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('artnft_recent_searches');
  };

  const handleRecentSearchClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleLoadMore = () => {
    setDisplayedCount(prevCount => Math.min(prevCount + ITEMS_PER_LOAD_MORE, processedNFTs.length));
  };

  const categoryOptions = [
    { value: 'all-categories', label: 'All Categories' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'photography', label: 'Photography' },
    { value: 'music', label: 'Music' },
    { value: 'collectible', label: 'Collectible' },
    { value: 'virtual-world', label: 'Virtual World' },
    { value: 'utility', label: 'Utility' },
    { value: 'generative-art', label: 'Generative Art' },
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'other', label: 'Other' },
  ];

  const priceRangeOptions = [
    { value: 'all-prices', label: 'Any Price' },
    { value: '0-0.5', label: 'Under 0.5 ETH' },
    { value: '0.5-2', label: '0.5 - 2 ETH' },
    { value: '2+', label: 'Over 2 ETH' },
  ];

  const statusOptions = [
      { value: 'all-status', label: 'Any Status' },
      { value: 'buy-now', label: 'Buy Now (Listed)' }, 
      { value: 'on-auction', label: 'On Auction' },
  ];

  const sortOptions: {value: SortOption, label: string}[] = [
    { value: 'date-desc', label: 'Recently Added' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'title-asc', label: 'Title: A-Z' },
    { value: 'title-desc', label: 'Title: Z-A' },
  ];

  const itemsToRender = useMemo(() => processedNFTs.slice(0, displayedCount), [processedNFTs, displayedCount]);

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Explore NFTs</CardTitle>
            <CardDescription>Find your next favorite digital art piece or unique collectible. Use the global search above.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-muted-foreground flex items-center"><History className="mr-1.5 h-3.5 w-3.5"/>Recent Searches</Label>
                  <Button variant="link" size="sm" onClick={handleClearRecentSearches} className="text-xs h-auto p-0">Clear All</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((rs, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-muted" onClick={() => handleRecentSearchClick(rs)}>
                      {rs}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger aria-label="Filter by Category"><Filter className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger aria-label="Filter by Price Range"><Filter className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priceRangeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger aria-label="Filter by Status"><Filter className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue /></SelectTrigger>
                  <SelectContent>
                      {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                  </SelectContent>
              </Select>
              <Select value={selectedSortOption} onValueChange={(value) => setSelectedSortOption(value as SortOption)}>
                <SelectTrigger aria-label="Sort by"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex justify-end items-center mt-2">
                <Badge variant="outline" className="mr-2">{activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active</Badge>
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-primary hover:text-primary/80 text-xs">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {searchTermFromUrl && !isLoadingResults ? `Results for "${searchTermFromUrl}"` : "Explore All"}
              {!isLoadingResults && <span className="text-sm text-muted-foreground ml-2">({processedNFTs.length} found)</span>}
            </h2>
            <div className="flex gap-1">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Grid view">
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="List view">
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {isLoadingResults && (
            <Card className="text-center py-12 shadow-md">
              <CardContent className="flex flex-col items-center">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg text-muted-foreground">
                  {searchTermFromUrl ? `Searching for "${searchTermFromUrl}"...` : "Loading NFTs..."}
                </p>
              </CardContent>
            </Card>
          )}

          {error && !isLoadingResults && (
             <Card className="text-center py-12 shadow-md border-destructive bg-destructive/10">
              <CardContent className="flex flex-col items-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold text-destructive">Error Loading Results</h3>
                <p className="text-muted-foreground mt-1 max-w-md">{error}</p>
              </CardContent>
            </Card>
          )}

          {!isLoadingResults && !error && processedNFTs.length === 0 && (searchTermFromUrl || activeFiltersCount > 0) && (
            <Card className="text-center py-12 shadow-md">
              <CardContent className="flex flex-col items-center">
                <Frown className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground">No NFTs Found</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  {searchTermFromUrl ? `We couldn't find anything matching "${searchTermFromUrl}" with the current filters.` : "No NFTs match your current filters."}
                </p>
                <p className="text-muted-foreground text-sm mt-1">Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-6" onClick={handleClearFilters}>
                  Clear Filters & Explore All
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoadingResults && !error && sourceNfts.length === 0 && !searchTermFromUrl && activeFiltersCount === 0 && (
            <Card className="text-center py-12 shadow-md">
              <CardContent className="flex flex-col items-center">
                <SearchIcon className="mx-auto h-16 w-16 text-primary mb-4 opacity-70" />
                <h3 className="text-xl font-semibold text-foreground">Discover Your Next NFT</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Use the global search bar above or apply filters to find amazing NFTs.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoadingResults && !error && itemsToRender.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {itemsToRender.map(nft => (
                  <NFTCard key={nft.id} {...nft} price={nft.price} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {itemsToRender.map(nft => (
                  <Link href={`/nft/${nft.id}`} key={nft.id} className="block group">
                    <Card className="flex overflow-hidden shadow-md hover:shadow-lg transition-shadow group-hover:border-primary">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 relative shrink-0 border-r">
                        <Image
                          src={nft.imageUrl}
                          alt={nft.title}
                          fill
                          sizes="(max-width: 640px) 25vw, 128px"
                          className="object-cover"
                          data-ai-hint={nft.dataAiHint || "nft image"}
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow min-w-0">
                        <div className="flex-grow space-y-1">
                            <h3 className="text-md font-semibold text-foreground group-hover:text-primary truncate leading-snug">
                                {nft.title}
                            </h3>
                            {nft.artistName && (
                                <p className="text-sm text-muted-foreground truncate">
                                by {nft.artistName}
                                </p>
                            )}
                             <p className="text-sm text-muted-foreground truncate">
                                <span className="font-medium">Category:</span> {nft.category.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <p className="text-lg font-bold text-accent">
                            {nft.price}
                          </p>
                          <Button variant="outline" size="sm" className="ml-3 shrink-0">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )
          )}

          {!isLoadingResults && !error && displayedCount < processedNFTs.length && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                Load More ({processedNFTs.length - displayedCount} remaining)
              </Button>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

