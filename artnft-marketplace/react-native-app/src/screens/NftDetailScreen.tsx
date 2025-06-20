
// react-native-app/src/screens/NftDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { Nft as NftData, NftProperty, Offer, User } from '../types/entities'; 
import apiClient, { ApiError } from '../api/apiService';
import AppButton from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft, ShoppingCart, Tag, Info, ListFilter, Heart, Eye, Share2, MoreHorizontal, AlertCircle, Activity as ActivityIconLucide, HandCoins, ListChecks, Wallet, CalendarClock, Check, X, PackageIcon } from 'lucide-react-native';
import { useAuth } from '../store/authContext'; 

type NftDetailScreenProps = AppScreenProps<'NftDetail'>;

const NftDetailScreen = ({ route, navigation }: NftDetailScreenProps) => {
  const { nftId } = route.params;
  const { user: authUser, token, isAuthenticated } = useAuth();

  const [nftData, setNftData] = useState<NftData | null>(null);
  // const [nftActivity, setNftActivity] = useState<any[]>([]); // Replace with NftActivityItem[] later
  // const [nftOffers, setNftOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [isFavorited, setIsFavorited] = useState(false); 
  const [currentFavoritesCount, setCurrentFavoritesCount] = useState(0);

  const fetchNftDetails = useCallback(async () => {
    setError(null);
    try {
      const response = await apiClient.get<{ data: NftData }>(`/nfts/${nftId}`);
      setNftData(response.data.data);
      setCurrentFavoritesCount(response.data.data.favoritesCount || 0);
      // TODO: Check if current user has favorited this NFT and set isFavorited
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.data?.message || apiErr.message || 'Failed to load NFT details.');
      setNftData(null); 
      console.error("Fetch NFT detail error:", err);
    }
  }, [nftId]);

  useEffect(() => {
    setIsLoading(true);
    fetchNftDetails().finally(() => setIsLoading(false));
  }, [fetchNftDetails]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNftDetails();
    // await fetchNftActivity(); // When implemented
    // await fetchNftOffers(); // When implemented
    setIsRefreshing(false);
  }, [fetchNftDetails]);


  const handleToggleFavorite = async () => {
    if (!nftData || !isAuthenticated || !token) {
      Alert.alert("Authentication Required", "Please sign in to favorite NFTs.");
      // navigation.navigate('AuthNavigator', { screen: 'SignIn' }); // Or similar
      return;
    }
    // Optimistic update
    const newFavoriteState = !isFavorited;
    const optimisticFavoritesCount = newFavoriteState ? currentFavoritesCount + 1 : Math.max(0, currentFavoritesCount - 1);
    setIsFavorited(newFavoriteState);
    setCurrentFavoritesCount(optimisticFavoritesCount);
    try {
      const result = await apiClient.post<{ favorited: boolean; favoritesCount: number }>(`/nfts/${nftData.id}/favorite`, {}, {
         headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorited(result.data.favorited); 
      setCurrentFavoritesCount(result.data.favoritesCount); 
      // Toast can be added here
    } catch (error: any) {
      setIsFavorited(!newFavoriteState); 
      setCurrentFavoritesCount(currentFavoritesCount);
      Alert.alert("Error", error.data?.message || "Could not update favorite status.");
    }
  };
  
  const isOwner = authUser && nftData && authUser.id === nftData.owner?.id;
  const canMakeOffer = isAuthenticated && nftData?.isListedForSale && !isOwner;


  if (isLoading && !nftData) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <AlertCircle size={48} color={theme.colors.destructive} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!nftData) {
    return <EmptyState title="NFT Not Found" message="This NFT could not be loaded or does not exist." icon={<PackageIcon size={48} color={theme.colors.mutedForeground}/>} />;
  }
  
  const priceEth = nftData?.price ? `${nftData.price} ${nftData.currency || 'ETH'}` : 'N/A';
  // const priceUsd = nftData?.price && nftData.currency === 'ETH' ? (nftData.price * 3000).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : null; // Example conversion

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: nftData.imageUrl || 'https://placehold.co/400x400.png' }} style={styles.image} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.actionButtonsTop}>
            <TouchableOpacity style={styles.iconButton} onPress={handleToggleFavorite}>
                <Heart size={22} color={theme.colors.white} fill={isFavorited ? theme.colors.destructive : 'none'} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
                <Share2 size={22} color={theme.colors.white} />
            </TouchableOpacity> */}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        {nftData.collectionName && (
          <TouchableOpacity onPress={() => nftData.collectionId && navigation.navigate('CollectionDetail', {collectionId: nftData.collectionId})}>
            <Text style={styles.collectionName}>{nftData.collectionName}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{nftData.title}</Text>
        
        <View style={styles.ownerCreatorContainer}>
          {nftData.owner && (
            <TouchableOpacity style={styles.metaBlock} onPress={() => navigation.navigate('ProfileTab', { screen: 'UserProfileScreen', params: { userId: nftData.owner.id} } )}>
                <Image source={{ uri: nftData.owner?.avatarUrl || 'https://placehold.co/40x40.png' }} style={styles.avatar} />
                <View>
                    <Text style={styles.metaLabel}>Owned by</Text>
                    <Text style={styles.metaValueLink}>{nftData.owner?.username || 'Unknown'}</Text>
                </View>
            </TouchableOpacity>
          )}
           {nftData.creator && (
            <TouchableOpacity style={styles.metaBlock} onPress={() => navigation.navigate('ProfileTab', { screen: 'UserProfileScreen', params: { userId: nftData.creator.id} } )}>
                <Image source={{ uri: nftData.creator?.avatarUrl || 'https://placehold.co/40x40.png' }} style={styles.avatar} />
                <View>
                    <Text style={styles.metaLabel}>Created by</Text>
                    <Text style={styles.metaValueLink}>{nftData.creator?.username || 'Unknown'}</Text>
                </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsRow}>
            <View style={styles.statChip}><Eye size={14} color={theme.colors.mutedForeground}/><Text style={styles.statChipText}>{nftData.views?.toLocaleString() || 0} views</Text></View>
            <View style={styles.statChip}><Heart size={14} color={theme.colors.mutedForeground}/><Text style={styles.statChipText}>{currentFavoritesCount.toLocaleString() || 0} favorites</Text></View>
        </View>

        {nftData.isListedForSale && nftData.price !== null && nftData.price !== undefined ? (
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Current Price</Text>
            <Text style={styles.priceValue}>{priceEth}</Text>
            {/* {priceUsd && <Text style={styles.priceUsd}>({priceUsd})</Text>} */}
          </View>
        ) : (
            <View style={styles.notForSaleSection}>
                <Text style={styles.notForSaleText}>Not currently for sale</Text>
                {nftData.lastSalePrice && nftData.lastSaleAt && (
                    <Text style={styles.lastSaleText}>Last sold for {nftData.lastSalePrice} {nftData.lastSaleCurrency || ''}</Text>
                )}
            </View>
        )}
        
        <View style={styles.actionsContainer}>
            {nftData.isListedForSale && <AppButton title="Buy Now (Placeholder)" onPress={() => {}} style={{flex:1}} leftIcon={<ShoppingCart size={18} color={theme.colors.primaryForeground}/>}/>}
            {canMakeOffer && <AppButton title="Make Offer (Placeholder)" onPress={() => {}} variant="outline" style={{flex:1}} leftIcon={<HandCoins size={18} color={theme.colors.primary}/>}/>}
        </View>

        {nftData.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{nftData.description}</Text>
          </View>
        )}

        {nftData.properties && nftData.properties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Properties</Text>
            <View style={styles.propertiesGrid}>
              {nftData.properties.map((prop, index) => (
                <View key={index} style={styles.propertyChip}>
                  <Text style={styles.propertyTraitType}>{prop.trait_type}</Text>
                  <Text style={styles.propertyValue}>{String(prop.value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offers (Coming Soon)</Text>
            <EmptyState title="No Offers Yet" message="Offers for this NFT will appear here." icon={<ListChecks size={32} color={theme.colors.mutedForeground}/>} />
         </View>
         <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity (Coming Soon)</Text>
            <EmptyState title="No Activity Yet" message="Recent activity for this NFT will appear here." icon={<ActivityIconLucide size={32} color={theme.colors.mutedForeground}/>} />
         </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingBottom: theme.spacing.xl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.md },
  errorText: { color: theme.colors.destructive, textAlign: 'center', fontSize: theme.fontSize.lg, marginTop: theme.spacing.md, },
  imageContainer: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1 },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 40 : 20, left: 15, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20, zIndex: 10 },
  actionButtonsTop: { position: 'absolute', top: Platform.OS === 'ios' ? 40 : 20, right: 15, flexDirection: 'row', zIndex: 10 },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 20, marginLeft: 10 },
  infoContainer: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md },
  collectionName: { fontSize: theme.fontSize.base, color: theme.colors.accent, fontWeight: '600', marginBottom: theme.spacing.xs, },
  title: { fontSize: theme.fontSize.xxl + 4, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.sm, lineHeight: 36 },
  ownerCreatorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.lg, flexWrap: 'wrap' },
  metaBlock: { flexDirection: 'row', alignItems: 'center', marginRight: theme.spacing.md, marginBottom: theme.spacing.xs },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: theme.spacing.xs, backgroundColor: theme.colors.muted },
  metaLabel: { fontSize: theme.fontSize.xs, color: theme.colors.mutedForeground, },
  metaValueLink: { fontSize: theme.fontSize.sm, color: theme.colors.accent, fontWeight: '500', },
  statsRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md, flexWrap: 'wrap' },
  statChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.muted, paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm, borderRadius: theme.borderRadius.full },
  statChipText: { fontSize: theme.fontSize.xs, color: theme.colors.foreground, marginLeft: theme.spacing.xs },
  priceSection: { backgroundColor: theme.colors.card, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, },
  notForSaleSection: { paddingVertical: theme.spacing.md, marginBottom: theme.spacing.md, alignItems: 'flex-start' },
  notForSaleText: { fontSize: theme.fontSize.lg, fontWeight: '600', color: theme.colors.mutedForeground },
  lastSaleText: { fontSize: theme.fontSize.xs, color: theme.colors.mutedForeground },
  priceLabel: { fontSize: theme.fontSize.sm, color: theme.colors.mutedForeground, marginBottom: 2 },
  priceValue: { fontSize: theme.fontSize.xl + 2, fontWeight: 'bold', color: theme.colors.foreground, },
  priceUsd: { fontSize: theme.fontSize.sm, color: theme.colors.mutedForeground, },
  actionsContainer: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg, },
  section: { marginTop: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md, },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: theme.colors.foreground, marginBottom: theme.spacing.sm, },
  descriptionText: { fontSize: theme.fontSize.base, color: theme.colors.foreground, lineHeight: 22, },
  propertiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, },
  propertyChip: { backgroundColor: theme.colors.muted, paddingVertical: theme.spacing.xs + 2, paddingHorizontal: theme.spacing.sm, borderRadius: theme.borderRadius.md, alignItems: 'center', minWidth: 100 },
  propertyTraitType: { fontSize: theme.fontSize.xs - 1, color: theme.colors.accent, fontWeight: '500', textTransform: 'uppercase', marginBottom: 2},
  propertyValue: { fontSize: theme.fontSize.sm, color: theme.colors.foreground, fontWeight: '500', },
});

export default NftDetailScreen;
