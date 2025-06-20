
// react-native-app/src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import NftList from '../components/nft/NftList';
import { theme } from '../styles/theme';
import type { Nft } from '../types/entities';
import apiClient, { ApiError } from '../api/apiService';
import AppButton from '../components/common/Button';
import { useFocusEffect } from '@react-navigation/native';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../store/authContext';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../navigation/AppNavigator'; // For navigation prop types

// For navigation within a Tab screen, you might need to get creative or use nested navigators
// type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'MainTabs'>;
// interface HomeScreenProps {
//   navigation: HomeScreenNavigationProp; // Example
// }
// Using `any` for navigation prop temporarily for simplicity if not fully typed

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { logout, user } = useAuth();
  const [trendingNfts, setTrendingNfts] = useState<Nft[]>([]);
  const [recentlyAddedNfts, setRecentlyAddedNfts] = useState<Nft[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [errorTrending, setErrorTrending] = useState<string | null>(null);
  const [errorRecent, setErrorRecent] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrendingNfts = useCallback(async () => {
    setIsLoadingTrending(true);
    setErrorTrending(null);
    try {
      // Assuming backend provides {data: Nft[]} structure
      const response = await apiClient.get<{ data: Nft[] }>('/nfts/trending'); 
      setTrendingNfts(response.data.data.slice(0, 6)); 
    } catch (err) {
      const error = err as ApiError;
      setErrorTrending(error.data?.message || error.message || 'Failed to load trending NFTs.');
      console.error("Trending NFTs fetch error:", error);
    } finally {
      setIsLoadingTrending(false);
    }
  }, []);

  const fetchRecentlyAddedNfts = useCallback(async () => {
    setIsLoadingRecent(true);
    setErrorRecent(null);
    try {
      // Assuming backend provides {data: Nft[]} structure and supports sortBy
      const response = await apiClient.get<{ data: Nft[] }>('/nfts?sortBy=createdAt_desc&limit=6');
      setRecentlyAddedNfts(response.data.data);
    } catch (err) {
      const error = err as ApiError;
      setErrorRecent(error.data?.message || error.message || 'Failed to load recently added NFTs.');
      console.error("Recently added NFTs fetch error:", error);
    } finally {
      setIsLoadingRecent(false);
    }
  }, []);

  const loadData = useCallback(() => {
    fetchTrendingNfts();
    fetchRecentlyAddedNfts();
  }, [fetchTrendingNfts, fetchRecentlyAddedNfts]);
  
  useFocusEffect( 
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTrendingNfts(), fetchRecentlyAddedNfts()]);
    setIsRefreshing(false);
  }, [fetchTrendingNfts, fetchRecentlyAddedNfts]);


  const navigateToNftDetail = (nftId: string) => {
    navigation.navigate('NftDetail', { nftId });
  };
  
  const navigateToAllCollections = () => {
    navigation.navigate('CollectionsTab'); 
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>}
      contentContainerStyle={{ paddingBottom: theme.spacing.xxl }} 
    >
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Welcome, {user?.username || 'Explorer'}!</Text>
        <Text style={styles.heroSubtitle}>Discover Unique Digital Art.</Text>
        <AppButton title="Explore Collections" onPress={navigateToAllCollections} style={styles.heroButton} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Listings</Text>
        <NftList 
            nfts={trendingNfts} 
            onNftPress={navigateToNftDetail} 
            isLoading={isLoadingTrending && trendingNfts.length === 0} // Show skeleton only on initial load
            error={errorTrending}
            horizontal={true}
            numColumns={1} // For FlatList horizontal, numColumns is typically 1 or not set
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
         <NftList 
            nfts={recentlyAddedNfts} 
            onNftPress={navigateToNftDetail} 
            isLoading={isLoadingRecent && recentlyAddedNfts.length === 0} // Show skeleton only on initial load
            error={errorRecent}
            horizontal={false}
            numColumns={2} 
        />
      </View>
      
      <View style={styles.logoutButtonContainer}>
        <AppButton
          title="Log Out"
          onPress={handleLogout}
          variant="destructive"
          leftIcon={<LogOut size={18} color={theme.colors.destructiveForeground} />}
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
    backgroundColor: theme.colors.primary, 
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
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
    backgroundColor: theme.colors.accent, 
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    paddingHorizontal: theme.spacing.sm, // Reduced horizontal padding for the section itself
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm, // Kept padding for title
  },
  logoutButtonContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  }
});

export default HomeScreen;
