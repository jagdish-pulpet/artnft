
// react-native-app/src/components/nft/NftList.tsx
import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import NftCard from './NftCard';
import type { Nft } from '../../types/entities';
import EmptyState from '../common/EmptyState';
import LoadingIndicator from '../common/LoadingIndicator';
import { theme } from '../../styles/theme';

interface NftListProps {
  nfts: Nft[];
  onNftPress: (nftId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  listHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onEndReached?: () => void;
  numColumns?: number;
  horizontal?: boolean;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const NftList: React.FC<NftListProps> = ({ 
    nfts, 
    onNftPress, 
    isLoading, 
    error,
    listHeaderComponent,
    onRefresh,
    isRefreshing,
    onEndReached,
    numColumns = 2, // Default to 2 columns if not horizontal
    horizontal = false,
    ListFooterComponent,
}) => {
  
  const screenWidth = Dimensions.get('window').width;
  // Adjust card width for horizontal scroll or based on numColumns
  const cardWidth = horizontal 
    ? (screenWidth / 2.2) // Fixed width for horizontal items
    : (screenWidth / numColumns) - (theme.spacing.sm * (numColumns +1) / numColumns) ;


  if (isLoading && nfts.length === 0 && !ListFooterComponent) {
    // Skeleton loading state
    const skeletonCount = horizontal ? 2 : (numColumns * 2); // Show a couple of rows of skeletons
    return (
        <View style={[styles.centered, horizontal ? styles.horizontalLoadingContainer : styles.gridLoadingContainer, {flexWrap: horizontal ? 'nowrap' : 'wrap'}]}>
            {Array.from({length: skeletonCount}).map((_, i) => (
                <View key={`skeleton-${i}`} style={[styles.skeletonCard, {width: cardWidth}]}>
                    <View style={styles.skeletonImage}/>
                    <View style={styles.skeletonTextLineShort}/>
                    <View style={styles.skeletonTextLineLong}/>
                </View>
            ))}
        </View>
    );
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>Error: {error}</Text></View>;
  }

  if (!isLoading && nfts.length === 0 && !ListFooterComponent) {
    return <EmptyState title="No NFTs Found" message="There are no NFTs to display right now." />;
  }
  
  return (
    <FlatList
      data={nfts}
      renderItem={({ item }) => (
        <NftCard 
            nft={item} 
            onPress={() => onNftPress(item.id)} 
            style={{ width: cardWidth, margin: horizontal ? theme.spacing.sm / 2 : theme.spacing.xs }}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={horizontal ? undefined : numColumns} // FlatList horizontal doesn't use numColumns
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={horizontal ? styles.horizontalListContainer : styles.listContainer}
      ListHeaderComponent={listHeaderComponent}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooterComponent || (isLoading && nfts.length > 0 ? <LoadingIndicator style={{paddingVertical: 20}} /> : null)}
    />
  );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: theme.spacing.sm / 2, 
    },
    horizontalListContainer: {
        paddingHorizontal: theme.spacing.sm,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    gridLoadingContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around', // Or 'flex-start' if margin handles spacing
    },
    horizontalLoadingContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    errorText: {
        color: theme.colors.destructive,
        textAlign: 'center',
    },
    skeletonCard: {
        backgroundColor: theme.colors.muted,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm,
        margin: theme.spacing.xs,
        height: 250, // Approximate height, adjust as needed
    },
    skeletonImage: {
        height: 150,
        backgroundColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    skeletonTextLineShort: {
        height: 10,
        width: '60%',
        backgroundColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.xs,
    },
    skeletonTextLineLong: {
        height: 10,
        width: '90%',
        backgroundColor: theme.colors.border,
        borderRadius: theme.borderRadius.sm,
    }
});

export default NftList;
