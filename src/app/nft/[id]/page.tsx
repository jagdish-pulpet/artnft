
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Tag, Info, ListFilter, ThumbsUp, Eye, Star, Share2, MoreHorizontal, AlertCircle, Activity as ActivityIconLucide, Loader2, HandCoins, ListChecks, Wallet, CalendarClock, X, Check } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, ApiError } from '@/lib/apiService';
import { useAuth } from '@/providers/auth-provider'; 
import type { Nft as NftDetailData, NftActivityItem, NftProperty, Offer, OfferStatus, PaginatedResponse } from '@/types/entities';
import { MakeOfferModal } from '@/components/nft/make-offer-modal';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


export default function NftDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();
  const { user: authUser, token, isAuthenticated } = useAuth();

  const [nftData, setNftData] = useState<NftDetailData | null>(null);
  const [nftActivity, setNftActivity] = useState<NftActivityItem[]>([]);
  const [nftOffers, setNftOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFavorited, setIsFavorited] = useState(false); 
  const [currentFavoritesCount, setCurrentFavoritesCount] = useState(0);

  const [isMakeOfferModalOpen, setIsMakeOfferModalOpen] = useState(false);
  const [actionOfferId, setActionOfferId] = useState<string | null>(null);
  const [isConfirmActionOpen, setIsConfirmActionOpen] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'accept' | 'reject' | 'cancel' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  const fetchNftDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.get<NftDetailData>(`/nfts/${id}`);
      setNftData(data);
      setCurrentFavoritesCount(data.favoritesCount || 0);
      // TODO: Fetch actual favorite status for the logged-in user
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load NFT details.';
      setError(errorMessage);
      setNftData(null); 
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchNftActivity = useCallback(async () => {
    setIsLoadingActivity(true);
    try {
      const activityResponse = await apiService.get<{data: NftActivityItem[]}>(`/nfts/${id}/activity`);
      setNftActivity(activityResponse.data || []);
    } catch (err) {
      console.error("Error fetching NFT activity:", err);
      setNftActivity([]); 
    } finally {
      setIsLoadingActivity(false);
    }
  }, [id]);
  
  const fetchNftOffers = useCallback(async () => {
    setIsLoadingOffers(true);
    try {
      const response = await apiService.get<PaginatedResponse<Offer>>(`/nfts/${id}/offers?limit=50`); // Fetch more for now
      setNftOffers(response.data || []);
    } catch (err) {
        console.error("Error fetching NFT offers:", err);
        setNftOffers([]);
    } finally {
        setIsLoadingOffers(false);
    }
  }, [id]);


  useEffect(() => {
    if (id) {
      fetchNftDetails();
      fetchNftActivity();
      fetchNftOffers();
    }
  }, [id, fetchNftDetails, fetchNftActivity, fetchNftOffers]);

  const refreshData = () => {
    fetchNftDetails();
    fetchNftOffers();
    fetchNftActivity(); // Activity might change after sale
  };

  const handleToggleFavorite = async () => {
    if (!nftData) return;
    if (!isAuthenticated || !token) {
      toast({ title: "Authentication Required", description: "Please sign in to favorite NFTs.", variant: "destructive" });
      router.push('/signin'); 
      return;
    }
    const newFavoriteState = !isFavorited;
    const optimisticFavoritesCount = newFavoriteState ? currentFavoritesCount + 1 : Math.max(0, currentFavoritesCount - 1);
    setIsFavorited(newFavoriteState);
    setCurrentFavoritesCount(optimisticFavoritesCount);
    try {
      const result = await apiService.post<{ favorited: boolean; favoritesCount: number }>(`/nfts/${nftData.id}/favorite`, {}, token);
      setIsFavorited(result.favorited); 
      setCurrentFavoritesCount(result.favoritesCount); 
      toast({ title: result.favorited ? "Added to Favorites" : "Removed from Favorites" });
    } catch (error: any) {
      setIsFavorited(!newFavoriteState); 
      setCurrentFavoritesCount(currentFavoritesCount);
      toast({ title: "Error", description: error.data?.message || "Could not update favorite status.", variant: "destructive" });
    }
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
            successMessage = "Offer accepted successfully. NFT ownership transferred.";
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
        default: 
            setIsProcessingAction(false); 
            return;
    }

    try {
        await apiService[method](endpoint, {}, token);
        toast({ title: "Success", description: successMessage });
        refreshData();
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
  
  const isOwner = authUser && nftData && authUser.id === nftData.owner.id;
  const canMakeOffer = isAuthenticated && nftData?.isListedForSale && !isOwner;

  const priceEth = nftData?.price ? `${nftData.price} ${nftData.currency || 'ETH'}` : 'N/A';
  const priceUsd = nftData?.price && nftData.currency === 'ETH' ? (nftData.price * 3000).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null;

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (error || !nftData) {
    return <div className="flex min-h-screen items-center justify-center p-4 text-center"><Card className="max-w-md"><CardHeader><AlertCircle className="mx-auto h-12 w-12 text-destructive" /><CardTitle>Error</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{error || "NFT not found."}</p><Button asChild className="mt-4"><Link href="/collections">Explore NFTs</Link></Button></CardContent></Card></div>;
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={nftData.collectionId ? `/collections/${nftData.collection?.slug || nftData.collectionId}` : "/collections"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {nftData.collectionName || "Collections"}
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-card p-3 sm:p-4 rounded-xl shadow-xl flex flex-col items-center justify-center aspect-square">
              <Image src={nftData.imageUrl || `https://placehold.co/600x600.png?text=NFT+${id}`} alt={nftData.title} width={600} height={600} className="rounded-lg object-cover w-full h-full" data-ai-hint={nftData.dataAiHint || "digital art NFT"} priority/>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <Card className="shadow-xl rounded-xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      {nftData.collectionName && (<Link href={nftData.collectionId ? `/collections/${nftData.collection?.slug || nftData.collectionId}` : `/collections?search=${encodeURIComponent(nftData.collectionName)}`} className="hover:underline"><CardDescription className="text-accent font-semibold text-sm mb-1">{nftData.collectionName}</CardDescription></Link>)}
                      <CardTitle className="text-3xl sm:text-4xl font-headline text-primary tracking-tight">{nftData.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button variant="ghost" size="icon" aria-label="Favorite" onClick={handleToggleFavorite} className="text-muted-foreground hover:text-destructive"><Star className={`h-5 w-5 ${isFavorited ? 'fill-destructive text-destructive' : ''}`} /></Button>
                      <Button variant="ghost" size="icon" aria-label="Share" className="text-muted-foreground hover:text-primary"><Share2 className="h-5 w-5" /></Button>
                       <Button variant="ghost" size="icon" aria-label="More options" className="text-muted-foreground hover:text-primary"><MoreHorizontal className="h-5 w-5" /></Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground pt-1">Owned by <Link href={`/profile/${nftData.owner.id}`} className="text-accent hover:underline font-medium">{nftData.owner.username}</Link> ({nftData.owner.walletAddress.substring(0,6)}...{nftData.owner.walletAddress.slice(-4)})</div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center"><Eye className="mr-1.5 h-4 w-4"/> {nftData.views.toLocaleString()} views</span>
                    <span className="flex items-center"><ThumbsUp className="mr-1.5 h-4 w-4"/> {currentFavoritesCount.toLocaleString()} favorites</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {nftData.isListedForSale && nftData.price !== null && nftData.price !== undefined ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current price</p>
                      <p className="text-3xl font-bold text-foreground">{priceEth} {priceUsd && <span className="text-lg text-muted-foreground font-normal">({priceUsd})</span>}</p>
                    </div>
                  ) : (
                     <div>
                        <p className="text-lg font-semibold text-muted-foreground">Not currently for sale.</p>
                        {nftData.lastSalePrice && nftData.lastSaleAt && (
                             <p className="text-sm text-muted-foreground">Last sold for {nftData.lastSalePrice} {nftData.lastSaleCurrency || ''} on {new Date(nftData.lastSaleAt).toLocaleDateString()}</p>
                        )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {nftData.isListedForSale && nftData.price !== null && nftData.price !== undefined && (
                      <Button size="lg" className="flex-1 font-semibold py-3 text-base" onClick={() => toast({title: "Buy Now Clicked (Placeholder)"})}><ShoppingCart className="mr-2 h-5 w-5" /> Buy Now</Button>
                    )}
                    {canMakeOffer && (
                        <Button size="lg" variant="outline" className="flex-1 font-semibold py-3 text-base border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMakeOfferModalOpen(true)}><HandCoins className="mr-2 h-5 w-5" /> Make Offer</Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Accordion type="multiple" defaultValue={["description", "properties", "offers"]} className="w-full space-y-4">
                <AccordionItem value="description" className="bg-card rounded-xl shadow-xl px-4 sm:px-6 border-border/50"><AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary py-4"><Info className="mr-2 h-5 w-5" /> Description</AccordionTrigger><AccordionContent className="text-foreground/80 pt-1 pb-4 text-sm sm:text-base"><p className="mb-2">Created by <Link href={`/profile/${nftData.creator.id}`} className="text-accent hover:underline font-medium">{nftData.creator.username}</Link></p>{nftData.description || "No description provided."}</AccordionContent></AccordionItem>
                <AccordionItem value="properties" className="bg-card rounded-xl shadow-xl px-4 sm:px-6 border-border/50"><AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary py-4"><ListFilter className="mr-2 h-5 w-5" /> Properties</AccordionTrigger><AccordionContent className="pt-1 pb-4">{nftData.properties && nftData.properties.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{nftData.properties.map((prop, index) => (<Card key={index} className="bg-background/50 p-3 rounded-lg text-center shadow-sm"><p className="text-xs text-accent uppercase font-semibold tracking-wide">{prop.trait_type}</p><p className="text-sm text-foreground font-medium truncate" title={String(prop.value)}>{String(prop.value)}</p></Card>))}</div>) : (<p className="text-sm text-muted-foreground text-center py-2">No properties listed.</p>)}</AccordionContent></AccordionItem>
                
                <AccordionItem value="offers" className="bg-card rounded-xl shadow-xl px-4 sm:px-6 border-border/50">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary py-4"><ListChecks className="mr-2 h-5 w-5" /> Offers</AccordionTrigger>
                    <AccordionContent className="pt-1 pb-4 text-sm sm:text-base">
                    {isLoadingOffers ? <div className="space-y-2 py-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> 
                    : nftOffers.length > 0 ? (
                        <ul className="space-y-3">
                            {nftOffers.filter(o => o.status === OfferStatus.PENDING).map(offer => (
                            <li key={offer.id} className="flex flex-col sm:flex-row justify-between items-start p-3 bg-muted/30 rounded-md shadow-sm gap-2 sm:gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6"><AvatarImage src={offer.offerer?.avatarUrl} /><AvatarFallback>{offer.offerer?.username?.charAt(0) || 'U'}</AvatarFallback></Avatar>
                                        <span className="font-semibold text-primary">{offer.offerAmount} {offer.currency}</span>
                                        <span className="text-xs text-muted-foreground">by <Link href={`/profile/${offer.offererId}`} className="hover:underline">{offer.offerer?.username || 'Unknown'}</Link></span>
                                    </div>
                                    {offer.expiresAt && <p className="text-xs text-muted-foreground mt-0.5 flex items-center"><CalendarClock className="h-3 w-3 mr-1"/>Expires {formatDistanceToNowStrict(new Date(offer.expiresAt), { addSuffix: true })} ({format(new Date(offer.expiresAt), 'PPp')})</p>}
                                </div>
                                <div className="flex gap-2 items-center self-start sm:self-center mt-2 sm:mt-0">
                                    {isOwner && (<><Button size="xs" variant="outline" className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white" onClick={() => openConfirmation(offer.id, 'accept')} disabled={isProcessingAction}>{isProcessingAction && actionOfferId === offer.id && confirmActionType === 'accept' ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4 mr-1"/>}Accept</Button><Button size="xs" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white" onClick={() => openConfirmation(offer.id, 'reject')} disabled={isProcessingAction}>{isProcessingAction && actionOfferId === offer.id && confirmActionType === 'reject' ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}Reject</Button></>)}
                                    {authUser?.id === offer.offererId && (<Button size="xs" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => openConfirmation(offer.id, 'cancel')} disabled={isProcessingAction}>{isProcessingAction && actionOfferId === offer.id && confirmActionType === 'cancel' ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4 mr-1"/>}Cancel</Button>)}
                                </div>
                            </li>
                            ))}
                            {nftOffers.filter(o => o.status === OfferStatus.PENDING).length === 0 && <p className="text-muted-foreground text-center py-4">No active offers for this NFT at the moment.</p>}
                        </ul>
                    ) : <p className="text-muted-foreground text-center py-4">No offers yet for this NFT.</p>}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="activity" className="bg-card rounded-xl shadow-xl px-4 sm:px-6 border-border/50"><AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary py-4"><ActivityIconLucide className="mr-2 h-5 w-5" /> Item Activity</AccordionTrigger><AccordionContent className="pt-1 pb-4 text-sm sm:text-base">{isLoadingActivity ? <div className="space-y-3 py-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div> : nftActivity.length > 0 ? (<ul className="space-y-3">{nftActivity.map(activity => (<li key={activity.id} className="flex flex-col sm:flex-row justify-between items-start p-3 bg-background/50 rounded-md shadow-sm gap-2 sm:gap-4"><div className="flex-1"><span className="font-semibold text-primary">{activity.transactionType}</span>{activity.price && <span className="text-accent font-medium ml-2">{activity.price}</span>}<div className="text-xs text-muted-foreground mt-0.5 space-x-2">{activity.fromUser?.username && <span>From: <Link href={`/profile/${activity.fromUser.id}`} className="hover:underline text-foreground/80">{activity.fromUser.username}</Link></span>}{activity.toUser?.username && <span>To: <Link href={`/profile/${activity.toUser.id}`} className="hover:underline text-foreground/80">{activity.toUser.username}</Link></span>}</div></div><div className="text-xs text-muted-foreground text-left sm:text-right whitespace-nowrap">{new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString()}{activity.blockchainTransactionHash && <Link href="#" className="block hover:underline text-accent truncate max-w-[100px] sm:max-w-xs" title={activity.blockchainTransactionHash}>Tx: {activity.blockchainTransactionHash.substring(0,6)}...{activity.blockchainTransactionHash.slice(-4)}</Link>}</div></li>))}</ul>) : (<p className="text-muted-foreground text-center py-2">No activity found for this NFT.</p>)}</AccordionContent></AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        {nftData && <MakeOfferModal isOpen={isMakeOfferModalOpen} onOpenChange={setIsMakeOfferModalOpen} nft={nftData} onOfferMade={refreshData} />}
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
      </main>
    </>
  );
}
