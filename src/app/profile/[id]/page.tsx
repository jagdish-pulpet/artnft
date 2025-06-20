
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Github, Twitter, Globe, BadgeCheck, ShoppingBag, List, Palette, ArrowLeft, ArrowRight, UserCircle2, Loader2, AlertCircle } from 'lucide-react';
import { NftCard } from '@/components/nft/nft-card';
import { CollectionCard } from '@/components/collection/collection-card';
import type { Nft as NftProps, PaginatedResponse, Collection, User as UserProfileData } from '@/types/entities';
import { Toaster } from '@/components/ui/toaster';
import { NftCardSkeleton } from '@/components/nft/nft-card-skeleton';
import { CollectionCardSkeleton } from '@/components/collection/collection-card-skeleton';
import { apiService, ApiError } from '@/lib/apiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_TAB = 8;

interface PublicUserProfileData extends Pick<UserProfileData, 'id' | 'username' | 'walletAddress' | 'avatarUrl' | 'coverUrl' | 'bio' | 'socialLinks' | 'createdAt'> {
  isVerifiedCreator?: boolean; // This field doesn't exist on UserEntity, using roles or a separate flag if needed
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth(); 
  const userId = params.id as string;

  const [profileData, setProfileData] = useState<PublicUserProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [createdNfts, setCreatedNfts] = useState<NftProps[]>([]);
  const [isLoadingCreated, setIsLoadingCreated] = useState(true);
  const [createdError, setCreatedError] = useState<string | null>(null);
  const [createdPage, setCreatedPage] = useState(1);
  const [totalCreatedPages, setTotalCreatedPages] = useState(1);

  const [ownedNfts, setOwnedNfts] = useState<NftProps[]>([]);
  const [isLoadingOwned, setIsLoadingOwned] = useState(true);
  const [ownedError, setOwnedError] = useState<string | null>(null);
  const [ownedPage, setOwnedPage] = useState(1);
  const [totalOwnedPages, setTotalOwnedPages] = useState(1);
  
  const [collectionsCreated, setCollectionsCreated] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [totalCollectionsPages, setTotalCollectionsPages] = useState(1);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const response = await apiService.get<{data: PublicUserProfileData}>(`/users/${userId}`);
      setProfileData(response.data);
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load user profile.';
      setProfileError(errorMessage);
      setProfileData(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId]);

  const fetchCreatedNfts = useCallback(async (page: number) => {
    if (!userId) return;
    setIsLoadingCreated(true);
    setCreatedError(null);
    try {
      const response = await apiService.get<PaginatedResponse<NftProps>>(
        `/nfts?creatorId=${userId}&page=${page}&limit=${ITEMS_PER_TAB}`
      );
      setCreatedNfts(response.data || []);
      setTotalCreatedPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_TAB));
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load created NFTs.';
      setCreatedError(errorMessage);
    } finally {
      setIsLoadingCreated(false);
    }
  }, [userId]);

  const fetchOwnedNfts = useCallback(async (page: number) => {
    if (!userId) return;
    setIsLoadingOwned(true);
    setOwnedError(null);
    try {
      const response = await apiService.get<PaginatedResponse<NftProps>>(
        `/nfts?ownerId=${userId}&page=${page}&limit=${ITEMS_PER_TAB}`
      );
      setOwnedNfts(response.data || []);
      setTotalOwnedPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_TAB));
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load owned NFTs.';
      setOwnedError(errorMessage);
    } finally {
      setIsLoadingOwned(false);
    }
  }, [userId]);

  const fetchUserCollections = useCallback(async (page: number) => {
    if (!userId) return;
    setIsLoadingCollections(true);
    setCollectionsError(null);
    try {
      const response = await apiService.get<PaginatedResponse<Collection>>(
        `/collections?creatorId=${userId}&page=${page}&limit=${ITEMS_PER_TAB}`
      );
      setCollectionsCreated(response.data || []);
      setTotalCollectionsPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_TAB));
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load user collections.';
      setCollectionsError(errorMessage);
    } finally {
      setIsLoadingCollections(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [userId, fetchUserProfile]);
  
  useEffect(() => {
    if (userId) fetchCreatedNfts(createdPage);
  }, [userId, createdPage, fetchCreatedNfts]);

  useEffect(() => {
    if (userId) fetchOwnedNfts(ownedPage);
  }, [userId, ownedPage, fetchOwnedNfts]);

  useEffect(() => {
    if (userId) fetchUserCollections(collectionsPage);
  }, [userId, collectionsPage, fetchUserCollections]);

  const renderNftGrid = (
    nfts: NftProps[], 
    isLoading: boolean, 
    error: string | null,
    currentPage: number, 
    totalPages: number, 
    setPage: (page: number) => void, 
    tabName: string
  ) => {
    if (error) return <Alert variant="destructive" className="col-span-full mt-8"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>;
    return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading 
          ? Array.from({ length: ITEMS_PER_TAB }).map((_, index) => <NftCardSkeleton key={`${tabName}-skeleton-${index}`} />)
          : nfts.length > 0 ? nfts.map((nft) => {
              const nftCardProps = {
                  ...nft,
                  price: nft.price !== undefined && nft.price !== null ? `${nft.price} ${nft.currency || 'ETH'}` : undefined,
                  creator: nft.creator?.username || 'N/A' // Ensure creator is accessed safely
              };
              return <NftCard key={`${tabName}-${nft.id}`} {...nftCardProps} />
          }) 
          : <p className="col-span-full text-center text-muted-foreground mt-8 py-8 bg-muted/30 rounded-md">No NFTs in this category.</p>
        }
      </div>
      {!isLoading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-8 py-4"
        />
      )}
    </>
    );
  };
  
  const renderCollectionGrid = (
    collections: Collection[], isLoading: boolean, error: string | null,
    currentPage: number, totalPages: number, setPage: (page: number) => void, tabName: string
  ) => {
    if (error) return <Alert variant="destructive" className="col-span-full mt-8"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>;
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => <CollectionCardSkeleton key={`${tabName}-skeleton-${index}`} />)
            : collections.length > 0
            ? collections.map((collection) => <CollectionCard key={`${tabName}-${collection.id}`} {...collection} />)
            : <p className="col-span-full text-center text-muted-foreground mt-8 py-8 bg-muted/30 rounded-md">No collections found.</p>}
        </div>
        {!isLoading && totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-8 py-4"
          />
        )}
      </>
    );
  };

  if (isLoadingProfile) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (profileError || !profileData) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <Card className="max-w-md">
                <CardHeader><UserCircle2 className="mx-auto h-12 w-12 text-muted-foreground" /><CardTitle>User Not Found</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{profileError || "The user profile you are looking for does not exist or could not be loaded."}</p>
                    <Button asChild className="mt-4"><Link href="/home">Go Home</Link></Button>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  const isOwnProfile = authUser?.id === profileData.id;
  const isVerified = profileData.isVerifiedCreator || (profileData as any).roles?.includes('ADMIN'); // Example check, adjust based on actual backend logic for verification badge

  return (
    <>
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative mb-8">
        <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96">
          <Image
            src={profileData.coverUrl || 'https://placehold.co/1200x300.png'}
            alt={`${profileData.username}'s Cover photo`}
            layout="fill"
            objectFit="cover"
            className="rounded-b-lg"
            priority
            data-ai-hint="abstract background profile"
          />
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 sm:translate-y-1/3 md:translate-y-1/4 lg:left-16 lg:translate-x-0 xl:left-24">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 border-4 border-background rounded-full shadow-lg">
            <AvatarImage src={profileData.avatarUrl || `https://placehold.co/128x128.png?text=${profileData.username.charAt(0)}`} alt={profileData.username} data-ai-hint="profile person user"/>
            <AvatarFallback>{profileData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute top-4 right-4">
            <Button variant="outline" size="sm" className="bg-card/80 hover:bg-card" asChild>
                <Link href="/home"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
            </Button>
        </div>
      </header>

      <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{profileData.username}</h1>
                  {isVerified && <BadgeCheck className="h-6 w-6 text-accent" strokeWidth={2.5} />}
                </div>
                <p className="text-muted-foreground mt-1 max-w-xl text-sm sm:text-base">{profileData.bio || "No bio provided."}</p>
                <p className="text-xs text-muted-foreground mt-1">Joined: {new Date(profileData.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex space-x-3">
                  {profileData.socialLinks?.website && <Link href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><Globe className="h-5 w-5" /> <span className="sr-only">Website</span></Button></Link>}
                  {profileData.socialLinks?.twitter && <Link href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><Twitter className="h-5 w-5" /> <span className="sr-only">Twitter</span></Button></Link>}
                  {profileData.socialLinks?.instagram && <Link href={profileData.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg><span className="sr-only">Instagram</span></Button></Link>}
                  {profileData.socialLinks?.discord && <Link href={profileData.socialLinks.discord} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4A1.62 1.62 0 0 0 13.4 5.5C13.4 5.5 13.12 6.41 12.73 7.25A14.41 14.41 0 0 0 10.25 7.5C10.09 7.42 9.93 7.33 9.77 7.25L9.75 7.25C9.36 6.41 9.07 5.5 9.07 5.5A1.62 1.62 0 0 0 7.5 4C6 4.26 4.56 4.71 3.23 5.33A18.43 18.43 0 0 0 2.1 10.79C2.1 10.79 3.32 12.64 5.53 14.07C5.53 14.07 5.28 14.57 5 15.07C4.06 14.91 3.26 14.47 3.26 14.47C3.26 14.47 2.63 16.2 4.06 17.53C5.28 18.57 6.73 18.85 7.43 19A14.66 14.66 0 0 0 9.45 19.58C10.15 19.93 10.85 20.25 11.5 20.5A1.73 1.73 0 0 0 12 20.6A1.73 1.73 0 0 0 12.5 20.5C13.15 20.25 13.85 19.93 14.55 19.58A14.66 14.66 0 0 0 16.57 19C17.27 18.85 18.72 18.57 19.94 17.53C21.37 16.2 20.74 14.47 20.74 14.47C20.74 14.47 19.94 14.91 19 15.07C18.72 14.57 18.47 14.07 18.47 14.07C20.68 12.64 21.9 10.79 21.9 10.79A18.43 18.43 0 0 0 19.27 5.33ZM9.75 15.5C8.75 15.5 8 14.75 8 13.75C8 12.75 8.75 12 9.75 12C10.75 12 11.5 12.75 11.5 13.75C11.5 14.75 10.75 15.5 9.75 15.5ZM14.25 15.5C13.25 15.5 12.5 14.75 12.5 13.75C12.5 12.75 13.25 12 14.25 12C15.25 12 16 12.75 16 13.75C16 14.75 15.25 15.5 14.25 15.5Z"></path></svg><span className="sr-only">Discord</span></Button></Link>}
                </div>
              </div>
              {isOwnProfile && (
                <Button variant="outline" asChild>
                    <Link href="/profile">View My Editable Profile</Link>
                </Button>
              )}
            </div>
        </div>
      </section>
      
      <Separator className="my-6 sm:my-8 max-w-5xl mx-auto" />

      <section className="px-4 sm:px-6 md:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-1 sm:gap-2 h-auto">
              <TabsTrigger value="created" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><List className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Created</TabsTrigger>
              <TabsTrigger value="owned" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><ShoppingBag className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Owned</TabsTrigger>
              <TabsTrigger value="collections" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><Palette className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-6">
              {renderNftGrid(createdNfts, isLoadingCreated, createdError, createdPage, totalCreatedPages, setCreatedPage, "created")}
            </TabsContent>
            <TabsContent value="owned" className="mt-6">
              {renderNftGrid(ownedNfts, isLoadingOwned, ownedError, ownedPage, totalOwnedPages, setOwnedPage, "owned")}
            </TabsContent>
            <TabsContent value="collections" className="mt-6">
              {renderCollectionGrid(collectionsCreated, isLoadingCollections, collectionsError, collectionsPage, totalCollectionsPages, setCollectionsPage, "collections")}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
    <Toaster />
    </>
  );
}

