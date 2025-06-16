
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AppLayout } from '@artnft/ui'; // Updated import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3, Loader2, AlertTriangle, Search, Filter, ArrowUpWideNarrow, ArrowDownWideNarrow, Award, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CryptoStat {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  price: number;
  change24h: number;
  marketCap: number;
}

type SortKey = 'marketCap_desc' | 'marketCap_asc' | 'price_desc' | 'price_asc' | 'change24h_desc' | 'change24h_asc' | 'name_asc' | 'name_desc';

const SkeletonCard = () => (
  <Card className="shadow-sm">
    <CardHeader className="p-3 sm:p-4 flex flex-col space-y-1.5">
       <div className="flex flex-row items-start justify-between">
        <div className="flex-1 min-w-0 space-y-1">
          <Skeleton className="h-4 w-20" /> 
          <Skeleton className="h-3 w-10" /> 
        </div>
        <Skeleton className="h-8 w-8 rounded-full ml-2 shrink-0" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" /> 
    </CardHeader>
    <CardContent className="space-y-1.5 pt-1 pb-3 px-3 sm:px-4">
      <Skeleton className="h-5 w-24" /> 
      <div className="flex items-center text-xs mt-1">
        <Skeleton className="h-3.5 w-3.5 mr-1 rounded-full" />
        <Skeleton className="h-3.5 w-12" /> 
      </div>
      <Skeleton className="h-3 w-20 mt-1.5" /> 
    </CardContent>
  </Card>
);

const DEBOUNCE_DELAY = 300;
const INITIAL_LIMIT = 20;
const LOAD_MORE_LIMIT = 10;

export default function StatsPage() {
  const [cryptoData, setCryptoData] = useState<CryptoStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('marketCap_desc');
  const [currentStart, setCurrentStart] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [topGainersIds, setTopGainersIds] = useState<Set<string>>(new Set());
  const [topLosersIds, setTopLosersIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setCurrentStart(1); 
      setCryptoData([]); 
    }
    setError(null);

    const limitToFetch = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT;
    const startOffset = isLoadMore ? currentStart : 1;

    try {
      const response = await fetch(`/api/crypto-stats?start=${startOffset}&limit=${limitToFetch}`);
      if (!response.ok) {
        const errorResult = await response.json();
        if (errorResult.error && typeof errorResult.error === 'string') {
            if (errorResult.error.toLowerCase().includes('api key is not configured')) {
                throw new Error('API_KEY_MISSING'); 
            } else if (errorResult.error.toLowerCase().includes('api key is invalid')) {
                throw new Error('API_KEY_INVALID'); 
            }
        }
        throw new Error(errorResult.error || `Failed to fetch crypto data: ${response.statusText}`);
      }
      const result: { data: CryptoStat[], hasMore: boolean } = await response.json();
      
      setCryptoData(prevData => isLoadMore ? [...prevData, ...result.data] : result.data);
      setHasMoreData(result.hasMore && result.data.length === limitToFetch); 
      setCurrentStart(prevStart => prevStart + result.data.length);
      
      if (!isLoadMore) {
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'API_KEY_MISSING') {
          setError('Configuration Error: The CoinMarketCap API key is missing. Please set COINMARKETCAP_API_KEY in your .env.local file and restart the server.');
        } else if (err.message === 'API_KEY_INVALID') {
          setError('API Key Error: The CoinMarketCap API key is invalid. Please check COINMARKETCAP_API_KEY in your .env.local file and ensure it is correct and active.');
        } else {
          setError(`Failed to load data: ${err.message}. Please try again later.`);
        }
      } else {
        setError('An unknown error occurred while fetching data.');
      }
      console.error('Error in fetchData:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [currentStart]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (cryptoData.length > 0) {
      const sortedByChange = [...cryptoData].sort((a, b) => b.change24h - a.change24h);
      const gainers = sortedByChange.slice(0, Math.min(3, cryptoData.length)).map(coin => coin.id);
      const losers = sortedByChange.slice(Math.max(0, cryptoData.length - 3)).reverse().map(coin => coin.id);
      setTopGainersIds(new Set(gainers));
      setTopLosersIds(new Set(losers));
    }
  }, [cryptoData]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...cryptoData];

    if (debouncedSearchTerm) {
      processedData = processedData.filter(
        (coin) =>
          coin.name.toLowerCase().includes(debouncedSearchTerm) ||
          coin.symbol.toLowerCase().includes(debouncedSearchTerm)
      );
    }

    switch (sortKey) {
      case 'marketCap_desc':
        processedData.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case 'marketCap_asc':
        processedData.sort((a, b) => a.marketCap - b.marketCap);
        break;
      case 'price_desc':
        processedData.sort((a, b) => b.price - a.price);
        break;
      case 'price_asc':
        processedData.sort((a, b) => a.price - b.price);
        break;
      case 'change24h_desc':
        processedData.sort((a, b) => b.change24h - a.change24h);
        break;
      case 'change24h_asc':
        processedData.sort((a, b) => a.change24h - b.change24h);
        break;
      case 'name_asc':
        processedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        processedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return processedData;
  }, [cryptoData, debouncedSearchTerm, sortKey]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const formatSmallCurrency = (value: number) => {
    if (value < 0.01 && value > 0) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(value);
    }
    return formatCurrency(value);
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    return value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
  };

  const sortOptions: { value: SortKey; label: string; icon?: React.ElementType }[] = [
    { value: 'marketCap_desc', label: 'Market Cap (High-Low)', icon: ArrowDownWideNarrow },
    { value: 'marketCap_asc', label: 'Market Cap (Low-High)', icon: ArrowUpWideNarrow },
    { value: 'price_desc', label: 'Price (High-Low)', icon: ArrowDownWideNarrow },
    { value: 'price_asc', label: 'Price (Low-High)', icon: ArrowUpWideNarrow },
    { value: 'change24h_desc', label: '24h Change (Gainers)', icon: TrendingUp },
    { value: 'change24h_asc', label: '24h Change (Losers)', icon: TrendingDown },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
  ];


  return (
    <AppLayout>
      <div className="p-4 md:px-6 md:py-8 max-w-6xl mx-auto">
        <header className="mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg md:text-xl font-bold font-headline text-primary flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 md:h-6 md:w-6" /> Crypto Market Stats
            </h1>
            {lastUpdated && !isLoading && !error && (
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-0">Last updated: {lastUpdated}</p>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Cryptocurrency market data.
          </p>
        </header>

        <Card className="mb-4 shadow-sm">
            <CardContent className="p-3 sm:p-4 space-y-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or symbol..."
                        className="pl-8 h-9 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                    <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center">
                                    {opt.icon && <opt.icon className="h-4 w-4 mr-2 text-muted-foreground" />}
                                    {opt.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        {isLoading && cryptoData.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array(INITIAL_LIMIT).fill(0).map((_, index) => <SkeletonCard key={`skel-${index}`} />)}
          </div>
        )}

        {error && !isLoading && cryptoData.length === 0 && (
          <Card className="text-center py-8 md:py-10 shadow-sm border-destructive bg-destructive/5">
            <CardContent className="flex flex-col items-center">
              <AlertTriangle className="mx-auto h-8 w-8 md:h-10 md:w-10 text-destructive mb-3" />
              <h3 className="text-md md:text-lg font-semibold text-destructive">Error Fetching Data</h3>
              <p className="text-muted-foreground mt-1 max-w-md px-4 text-xs md:text-sm">{error}</p>
              <Button variant="outline" className="mt-5 text-sm h-9" onClick={() => fetchData()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && cryptoData.length === 0 && !error && (
           <Card className="text-center py-8 md:py-10 shadow-sm border-border border-dashed">
            <CardContent className="flex flex-col items-center">
              <BarChart3 className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3" />
              <h3 className="text-md md:text-lg font-semibold text-foreground">No Data Available</h3>
              <p className="text-muted-foreground mt-1 text-xs md:text-sm">
                {debouncedSearchTerm ? `No coins match "${searchTerm}".` : "Could not load cryptocurrency data."}
              </p>
               <Button variant="outline" className="mt-5 text-sm h-9" onClick={() => fetchData()}>
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredAndSortedData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredAndSortedData.map((coin) => {
              const isTopGainer = topGainersIds.has(coin.id);
              const isTopLoser = topLosersIds.has(coin.id);
              return (
                <Card key={coin.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
                  <CardHeader className="p-3 sm:p-4 flex flex-col space-y-1.5">
                    <div className="flex flex-row items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium tracking-tight truncate" title={coin.name}>{coin.name}</CardTitle>
                        <p className="text-xs text-muted-foreground pt-0.5">{coin.symbol}</p>
                      </div>
                      <Image 
                        src={coin.logoUrl} 
                        alt={`${coin.name} logo`} 
                        width={32} 
                        height={32} 
                        className="rounded-full ml-2 shrink-0" 
                        data-ai-hint={`${coin.symbol.toLowerCase()} logo`}
                      />
                    </div>
                    {(isTopGainer || isTopLoser) && (
                      <div>
                        <Badge 
                          variant="secondary" 
                          className={`text-[0.6rem] py-0.5 px-1.5 inline-flex items-center ${isTopGainer ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}
                        >
                          {isTopGainer && <Star className="h-2.5 w-2.5 mr-1"/>}
                          {isTopLoser && <Award className="h-2.5 w-2.5 mr-1"/>}
                          {isTopGainer ? 'Top Gainer' : 'Top Loser'}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between pt-1 pb-3 px-3 sm:px-4">
                    <div>
                      <div className="text-md font-bold text-foreground mb-0.5 sm:text-lg">{formatSmallCurrency(coin.price)}</div>
                      <div className={`flex items-center text-xs ${coin.change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                        )}
                        <span>{coin.change24h.toFixed(2)}% (24h)</span>
                      </div>
                    </div>
                    <p className="text-[0.65rem] text-muted-foreground mt-1.5 sm:text-xs">
                      Mkt Cap: <span className="font-medium text-foreground/80">{formatMarketCap(coin.marketCap)}</span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredAndSortedData.length > 0 && hasMoreData && !isLoadingMore && !error && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => fetchData(true)} disabled={isLoadingMore}>
              {isLoadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Load More
            </Button>
          </div>
        )}
        {isLoadingMore && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}
        
         <p className="text-center text-xs text-muted-foreground mt-6">
            Cryptocurrency data provided by CoinMarketCap. Not financial advice.
        </p>
      </div>
    </AppLayout>
  );
}
