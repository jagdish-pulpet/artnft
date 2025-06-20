
// react-native-app/src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import NftList from '../components/nft/NftList'; // Assuming NftList can handle loading/error states
import { theme } from '../styles/theme';
import type { AppScreenProps } from '../navigation/types';
import type { Nft } from '../types/entities';
import apiClient from '../api/apiService'; // Assuming default export
import AppButton from '../components/common/Button';
import LoadingIndicator from '../components/common/LoadingIndicator';
import EmptyState from '../components/common/EmptyState';

// type HomeScreenProps = AppScreenProps<'Home'>; // Example if using specific screen props

const HomeScreen = (/*{ navigation }: HomeScreenProps*/) => {
  const [trendingNfts, setTrendingNfts] = useState<Nft[]>([]);
  const [recentlyAddedNfts, setRecentlyAddedNfts] = useState<Nft[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [errorTrending, setErrorTrending] = useState<string | null>(null);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);

  const fetchTrendingNfts = useCallback(async () => {
    setIsLoadingTrending(true);
    setErrorTrending(null);
    try {
      const response = await apiClient.get<Nft[]>('/nfts/trending'); // Using placeholder data in web API
      setTrendingNfts(response.data.slice(0, 4)); // Take first 4 for home screen
    } catch (err) {
      setErrorTrending('Failed to load trending NFTs.');
      console.error(err);
    } finally {
      setIsLoadingTrending(false);
    }
  }, []);

  const fetchRecentlyAddedNfts = useCallback(async () => {
    setIsLoadingRecent(true);
    setErrorRecent(null);
    try {
      const response = await apiClient.get<Nft[]>('/nfts?sortBy=createdAt_desc&limit=4'); // Assuming backend supports this
      setRecentlyAddedNfts(response.data);
    } catch (err) {
      setErrorRecent('Failed to load recently added NFTs.');
      console.error(err);
    } finally {
      setIsLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingNfts();
    fetchRecentlyAddedNfts();
  }, [fetchTrendingNfts, fetchRecentlyAddedNfts]);

  const navigateToNftDetail = (nftId: string) => {
    // navigation.navigate('NftDetail', { nftId });
    console.log('Navigate to NFT Detail:', nftId);
  };
  
  const navigateToAllCollections = () => {
    // navigation.navigate('CollectionsTab'); // Or equivalent
    console.log('Navigate to all collections');
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Discover Unique Digital Art</Text>
        <Text style={styles.heroSubtitle}>Explore, Collect, and Trade Extraordinary NFTs.</Text>
        <AppButton title="Explore Collections" onPress={navigateToAllCollections} style={styles.heroButton} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Listings</Text>
        <NftList 
            nfts={trendingNfts} 
            onNftPress={navigateToNftDetail} 
            isLoading={isLoadingTrending}
            error={errorTrending}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
         <NftList 
            nfts={recentlyAddedNfts} 
            onNftPress={navigateToNftDetail} 
            isLoading={isLoadingRecent}
            error={errorRecent}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroSection: {
    backgroundColor: theme.colors.primary, // Or an image background
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.fontSize['3xl'],
    fontWeight: 'bold',
    color: theme.colors.primaryForeground,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primaryForeground,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.lg,
  },
  heroButton: {
    backgroundColor: theme.colors.accent, // Or secondary
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
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
  }
});

export default HomeScreen;

    