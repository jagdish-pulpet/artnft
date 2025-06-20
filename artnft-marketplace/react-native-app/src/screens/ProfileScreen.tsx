// react-native-app/src/screens/ProfileScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Alert as RNAlert } from 'react-native';
import AppButton from '../components/common/Button';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { User as UserProfileData, Nft, Collection, Offer, OfferStatus, ActivityTypeEnum as RNActivityTypeEnum } from '../types/entities'; // Added OfferStatus, RNActivityTypeEnum
import apiClient, { ApiError } from '../api/apiService';
import { useAuth } from '../store/authContext';
import NftList from '../components/nft/NftList';
import CollectionList from '../components/collection/CollectionList';
import EmptyState from '../components/common/EmptyState';
import { Edit3, Globe, Twitter, Instagram, LogOut, UserCircle, AlertCircle, ShoppingBag, ListChecks, Palette, Tags, Activity as ActivityIconLucide, Heart, List, Check, X, HandCoins, Settings, PackageIcon, FileArchive, ShieldAlert, ShieldCheckIcon, Landmark, MessageSquareIcon, Trash2, UserCircle2, Loader2 } from 'lucide-react-native';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useToast } from '../hooks/useToast'; // Assuming a simple RN toast hook/service
import ConfirmationDialog from '../components/common/ConfirmationDialog'; // Placeholder

const ITEMS_PER_TAB = 6; // Fewer items per page for mobile

const ProfileScreen = ({ navigation, route }: AppScreenProps<'MainTabs'>) => {
  const { user: authUser, token, logout, isLoading: isAuthLoading, refreshAuthUser } = useAuth();
  const { toast } = useToast(); 

  const routeUserId = (route.params as { userId?: string })?.userId;
  const isOwnProfile = !routeUserId || routeUserId === authUser?.id;
  const profileUserIdToFetch = isOwnProfile ? authUser?.id : routeUserId;

  const [profileData, setProfileData] = useState<UserProfileData | null>(isOwnProfile ? authUser : null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(isOwnProfile && authUser ? false : true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<'created' | 'owned' | 'collections' | 'favorites' | 'activity' | 'offers'>('created');
  
  const [createdNfts, setCreatedNfts] = useState<Nft[]>([]);
  const [isLoadingCreated, setIsLoadingCreated] = useState(true);
  const [createdError, setCreatedError] = useState<string | null>(null);
  const [createdPage, setCreatedPage] = useState(1);
  const [totalCreatedPages, setTotalCreatedPages] = useState(1);

  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [isLoadingOwned, setIsLoadingOwned] = useState(true);
  const [ownedError, setOwnedError] = useState<string | null>(null);
  const [ownedPage, setOwnedPage] = useState(1);
  const [totalOwnedPages, setTotalOwnedPages] = useState(1);

  const [collectionsCreated, setCollectionsCreated] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [totalCollectionsPages, setTotalCollectionsPages] = useState(1);

  const [favoritedNfts, setFavoritedNfts] = useState<Nft[]>([]);
  const [isLoadingFavorited, setIsLoadingFavorited] = useState(true);
  const [favoritedError, setFavoritedError] = useState<string | null>(null);
  const [favoritedPage, setFavoritedPage] = useState(1);
  const [totalFavoritedPages, setTotalFavoritedPages] = useState(1);

  const [userActivity, setUserActivity] = useState<any[]>([]); // Type with UserActivityItemType later
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
  const [isConfirmActionVisible, setIsConfirmActionVisible] = useState(false);
  const [confirmActionDetails, setConfirmActionDetails] = useState<{type: 'accept' | 'reject' | 'cancel', offer?: Offer } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  const fetchProfileData = useCallback(async () => {
    if (!profileUserIdToFetch) {
      if (isOwnProfile) setProfileError("You are not logged in.");
      else setProfileError("User ID not available.");
      setIsLoadingProfile(false);
      return;
    }
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const endpoint = isOwnProfile ? '/auth/me' : `/users/${profileUserIdToFetch}`;
      const response = await apiClient.get<{ data: UserProfileData }>(endpoint, isOwnProfile ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
      setProfileData(response.data.data); // Backend wraps in 'data'
    } catch (err) {
      const apiErr = err as ApiError;
      setProfileError(apiErr.data?.message || apiErr.message || 'Failed to load profile.');
      setProfileData(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [profileUserIdToFetch, isOwnProfile, token]);

  useEffect(() => {
    if (!isOwnProfile || !authUser) { // Fetch if not own profile or if authUser isn't loaded yet for own profile
        fetchProfileData();
    } else if (isOwnProfile && authUser) {
        setProfileData(authUser); // Use context data for own profile to avoid re-fetch unless necessary
        setIsLoadingProfile(false);
    }
  }, [fetchProfileData, isOwnProfile, authUser]);


  const fetchTabData = useCallback(async (tabKey: typeof activeTab) => {
    if (!profileUserIdToFetch || !token) return;

    let endpoint = '';
    let setData: React.Dispatch<React.SetStateAction<any[]>> = () => {};
    let setIsLoading: React.Dispatch<React.SetStateAction<boolean>> = () => {};
    let setError: React.Dispatch<React.SetStateAction<string | null>> = () => {};
    let setTotalPages: React.Dispatch<React.SetStateAction<number>> = () => {};
    let currentPage: number = 1;
    
    switch(tabKey) {
        case 'created': 
            endpoint = `/nfts?creatorId=${profileUserIdToFetch}&limit=${ITEMS_PER_TAB}&page=${createdPage}`; 
            setData = setCreatedNfts; setIsLoading = setIsLoadingCreated; setError = setCreatedError; setTotalPages = setTotalCreatedPages; currentPage = createdPage;
            break;
        case 'owned': 
            endpoint = `/nfts?ownerId=${profileUserIdToFetch}&limit=${ITEMS_PER_TAB}&page=${ownedPage}`; 
            setData = setOwnedNfts; setIsLoading = setIsLoadingOwned; setError = setOwnedError; setTotalPages = setTotalOwnedPages; currentPage = ownedPage;
            break;
        case 'collections': 
            endpoint = `/collections?creatorId=${profileUserIdToFetch}&limit=${ITEMS_PER_TAB}&page=${collectionsPage}`; 
            setData = setCollectionsCreated; setIsLoading = setIsLoadingCollections; setError = setCollectionsError; setTotalPages = setTotalCollectionsPages; currentPage = collectionsPage;
            break;
        case 'favorites':
            if (!isOwnProfile) { setIsLoadingFavorited(false); setFavoritedNfts([]); return; } // Favorites only for own profile
            endpoint = `/users/me/favorites?limit=${ITEMS_PER_TAB}&page=${favoritedPage}`;
            setData = setFavoritedNfts; setIsLoading = setIsLoadingFavorited; setError = setFavoritedError; setTotalPages = setTotalFavoritedPages; currentPage = favoritedPage;
            break;
        case 'activity':
            if (!isOwnProfile) { setIsLoadingActivity(false); setUserActivity([]); return; }
            endpoint = `/users/me/activity?limit=${ITEMS_PER_TAB}&page=${activityPage}`;
            setData = setUserActivity; setIsLoading = setIsLoadingActivity; setError = setActivityError; setTotalPages = setTotalActivityPages; currentPage = activityPage;
            break;
        case 'offers': // For offers, we'll fetch both made and received
            if (!isOwnProfile) { setIsLoadingOffersMade(false); setOffersMade([]); setIsLoadingOffersReceived(false); setOffersReceived([]); return; }
            // Fetch Offers Made
            setIsLoadingOffersMade(true); setOffersMadeError(null);
            try {
                const madeRes = await apiClient.get<PaginatedResponse<Offer>>(`/users/me/offers/made?limit=${ITEMS_PER_TAB}&page=${offersMadePage}`, token ? { headers: { Authorization: `Bearer ${token}`}} : undefined);
                setOffersMade(madeRes.data.data || []);
                setTotalOffersMadePages(Math.ceil((madeRes.data.meta?.total || 0) / ITEMS_PER_TAB));
            } catch (err) { const e = err as ApiError; setOffersMadeError(e.data?.message || e.message || "Failed to load offers made."); } 
            finally { setIsLoadingOffersMade(false); }
            // Fetch Offers Received
            setIsLoadingOffersReceived(true); setOffersReceivedError(null);
            try {
                const receivedRes = await apiClient.get<PaginatedResponse<Offer>>(`/users/me/offers/received?limit=${ITEMS_PER_TAB}&page=${offersReceivedPage}`, token ? { headers: { Authorization: `Bearer ${token}`}} : undefined);
                setOffersReceived(receivedRes.data.data || []);
                setTotalOffersReceivedPages(Math.ceil((receivedRes.data.meta?.total || 0) / ITEMS_PER_TAB));
            } catch (err) { const e = err as ApiError; setOffersReceivedError(e.data?.message || e.message || "Failed to load offers received."); }
            finally { setIsLoadingOffersReceived(false); }
            return; // Handled fetching for both sub-tabs
    }

    if (!endpoint) return;
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.get<PaginatedResponse<any>>(endpoint, token && isOwnProfile ? { headers: { Authorization: `Bearer ${token}`}} : undefined);
      setData(response.data.data || []);
      setTotalPages(Math.ceil((response.data.meta?.total || 0) / ITEMS_PER_TAB));
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.data?.message || apiErr.message || `Failed to load ${tabKey}.`);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [profileUserIdToFetch, token, isOwnProfile, createdPage, ownedPage, collectionsPage, favoritedPage, activityPage, offersMadePage, offersReceivedPage]);

  useEffect(() => {
    if (profileData) fetchTabData(activeTab);
  }, [profileData, activeTab, fetchTabData]);


  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (!isOwnProfile || !authUser) await fetchProfileData(); // Refresh public profile data
    else await refreshAuthUser(); // Refresh own profile from context
    await fetchTabData(activeTab); // Refresh current tab data
    setIsRefreshing(false);
  }, [fetchProfileData, refreshAuthUser, fetchTabData, activeTab, isOwnProfile, authUser]);
  
  const handleLogout = async () => { await logout(); navigation.replace('AuthNavigator', { screen: 'Welcome' }); };
  const navigateToNftDetail = (nftId: string) => navigation.navigate('NftDetail', { nftId });
  const navigateToCollectionDetail = (collectionId: string) => navigation.navigate('CollectionDetail', { collectionId });

  const handleOfferAction = async () => {
    if (!token || !confirmActionDetails?.offer?.id || !confirmActionDetails?.type) return;
    
    const offerId = confirmActionDetails.offer.id;
    const actionType = confirmActionDetails.type;

    setIsProcessingAction(true);
    let endpoint = '';
    let method: 'put' | 'del' = 'put';
    let successMessage = '';

    switch(actionType) {
        case 'accept': endpoint = `/offers/${offerId}/accept`; successMessage = "Offer accepted!"; break;
        case 'reject': endpoint = `/offers/${offerId}/reject`; successMessage = "Offer rejected."; break;
        case 'cancel': endpoint = `/offers/${offerId}/cancel`; method = 'del'; successMessage = "Offer cancelled."; break;
        default: setIsProcessingAction(false); return;
    }

    try {
        if (method === 'del') await apiClient.delete(endpoint, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        else await apiClient.put(endpoint, {}, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        toast({ message: successMessage, type: 'success' });
        fetchTabData('offers'); // Refresh offers lists
    } catch (error: any) {
        const apiErr = error as ApiError;
        toast({ message: apiErr.data?.message || `Failed to ${actionType} offer.`, type: 'error' });
    } finally {
        setIsProcessingAction(false);
        setIsConfirmActionVisible(false);
        setConfirmActionDetails(null);
    }
  };

  const openConfirmation = (offer: Offer, type: 'accept' | 'reject' | 'cancel') => {
    setConfirmActionDetails({ offer, type });
    setIsConfirmActionVisible(true);
  };

  if (isLoadingProfile && !profileData) return <LoadingIndicator fullScreen />;
  if (profileError && !profileData) return (<View style={styles.centered}><AlertCircle size={48} color={theme.colors.destructive} /><Text style={styles.errorText}>{profileError}</Text>{isOwnProfile && <AppButton title="Retry" onPress={fetchProfileData} style={{marginTop: 20}} />}</View>);
  if (!profileData) return (<View style={styles.centered}><UserCircle2 size={48} color={theme.colors.mutedForeground} /><Text style={styles.errorText}>Profile not found.</Text></View>);
  
  const currentData = { created: createdNfts, owned: ownedNfts, collections: collectionsCreated, favorites: favoritedNfts, activity: userActivity, offersMade, offersReceived }[activeTab === 'offers' ? 'offersMade' : activeTab] || [];
  const currentIsLoading = { created: isLoadingCreated, owned: isLoadingOwned, collections: isLoadingCollections, favorites: isLoadingFavorited, activity: isLoadingActivity, offersMade: isLoadingOffersMade, offersReceived: isLoadingOffersReceived }[activeTab === 'offers' ? 'offersMade' : activeTab];
  const currentError = { created: createdError, owned: ownedError, collections: collectionsError, favorites: favoritedError, activity: activityError, offersMade: offersMadeError, offersReceived: offersReceivedError }[activeTab === 'offers' ? 'offersMade' : activeTab];
  const currentPageForTab = { created: createdPage, owned: ownedPage, collections: collectionsPage, favorites: favoritedPage, activity: activityPage, offersMade: offersMadePage, offersReceived: offersReceivedPage }[activeTab === 'offers' ? 'offersMade' : activeTab];
  const totalPagesForTab = { created: totalCreatedPages, owned: totalOwnedPages, collections: totalCollectionsPages, favorites: totalFavoritedPages, activity: totalActivityPages, offersMade: totalOffersMadePages, offersReceived: totalOffersReceivedPages }[activeTab === 'offers' ? 'offersMade' : activeTab];
  const setPageForTab = { created: setCreatedPage, owned: setOwnedPage, collections: setCollectionsPage, favorites: setFavoritedPage, activity: setActivityPage, offersMade: setOffersMadePage, offersReceived: setOffersReceivedPage }[activeTab === 'offers' ? 'offersMade' : activeTab];

  const renderTabContent = () => {
    if (currentIsLoading && currentData.length === 0) return <LoadingIndicator style={{ marginVertical: 20 }} />;
    if (currentError) return <View style={styles.centered}><Text style={styles.errorText}>{currentError}</Text></View>;
    if (!currentIsLoading && currentData.length === 0) return <EmptyState title={`No ${activeTab}`} message={`This user has no ${activeTab} items.`} icon={activeTab === 'collections' ? <Palette size={32} color={theme.colors.mutedForeground}/> : activeTab === 'offers' ? <Tags size={32} color={theme.colors.mutedForeground}/> : <ShoppingBag size={32} color={theme.colors.mutedForeground}/>} />;

    if (activeTab === 'created' || activeTab === 'owned' || activeTab === 'favorites') {
      return <NftList nfts={currentData as Nft[]} onNftPress={navigateToNftDetail} numColumns={2} ListFooterComponent={currentIsLoading && currentData.length > 0 ? <LoadingIndicator /> : null} onEndReached={() => currentPageForTab < totalPagesForTab && setPageForTab(currentPageForTab + 1)} />;
    }
    if (activeTab === 'collections') {
      return <CollectionList collections={currentData as Collection[]} onCollectionPress={navigateToCollectionDetail} ListFooterComponent={currentIsLoading && currentData.length > 0 ? <LoadingIndicator /> : null} onEndReached={() => currentPageForTab < totalPagesForTab && setPageForTab(currentPageForTab + 1)} />;
    }
    if (activeTab === 'activity') {
      // Implement Activity List rendering
      return (
        <FlatList
          data={userActivity}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
                {/* {getActivityIcon(item.type)} */}
                <View style={{flex:1}}><Text style={styles.activityText}>{item.details?.message || `${item.type} for item ${item.relatedNftId || item.relatedCollectionId || ''}`}</Text><Text style={styles.activityTimestamp}>{formatDistanceToNowStrict(new Date(item.timestamp), { addSuffix: true })}</Text></View>
            </View>
          )}
          ListEmptyComponent={<EmptyState title="No Activity" message="No recent activity to display." />}
          ListFooterComponent={isLoadingActivity && userActivity.length > 0 ? <LoadingIndicator /> : null}
          onEndReached={() => activityPage < totalActivityPages && setActivityPage(activityPage + 1)}
        />
      );
    }
    if (activeTab === 'offers') {
        return (
            <View>
                <Text style={styles.subSectionTitle}>Offers Made ({offersMade.length})</Text>
                {isLoadingOffersMade && offersMade.length === 0 ? <LoadingIndicator/> : offersMadeError ? <Text style={styles.errorText}>{offersMadeError}</Text> : offersMade.length === 0 ? <EmptyState title="No Offers Made" message="You haven't made any offers yet."/> :
                    offersMade.map(offer => (
                        <View key={offer.id} style={styles.offerItem}>
                            <View>
                                <Text style={styles.offerNftTitle}>To: {offer.nft?.title || `NFT ID ${offer.nftId.substring(0,8)}...`}</Text>
                                <Text style={styles.offerAmount}>{offer.offerAmount} {offer.currency} - <Text style={[styles.offerStatus, {color: offer.status === OfferStatus.PENDING ? theme.colors.accent : theme.colors.mutedForeground}]}>{offer.status}</Text></Text>
                                {offer.expiresAt && <Text style={styles.offerTimestamp}>Expires: {formatDistanceToNowStrict(new Date(offer.expiresAt), {addSuffix:true})}</Text>}
                            </View>
                            {offer.status === OfferStatus.PENDING && <AppButton title="Cancel" onPress={() => openConfirmation(offer, 'cancel')} variant="outline" style={styles.offerActionButtonDestructive} textStyle={{fontSize:12}} isLoading={isProcessingAction && actionOfferId === offer.id && confirmActionDetails?.type === 'cancel'} leftIcon={<Trash2 size={14} color={theme.colors.destructive}/>} />}
                        </View>
                    ))
                }
                 {!isLoadingOffersMade && totalOffersMadePages > 1 && <PaginationControls currentPage={offersMadePage} totalPages={totalOffersMadePages} onPageChange={setOffersMadePage} style={{marginVertical:10}} />}

                <Text style={[styles.subSectionTitle, {marginTop: theme.spacing.lg}]}>Offers Received ({offersReceived.length})</Text>
                 {isLoadingOffersReceived && offersReceived.length === 0 ? <LoadingIndicator/> : offersReceivedError ? <Text style={styles.errorText}>{offersReceivedError}</Text> : offersReceived.length === 0 ? <EmptyState title="No Offers Received" message="You haven't received any offers yet."/> :
                    offersReceived.map(offer => (
                        <View key={offer.id} style={styles.offerItem}>
                            <View>
                                <Text style={styles.offerNftTitle}>On: {offer.nft?.title || `NFT ID ${offer.nftId.substring(0,8)}...`}</Text>
                                <Text style={styles.offerAmount}>{offer.offerAmount} {offer.currency} by {offer.offerer?.username || 'User'} - <Text style={[styles.offerStatus, {color: offer.status === OfferStatus.PENDING ? theme.colors.accent : theme.colors.mutedForeground}]}>{offer.status}</Text></Text>
                                {offer.expiresAt && <Text style={styles.offerTimestamp}>Expires: {formatDistanceToNowStrict(new Date(offer.expiresAt), {addSuffix:true})}</Text>}
                            </View>
                            {offer.status === OfferStatus.PENDING && (
                                <View style={{flexDirection:'row', gap: theme.spacing.sm}}>
                                    <AppButton title="Reject" onPress={() => openConfirmation(offer, 'reject')} variant="outline" style={styles.offerActionButtonDestructive} textStyle={{fontSize:12}} isLoading={isProcessingAction && actionOfferId === offer.id && confirmActionDetails?.type === 'reject'} leftIcon={<X size={14} color={theme.colors.destructive}/>} />
                                    <AppButton title="Accept" onPress={() => openConfirmation(offer, 'accept')} variant="outline" style={styles.offerActionButtonAccept} textStyle={{fontSize:12}} isLoading={isProcessingAction && actionOfferId === offer.id && confirmActionDetails?.type === 'accept'} leftIcon={<Check size={14} color={theme.colors.primary /* or a green */} />}/>
                                </View>
                            )}
                        </View>
                    ))
                }
                {!isLoadingOffersReceived && totalOffersReceivedPages > 1 && <PaginationControls currentPage={offersReceivedPage} totalPages={totalOffersReceivedPages} onPageChange={setOffersReceivedPage} style={{marginVertical:10}} />}
            </View>
        )
    }
    return <Text>Unknown tab</Text>;
  };


  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>} contentContainerStyle={{paddingBottom: theme.spacing.xxl}}>
      <View style={styles.header}><Image source={{ uri: profileData.coverUrl || 'https://placehold.co/400x150.png' }} style={styles.coverImage}/><View style={styles.avatarContainer}><Image source={{ uri: profileData.avatarUrl || `https://placehold.co/100x100.png?text=${profileData.username.charAt(0)}` }} style={styles.avatar}/></View></View>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{profileData.username}</Text>
        {profileData.walletAddress && (<Text style={styles.walletAddress} selectable>{profileData.walletAddress.substring(0, 6)}...{profileData.walletAddress.slice(-4)}</Text>)}
        {profileData.bio && <Text style={styles.bio}>{profileData.bio}</Text>}
        <View style={styles.socialLinksContainer}>{profileData.socialLinks?.website && <TouchableOpacity onPress={() => {}}><Globe size={20} color={theme.colors.accent}/></TouchableOpacity>}{profileData.socialLinks?.twitter && <TouchableOpacity onPress={() => {}}><Twitter size={20} color={theme.colors.accent}/></TouchableOpacity>}{profileData.socialLinks?.instagram && <TouchableOpacity onPress={() => {}}><Instagram size={20} color={theme.colors.accent}/></TouchableOpacity>}</View>
        {isOwnProfile && (<AppButton title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} variant="outline" style={styles.editButton} leftIcon={<Edit3 size={16} color={theme.colors.primary}/>}/>)}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {(['created', 'owned', 'collections', 'favorites', 'activity', 'offers'] as const).map(tab => (
            (!isOwnProfile && (tab === 'favorites' || tab === 'activity' || tab === 'offers')) ? null : // Hide some tabs for public profiles
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}>
                <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.tabContentContainer}>{renderTabContent()}</View>

      {isOwnProfile && (<View style={{paddingHorizontal: theme.spacing.md, marginVertical: theme.spacing.xl}}><AppButton title="Log Out" onPress={handleLogout} variant="destructive" leftIcon={<LogOut size={18} color={theme.colors.destructiveForeground}/>}/></View>)}
      <ConfirmationDialog
        isVisible={isConfirmActionVisible}
        title={`Confirm ${confirmActionDetails?.type || 'Action'}`}
        message={`Are you sure you want to ${confirmActionDetails?.type} this offer on "${confirmActionDetails?.offer?.nft?.title || 'this NFT'}"?`}
        onCancel={() => { setIsConfirmActionVisible(false); setConfirmActionDetails(null); }}
        onConfirm={handleOfferAction}
        confirmText={isProcessingAction ? "Processing..." : (confirmActionDetails?.type || 'Confirm')}
        cancelText="Dismiss"
        isDestructive={confirmActionDetails?.type === 'reject' || confirmActionDetails?.type === 'cancel'}
        isLoading={isProcessingAction}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md },
  errorText: { color: theme.colors.destructive, textAlign: 'center', fontSize: theme.fontSize.base },
  header: { marginBottom: 60 },
  coverImage: { width: '100%', height: 150, backgroundColor: theme.colors.muted },
  avatarContainer: { position: 'absolute', bottom: -50, alignSelf: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: theme.colors.card, backgroundColor: theme.colors.muted },
  profileInfo: { alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.xs },
  username: { fontSize: theme.fontSize.xl + 2, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.xs },
  walletAddress: { fontSize: theme.fontSize.sm, color: theme.colors.mutedForeground, marginBottom: theme.spacing.sm },
  bio: { fontSize: theme.fontSize.base, color: theme.colors.foreground, textAlign: 'center', marginBottom: theme.spacing.md, lineHeight: 20 },
  socialLinksContainer: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.md },
  editButton: { marginTop: theme.spacing.xs, borderColor: theme.colors.primary, paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.sm },
  tabButton: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, marginRight: theme.spacing.xs },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabButtonText: { fontSize: theme.fontSize.base, color: theme.colors.mutedForeground, fontWeight: '500' },
  activeTabButtonText: { color: theme.colors.primary, fontWeight: 'bold' },
  tabContentContainer: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.sm }, // Adjusted padding
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border, gap: theme.spacing.sm},
  activityText: { fontSize: theme.fontSize.sm, color: theme.colors.foreground, flexShrink: 1 },
  activityTimestamp: { fontSize: theme.fontSize.xs, color: theme.colors.mutedForeground, marginTop: 2 },
  subSectionTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: theme.colors.foreground, marginVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xs },
  offerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.sm, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border },
  offerNftTitle: { fontSize: theme.fontSize.sm, fontWeight: '500', color: theme.colors.primary, marginBottom: 2 },
  offerAmount: { fontSize: theme.fontSize.base, fontWeight: 'bold', color: theme.colors.foreground },
  offerStatus: { fontSize: theme.fontSize.xs, fontWeight: '500' },
  offerTimestamp: { fontSize: theme.fontSize.xs, color: theme.colors.mutedForeground, marginTop: 2 },
  offerActionButtonDestructive: { borderColor: theme.colors.destructive, paddingHorizontal: theme.spacing.sm, height: 32},
  offerActionButtonAccept: { borderColor: theme.colors.primary, paddingHorizontal: theme.spacing.sm, height: 32 },
});

export default ProfileScreen;

