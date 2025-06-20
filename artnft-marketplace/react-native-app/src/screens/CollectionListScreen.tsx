
// react-native-app/src/screens/CollectionListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import type { AppScreenProps } from '../navigation/types';
import CollectionCard from '../components/collection/CollectionCard';
import type { Collection, PaginatedResponse } from '../types/entities';
import apiClient, { ApiError } from '../api/apiService';
import { theme } from '../styles/theme';
import LoadingIndicator from '../components/common/LoadingIndicator';
import EmptyState from '../components/common/EmptyState';
import { AlertCircle } from 'lucide-react-native';

type CollectionListScreenProps = AppScreenProps<'MainTabs'>; // Assuming it's a tab

const ITEMS_PER_PAGE = 10;

const CollectionListScreen = ({ navigation }: CollectionListScreenProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchCollections = useCallback(async (pageToFetch: number, refreshing = false) => {
    if (!refreshing && isLoadingMore) return; // Prevent multiple loads if already loading more

    if (refreshing) {
      setIsRefreshing(true);
    } else if (pageToFetch === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const response = await apiClient.get<PaginatedResponse<Collection>>(
        `/collections?page=${pageToFetch}&limit=${ITEMS_PER_PAGE}&sortBy=name_asc`
      );
      const newCollections = response.data.data || [];
      
      if (pageToFetch === 1) {
        setCollections(newCollections);
      } else {
        setCollections(prev => [...prev, ...newCollections]);
      }
      setCurrentPage(response.data.meta?.page || 1);
      setTotalPages(Math.ceil((response.data.meta?.total || 0) / ITEMS_PER_PAGE));

    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.data?.message || apiErr.message || 'Failed to load collections.');
      if (pageToFetch === 1) setCollections([]); // Clear if initial load fails
      console.error("Fetch collections error:", err);
    } finally {
      if (refreshing) setIsRefreshing(false);
      if (pageToFetch === 1) setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [isLoadingMore]);

  useEffect(() => {
    fetchCollections(1);
  }, []); // Initial fetch

  const handleRefresh = () => {
    setCurrentPage(1); // Reset page to 1 for refresh
    fetchCollections(1, true);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      fetchCollections(currentPage + 1);
    }
  };
  
  const navigateToCollectionDetail = (collectionId: string) => {
    navigation.navigate('CollectionDetail', { collectionId });
  };

  if (isLoading && collections.length === 0 && !isRefreshing) {
    return <LoadingIndicator fullScreen />;
  }

  if (error && collections.length === 0 && !isRefreshing) {
    return (
      <View style={styles.centered}>
        <AlertCircle size={48} color={theme.colors.destructive} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={collections}
        renderItem={({ item }) => (
          <CollectionCard 
            collection={item} 
            onPress={() => navigateToCollectionDetail(item.id)} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1} 
        contentContainerStyle={styles.listContainer}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <LoadingIndicator style={{paddingVertical: 20}} /> : null}
        ListEmptyComponent={!isLoading && !error ? (
          <EmptyState title="No Collections Yet" message="Explore again later or create your own!" />
        ) : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
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
});

export default CollectionListScreen;
