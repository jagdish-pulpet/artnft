
// react-native-app/src/components/nft/NftList.tsx
// Placeholder for displaying a list/grid of NFTs
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
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
}

const NftList: React.FC<NftListProps> = ({ 
    nfts, 
    onNftPress, 
    isLoading, 
    error,
    listHeaderComponent,
    onRefresh,
    isRefreshing,
    onEndReached
}) => {
  if (isLoading && nfts.length === 0) {
    return <LoadingIndicator fullScreen={false} style={styles.centered}/>;
  }

  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>Error loading NFTs: {error}</Text></View>;
  }

  if (!isLoading && nfts.length === 0) {
    return <EmptyState title="No NFTs Found" message="There are no NFTs to display right now." />;
  }
  
  return (
    <FlatList
      data={nfts}
      renderItem={({ item }) => <NftCard nft={item} onPress={() => onNftPress(item.id)} />}
      keyExtractor={(item) => item.id}
      numColumns={2} // Example for a grid
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={listHeaderComponent}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isLoading && nfts.length > 0 ? <LoadingIndicator /> : null}
    />
  );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: theme.spacing.sm / 2, // Half of card margin for outer padding
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

export default NftList;

    