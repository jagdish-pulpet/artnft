
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
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

// Enhanced NFTCardProps to support new features
interface EnhancedNFTCardProps extends NFTCardProps {
  priceEth: number;
  category: 'digital-art' | 'photography' | 'music' | 'collectible' | 'virtual-world' | 'utility' | 'other';
  status: 'buy-now' | 'on-auction';
  dateAdded: string; // ISO string
}

// This MOCK_ALL_NFTS_FOR_SIMULATION represents the complete dataset the backend *could* return
const MOCK_ALL_NFTS_FOR_SIMULATION: EnhancedNFTCardProps[] = [
  { id: '1', imageUrl: 'https://placehold.co/400x400.png', title: 'Abstract Flow', price: '1.5 ETH', priceEth: 1.5, artistName: 'VisionaryArtist', dataAiHint: 'abstract colorful', category: 'digital-art', status: 'buy-now', dateAdded: '2023-10-01T10:00:00Z' },
  { id: '2', imageUrl: 'https://placehold.co/400x400.png', title: 'Cyber Dreams', price: '2.2 ETH', priceEth: 2.2, artistName: 'DigitalSculptor', dataAiHint: 'cyberpunk neon', category: 'digital-art', status: 'on-auction', dateAdded: '2023-10-15T12:30:00Z' },
  { id: '3', imageUrl: 'https://placehold.co/400x400.png', title: 'Pixelated Serenity', price: '0.8 ETH', priceEth: 0.8, artistName: '8BitWonder', dataAiHint: 'pixel art', category: 'collectible', status: 'buy-now', dateAdded: '2023-09-20T08:00:00Z' },
  { id: '4', imageUrl: 'https://placehold.co/400x400.png', title: 'Cosmic Explorer', price: '3.0 ETH', priceEth: 3.0, artistName: 'GalaxyPainter', dataAiHint: 'space galaxy', category: 'virtual-world', status: 'on-auction', dateAdded: '2023-10-25T14:00:00Z' },
  { id: 's1', imageUrl: 'https://placehold.co/400x400.png', title: 'Sunset Digitalis', price: '1.1 ETH', priceEth: 1.1, artistName: 'PhotoMaster', dataAiHint: 'sunset digital', category: 'photography', status: 'buy-now', dateAdded: '2023-11-01T18:00:00Z' },
  { id: 's2', imageUrl: 'https://placehold.co/400x400.png', title: 'Monochrome Moods', price: '0.5 ETH', priceEth: 0.5, artistName: 'BWArt', dataAiHint: 'monochrome abstract', category: 'digital-art', status: 'buy-now', dateAdded: '2023-11-05T11:00:00Z' },
  { id: 's3', imageUrl: 'https://placehold.co/400x400.png', title: 'Future Beats', price: '0.3 ETH', priceEth: 0.3, artistName: 'SynthWave', dataAiHint: 'music album', category: 'music', status: 'on-auction', dateAdded: '2023-11-10T20:00:00Z' },
  { id: 's4', imageUrl: 'https://placehold.co/400x400.png', title: 'Ancient Relic Token', price: '5.0 ETH', priceEth: 5.0, artistName: 'TokenForge', dataAiHint: 'ancient token', category: 'utility', status: 'buy-now', dateAdded: '2023-08-15T09:00:00Z' },
  { id: 's5', imageUrl: 'https://placehold.co/400x400.png', title: 'Vibrant Portrait', price: '0.75 ETH', priceEth: 0.75, artistName: 'ArtByJane', dataAiHint: 'colorful portrait', category: 'digital-art', status: 'buy-now', dateAdded: '2023-11-12T10:00:00Z' },
  { id: 's6', imageUrl: 'https://placehold.co/400x400.png', title: 'Nature\'s Lens', price: '1.8 ETH', priceEth: 1.8, artistName: 'WildFocus', dataAiHint: 'nature photography', category: 'photography', status: 'on-auction', dateAdded: '2023-11-08T15:00:00Z' },
  { id: 's7', imageUrl: 'https://placehold.co/400x400.png', title: 'City Light Trails', price: '2.5 ETH', priceEth: 2.5, artistName: 'UrbanLens', dataAiHint: 'city night', category: 'photography', status: 'buy-now', dateAdded: '2023-11-15T19:00:00Z' },
  { id: 's8', imageUrl: 'https://placehold.co/400x400.png', title: 'LoFi Chill Hop', price: '0.2 ETH', priceEth: 0.2, artistName: 'BeatProducer', dataAiHint: 'lofi music', category: 'music', status: 'buy-now', dateAdded: '2023-11-18T22:00:00Z' },
  { id: 's9', imageUrl: 'https://placehold.co/400x400.png', title: 'Metaverse Wearable', price: '0.9 ETH', priceEth: 0.9, artistName: 'DigitalTailor', dataAiHint: 'virtual clothing', category: 'virtual-world', status: 'on-auction', dateAdded: '2023-11-20T10:00:00Z' },
  { id: 's10', imageUrl: 'https://placehold.co/400x400.png', title: 'Gaming Access Pass', price: '1.0 ETH', priceEth: 1.0, artistName: 'GameDAO', dataAiHint: 'gaming pass', category: 'utility', status: 'buy-now', dateAdded: '2023-11-22T13:00:00Z' },
  { id: 's11', imageUrl: 'https://placehold.co/400x400.png', title: 'Sculpted Form X', price: '3.5 ETH', priceEth: 3.5, artistName: '3DModeller', dataAiHint: '3d sculpture', category: 'digital-art', status: 'on-auction', dateAdded: '2023-07-01T10:00:00Z' },
  { id: 's12', imageUrl: 'https://placehold.co/400x400.png', title: 'Animated Character Pack', price: '4.0 ETH', priceEth: 4.0, artistName: 'AnimatorPro', dataAiHint: 'cartoon characters', category: 'collectible', status: 'buy-now', dateAdded: '2023-07-10T11:00:00Z' },
  { id: 's13', imageUrl: 'https://placehold.co/400x400.png', title: 'Abstract Soundscape', price: '0.6 ETH', priceEth: 0.6, artistName: 'AudioAlchemist', dataAiHint: 'sound wave', category: 'music', status: 'buy-now', dateAdded: '2023-06-05T17:00:00Z' },
  { id: 's14', imageUrl: 'https://placehold.co/400x400.png', title: 'AI Generated Landscape', price: '1.3 ETH', priceEth: 1.3, artistName: 'GenArtCreator', dataAiHint: 'ai landscape', category: 'digital-art', status: 'on-auction', dateAdded: '2023-05-20T09:00:00Z' },
  { id: 's15', imageUrl: 'https://placehold.co/400x400.png', title: 'Vintage Photo Filter NFT', price: '0.4 ETH', priceEth: 0.4, artistName: 'RetroGrapher', dataAiHint: 'vintage photo', category: 'photography', status: 'buy-now', dateAdded: '2023-04-10T12:00:00Z' },
  { id: 's16', imageUrl: 'https://placehold.co/400x400.png', title: 'Dream Weaver', price: '1.9 ETH', priceEth: 1.9, artistName: 'SurrealDreamer', dataAiHint: 'surreal abstract', category: 'digital-art', status: 'buy-now', dateAdded: '2023-11-25T10:00:00Z' },
  { id: 's17', imageUrl: 'https://placehold.co/400x400.png', title: 'Synth Pop Gem', price: '0.25 ETH', priceEth: 0.25, artistName: 'PopProducer', dataAiHint: 'pop music', category: 'music', status: 'on-auction', dateAdded: '2023-11-26T11:00:00Z' },
  { id: 's18', imageUrl: 'https://placehold.co/400x400.png', title: 'VR Gallery Pass', price: '2.1 ETH', priceEth: 2.1, artistName: 'MetaverseEvents', dataAiHint: 'vr gallery', category: 'utility', status: 'buy-now', dateAdded: '2023-11-27T12:00:00Z' },
  { id: 's19', imageUrl: 'https://placehold.co/400x400.png', title: 'Collector Figurine #007', price: '3.3 ETH', priceEth: 3.3, artistName: 'ToyMaster', dataAiHint: 'action figure', category: 'collectible', status: 'on-auction', dateAdded: '2023-11-28T13:00:00Z' },
  { id: 's20', imageUrl: 'https://placehold.co/400x400.png', title: 'Aurora Borealis Photo', price: '0.95 ETH', priceEth: 0.95, artistName: 'NorthernLights', dataAiHint: 'aurora photography', category: 'photography', status: 'buy-now', dateAdded: '2023-11-29T14:00:00Z' },
  { id: 's21', imageUrl: 'https://placehold.co/400x400.png', title: 'Digital Sketchbook Page', price: '0.15 ETH', priceEth: 0.15, artistName: 'DailyDoodler', dataAiHint: 'sketch art', category: 'digital-art', status: 'buy-now', dateAdded: '2023-11-30T15:00:00Z' },
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

      if (statusFilterValue !== 'all-status') {
        simulatedResults = simulatedResults.filter(nft => nft.status === statusFilterValue);
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
    } finally {
      setIsLoadingResults(false);
    }
  }, [addRecentSearch, setIsLoadingResults, setError, setSourceNfts, setDisplayedCount]);


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
      { value: 'buy-now', label: 'Buy Now' },
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
                  <NFTCard key={nft.id} {...nft} />
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
    
