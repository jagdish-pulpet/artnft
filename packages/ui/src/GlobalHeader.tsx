
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, type FormEvent } from 'react';
import ArtNFTLogo from './ArtNFTLogo'; // Updated path
import { Button } from '@/components/ui/button'; // Relies on consuming app's alias
import { Input } from '@/components/ui/input';   // Relies on consuming app's alias
import { Bell, PlusSquare, Search as SearchIcon, X } from 'lucide-react';

const DEBOUNCE_DELAY = 500;

export default function GlobalHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null && query !== searchTerm) {
      setSearchTerm(query);
      setDebouncedSearchTerm(query); 
    } else if (query === null && searchTerm !== '') {
      if (pathname !== '/search') {
        setSearchTerm('');
        setDebouncedSearchTerm('');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]); 

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
      router.replace('/search');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, pathname, router]); 

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else if (pathname === '/search' && searchParams.has('q')) {
      router.push('/search'); 
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm(''); 
    if (pathname === '/search') {
      router.push('/search'); 
    }
  };

  const userName = "CreativeUser123"; // Placeholder

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/home" aria-label="Go to Homepage">
          <ArtNFTLogo />
        </Link>

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
