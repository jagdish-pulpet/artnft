
// react-native-app/src/screens/CollectionDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import type { AppScreenProps } from '../navigation/types';
import type { Collection, Nft } from '../types/entities';
import apiClient, { ApiError } from '../api/apiService';
import { theme } from '../styles/theme';
import NftList from '../components/nft/NftList';
import EmptyState from '../components/common/EmptyState';
import { AlertCircle, Palette } from 'lucide-react-native';

type CollectionDetailScreenProps = AppScreenProps<'CollectionDetail'>;

const CollectionDetailScreen = ({ route, navigation }: CollectionDetailScreenProps) => {
  const { collectionId } = route.params;
  const [collectionData, setCollectionData] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCollectionDetails = useCallback(async () => {
    setError(null);
    try {
      const response = await apiClient.get<{ data: Collection }>(`/collections/${collectionId}`);
      const collection = response.data.data;
      
      // Ensure NFTs in the collection have the collectionName populated for NftCard consistency
      if (collection && collection.nfts) {
        collection.nfts = collection.nfts.map(nft => ({
          ...nft,
          collectionName: collection.name,
        }));
      }
      setCollectionData(collection);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.data?.message || apiErr.message || 'Failed to load collection details.');
      setCollectionData(null);
      console.error("Fetch collection detail error:", err);
    }
  }, [collectionId]);

  useEffect(() => {
    setIsLoading(true);
    fetchCollectionDetails().finally(() => setIsLoading(false));
  }, [fetchCollectionDetails]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchCollectionDetails();
    setIsRefreshing(false);
  }, [fetchCollectionDetails]);
  
  const navigateToNftDetail = (nftId: string) => {
    navigation.push('NftDetail', { nftId }); // Use push to allow navigating to multiple NFT details from collection
  };

  if (isLoading && !collectionData) {
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

  if (!collectionData) {
    return <EmptyState title="Collection Not Found" message="This collection could not be loaded or does not exist." />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>}
    >
      {collectionData.bannerImageUrl || collectionData.coverImageUrl ? (
        <Image 
          source={{ uri: collectionData.bannerImageUrl || collectionData.coverImageUrl || 'https://placehold.co/400x150.png' }} 
          style={styles.bannerImage} 
        />
      ) : null}
      
      <View style={styles.headerContent}>
        {collectionData.logoImageUrl && (
          <Image source={{ uri: collectionData.logoImageUrl }} style={styles.logoImage} />
        )}
        <Text style={styles.collectionName}>{collectionData.name}</Text>
        {collectionData.creator && (
            <Text style={styles.creatorName}>
                By {collectionData.creator.username || 'Unknown Creator'}
            </Text>
        )}
        {collectionData.description && (
          <Text style={styles.description}>{collectionData.description}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}><Text style={styles.statValue}>{collectionData.itemCount || 0}</Text><Text style={styles.statLabel}>Items</Text></View>
        <View style={styles.statItem}><Text style={styles.statValue}>{collectionData.floorPrice || 'N/A'}</Text><Text style={styles.statLabel}>Floor Price</Text></View>
        <View style={styles.statItem}><Text style={styles.statValue}>{collectionData.volumeTraded || 'N/A'}</Text><Text style={styles.statLabel}>Volume</Text></View>
      </View>

      <View style={styles.nftsSection}>
        <Text style={styles.sectionTitle}>NFTs in this Collection</Text>
        {collectionData.nfts && collectionData.nfts.length > 0 ? (
          <NftList 
            nfts={collectionData.nfts} 
            onNftPress={navigateToNftDetail} 
            numColumns={2}
            horizontal={false} 
          />
        ) : (
           <EmptyState title="No NFTs Yet" message="This collection doesn't have any NFTs listed at the moment." icon={<Palette size={40} color={theme.colors.mutedForeground}/>}/>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.destructive,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    marginTop: theme.spacing.md,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  headerContent: {
    alignItems: 'center',
    padding: theme.spacing.md,
    marginTop: -50, // To overlap avatar with banner
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.card,
    backgroundColor: theme.colors.muted, // Fallback bg for logo
    marginBottom: theme.spacing.sm,
  },
  collectionName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  creatorName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  nftsSection: {
    paddingHorizontal: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
});

export default CollectionDetailScreen;
