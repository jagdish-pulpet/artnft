
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, LayoutGrid, Search, AlertCircle, PlusSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CollectionCard } from '@/components/collection/collection-card';
import { CollectionCardSkeleton } from '@/components/collection/collection-card-skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiError } from '@/lib/apiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Collection, PaginatedResponse } from '@/types/entities';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_PAGE = 8;

interface ApiResponse extends PaginatedResponse<Collection> {}

const sortOptions = [
  { value: 'createdAt_desc', label: 'Recently Added' },
  { value: 'volumeTraded_desc', label: 'Volume: High to Low' },
  { value: 'floorPrice_asc', label: 'Floor Price: Low to High' },
  { value: 'itemCount_desc', label: 'Most Items' },
  { value: 'name_asc', label: 'Name: A-Z' },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(sortOptions[0].value);

  const fetchCollections = useCallback(async (pageToFetch: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        limit: String(ITEMS_PER_PAGE),
        sortBy: sortOption,
      });
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await apiService.get<ApiResponse>(`/collections?${params.toString()}`);
      setCollections(response.data || []);
      setCurrentPage(response.meta?.page || 1);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load collections.';
      setError(errorMessage);
      setCollections([]);
      console.error("Failed to fetch collections:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, sortOption]);

  useEffect(() => {
    fetchCollections(currentPage);
  }, [fetchCollections, currentPage]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    if (currentPage !== 1) { // Avoid initial double fetch if currentPage starts at 1
      setCurrentPage(1);
    } else {
      fetchCollections(1); // Fetch if already on page 1 but filters changed
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortOption]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
             <Button asChild>
              <Link href="/collections/create">
                <PlusSquare className="mr-2 h-4 w-4" /> Create Collection
              </Link>
            </Button>
          </div>

          <header className="mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary tracking-tight mb-3">
              Explore Collections
            </h1>
            <p className="text-lg text-foreground/80 font-body">
              Discover a universe of unique digital assets from various creators and collections.
            </p>
          </header>
          
          <div className="mb-8 p-4 sm:p-6 bg-card rounded-xl shadow-lg sticky top-16 z-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="relative md:col-span-2">
                <Input
                  type="search"
                  placeholder="Search collections by name..."
                  className="w-full pl-10 pr-4 h-11 text-base focus:bg-background"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-1 gap-4 md:col-span-1 md:flex md:items-center">
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-11 text-base w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && collections.length === 0 ? ( // Show skeletons only if loading and no data yet
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <CollectionCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : !isLoading && collections.length === 0 ? (
             <div className="flex flex-col items-center justify-center rounded-xl bg-card p-8 sm:p-12 shadow-xl text-center min-h-[300px]">
              <LayoutGrid className="h-16 w-16 text-muted-foreground mb-6" strokeWidth={1.5} />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No Collections Found</h2>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any collections matching your current criteria. Try adjusting your search or explore other categories.
              </p>
              <Button variant="outline" className="mt-6" asChild>
                <Link href="/home">Explore Home</Link>
              </Button>
            </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} {...collection} />
              ))}
              {/* Show skeletons for remaining slots if loading next page */}
              {isLoading && collections.length > 0 && Array.from({ length: Math.max(0, ITEMS_PER_PAGE - collections.length) }).map((_, index) => (
                  <CollectionCardSkeleton key={`loading-more-skeleton-${index}`} />
              ))}
            </div>
          )}
          
          {!isLoading && totalPages > 1 && (
             <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="py-8" 
            />
          )}

        </div>
      </main>
      <Toaster />
    </>
  );
}

