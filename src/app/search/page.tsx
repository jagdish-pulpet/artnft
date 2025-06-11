
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
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface DBNFT {
  id: string;
  title: string;
  image_url: string;
  price: number | null;
  artist_name: string | null;
  category: string; // This should match the 'category' TEXT field in your 'nfts' table
  status: string;
  created_at: string;
}

const MAX_RECENT_SEARCHES = 5;
const INITIAL_ITEMS_TO_DISPLAY = 12;
const ITEMS_PER_LOAD_MORE = 8;

type SortOption = 'created_at-desc' | 'created_at-asc' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc';

const LoadingNFTSkeleton = ({ count = INITIAL_ITEMS_TO_DISPLAY, viewMode = 'grid' }: { count?: number, viewMode?: 'grid' | 'list' }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(count).fill(0).map((_,i) => (
          <Card key={`skel-nft-grid-${i}`} className="shadow-lg">
            <Skeleton className="aspect-square w-full bg-muted" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
              <Skeleton className="h-6 w-1/3 bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_,i) => (
        <Card key={`skel-nft-list-${i}`} className="flex overflow-hidden shadow-md">
          <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-muted" />
          <div className="p-4 flex flex-col flex-grow min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-1/2 bg-muted" />
            <Skeleton className="h-4 w-1/3 bg-muted" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-7 w-24 bg-muted" />
              <Skeleton className="h-9 w-28 bg-muted" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTermFromUrl, setSearchTermFromUrl] = useState('');
  const [allFetchedNfts, setAllFetchedNfts] = useState<DBNFT[]>([]);
  const [displayedNfts, setDisplayedNfts] = useState<NFTCardProps[]>([]);
  const [displayedCount, setDisplayedCount] = useState<number>(INITIAL_ITEMS_TO_DISPLAY);

  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all-prices');
  const [selectedStatus, setSelectedStatus] = useState('all-status');
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption>('created_at-desc');
  
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [totalMatchingNfts, setTotalMatchingNfts] = useState(0);

  const addRecentSearch = useCallback((term: string) => {
    if (!term) return;
    setRecentSearches(prev => {
      const newSearches = [term, ...prev.filter(s => s.toLowerCase() !== term.toLowerCase())];
      const limitedSearches = newSearches.slice(0, MAX_RECENT_SEARCHES);
      if (typeof window !== 'undefined') {
        localStorage.setItem('artnft_recent_searches', JSON.stringify(limitedSearches));
      }
      return limitedSearches;
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRecentSearches = localStorage.getItem('artnft_recent_searches');
      if (storedRecentSearches) {
        setRecentSearches(JSON.parse(storedRecentSearches));
      }
    }
  }, []);
  
  const transformDbNftToCardProps = (dbNfts: DBNFT[]): NFTCardProps[] => {
    return dbNfts.map(nft => ({
      id: nft.id,
      imageUrl: nft.image_url || 'https://placehold.co/400x400.png',
      title: nft.title,
      price: nft.price ? `${nft.price} ETH` : 'N/A',
      artistName: nft.artist_name || 'Unknown Artist',
      dataAiHint: 'nft image'
    }));
  };

  const fetchNftsFromSupabase = useCallback(async (query: string, category: string, priceRange: string, statusFilterValue: string, sort: SortOption) => {
    setIsLoadingResults(true);
    setError(null);
    try {
      let supabaseQuery = supabase
        .from('nfts')
        .select('id, title, image_url, price, artist_name, category, status, created_at', { count: 'exact' });


      if (query) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,artist_name.ilike.%${query}%`);
      }
      if (category !== 'all-categories') {
        supabaseQuery = supabaseQuery.eq('category', category); 
      }
      if (priceRange !== 'all-prices') {
        if (priceRange === '0-0.5') supabaseQuery = supabaseQuery.lte('price', 0.5);
        else if (priceRange === '0.5-2') supabaseQuery = supabaseQuery.gte('price', 0.5).lte('price', 2);
        else if (priceRange === '2+') supabaseQuery = supabaseQuery.gte('price', 2);
      }
      if (statusFilterValue !== 'all-status') {
        supabaseQuery = supabaseQuery.eq('status', statusFilterValue);
      } else {
         supabaseQuery = supabaseQuery.in('status', ['listed', 'on_auction']);
      }
      
      const [sortColumn, sortOrder] = sort.split('-');
      supabaseQuery = supabaseQuery.order(sortColumn, { ascending: sortOrder === 'asc' });
      
      const { data, error: dbError, count } = await supabaseQuery;

      if (dbError) throw dbError;
      
      setAllFetchedNfts(data as DBNFT[] || []);
      setTotalMatchingNfts(count || 0);
      setDisplayedNfts(transformDbNftToCardProps((data as DBNFT[] || []).slice(0, INITIAL_ITEMS_TO_DISPLAY)));
      setDisplayedCount(INITIAL_ITEMS_TO_DISPLAY);
      
      if (query) {
        addRecentSearch(query);
      }

    } catch (err: any) {
      console.error("Supabase fetch error:", err);
      setError(`Could not load search results: ${err.message}`);
      setAllFetchedNfts([]);
      setDisplayedNfts([]);
      setTotalMatchingNfts(0);
    } finally {
      setIsLoadingResults(false);
    }
  }, [addRecentSearch]);

  const qFromUrl = searchParams.get('q') || '';

  useEffect(() => {
    setSearchTermFromUrl(qFromUrl);
    fetchNftsFromSupabase(qFromUrl, selectedCategory, selectedPriceRange, selectedStatus, selectedSortOption);
  }, [qFromUrl, selectedCategory, selectedPriceRange, selectedStatus, selectedSortOption, fetchNftsFromSupabase]);


  useEffect(() => {
    let count = 0;
    if (qFromUrl) count++;
    if (selectedCategory !== 'all-categories') count++;
    if (selectedPriceRange !== 'all-prices') count++;
    if (selectedStatus !== 'all-status') count++;
    setActiveFiltersCount(count);
  }, [qFromUrl, selectedCategory, selectedPriceRange, selectedStatus]);


  const handleClearFilters = () => {
    setSelectedCategory('all-categories');
    setSelectedPriceRange('all-prices');
    setSelectedStatus('all-status');
    setSelectedSortOption('created_at-desc'); 
    if (qFromUrl) {
        router.push('/search');
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artnft_recent_searches');
    }
  };

  const handleRecentSearchClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleLoadMore = () => {
    const newCount = Math.min(displayedCount + ITEMS_PER_LOAD_MORE, allFetchedNfts.length);
    setDisplayedNfts(transformDbNftToCardProps(allFetchedNfts.slice(0, newCount)));
    setDisplayedCount(newCount);
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
      { value: 'all-status', label: 'Any Status (Listed/Auction)' },
      { value: 'listed', label: 'Buy Now' },
      { value: 'on_auction', label: 'On Auction' },
  ];
  
  const sortOptions: {value: SortOption, label: string}[] = [
    { value: 'created_at-desc', label: 'Recently Added' },
    { value: 'created_at-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'title-asc', label: 'Title: A-Z' },
    { value: 'title-desc', label: 'Title: Z-A' },
  ];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Explore NFTs</CardTitle>
            <CardDescription>Find your next favorite digital art piece or unique collectible. Use the global search (top of page) or filters below.</CardDescription>
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
                  Clear Filters & Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {searchTermFromUrl && !isLoadingResults ? `Results for "${searchTermFromUrl}"` : "Explore All"}
              {!isLoadingResults && <span className="text-sm text-muted-foreground ml-2">({totalMatchingNfts} found)</span>}
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
            <LoadingNFTSkeleton count={INITIAL_ITEMS_TO_DISPLAY} viewMode={viewMode} />
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

          {!isLoadingResults && !error && totalMatchingNfts === 0 && (searchTermFromUrl || activeFiltersCount > 0) && (
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

          {!isLoadingResults && !error && totalMatchingNfts === 0 && !searchTermFromUrl && activeFiltersCount === 0 && ( 
            <Card className="text-center py-12 shadow-md">
              <CardContent className="flex flex-col items-center">
                <SearchIcon className="mx-auto h-16 w-16 text-primary mb-4 opacity-70" />
                <h3 className="text-xl font-semibold text-foreground">Discover Your Next NFT</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Use the global search bar (top of page) or apply filters to find amazing NFTs.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoadingResults && !error && displayedNfts.length > 0 && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedNfts.map(nft => (
                  <NFTCard key={nft.id} {...nft} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedNfts.map(nft => (
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
                                <span className="font-medium">Category:</span> {(allFetchedNfts.find(dbnft => dbnft.id === nft.id)?.category || 'N/A').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
          
          {!isLoadingResults && !error && displayedCount < totalMatchingNfts && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                Load More ({totalMatchingNfts - displayedCount} remaining)
              </Button>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
    