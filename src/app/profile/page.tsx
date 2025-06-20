
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Github, Twitter, Globe, BadgeCheck, Edit3, Heart, ShoppingBag, List, Activity as ActivityIconLucide, ArrowLeft, ArrowRight, ListChecks, Tags, Palette, UserCircle2, Loader2, AlertCircle, PackageIcon, Landmark, Edit, ShieldAlert, ShieldCheckIcon, Settings, Check, X, HandCoins, Trash2, FileArchive, FileTextIcon, MessageSquareIcon } from 'lucide-react';
import { NftCard } from '@/components/nft/nft-card';
import { CollectionCard, type CollectionCardProps } from '@/components/collection/collection-card';
import type { Nft as NftProps, PaginatedResponse, Collection, UserActivityItem as UserActivityItemType, ActivityTypeEnum, Offer, OfferStatus } from '@/types/entities';
import { Toaster } from '@/components/ui/toaster';
import { NftCardSkeleton } from '@/components/nft/nft-card-skeleton';
import { CollectionCardSkeleton } from '@/components/collection/collection-card-skeleton';
import { useAuth } from '@/providers/auth-provider';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { useRouter } from 'next/navigation';
import { apiService, ApiError } from '@/lib/apiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/pagination-controls';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


const ITEMS_PER_TAB = 8;

export default function ProfilePage() {
  const { user, token, isLoading: isAuthLoading, isAuthenticated, refreshAuthUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
  
  const [favoritedNfts, setFavoritedNfts] = useState<NftProps[]>([]);
  const [isLoadingFavorited, setIsLoadingFavorited] = useState(true);
  const [favoritedError, setFavoritedError] = useState<string | null>(null);
  const [favoritedPage, setFavoritedPage] = useState(1);
  const [totalFavoritedPages, setTotalFavoritedPages] = useState(1);
  
  const [collectionsCreated, setCollectionsCreated] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [totalCollectionsPages, setTotalCollectionsPages] = useState(1);

  const [userActivity, setUserActivity] = useState<UserActivityItemType[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivityPages, setTotalActivityPages] = useState(1);

  const [offersMade, setOffersMade] = useState<Offer[]>([]);
  const [isLoadingOffersMade, setIsLoadingOffersMade] = useState(true);
  const [offersMadeError, setOffersMadeError] = useState<string | null>(null);
  const [offersMadePage, setOffersMadePage] = useState(1);
  const [totalOffersMadePages, setTotalOffersMadePages] = useState(1);

  const [offersReceived, setOffersReceived] = useState<Offer[]>([]);
  const [isLoadingOffersReceived, setIsLoadingOffersReceived] = useState(true);
  const [offersReceivedError, setOffersReceivedError] = useState<string | null>(null);
  const [offersReceivedPage, setOffersReceivedPage] = useState(1);
  const [totalOffersReceivedPages, setTotalOffersReceivedPages] = useState(1);

  const [actionOfferId, setActionOfferId] = useState<string | null>(null);
  const [isConfirmActionOpen, setIsConfirmActionOpen] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'accept' | 'reject' | 'cancel' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  const handleProfileUpdated = async () => {
    await refreshAuthUser(); 
  };


  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const fetchGenericPaginatedData = useCallback(async <T,>(
    endpoint: string,
    setData: React.Dispatch<React.SetStateAction<T[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    entityName: string
  ) => {
    if (!user?.id || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.get<PaginatedResponse<T>>(
        `${endpoint}?page=${page}&limit=${ITEMS_PER_TAB}`,
        token
      );
      setData(response.data || []);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_TAB));
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : `Could not load ${entityName}.`;
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token]);


  const fetchCreatedNfts = useCallback((page:number) => fetchGenericPaginatedData(`/nfts?creatorId=${user?.id}`, setCreatedNfts, setIsLoadingCreated, setCreatedError, setTotalCreatedPages, page, "created NFTs"), [user?.id, fetchGenericPaginatedData]);
  const fetchOwnedNfts = useCallback((page:number) => fetchGenericPaginatedData(`/nfts?ownerId=${user?.id}`, setOwnedNfts, setIsLoadingOwned, setOwnedError, setTotalOwnedPages, page, "owned NFTs"), [user?.id, fetchGenericPaginatedData]);
  const fetchFavoritedNfts = useCallback((page:number) => fetchGenericPaginatedData(`/users/me/favorites`, setFavoritedNfts, setIsLoadingFavorited, setFavoritedError, setTotalFavoritedPages, page, "favorited NFTs"), [fetchGenericPaginatedData]);
  const fetchUserCollections = useCallback((page:number) => fetchGenericPaginatedData(`/collections?creatorId=${user?.id}`, setCollectionsCreated, setIsLoadingCollections, setCollectionsError, setTotalCollectionsPages, page, "collections"), [user?.id, fetchGenericPaginatedData]);
  const fetchUserActivity = useCallback((page:number) => fetchGenericPaginatedData(`/users/me/activity`, setUserActivity, setIsLoadingActivity, setActivityError, setTotalActivityPages, page, "activity"), [fetchGenericPaginatedData]);
  const fetchOffersMade = useCallback((page:number) => fetchGenericPaginatedData(`/users/me/offers/made`, setOffersMade, setIsLoadingOffersMade, setOffersMadeError, setTotalOffersMadePages, page, "offers made"), [fetchGenericPaginatedData]);
  const fetchOffersReceived = useCallback((page:number) => fetchGenericPaginatedData(`/users/me/offers/received`, setOffersReceived, setIsLoadingOffersReceived, setOffersReceivedError, setTotalOffersReceivedPages, page, "offers received"), [fetchGenericPaginatedData]);

  useEffect(() => { if (user?.id && token) fetchCreatedNfts(createdPage); }, [user?.id, token, createdPage, fetchCreatedNfts]);
  useEffect(() => { if (user?.id && token) fetchOwnedNfts(ownedPage); }, [user?.id, token, ownedPage, fetchOwnedNfts]);
  useEffect(() => { if (user?.id && token) fetchFavoritedNfts(favoritedPage); }, [user?.id, token, favoritedPage, fetchFavoritedNfts]);
  useEffect(() => { if (user?.id && token) fetchUserCollections(collectionsPage); }, [user?.id, token, collectionsPage, fetchUserCollections]);
  useEffect(() => { if (user?.id && token) fetchUserActivity(activityPage); }, [user?.id, token, activityPage, fetchUserActivity]);
  useEffect(() => { if (user?.id && token) fetchOffersMade(offersMadePage); }, [user?.id, token, offersMadePage, fetchOffersMade]);
  useEffect(() => { if (user?.id && token) fetchOffersReceived(offersReceivedPage); }, [user?.id, token, offersReceivedPage, fetchOffersReceived]);


  const refreshOffersData = () => {
    fetchOffersMade(offersMadePage);
    fetchOffersReceived(offersReceivedPage);
  };

  const handleOfferAction = async () => {
    if (!token || !actionOfferId || !confirmActionType) return;
    setIsProcessingAction(true);
    let endpoint = '';
    let method: 'put' | 'del' = 'put';
    let successMessage = '';

    switch(confirmActionType) {
        case 'accept': 
            endpoint = `/offers/${actionOfferId}/accept`; 
            successMessage = "Offer accepted successfully.";
            break;
        case 'reject': 
            endpoint = `/offers/${actionOfferId}/reject`; 
            successMessage = "Offer rejected successfully.";
            break;
        case 'cancel': 
            endpoint = `/offers/${actionOfferId}/cancel`; 
            method = 'del';
            successMessage = "Offer cancelled successfully.";
            break;
        default: setIsProcessingAction(false); return;
    }

    try {
        await apiService[method](endpoint, {}, token);
        toast({ title: "Success", description: successMessage });
        refreshOffersData(); 
        fetchOwnedNfts(ownedPage); 
        fetchUserActivity(activityPage); 
    } catch (error: any) {
        toast({ title: "Action Failed", description: error.data?.message || "Could not perform offer action.", variant: "destructive" });
    } finally {
        setIsProcessingAction(false);
        setIsConfirmActionOpen(false);
        setActionOfferId(null);
        setConfirmActionType(null);
    }
  };

  const openConfirmation = (offerId: string, type: 'accept' | 'reject' | 'cancel') => {
    setActionOfferId(offerId);
    setConfirmActionType(type);
    setIsConfirmActionOpen(true);
  };


  const renderNftGrid = (
    nfts: NftProps[], isLoading: boolean, error: string | null,
    currentPage: number, totalPages: number, setPage: (page: number) => void, tabName: string
  ) => {
    if (error) return <Alert variant="destructive" className="col-span-full mt-8"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>;
    return (<><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">{isLoading ? Array.from({ length: ITEMS_PER_TAB }).map((_, index) => <NftCardSkeleton key={`${tabName}-skeleton-${index}`} />) : nfts.length > 0 ? nfts.map((nft) => (<NftCard key={`${tabName}-${nft.id}`} {...{...nft, price: nft.price !== undefined && nft.price !== null ? `${nft.price} ${nft.currency || 'ETH'}` : undefined, creator: nft.creator?.username || 'N/A'}} />)) : <p className="col-span-full text-center text-muted-foreground mt-8 py-8 bg-muted/30 rounded-md">No NFTs in this category yet.</p>}</div>
      {!isLoading && totalPages > 1 && (<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} className="mt-8"/>)}</>);
  };
  
  const renderCollectionGrid = (
    collections: Collection[], isLoading: boolean, error: string | null,
    currentPage: number, totalPages: number, setPage: (page: number) => void, tabName: string
  ) => {
    if (error) return <Alert variant="destructive" className="col-span-full mt-8"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>;
    return (<><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">{isLoading ? Array.from({ length: 3 }).map((_, index) => <CollectionCardSkeleton key={`${tabName}-skeleton-${index}`} />) : collections.length > 0 ? collections.map((collection) => <CollectionCard key={`${tabName}-${collection.id}`} {...collection} />) : <p className="col-span-full text-center text-muted-foreground mt-8 py-8 bg-muted/30 rounded-md">No collections created yet.</p>}</div>
      {!isLoading && totalPages > 0 && (<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} className="mt-8"/>)}</>);
  };

  const getActivityIcon = (type: ActivityTypeEnum) => {
    switch (type) {
      case ActivityTypeEnum.NFT_CREATE: return <PackageIcon className="h-5 w-5 text-green-500" />;
      case ActivityTypeEnum.COLLECTION_CREATE: return <Palette className="h-5 w-5 text-blue-500" />;
      case ActivityTypeEnum.NFT_FAVORITE_ADD: return <Heart className="h-5 w-5 text-red-500" />;
      case ActivityTypeEnum.NFT_FAVORITE_REMOVE: return <Heart className="h-5 w-5 text-muted-foreground" />;
      case ActivityTypeEnum.NFT_LIST: return <Tags className="h-5 w-5 text-orange-500" />;
      case ActivityTypeEnum.NFT_DELIST: return <Tags className="h-5 w-5 text-gray-500" />;
      case ActivityTypeEnum.USER_PROFILE_UPDATE: return <Edit className="h-5 w-5 text-purple-500" />;
      case ActivityTypeEnum.ADMIN_ACTION_USER_SUSPEND: return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case ActivityTypeEnum.ADMIN_ACTION_NFT_VERIFY: return <ShieldCheckIcon className="h-5 w-5 text-accent" />;
      case ActivityTypeEnum.ADMIN_ACTION_COLLECTION_VERIFY: return <ShieldCheckIcon className="h-5 w-5 text-blue-400" />;
      case ActivityTypeEnum.ADMIN_ACTION_NFT_DELETE: return <Trash2 className="h-5 w-5 text-destructive" />;
      case ActivityTypeEnum.ADMIN_ACTION_COLLECTION_DELETE: return <FileArchive className="h-5 w-5 text-destructive" />;
      case ActivityTypeEnum.ADMIN_ACTION_REPORT_UPDATE: return <Settings className="h-5 w-5 text-gray-600" />;
      case ActivityTypeEnum.OFFER_MAKE: return <HandCoins className="h-5 w-5 text-yellow-500" />;
      case ActivityTypeEnum.OFFER_ACCEPT: return <HandCoins className="h-5 w-5 text-green-600" />;
      case ActivityTypeEnum.OFFER_REJECT: return <HandCoins className="h-5 w-5 text-red-600" />;
      case ActivityTypeEnum.OFFER_CANCEL: return <HandCoins className="h-5 w-5 text-gray-500" />;
      case ActivityTypeEnum.NFT_SALE: return <Landmark className="h-5 w-5 text-teal-500" />;
      default: return <ActivityIconLucide className="h-5 w-5 text-primary" />;
    }
  };
  
  const formatActivityTitle = (activity: UserActivityItemType): React.ReactNode => {
    let itemLink = null;
    let itemTitle = activity.details?.title || activity.details?.name || activity.details?.nftTitle || activity.details?.collectionName || activity.relatedNft?.title || activity.relatedCollection?.name || 'an item';
    const performingAdminUsername = activity.user?.id === user?.id && activity.type.startsWith('ADMIN_ACTION') ? 'You (Admin)' : activity.user?.username || 'Admin';

    if (activity.relatedNftId && activity.relatedNft) {
      itemLink = <Link href={`/nft/${activity.relatedNft.slug || activity.relatedNft.id}`} className="font-medium hover:underline text-primary">{itemTitle || 'NFT'}</Link>;
    } else if (activity.relatedCollectionId && activity.relatedCollection) {
      itemLink = <Link href={`/collections/${activity.relatedCollection.slug || activity.relatedCollection.id}`} className="font-medium hover:underline text-primary">{itemTitle || 'collection'}</Link>;
    } else if (activity.relatedOfferId && activity.relatedNft) { 
      itemLink = <Link href={`/nft/${activity.relatedNft.slug || activity.relatedNft.id}`} className="font-medium hover:underline text-primary">{activity.relatedNft.title || 'an NFT'}</Link>;
    } else {
      itemLink = <span className="font-medium text-primary">{itemTitle}</span>;
    }
    
    const actionUserIsAuthUser = activity.user?.id === user?.id;

    switch (activity.type) {
      case ActivityTypeEnum.NFT_CREATE: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} created {itemLink}</>;
      case ActivityTypeEnum.COLLECTION_CREATE: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} created collection {itemLink}</>;
      case ActivityTypeEnum.NFT_FAVORITE_ADD: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} favorited {itemLink}</>;
      case ActivityTypeEnum.NFT_FAVORITE_REMOVE: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} unfavorited {itemLink}</>;
      case ActivityTypeEnum.NFT_LIST: 
        const lister = activity.details?.listedBy === 'admin' ? (activity.relatedUserId === user?.id ? 'You (Admin)' : 'Admin') : (actionUserIsAuthUser ? "You" : activity.user?.username);
        return <>{lister} listed {itemLink} for sale at {activity.details?.price} {activity.details?.currency}</>;
      case ActivityTypeEnum.NFT_DELIST: 
        const delister = activity.details?.delistedBy === 'admin' ? (activity.relatedUserId === user?.id ? 'You (Admin)' : 'Admin') : (actionUserIsAuthUser ? "You" : activity.user?.username);
        return <>{delister} delisted {itemLink}</>;
      case ActivityTypeEnum.NFT_SALE:
        const buyer = activity.relatedUser; 
        const seller = activity.user; 
        if (seller?.id === user?.id) { 
          return <>You sold {itemLink} to {buyer ? <Link href={`/profile/${buyer.id}`} className="font-medium hover:underline text-primary">{buyer.username}</Link> : 'a user'} for {activity.details?.price} {activity.details?.currency}</>;
        } else if (buyer?.id === user?.id) { 
             return <>You bought {itemLink} from {seller ? <Link href={`/profile/${seller.id}`} className="font-medium hover:underline text-primary">{seller.username}</Link> : 'a user'} for {activity.details?.price} {activity.details?.currency}</>;
        }
        return <>{seller?.username} sold {itemLink} to {buyer?.username} for {activity.details?.price} {activity.details?.currency}</>;
      case ActivityTypeEnum.USER_PROFILE_UPDATE: const fields = activity.details?.updatedFields?.join(', '); return <>{actionUserIsAuthUser ? "You" : activity.user?.username} updated your profile {fields ? `(changed: ${fields})` : ''}</>;
      case ActivityTypeEnum.ADMIN_ACTION_USER_SUSPEND: const targetUserSuspended = activity.relatedUser; return <>{performingAdminUsername} {activity.details?.suspended ? 'suspended' : 'unsuspended'} user <Link href={`/profile/${targetUserSuspended?.id}`} className="font-medium hover:underline text-primary">{targetUserSuspended?.username || 'N/A'}</Link></>;
      case ActivityTypeEnum.ADMIN_ACTION_NFT_VERIFY: return <>{performingAdminUsername} verified NFT {itemLink}</>;
      case ActivityTypeEnum.ADMIN_ACTION_COLLECTION_VERIFY: return <>{performingAdminUsername} verified collection {itemLink}</>;
      case ActivityTypeEnum.ADMIN_ACTION_NFT_DELETE: return <>{performingAdminUsername} deleted NFT "{activity.details?.nftTitle || 'N/A'}" (ID: {activity.details?.deletedNftId?.substring(0,8)}...)</>;
      case ActivityTypeEnum.ADMIN_ACTION_COLLECTION_DELETE: return <>{performingAdminUsername} deleted collection "{activity.details?.collectionName || 'N/A'}" (ID: {activity.details?.deletedCollectionId?.substring(0,8)}...)</>;
      case ActivityTypeEnum.ADMIN_ACTION_REPORT_UPDATE: return <>{performingAdminUsername} updated report (ID: {activity.details?.reportId?.substring(0,8)}...) to status "{activity.details?.newStatus}"</>;
      case ActivityTypeEnum.OFFER_MAKE: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} made an offer of {activity.details?.offerAmount} {activity.details?.currency} on {itemLink}</>;
      case ActivityTypeEnum.OFFER_ACCEPT: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} accepted an offer on {itemLink} from {activity.relatedUser ? <Link href={`/profile/${activity.relatedUser.id}`} className="font-medium hover:underline text-primary">{activity.relatedUser.username}</Link> : 'a user'}</>;
      case ActivityTypeEnum.OFFER_REJECT: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} rejected an offer on {itemLink} from {activity.relatedUser ? <Link href={`/profile/${activity.relatedUser.id}`} className="font-medium hover:underline text-primary">{activity.relatedUser.username}</Link> : 'a user'}</>;
      case ActivityTypeEnum.OFFER_CANCEL: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} cancelled your offer on {itemLink}</>;
      default: return <>{actionUserIsAuthUser ? "You" : activity.user?.username} performed action: <span className="font-semibold">{String(activity.type).replace(/_/g, ' ').toLowerCase()}</span> on {itemLink}</>;
    }
  };

  const renderOffersList = (
    offers: Offer[], isLoading: boolean, error: string | null,
    currentPage: number, totalPages: number, setPage: (page: number) => void,
    listType: 'made' | 'received'
  ) => {
    if (error) return <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>;
    if (isLoading && offers.length === 0) return <div className="space-y-3 py-4"><Skeleton className="h-20 w-full rounded-lg" /><Skeleton className="h-20 w-full rounded-lg" /></div>;
    if (!isLoading && offers.length === 0) return <p className="col-span-full text-center text-muted-foreground mt-8 py-8 bg-muted/30 rounded-md">You haven't {listType === 'made' ? 'made any' : 'received any new'} offers yet.</p>;

    return (
      <>
        <ul className="space-y-4">
          {offers.map(offer => (
            <li key={offer.id} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {listType === 'made' ? 'Offer made on:' : 'Offer received for:'}
                  </p>
                  <Link href={`/nft/${offer.nft?.slug || offer.nftId}`} className="text-lg font-semibold text-primary hover:underline block truncate">
                    {offer.nft?.title || 'NFT Title Unavailable'}
                  </Link>
                  <p className="text-sm font-bold text-accent">
                    {offer.offerAmount} {offer.currency}
                  </p>
                  {listType === 'received' && offer.offerer && (
                    <p className="text-xs text-muted-foreground">
                      From: <Link href={`/profile/${offer.offerer.id}`} className="hover:underline text-foreground">{offer.offerer.username}</Link>
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <Badge variant={offer.status === OfferStatus.PENDING ? "secondary" : offer.status === OfferStatus.ACCEPTED ? "default" : "destructive"} className="capitalize mb-1">
                    {offer.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(offer.createdAt), "PP")}
                    {offer.expiresAt && (
                      <span className="block">Expires: {formatDistanceToNowStrict(new Date(offer.expiresAt), { addSuffix: true })}</span>
                    )}
                  </p>
                </div>
              </div>
              {offer.status === OfferStatus.PENDING && (
                <div className="mt-3 pt-3 border-t flex gap-2 justify-end">
                  {listType === 'made' && (
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => openConfirmation(offer.id, 'cancel')} disabled={isProcessingAction}>
                      {isProcessingAction && actionOfferId === offer.id && confirmActionType === 'cancel' ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}Cancel Offer
                    </Button>
                  )}
                  {listType === 'received' && (
                    <>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => openConfirmation(offer.id, 'reject')} disabled={isProcessingAction}>
                        {isProcessingAction && actionOfferId === offer.id && confirmActionType === 'reject' ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}Reject
                      </Button>
                      <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => openConfirmation(offer.id, 'accept')} disabled={isProcessingAction}>
                         {isProcessingAction && actionOfferId === offer.id && confirmActionType === 'accept' ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4 mr-1"/>}Accept
                      </Button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {!isLoading && totalPages > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-6"
          />
        )}
      </>
    );
  };


  if (isAuthLoading || (!isAuthenticated && !isAuthLoading)) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!user) {
    return <div className="flex min-h-screen items-center justify-center p-4 text-center"><Card className="max-w-md"><CardHeader><UserCircle2 className="mx-auto h-12 w-12 text-muted-foreground" /><CardTitle>Profile Not Found</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">Please sign in to view your profile.</p><Button asChild className="mt-4"><Link href="/signin">Sign In</Link></Button></CardContent></Card></div>;
  }

  return (
    <>
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative mb-8">
        <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96">{isAuthLoading || !user.coverUrl ? <Skeleton className="w-full h-full rounded-b-lg bg-muted" /> : <Image src={user.coverUrl || 'https://placehold.co/1200x300.png'} alt="Cover photo" layout="fill" objectFit="cover" className="rounded-b-lg" priority data-ai-hint="abstract background profile"/>}</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 sm:translate-y-1/3 md:translate-y-1/4 lg:left-16 lg:translate-x-0 xl:left-24">{isAuthLoading ? <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-background" /> : <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 border-4 border-background rounded-full shadow-lg"><AvatarImage src={user.avatarUrl || `https://placehold.co/128x128.png?text=${user.username.charAt(0)}`} alt={user.username} data-ai-hint="profile person user"/><AvatarFallback>{user.username ? user.username.substring(0, 1).toUpperCase() : 'U'}</AvatarFallback></Avatar>}</div>
        <div className="absolute top-4 right-4"><Link href="/home" passHref><Button variant="outline" size="sm" className="bg-card/80 hover:bg-card"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Button></Link></div>
      </header>

      <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">{isAuthLoading ? (<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end"><div className="mb-4 lg:mb-0 w-full lg:w-2/3"><div className="flex items-center space-x-2"><Skeleton className="h-8 w-48 mb-1" /><Skeleton className="h-6 w-6 rounded-full" /></div><Skeleton className="h-4 w-full mt-2" /><Skeleton className="h-4 w-3/4 mt-1" /><div className="mt-3 flex space-x-3"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></div><Skeleton className="h-10 w-full lg:w-36 mt-4 lg:mt-0" /></div>) : (<div className="flex flex-col lg:flex-row justify-between items-start lg:items-end"><div className="mb-4 lg:mb-0"><div className="flex items-center space-x-2"><h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{user.username}</h1>{(user.isWalletVerified || user.roles.includes('ADMIN')) && <BadgeCheck className="h-6 w-6 text-accent" strokeWidth={2.5} />}</div><p className="text-muted-foreground mt-1 max-w-xl text-sm sm:text-base">{user.bio || "No bio provided."}</p><p className="text-xs text-muted-foreground mt-1">Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p><div className="mt-3 flex space-x-3">{user.socialLinks?.website && (<Link href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label={`${user.username} Website`}><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><Globe className="h-5 w-5" /> <span className="sr-only">Website</span></Button></Link>)}{user.socialLinks?.twitter && (<Link href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${user.username} Twitter`}><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><Twitter className="h-5 w-5" /> <span className="sr-only">Twitter</span></Button></Link>)}{user.socialLinks?.instagram && ( <Link href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${user.username} Instagram`}><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg><span className="sr-only">Instagram</span></Button></Link>)}{user.socialLinks?.discord && (<Link href={user.socialLinks.discord} target="_blank" rel="noopener noreferrer" aria-label={`${user.username} Discord`}><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4A1.62 1.62 0 0 0 13.4 5.5C13.4 5.5 13.12 6.41 12.73 7.25A14.41 14.41 0 0 0 10.25 7.5C10.09 7.42 9.93 7.33 9.77 7.25L9.75 7.25C9.36 6.41 9.07 5.5 9.07 5.5A1.62 1.62 0 0 0 7.5 4C6 4.26 4.56 4.71 3.23 5.33A18.43 18.43 0 0 0 2.1 10.79C2.1 10.79 3.32 12.64 5.53 14.07C5.53 14.07 5.28 14.57 5 15.07C4.06 14.91 3.26 14.47 3.26 14.47C3.26 14.47 2.63 16.2 4.06 17.53C5.28 18.57 6.73 18.85 7.43 19A14.66 14.66 0 0 0 9.45 19.58C10.15 19.93 10.85 20.25 11.5 20.5A1.73 1.73 0 0 0 12 20.6A1.73 1.73 0 0 0 12.5 20.5C13.15 20.25 13.85 19.93 14.55 19.58A14.66 14.66 0 0 0 16.57 19C17.27 18.85 18.72 18.57 19.94 17.53C21.37 16.2 20.74 14.47 20.74 14.47C20.74 14.47 19.94 14.91 19 15.07C18.72 14.57 18.47 14.07 18.47 14.07C20.68 12.64 21.9 10.79 21.9 10.79A18.43 18.43 0 0 0 19.27 5.33ZM9.75 15.5C8.75 15.5 8 14.75 8 13.75C8 12.75 8.75 12 9.75 12C10.75 12 11.5 12.75 11.5 13.75C11.5 14.75 10.75 15.5 9.75 15.5ZM14.25 15.5C13.25 15.5 12.5 14.75 12.5 13.75C12.5 12.75 13.25 12 14.25 12C15.25 12 16 12.75 16 13.75C16 14.75 15.25 15.5 14.25 15.5Z"></path></svg><span className="sr-only">Discord</span></Button></Link>)}</div></div><Button variant="outline" className="w-full lg:w-auto" onClick={() => setIsEditModalOpen(true)}><Edit3 className="mr-2 h-4 w-4" />Edit Profile</Button></div>)}</div>
      </section>
      <Separator className="my-6 sm:my-8 max-w-5xl mx-auto" />

      <section className="px-4 sm:px-6 md:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-2 h-auto">
              <TabsTrigger value="created" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><List className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Created</TabsTrigger>
              <TabsTrigger value="owned" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><ShoppingBag className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Owned</TabsTrigger>
              <TabsTrigger value="favorites" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><Heart className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Favorites</TabsTrigger>
              <TabsTrigger value="collections" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><Palette className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Collections</TabsTrigger>
              <TabsTrigger value="activity" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><ActivityIconLucide className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Activity</TabsTrigger>
              <TabsTrigger value="offers" className="py-2.5 sm:py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold"><Tags className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="created" className="mt-6">{renderNftGrid(createdNfts, isLoadingCreated, createdError, createdPage, totalCreatedPages, setCreatedPage, "created")}</TabsContent>
            <TabsContent value="owned" className="mt-6">{renderNftGrid(ownedNfts, isLoadingOwned, ownedError, ownedPage, totalOwnedPages, setOwnedPage, "owned")}</TabsContent>
            <TabsContent value="favorites" className="mt-6">{renderNftGrid(favoritedNfts, isLoadingFavorited, favoritedError, favoritedPage, totalFavoritedPages, setFavoritedPage, "favorited")}</TabsContent>
            <TabsContent value="collections" className="mt-6">{renderCollectionGrid(collectionsCreated, isLoadingCollections, collectionsError, collectionsPage, totalCollectionsPages, setCollectionsPage, "collections")}</TabsContent>
            <TabsContent value="activity" className="mt-6">{activityError && (<Alert variant="destructive" className="col-span-full my-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{activityError}</AlertDescription></Alert>)}{isLoadingActivity ? (<Card><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>) : (<Card className="shadow-lg rounded-xl"><CardHeader><CardTitle className="text-xl text-primary">Recent Activity</CardTitle></CardHeader><CardContent>{userActivity.length > 0 ? (<ul className="space-y-4">{userActivity.map(activity => (<li key={activity.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg shadow-sm hover:bg-muted/60 transition-colors"><div className="flex-shrink-0 pt-0.5">{getActivityIcon(activity.type)}</div><div className="flex-1"><p className="text-sm text-foreground leading-snug">{formatActivityTitle(activity)}</p><p className="text-xs text-muted-foreground mt-0.5">{new Date(activity.timestamp).toLocaleString()}</p></div>{(activity.type === ActivityTypeEnum.NFT_CREATE || activity.type === ActivityTypeEnum.NFT_LIST || activity.type === ActivityTypeEnum.NFT_DELIST || activity.type === ActivityTypeEnum.NFT_FAVORITE_ADD || activity.type === ActivityTypeEnum.NFT_FAVORITE_REMOVE || activity.type === ActivityTypeEnum.ADMIN_ACTION_NFT_VERIFY || activity.type === ActivityTypeEnum.ADMIN_ACTION_NFT_DELETE || activity.type === ActivityTypeEnum.OFFER_MAKE || activity.type === ActivityTypeEnum.OFFER_ACCEPT || activity.type === ActivityTypeEnum.OFFER_REJECT || activity.type === ActivityTypeEnum.OFFER_CANCEL || activity.type === ActivityTypeEnum.NFT_SALE) && activity.relatedNftId && (<Button variant="ghost" size="sm" asChild className="self-center ml-auto"><Link href={`/nft/${activity.relatedNft?.slug || activity.relatedNftId}`}>View NFT</Link></Button>)}{(activity.type === ActivityTypeEnum.COLLECTION_CREATE || activity.type === ActivityTypeEnum.ADMIN_ACTION_COLLECTION_VERIFY || activity.type === ActivityTypeEnum.ADMIN_ACTION_COLLECTION_DELETE) && activity.relatedCollectionId && (<Button variant="ghost" size="sm" asChild className="self-center ml-auto"><Link href={`/collections/${activity.relatedCollection?.slug || activity.relatedCollectionId}`}>View Collection</Link></Button>)}{(activity.type === ActivityTypeEnum.ADMIN_ACTION_REPORT_UPDATE && activity.details?.reportId) && (<Button variant="ghost" size="sm" asChild className="self-center ml-auto"><Link href={`/admin/view-reports?search=${activity.details.reportId}`}>View Report</Link></Button>)}</li>))}</ul>) : (<div className="text-center py-8"><ListChecks className="h-16 w-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} /><p className="text-lg font-semibold text-foreground">No Recent Activity</p><p className="text-sm text-muted-foreground">Your recent actions will appear here.</p></div>)}{!isLoadingActivity && totalActivityPages > 1 && (<PaginationControls currentPage={activityPage} totalPages={totalActivityPages} onPageChange={setActivityPage} className="mt-8"/>)}</CardContent></Card>)}</TabsContent>
            <TabsContent value="offers" className="mt-6">
              <Tabs defaultValue="made" className="w-full">
                <TabsList className="grid w-full grid-cols-2 gap-1 sm:gap-2 h-auto mb-4">
                    <TabsTrigger value="made" className="py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">Offers Made</TabsTrigger>
                    <TabsTrigger value="received" className="py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">Offers Received</TabsTrigger>
                </TabsList>
                <TabsContent value="made">
                    {renderOffersList(offersMade, isLoadingOffersMade, offersMadeError, offersMadePage, totalOffersMadePages, setOffersMadePage, 'made')}
                </TabsContent>
                <TabsContent value="received">
                    {renderOffersList(offersReceived, isLoadingOffersReceived, offersReceivedError, offersReceivedPage, totalOffersReceivedPages, setOffersReceivedPage, 'received')}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
    {user && <EditProfileModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} onProfileUpdated={handleProfileUpdated} />}
    <ConfirmationDialog 
        isOpen={isConfirmActionOpen} 
        onOpenChange={setIsConfirmActionOpen}
        onConfirm={handleOfferAction}
        title={`Confirm Offer ${confirmActionType?.charAt(0).toUpperCase()}${confirmActionType?.slice(1)}`}
        description={`Are you sure you want to ${confirmActionType} this offer? This action may be irreversible.`}
        confirmButtonText={confirmActionType ? `${confirmActionType.charAt(0).toUpperCase()}${confirmActionType.slice(1)} Offer` : "Confirm"}
        isDestructive={confirmActionType === 'reject' || confirmActionType === 'cancel'}
        isConfirming={isProcessingAction}
    />
    <Toaster />
    </>
  );
}
