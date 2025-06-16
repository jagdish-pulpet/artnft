
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import ArtNFTLogo from '@ui/ArtNFTLogo'; // Updated import
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bell, PlusSquare, Search as SearchIcon, X } from 'lucide-react';

const DEBOUNCE_DELAY = 500;

export default function GlobalHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Sync search input with URL query parameter 'q'
  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null && query !== searchTerm) {
      setSearchTerm(query);
      setDebouncedSearchTerm(query); // Also set debounced term to avoid immediate re-navigation
    } else if (query === null && searchTerm !== '') {
      // If q is removed from URL (e.g. navigating away from search)
      // and we are not on search page, clear the input.
      // If we ARE on search page, the page itself might want to control this.
      // For now, let's clear if not on search page.
      if (pathname !== '/search') {
        setSearchTerm('');
        setDebouncedSearchTerm('');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]); // Rerun when q in URL changes or pathname changes

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== debouncedSearchTerm) {
        setDebouncedSearchTerm(searchTerm);
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      if (pathname === '/search') {
        router.replace(`/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(debouncedSearchTerm)}`);
      }
    } else if (debouncedSearchTerm === '' && pathname === '/search' && searchParams.has('q')) {
      // If search term is cleared while on search page, remove q from URL
      router.replace('/search');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, pathname, router]); // router was missing, searchParams also

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      // Immediately navigate/update on submit
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else if (pathname === '/search' && searchParams.has('q')) {
      router.push('/search'); // Clear search query if submitted empty on search page
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm(''); // Ensure debounced also clears
    if (pathname === '/search') {
      router.push('/search'); // Navigate to search page without query
    }
  };

  const userName = "CreativeUser123"; // Placeholder

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link href="/home" aria-label="Go to Homepage">
          <ArtNFTLogo />
        </Link>

        {/* Center: Search Form */}
        <form onSubmit={handleSearchSubmit} className="mx-4 flex-grow max-w-md relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search NFTs, collections, artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 h-10 rounded-full border-border hover:border-primary focus:border-primary focus:ring-primary/50 transition-colors"
            aria-label="Search"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        {/* Right: Actions & User */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/create-nft">
              <PlusSquare className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Create NFT</span>
            </Link>
          </Button>
          <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image
              src="https://placehold.co/32x32.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full border border-border"
              data-ai-hint="profile avatar"
            />
            <span className="hidden lg:inline text-sm font-medium text-foreground">{userName}</span>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
